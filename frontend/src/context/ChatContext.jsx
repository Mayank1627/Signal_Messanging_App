// frontend/src/context/ChatContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { conversationAPI } from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);

  const activeConversationRef = useRef(null);
  activeConversationRef.current = activeConversation;

  useEffect(() => {
    if (user) {
      conversationAPI.getConversations()
        .then(res => setConversations(res.data.conversations))
        .catch(err => console.error('Error fetching conversations:', err));
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (messageData) => {
      const isActiveChat = activeConversationRef.current?.id === messageData.conversation_id;
      
      if (isActiveChat) {
        // Ensure new messages have an empty reactions array
        setMessages(prev => [...prev, { ...messageData, reactions: [] }]);
        socket.emit('message_delivered', {
          message_id: messageData.id,
          conversation_id: messageData.conversation_id
        });
      }

      setConversations(prev => {
        return prev.map(conv => {
          if (conv.id === messageData.conversation_id) {
            return {
              ...conv,
              last_message: messageData.body,
              last_message_time: messageData.created_at,
              last_message_sender: messageData.sender_name,
              unread_count: isActiveChat ? 0 : (conv.unread_count || 0) + 1
            };
          }
          return conv;
        }).sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
      });
    };

    const handleTyping = (data) => {
      setTypingUsers(prev => {
        const updated = { ...prev };
        if (data.isTyping) {
          if (!updated[data.conversation_id]) updated[data.conversation_id] = {};
          updated[data.conversation_id][data.user_id] = Date.now();
        } else {
          if (updated[data.conversation_id]) {
            delete updated[data.conversation_id][data.user_id];
          }
        }
        return updated;
      });
    };

    const handleStatusUpdate = (data) => {
      if (activeConversationRef.current?.id === data.conversation_id) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.message_id ? { ...msg, status: data.status } : msg
          )
        );
      }
    };

    const handleUserStatusChange = (data) => {
      setConversations(prev => 
        prev.map(conv => {
          if (conv.type === 'direct' && conv.other_user?.id === data.userId) {
            return {
              ...conv,
              other_user: {
                ...conv.other_user,
                isOnline: data.isOnline,
                last_seen: data.last_seen || conv.other_user.last_seen
              }
            };
          }
          return conv;
        })
      );
    };

    // NEW: Handle Reaction Updates
    const handleReactionUpdate = (data) => {
      const { message_id, reactions } = data;
      if (activeConversationRef.current?.id === data.conversation_id) {
        setMessages(prev => prev.map(msg => 
          msg.id === message_id ? { ...msg, reactions } : msg
        ));
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('message_status_update', handleStatusUpdate);
    socket.on('user_status_change', handleUserStatusChange);
    socket.on('message_reaction_update', handleReactionUpdate); // Listen here

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('message_status_update', handleStatusUpdate);
      socket.off('user_status_change', handleUserStatusChange);
      socket.off('message_reaction_update', handleReactionUpdate);
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => {
        const updated = { ...prev };
        let changed = false;
        for (const convId in updated) {
          for (const userId in updated[convId]) {
            if (Date.now() - updated[convId][userId] > 3000) {
              delete updated[convId][userId];
              changed = true;
            }
          }
        }
        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectConversation = (conversation) => {
    if (activeConversation && socket) {
      socket.emit('leave_conversation', activeConversation.id);
    }

    setActiveConversation(conversation);
    setLoadingMessages(true);
    setMessages([]);

    if (conversation) {
      setConversations(prev => prev.map(c => 
        c.id === conversation.id ? { ...c, unread_count: 0 } : c
      ));

      if (socket) {
        socket.emit('join_conversation', conversation.id);
      }

      conversationAPI.getMessages(conversation.id)
        .then(res => {
          setMessages(res.data.messages);
          if (socket) {
            res.data.messages.forEach(msg => {
              if (msg.sender_id !== user.id && msg.status !== 'read') {
                socket.emit('message_read', {
                  message_id: msg.id,
                  conversation_id: conversation.id
                });
              }
            });
          }
        })
        .catch(err => console.error('Error fetching messages:', err))
        .finally(() => setLoadingMessages(false));
    }
  };

  const sendMessage = (text) => {
    if (!activeConversation || !socket || !text.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage = {
      id: tempId,
      conversation_id: activeConversation.id,
      sender_id: user.id,
      body: text,
      status: 'sending',
      created_at: new Date().toISOString(),
      sender_name: user.display_name,
      sender_avatar: user.avatar_url,
      reactions: [] // Initialize empty reactions array
    };

    setMessages(prev => [...prev, newMessage]);

    socket.emit('send_message', { 
      conversation_id: activeConversation.id, 
      body: text 
    }, (response) => {
      if (response.status === 'ok') {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId ? response.message : msg
          )
        );
      }
    });
  };

  const sendTypingEvent = (isTyping) => {
    if (!activeConversation || !socket) return;
    socket.emit('typing', {
      conversation_id: activeConversation.id,
      isTyping
    });
  };

  const startNewConversation = async (otherUserId) => {
    try {
      const res = await conversationAPI.createDirectConversation(otherUserId);
      const newConvId = res.data.conversation_id;
      const convRes = await conversationAPI.getConversations();
      const newConv = convRes.data.conversations.find(c => c.id === newConvId);
      
      if (newConv) {
        setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConvId)]);
        selectConversation(newConv);
      }
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  };

  const startNewGroupConversation = async (name, memberIds) => {
    try {
      const res = await conversationAPI.createGroupConversation(name, memberIds);
      const newConvId = res.data.conversation_id;
      const convRes = await conversationAPI.getConversations();
      const newConv = convRes.data.conversations.find(c => c.id === newConvId);
      
      if (newConv) {
        setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConvId)]);
        selectConversation(newConv);
      }
    } catch (error) {
      console.error('Error starting new group:', error);
    }
  };

  // NEW: Function to emit reaction event
  const reactToMessage = (messageId, conversationId, emoji) => {
    if (!socket) return;
    socket.emit('react_to_message', { message_id: messageId, conversation_id: conversationId, emoji });
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      typingUsers,
      loadingMessages,
      selectConversation,
      sendMessage,
      sendTypingEvent,
      startNewConversation,
      startNewGroupConversation,
      reactToMessage // Expose function here
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};