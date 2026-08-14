// frontend/src/components/NewGroupModal.jsx
import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { userAPI } from '../services/api';
import { useChat } from '../context/ChatContext';

export default function NewGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { startNewGroupConversation } = useChat();

  // Fetch contacts when modal opens
  useEffect(() => {
    if (isOpen) {
      userAPI.getContacts()
        .then(res => setContacts(res.data.contacts))
        .catch(err => console.error('Failed to fetch contacts', err));
    } else {
      // Reset state on close
      setGroupName('');
      setSelectedContacts([]);
      setContacts([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId) 
        : [...prev, contactId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName || selectedContacts.length === 0) return;
    
    setLoading(true);
    await startNewGroupConversation(groupName, selectedContacts);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-3/4 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">New Group</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Group Name Input */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-signal-blue text-sm"
            required
          />
        </div>

        {/* Contacts List */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-600">Select members</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              You have no contacts to add. Use the "New Chat" button to add contacts first.
            </div>
          ) : (
            contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleToggleContact(contact.id)}
                className={`flex items-center p-3 cursor-pointer border-b border-gray-100 ${
                  selectedContacts.includes(contact.id) ? 'bg-blue-50' : 'hover:bg-sidebar-hover'
                }`}
              >
                <img 
                  src={contact.avatar_url} 
                  alt={contact.display_name} 
                  className="w-12 h-12 rounded-full bg-gray-300 mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.display_name}</h3>
                  <p className="text-xs text-gray-500">{contact.phone_number}</p>
                </div>
                {/* Checkbox visual */}
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  selectedContacts.includes(contact.id) ? 'bg-signal-blue border-signal-blue' : 'border-gray-300'
                }`}>
                  {selectedContacts.includes(contact.id) && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleCreateGroup}
            disabled={!groupName || selectedContacts.length === 0 || loading}
            className="px-4 py-2 bg-signal-blue text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}