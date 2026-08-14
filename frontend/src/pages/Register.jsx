// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const phoneNumber = location.state?.phone_number;

  if (!phoneNumber) {
    navigate('/login');
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
      
      const res = await authAPI.register({ 
        phone_number: phoneNumber, 
        display_name: displayName, 
        avatar_url: finalAvatar 
      });
      
      login(res.data.user, res.data.token);
      navigate('/app'); // <-- Updated to /app
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Set up your profile</h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Enter your name and add a profile picture.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (Optional)</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-signal-blue focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal-blue text-white font-medium py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Start messaging'}
          </button>
        </form>
      </div>
    </div>
  );
}