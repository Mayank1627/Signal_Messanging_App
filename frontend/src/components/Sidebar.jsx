// frontend/src/components/Sidebar.jsx
import { useState } from 'react';
import { Search, MessageSquare, Users, Settings } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import SettingsModal from './SettingsModal';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';

export default function Sidebar() {
  const { conversations, activeConversation, selectConversation } = useChat();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    return conv.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-sidebar-bg border-r border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <img src={user?.avatar_url} alt="Profile" className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <h2 className="font-semibold text-gray-900">{user?.display_name}</h2>
            <p className="text-xs text-gray-500">{user?.phone_number}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsNewGroupModalOpen(true)} className="p-2 rounded-full hover:bg-sidebar-hover text-gray-600" title="New Group">
            <Users className="w-5 h-5" />
          </button>
          <button onClick={() => setIsNewChatModalOpen(true)} className="p-2 rounded-full hover:bg-sidebar-hover text-gray-600" title="New Chat">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-sidebar-hover text-gray-600" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-signal-blue text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery ? 'No conversations found.' : 'No conversations yet. Start a new chat!'}
          </div>
        ) : (
          filteredConversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`flex items-center p-3 cursor-pointer border-b border-gray-100 hover:bg-sidebar-hover ${
                activeConversation?.id === conv.id ? 'bg-sidebar-active' : ''
              }`}
            >
              <img src={conv.avatar_url} alt={conv.name} className="w-12 h-12 rounded-full bg-gray-300 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0 border-b border-transparent">
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-semibold truncate ${conv.unread_count > 0 ? 'text-gray-900' : 'text-gray-800'}`}>
                    {conv.name}
                  </h3>
                  <span className={`text-xs ml-2 flex-shrink-0 ${conv.unread_count > 0 ? 'text-signal-blue font-medium' : 'text-gray-500'}`}>
                    {formatTime(conv.last_message_time)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-sm truncate pr-2 ${conv.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {conv.last_message ? (
                      <>
                        {conv.type === 'group' && conv.last_message_sender + ': '}
                        {conv.last_message}
                      </>
                    ) : (
                      <span className="italic text-gray-400">No messages yet</span>
                    )}
                  </p>
                  
                  {/* Unread Badge */}
                  {conv.unread_count > 0 && (
                    <span className="bg-signal-blue text-white text-xs font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <NewChatModal isOpen={isNewChatModalOpen} onClose={() => setIsNewChatModalOpen(false)} />
      <NewGroupModal isOpen={isNewGroupModalOpen} onClose={() => setIsNewGroupModalOpen(false)} />
    </div>
  );
}