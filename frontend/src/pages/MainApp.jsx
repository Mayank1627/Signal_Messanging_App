// frontend/src/pages/MainApp.jsx
import { ChatProvider, useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import EmptyState from '../components/EmptyState';

// Inner component that consumes the chat context to handle layout switching
const AppLayout = () => {
  const { activeConversation } = useChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* 
        Sidebar: 
        On mobile, it takes full width unless a chat is active.
        On desktop, it always takes up 1/3 (or 1/4) of the screen.
      */}
      <div className={`w-full md:w-1/3 lg:w-1/4 ${activeConversation ? 'hidden md:block' : 'block'}`}>
        <Sidebar />
      </div>

      {/* 
        Chat Window:
        On mobile, it takes full width only if a chat is active.
        On desktop, it takes the remaining 2/3 of the screen.
      */}
      <div className={`w-full md:w-2/3 lg:w-3/4 ${activeConversation ? 'block' : 'hidden md:block'}`}>
        {activeConversation ? <ChatWindow /> : <EmptyState />}
      </div>
    </div>
  );
};

export default function MainApp() {
  return (
    <ChatProvider>
      <AppLayout />
    </ChatProvider>
  );
}