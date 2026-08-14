// frontend/src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if the user is logged in
    if (user) {
      const token = localStorage.getItem('signal_token');
      
      // Initialize socket connection, passing the token in the auth object
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('⚡ Connected to WebSocket server');
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      setSocket(newSocket);

      // Cleanup on unmount or when user logs out
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access the socket instance easily
export const useSocket = () => {
  return useContext(SocketContext);
};