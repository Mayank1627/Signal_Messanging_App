// frontend/src/components/EmptyState.jsx
import { MessageSquare } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-chat-bg border-l border-gray-200">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <MessageSquare className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-xl font-medium text-gray-500">
        Signal
      </h2>
      <p className="text-sm text-gray-400 mt-1 text-center max-w-sm">
        Select a chat to start messaging, or search for a user to begin a new conversation.
      </p>
      <p className="text-xs text-gray-300 mt-8">
        Everything is end-to-end encrypted (mocked).
      </p>
    </div>
  );
}