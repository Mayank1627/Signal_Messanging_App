// frontend/src/components/NewChatModal.jsx
import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { userAPI } from '../services/api';
import { useChat } from '../context/ChatContext';

export default function NewChatModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { startNewConversation } = useChat();

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      setLoading(true);
      try {
        const res = await userAPI.searchUsers(e.target.value);
        setSearchResults(res.data.users);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserClick = (userId) => {
    startNewConversation(userId);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-3/4 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">New Chat</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone number"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-signal-blue text-sm"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? 'No users found.' : 'Type to search for users.'}
            </div>
          ) : (
            searchResults.map(user => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user.id)}
                className="flex items-center p-3 cursor-pointer hover:bg-sidebar-hover border-b border-gray-100"
              >
                <img 
                  src={user.avatar_url} 
                  alt={user.display_name} 
                  className="w-12 h-12 rounded-full bg-gray-300 mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.display_name}</h3>
                  <p className="text-xs text-gray-500">{user.phone_number}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}