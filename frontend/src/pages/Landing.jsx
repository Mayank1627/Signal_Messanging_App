// frontend/src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Video, Users, Shield, Globe } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-signal-blue" />
            <span className="font-bold text-xl text-gray-900">Signal</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900">Get Signal</a>
            <a href="#" className="hover:text-gray-900">Blog</a>
            <a href="#" className="hover:text-gray-900">Docs</a>
            <a href="#" className="hover:text-gray-900">Donate</a>
            <Link to="/login" className="bg-signal-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Start Messaging</Link>
          </div>
          <Link to="/login" className="md:hidden bg-signal-blue text-white px-4 py-2 rounded-md text-sm">Start</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 flex-1">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Speak Freely</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Say anything. State-of-the-art end-to-end encryption (mocked) keeps your conversations secure. Privacy isn't optional, it's the default.
          </p>
          <Link to="/login" className="inline-flex items-center justify-center bg-signal-blue text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-blue-700 transition shadow-md">
            Start Messaging
          </Link>
          
          {/* Mock Phones */}
          <div className="mt-16 flex justify-center space-x-4 md:space-x-8">
            <div className="w-40 h-72 md:w-52 md:h-96 bg-gray-800 rounded-[2rem] p-2 shadow-xl transform rotate-[-6deg]">
              <div className="w-full h-full bg-chat-bg rounded-[1.5rem] flex flex-col items-center justify-center p-4">
                <Video className="w-12 h-12 text-signal-blue mb-4" />
                <div className="w-full bg-white rounded-lg p-2 text-xs text-gray-500 text-center">Video call connected...</div>
              </div>
            </div>
            <div className="w-40 h-72 md:w-52 md:h-96 bg-gray-800 rounded-[2rem] p-2 shadow-xl transform rotate-[6deg]">
              <div className="w-full h-full bg-chat-bg rounded-[1.5rem] flex flex-col p-4 space-y-2">
                <div className="self-start bg-white rounded-lg p-2 text-xs text-gray-700">Hey! How are you?</div>
                <div className="self-end bg-chat-outgoing rounded-lg p-2 text-xs text-gray-700">I am good!</div>
                <div className="self-start bg-white rounded-lg p-2 text-xs text-gray-700">Let's catch up later.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-signal-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Say Anything</h3>
          <p className="text-gray-600 text-sm">Share text, voice messages, photos, videos, and more without sacrificing privacy.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-8 h-8 text-signal-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Speak Freely</h3>
          <p className="text-gray-600 text-sm">Crystal-clear voice and video calls. Keep in touch with friends and family without limits.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-signal-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Make Privacy Stick</h3>
          <p className="text-gray-600 text-sm">Encryption ensures that only the people you are talking to can read your messages.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-signal-blue" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Get Together with Groups</h3>
          <p className="text-gray-600 text-sm">Stay connected with up to 1000 friends and family in a secure group chat.</p>
        </div>
      </div>

      {/* No Ads Section */}
      <div className="bg-[#2c1c4e] text-white py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">No ads. No trackers. No kidding.</h2>
        <p className="max-w-2xl mx-auto text-gray-300">There is no tracking, no ads, no bots. Just a simple, secure messaging app.</p>
      </div>

      {/* Free Section */}
      <div className="bg-signal-blue text-white py-16 px-4 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Free for Everyone</h2>
        <p className="max-w-2xl mx-auto mb-8 text-blue-50">Signal is an independent nonprofit. We're not tied to major tech companies, and we rely on donations to keep going.</p>
        <button className="bg-white text-signal-blue px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition">Donate to Signal</button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-6 h-6 text-signal-blue" />
              <span className="font-bold text-white text-lg">Signal</span>
            </div>
            <p className="text-xs">© 2013 - 2026 Signal Clone, a 501c3 nonprofit.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Organization</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Donate</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Download</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Android</a></li>
              <li><a href="#" className="hover:text-white">iOS</a></li>
              <li><a href="#" className="hover:text-white">Desktop</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Social</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Support</a></li>
              <li><a href="#" className="hover:text-white">Community</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}