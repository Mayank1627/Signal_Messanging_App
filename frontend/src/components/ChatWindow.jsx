// frontend/src/components/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { Phone, Video, Search, MoreVertical, ArrowLeft, Send } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import MessageBubble from './MessageBubble';
import GroupInfoModal from './GroupInfoModal';

export default function ChatWindow() {
  const { activeConversation, messages, sendMessage, sendTypingEvent, typingUsers, selectConversation } = useChat();
  const { user } = useAuth();
  
  const [newMessage, setNewMessage] = useState('');
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isTyping = activeConversation && typingUsers[activeConversation.id] 
    ? Object.keys(typingUsers[activeConversation.id]).some(uid => uid !== user.id)
    : false;

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage('');
    sendTypingEvent(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    sendTypingEvent(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingEvent(false);
    }, 2000);
  };

  const handleFeatureClick = () => {
    alert('This feature is not implemented in the clone. (Coming Soon)');
  };

  if (!activeConversation) return null;

  // Helper to format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'offline';
    const date = new Date(timestamp);
    const today = new Date();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (date.toDateString() === today.toDateString()) {
      return `last seen today at ${time}`;
    }
    return `last seen ${date.toLocaleDateString()}`;
  };

  // Determine status text for the header
  let statusText = '';
  if (isTyping) {
    statusText = <span className="text-signal-blue">typing...</span>;
  } else if (activeConversation.type === 'group') {
    statusText = 'Tap here for group info';
  } else if (activeConversation.other_user?.isOnline) {
    statusText = <span className="text-signal-blue">online</span>;
  } else {
    statusText = formatLastSeen(activeConversation.other_user?.last_seen);
  }

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 shadow-sm z-10">
        <div 
          className="flex items-center min-w-0 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition"
          onClick={() => activeConversation.type === 'group' && setIsGroupInfoOpen(true)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); selectConversation(null); }} 
            className="md:hidden p-2 mr-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <img src={activeConversation.avatar_url} alt={activeConversation.name} className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{activeConversation.name}</h2>
            <p className="text-xs text-gray-500 truncate">{statusText}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-500">
          <button onClick={handleFeatureClick} className="p-2 rounded-full hover:bg-gray-100"><Phone className="w-5 h-5" /></button>
          <button onClick={handleFeatureClick} className="p-2 rounded-full hover:bg-gray-100"><Video className="w-5 h-5" /></button>
          <button onClick={handleFeatureClick} className="p-2 rounded-full hover:bg-gray-100"><Search className="w-5 h-5" /></button>
          <button onClick={handleFeatureClick} className="p-2 rounded-full hover:bg-gray-100"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-chat-bg">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm text-sm text-gray-600">
              Say Hi to {activeConversation.name}! 👋
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg}
              isOwn={msg.sender_id === user.id}
              isGroup={activeConversation.type === 'group'}
              senderName={msg.sender_name}
            />
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center p-3 bg-white border-t border-gray-200">
        <button type="button" onClick={handleFeatureClick} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-signal-blue text-sm mx-2"
        />
        <button type="submit" disabled={!newMessage.trim()} className="p-3 rounded-full bg-signal-blue text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <Send className="w-5 h-5" />
        </button>
      </form>

      <GroupInfoModal isOpen={isGroupInfoOpen} onClose={() => setIsGroupInfoOpen(false)} conversation={activeConversation} />
    </div>
  );
}