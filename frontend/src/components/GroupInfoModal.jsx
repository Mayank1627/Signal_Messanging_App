// frontend/src/components/GroupInfoModal.jsx
import { useState, useEffect } from 'react';
import { X, UserMinus, UserPlus, Shield } from 'lucide-react';
import { conversationAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GroupInfoModal({ isOpen, onClose, conversation }) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isGroup = conversation?.type === 'group';
  const currentUserId = user?.id;

  useEffect(() => {
    if (!isOpen || !conversation) return;

    setLoading(true);
    
    // Fetch participants and contacts in parallel
    Promise.all([
      conversationAPI.getParticipants(conversation.id),
      userAPI.getContacts()
    ])
      .then(([partRes, contactsRes]) => {
        setParticipants(partRes.data.participants);
        
        // Filter out contacts who are already in the group
        const participantIds = partRes.data.participants.map(p => p.id);
        const availableContacts = contactsRes.data.contacts.filter(c => !participantIds.includes(c.id));
        setContacts(availableContacts);
      })
      .catch(err => console.error('Error fetching group info', err))
      .finally(() => setLoading(false));
  }, [isOpen, conversation]);

  if (!isOpen || !conversation) return null;

  // Find current user's role in this group
  const currentUserParticipant = participants.find(p => p.id === currentUserId);
  const isAdmin = currentUserParticipant?.role === 'admin';

  const handleRemoveMember = async (userId) => {
    try {
      await conversationAPI.removeGroupMember(conversation.id, userId);
      // Update local state
      setParticipants(prev => prev.filter(p => p.id !== userId));
      
      // Add them back to the available contacts list
      const removedUser = participants.find(p => p.id === userId);
      if (removedUser) setContacts(prev => [...prev, removedUser]);
    } catch (error) {
      console.error('Failed to remove member', error);
      alert('Failed to remove member');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const res = await conversationAPI.addGroupMember(conversation.id, userId);
      setParticipants(prev => [...prev, res.data.participant]);
      
      // Remove them from available contacts list
      setContacts(prev => prev.filter(c => c.id !== userId));
    } catch (error) {
      console.error('Failed to add member', error);
      alert('Failed to add member');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-3/4 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Group Info</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Group Profile Section */}
        <div className="flex flex-col items-center p-6 border-b border-gray-200">
          <img 
            src={conversation.avatar_url} 
            alt={conversation.name} 
            className="w-24 h-24 rounded-full bg-gray-300 mb-3"
          />
          <h3 className="text-xl font-semibold text-gray-900">{conversation.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{participants.length} members</p>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              {/* Current Members */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{participants.length} Members</h4>
                {participants.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 group">
                    <div className="flex items-center">
                      <img src={p.avatar_url} alt={p.display_name} className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 flex items-center">
                          {p.display_name} 
                          {p.id === currentUserId && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                        </p>
                        <p className="text-xs text-gray-500">{p.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {p.role === 'admin' && (
                        <span className="flex items-center text-xs text-signal-blue font-medium mr-2">
                          <Shield className="w-3 h-3 mr-1" /> Admin
                        </span>
                      )}
                      {isAdmin && p.id !== currentUserId && p.role !== 'admin' && (
                        <button 
                          onClick={() => handleRemoveMember(p.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                          title="Remove member"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Members (Admin Only) */}
              {isAdmin && (
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Add Members</h4>
                  {contacts.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No available contacts to add.</p>
                  ) : (
                    contacts.map(c => (
                      <div key={c.id} className="flex items-center justify-between py-2 group">
                        <div className="flex items-center">
                          <img src={c.avatar_url} alt={c.display_name} className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{c.display_name}</p>
                            <p className="text-xs text-gray-500">{c.phone_number}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleAddMember(c.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-blue-50 text-signal-blue hover:bg-blue-100 transition"
                          title="Add member"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}