// frontend/src/components/SettingsModal.jsx
import { useState } from 'react';
import { X, ArrowLeft, User, Lock, Bell, Palette, Monitor, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

export default function SettingsModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('main'); // 'main' or 'edit'
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  if (!isOpen) return null;

  const handleFeatureClick = () => {
    alert('This feature is mocked/coming soon.');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-3/4 flex flex-col relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Header Card */}
            <div 
              className="flex items-center p-4 cursor-pointer hover:bg-sidebar-hover border-b border-gray-100"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <img 
                src={user?.avatar_url} 
                alt="Profile" 
                className="w-16 h-16 rounded-full bg-gray-200 mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{user?.display_name}</h3>
                <p className="text-sm text-gray-500">{user?.phone_number}</p>
                <p className="text-xs text-gray-400 mt-1 italic">Tap to edit profile</p>
              </div>
            </div>

            {/* Settings Menu List */}
            <div className="py-2">
              <button onClick={handleFeatureClick} className="w-full flex items-center px-4 py-3 hover:bg-sidebar-hover text-gray-700">
                <Lock className="w-5 h-5 mr-4 text-gray-500" />
                <span className="text-sm font-medium">Privacy</span>
              </button>
              <button onClick={handleFeatureClick} className="w-full flex items-center px-4 py-3 hover:bg-sidebar-hover text-gray-700">
                <Bell className="w-5 h-5 mr-4 text-gray-500" />
                <span className="text-sm font-medium">Notifications</span>
              </button>
              <button onClick={handleFeatureClick} className="w-full flex items-center px-4 py-3 hover:bg-sidebar-hover text-gray-700">
                <Palette className="w-5 h-5 mr-4 text-gray-500" />
                <span className="text-sm font-medium">Appearance</span>
              </button>
              <button onClick={handleFeatureClick} className="w-full flex items-center px-4 py-3 hover:bg-sidebar-hover text-gray-700">
                <Monitor className="w-5 h-5 mr-4 text-gray-500" />
                <span className="text-sm font-medium">Linked Devices</span>
              </button>
              <button onClick={handleFeatureClick} className="w-full flex items-center px-4 py-3 hover:bg-sidebar-hover text-gray-700">
                <HelpCircle className="w-5 h-5 mr-4 text-gray-500" />
                <span className="text-sm font-medium">Help</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Edit Profile Modal on top if triggered */}
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </>
  );
}