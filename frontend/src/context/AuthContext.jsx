// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in local storage on initial app load
    const token = localStorage.getItem('signal_token');
    
    if (token) {
      // Verify token with backend and get user data
      authAPI.getMe()
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('signal_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          // If token is invalid, clear it
          localStorage.removeItem('signal_token');
          localStorage.removeItem('signal_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('signal_token', token);
    localStorage.setItem('signal_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('signal_token');
    localStorage.removeItem('signal_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};