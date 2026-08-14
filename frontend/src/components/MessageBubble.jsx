// frontend/src/components/MessageBubble.jsx
import { useState } from 'react';
import { Check, CheckCheck, Clock, SmilePlus } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function MessageBubble({ message, isOwn, isGroup, senderName }) {
  const { reactToMessage } = useChat();
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏','😎'];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatusIcon = () => {
    if (!isOwn) return null;
    if (message.status === 'sending') return <Clock className="w-3.5 h-3.5 text-gray-500 inline-block ml-1" />;
    if (message.status === 'sent') return <Check className="w-4 h-4 text-gray-500 inline-block ml-1" />;
    if (message.status === 'delivered') return <CheckCheck className="w-4 h-4 text-gray-500 inline-block ml-1" />;
    if (message.status === 'read') return <CheckCheck className="w-4 h-4 text-signal-blue inline-block ml-1" />;
    return null;
  };

  const handleReact = (emoji) => {
    reactToMessage(message.id, message.conversation_id, emoji);
    setShowEmojiPicker(false);
  };

  // Group reactions by emoji to show counts
  const groupedReactions = message.reactions?.reduce((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r.user_id);
    return acc;
  }, {});

  return (
    <div className={`group relative flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`relative max-w-[75%] md:max-w-[60%] px-3 py-2 rounded-lg shadow-sm ${
          isOwn ? 'bg-chat-outgoing message-tail-out' : 'bg-chat-incoming message-tail-in'
        }`}
      >
        {/* Hover React Button */}
        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`absolute top-0 ${isOwn ? 'left-[-30px]' : 'right-[-30px]'} p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition text-gray-500 hover:text-gray-700 z-10`}
        >
          <SmilePlus className="w-4 h-4" />
        </button>

        {/* Emoji Picker Menu */}
        {showEmojiPicker && (
          <div className={`absolute z-20 ${isOwn ? 'right-0' : 'left-0'} top-[-45px] bg-white shadow-lg rounded-full px-2 py-1 flex space-x-1`}>
            {emojis.map(e => (
              <button 
                key={e} 
                onClick={() => handleReact(e)}
                className="text-xl hover:scale-125 transition transform"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        {/* Sender Name for Group Chats */}
        {!isOwn && isGroup && senderName && (
          <p className="text-xs font-semibold text-signal-blue mb-1">
            {senderName}
          </p>
        )}
        
        {/* Message Body */}
        <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
          {message.body}
        </p>
        
        {/* Timestamp & Status */}
        <div className={`flex items-center justify-end mt-1 ${isOwn ? 'text-gray-600' : 'text-gray-500'}`}>
          <span className="text-[10px]">{formatTime(message.created_at)}</span>
          {renderStatusIcon()}
        </div>

        {/* Render Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`absolute bottom-[-12px] flex space-x-1 ${isOwn ? 'right-2' : 'left-2'}`}>
            {Object.entries(groupedReactions).map(([emoji, userIds]) => (
              <button 
                key={emoji} 
                onClick={() => handleReact(emoji)}
                className={`flex items-center bg-white shadow-sm rounded-full px-1.5 py-0.5 text-xs border ${
                  userIds.includes(user.id) ? 'border-signal-blue' : 'border-gray-200'
                }`}
              >
                <span>{emoji}</span>
                {userIds.length > 1 && <span className="ml-0.5 text-gray-600 font-medium">{userIds.length}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}