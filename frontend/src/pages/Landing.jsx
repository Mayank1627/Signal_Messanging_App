// frontend/src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, Shield, Users, Globe, Lock, Mic } from 'lucide-react';
import global from '../assets/logo.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-8 h-8 text-signal-blue" />
            <span className="font-bold text-xl text-gray-900">Signal</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900">Get Signal</a>
            <a href="#" className="hover:text-gray-900">Blog</a>
            <a href="#" className="hover:text-gray-900">Docs</a>
            <a href="#" className="hover:text-gray-900">Donate</a>
            <Link to="/login" className="bg-signal-blue text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">Start Messaging</Link>
          </div>
          <Link to="/login" className="md:hidden bg-signal-blue text-white px-4 py-2 rounded-md text-sm">Start</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
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
                <Phone className="w-12 h-12 text-signal-blue mb-4" />
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

      {/* Features Section (2x2 Grid with Mock UIs) */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Feature 1: Say Anything */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-xs mb-8">
              {/* Mock UI: Say Anything */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 flex flex-col space-y-3">
                <div className="self-start bg-gray-100 rounded-lg p-2 text-sm text-gray-700 max-w-[80%]">
                  When are we going hiking?
                </div>
                <div className="self-end bg-chat-outgoing rounded-lg p-2 flex items-center space-x-2 max-w-[60%]">
                  <Mic className="w-4 h-4 text-gray-600" />
                  <div className="flex items-end space-x-0.5 h-4">
                    <span className="w-0.5 h-2 bg-gray-500 rounded-full"></span>
                    <span className="w-0.5 h-3 bg-gray-500 rounded-full"></span>
                    <span className="w-0.5 h-4 bg-gray-500 rounded-full"></span>
                    <span className="w-0.5 h-2 bg-gray-500 rounded-full"></span>
                    <span className="w-0.5 h-3 bg-gray-500 rounded-full"></span>
                  </div>
                  <span className="text-xs text-gray-600">0:05</span>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Say Anything</h2>
            <p className="text-gray-600 text-base max-w-xs">
              Send and receive messages, photos, videos, documents, and voice messages.
            </p>
          </div>

          {/* Feature 2: Free for Everyone (Replaced Video Call) */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-xs mb-8">
              {/* Image: Earth */}
              <div className="bg-[#eaf3ff] rounded-2xl shadow-lg p-4 flex items-center justify-center h-48">
                <img 
                  src={global} 
                  alt="Global Connectivity" 
                  className="max-h-full w-auto object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Free for Everyone</h2>
            <p className="text-gray-600 text-base max-w-xs">
              Signal is an independent nonprofit. We're not tied to major tech companies, and we rely on donations to keep going.
            </p>
          </div>

          {/* Feature 3: Make Privacy Stick */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-xs mb-8">
              {/* Mock UI: Make Privacy Stick */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 flex flex-col space-y-3 items-center">
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-100 text-4xl">
                  😎
                </div>
                <div className="bg-yellow-300 rounded-md px-3 py-1 text-sm font-bold text-gray-800 shadow-sm">
                  FRIDAY!
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Make Privacy Stick</h2>
            <p className="text-gray-600 text-base max-w-xs">
              Add a new layer of expression to your conversations with encrypted stickers.
            </p>
          </div>

          {/* Feature 4: Get Together with Groups */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-xs mb-8">
              {/* Mock UI: Get Together with Groups */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 flex flex-col space-y-2">
                <div className="self-start bg-gray-100 rounded-lg p-2 text-sm text-gray-700 max-w-[80%]">
                  See you there!
                </div>
                <div className="self-end bg-chat-outgoing rounded-lg p-2 text-sm text-gray-700 max-w-[70%]">
                  Sounds great, I'll bring snacks.
                </div>
                <div className="self-start bg-gray-100 rounded-lg p-2 text-sm text-gray-700 max-w-[60%]">
                  Awesome!
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Get Together with Groups</h2>
            <p className="text-gray-600 text-base max-w-xs">
              Keep in touch with friends and family. Get together and stay connected with groups.
            </p>
          </div>
        </div>
      </div>

      {/* No Ads Section (Purple) */}
      <div className="bg-[#3a1d6d] text-white py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">No ads. No trackers. No kidding.</h2>
            <p className="text-purple-100 text-lg max-w-md">
              There is no tracking, no ads, no bots. Just a simple, secure messaging app.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Lock className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Free Section (Blue) */}
      <div className="bg-[#eaf3ff] py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Globe className="w-10 h-10 text-signal-blue" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Free for Everyone</h2>
          <p className="text-gray-600 text-lg mb-8">
            Signal is an independent nonprofit. We're not tied to major tech companies, and we rely on donations to keep going.
          </p>
          <button className="bg-signal-blue text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-blue-700 transition shadow-md">
            Donate to Signal
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111b21] text-gray-400 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-6 h-6 text-signal-blue" />
              <span className="font-bold text-white text-lg">Signal</span>
            </div>
            <p className="text-xs">© 2013 - 2026 Signal Clone, a 501c3 nonprofit.</p>
            <p className="text-xs mt-2">press@signal.org</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Organization</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Donate</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Download</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Android</a></li>
              <li><a href="#" className="hover:text-white">iPhone & iPad</a></li>
              <li><a href="#" className="hover:text-white">Desktop</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Social</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Bluesky</a></li>
              <li><a href="#" className="hover:text-white">GitHub</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Support Center</a></li>
              <li><a href="#" className="hover:text-white">Community</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}