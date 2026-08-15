// frontend/src/pages/Landing.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Lock, Mic, Phone, Shield, Sticker } from 'lucide-react';

// Official-looking Signal logo (blue speech bubble with white outline tail)
// eslint-disable-next-line react/prop-types
function SignalLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Signal logo" role="img">
      <path
        fill="#3a76f0"
        d="M24 4C12.95 4 4 12.95 4 24c0 3.14.8 6.1 2.2 8.69L4 44l11.74-2.13A19.9 19.9 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4z"
      />
      <path
        fill="#ffffff"
        d="M34.6 31.2c-.6 1.7-2.9 3.1-4.8 3.5-1.3.3-2.9.5-8.4-1.8-7.1-3-11.6-10.2-12-10.7-.3-.4-2.9-3.8-2.9-7.3 0-3.4 1.7-5.1 2.4-5.8.5-.5 1.3-.7 2-.7h.5c.6 0 1.5.2 2.3 1.8l2 4.3c.2.4.4.8.4 1.2 0 .6-.3 1-.7 1.5l-.3.4c-.4.4-.7.7-.3 1.4.4.7 1.8 3 3.9 4.9 2.7 2.4 4.8 3.2 5.5 3.5.5.2.9.2 1.3-.2.5-.5 1.6-1.8 2-2.4.4-.6.8-.5 1.4-.3.6.2 3.7 1.7 4.3 2 .6.3 1 .5 1.2.7.3.4.3 1.9-.3 3.5z"
      />
    </svg>
  );
}

export default function Landing() {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#16181d]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <SignalLogo className="w-8 h-8" />
            <span className="font-bold text-lg text-gray-900 tracking-tight">Signal</span>
          </Link>
          <div className="hidden md:flex items-center space-x-7 text-sm font-medium text-gray-700">
            <a href="#get-signal" className="hover:text-signal-blue transition-colors">Get Signal</a>
            <a href="#blog" className="hover:text-signal-blue transition-colors">Blog</a>
            <a href="#docs" className="hover:text-signal-blue transition-colors">Docs</a>
            <a href="#donate" className="hover:text-signal-blue transition-colors">Donate</a>
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center space-x-1 hover:text-signal-blue transition-colors"
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              >
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-72 overflow-auto z-10">
                  {['English', 'Español', 'Français', 'Deutsch', 'हिन्दी', 'العربية', 'Português', '日本語', '简体中文'].map((l) => (
                    <div key={l} className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-signal-blue cursor-pointer">
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/login"
              className="bg-signal-blue text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Start Messaging
            </Link>
          </div>
          <Link to="/login" className="md:hidden bg-signal-blue text-white px-4 py-2 rounded-md text-sm">
            Start
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="get-signal" className="bg-white pt-16 md:pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center px-5">
          {/* Light-blue highlight behind heading + subtext + button (ends at the button) */}
          <div className="bg-[#eaf3ff] rounded-b-3xl px-6 pt-16 pb-12 md:pt-24 md:pb-14 -mx-6 md:mx-0 md:rounded-[2.5rem] md:px-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 tracking-tight">Speak Freely</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-9 max-w-2xl mx-auto leading-relaxed">
              Say &ldquo;hello&rdquo; to a different messaging experience. An unexpected focus on privacy, combined with all of the features you expect.
            </p>
            <a
              href="#get-signal"
              className="inline-flex items-center justify-center bg-signal-blue text-white px-7 py-3.5 rounded-md font-semibold text-base hover:bg-blue-700 transition-colors shadow-sm"
            >
              Get Signal
            </a>
          </div>

          {/* Mock Phone */}
          <div className="mt-14 flex justify-center">
            <div className="w-60 md:w-72 h-[520px] md:h-[600px] bg-[#0a0a0a] rounded-[2.75rem] p-2.5 shadow-2xl">
              <div className="w-full h-full bg-chat-bg rounded-[2.25rem] flex flex-col overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#0a0a0a] rounded-full z-10"></div>
                {/* App header */}
                <div className="bg-[#f0f2f5] px-4 pt-7 pb-3 border-b border-black/5 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-signal-blue/10 flex items-center justify-center">
                    <SignalLogo className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Signal</div>
                    <div className="text-[10px] text-gray-500">Mom & Dad</div>
                  </div>
                </div>
                {/* Chat body */}
                <div className="flex-1 px-3 py-4 space-y-2.5 overflow-hidden">
                  <div className="self-start max-w-[75%] bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-[11px] text-gray-800 shadow-sm">
                    Are you coming over for dinner tonight?
                  </div>
                  <div className="self-end max-w-[70%] bg-chat-outgoing rounded-2xl rounded-tr-sm px-3 py-2 text-[11px] text-gray-800 shadow-sm">
                    Yes! What time?
                  </div>
                  <div className="self-start max-w-[75%] bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-[11px] text-gray-800 shadow-sm">
                    7pm. Can&rsquo;t wait! ❤️
                  </div>
                  <div className="self-end max-w-[60%] bg-chat-outgoing rounded-2xl rounded-tr-sm px-3 py-2 flex items-center space-x-1.5 shadow-sm">
                    <Mic className="w-3 h-3 text-gray-700" />
                    <div className="flex items-end space-x-0.5 h-3">
                      <span className="w-0.5 h-1.5 bg-gray-600 rounded-full"></span>
                      <span className="w-0.5 h-2.5 bg-gray-600 rounded-full"></span>
                      <span className="w-0.5 h-3 bg-gray-600 rounded-full"></span>
                      <span className="w-0.5 h-1.5 bg-gray-600 rounded-full"></span>
                      <span className="w-0.5 h-2.5 bg-gray-600 rounded-full"></span>
                    </div>
                    <span className="text-[10px] text-gray-700">0:05</span>
                  </div>
                </div>
                {/* Input bar */}
                <div className="px-3 pb-4 pt-2">
                  <div className="bg-white rounded-full px-3 py-2 flex items-center justify-between shadow-sm">
                    <span className="text-[10px] text-gray-400">Message</span>
                    <div className="w-6 h-6 rounded-full bg-signal-blue flex items-center justify-center">
                      <Mic className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why use Signal? intro */}
      <div className="bg-white pt-20 pb-4 px-5 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-signal-blue uppercase tracking-wider mb-3">Why use Signal?</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 max-w-2xl mx-auto">
            Explore below to see why Signal is a simple, powerful, and secure messenger
          </h2>
        </div>
      </div>

      {/* Features Section (Alternating Left/Right Layout) */}
      <div className="bg-white py-16 px-5">
        <div className="max-w-5xl mx-auto space-y-28">

          {/* Feature 1: Share Without Insecurity (Text Left, UI Right) */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Share Without Insecurity</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                State-of-the-art end-to-end encryption (powered by the open source Signal Protocol) keeps your conversations secure. We can&rsquo;t read your messages or listen to your calls, and no one else can either. Privacy isn&rsquo;t an optional mode — it&rsquo;s just the way that Signal works. Every message, every call, every time.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-xs bg-chat-bg rounded-2xl p-5 shadow-lg flex flex-col items-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-signal-blue flex items-center justify-center shadow-md">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <div className="w-full bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Safety numbers</div>
                  <div className="font-mono text-[11px] text-gray-700 tracking-wider break-all">
                    8412 9357 6621 0419<br />8832 1094 5566 7201
                  </div>
                  <div className="mt-2 inline-flex items-center space-x-1 text-signal-blue text-[11px] font-medium">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Say Anything (UI Left, Text Right) */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-xs bg-chat-bg rounded-2xl p-4 shadow-lg flex flex-col space-y-3">
                <div className="self-start max-w-[80%] bg-white rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 shadow-sm">
                  When are we going hiking?
                </div>
                <div className="self-start max-w-[55%] bg-white rounded-2xl rounded-tl-sm p-3 space-y-2 shadow-sm">
                  <div className="h-20 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-500">📷 Photo</div>
                </div>
                <div className="self-end max-w-[60%] bg-chat-outgoing rounded-2xl rounded-tr-sm p-3 flex items-center space-x-2 shadow-sm">
                  <Mic className="w-4 h-4 text-gray-700" />
                  <div className="flex items-end space-x-0.5 h-4">
                    <span className="w-0.5 h-2 bg-gray-600 rounded-full"></span>
                    <span className="w-0.5 h-3 bg-gray-600 rounded-full"></span>
                    <span className="w-0.5 h-4 bg-gray-600 rounded-full"></span>
                    <span className="w-0.5 h-2 bg-gray-600 rounded-full"></span>
                    <span className="w-0.5 h-3 bg-gray-600 rounded-full"></span>
                  </div>
                  <span className="text-xs text-gray-700">0:05</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Say Anything</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                Share text, voice messages, photos, videos, GIFs and files for free. Signal uses your phone&rsquo;s data connection so you can avoid SMS and MMS fees.
              </p>
            </div>
          </div>

          {/* Feature 3: Speak Freely (Text Left, UI Right) */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Speak Freely</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                Make crystal-clear voice and video calls to people who live across town, or across the ocean, with no long-distance charges.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-xs aspect-square bg-gradient-to-br from-[#1f2a3a] to-[#0a0f1a] rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center">
                <div className="absolute inset-6 rounded-2xl bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 px-5 py-6">
                  <div className="w-20 h-20 rounded-full bg-signal-blue/80 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                    JA
                  </div>
                  <div className="text-white font-medium">Jane Anderson</div>
                  <div className="text-white/80 text-sm flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Connected · 0:42</span>
                  </div>
                  <div className="flex space-x-4 mt-2">
                    <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center backdrop-blur">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Make Privacy Stick (UI Left, Text Right) */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-xs bg-chat-bg rounded-2xl p-5 shadow-lg flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Sticker className="w-9 h-9 text-signal-blue" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-3">
                  <span className="text-3xl">😎</span>
                  <span className="text-sm font-bold text-gray-800">FRIDAY!</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Make Privacy Stick</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                Add a new layer of expression to your conversations with encrypted stickers. You can also create and share your own sticker packs.
              </p>
            </div>
          </div>

          {/* Feature 5: Get Together with Groups (Text Left, UI Right) */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Together with Groups</h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                Group chats make it easy to stay connected to your family, friends, and coworkers.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-xs bg-chat-bg rounded-2xl p-4 shadow-lg flex flex-col space-y-3">
                <div className="bg-white rounded-xl p-3 shadow-sm flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-signal-blue flex items-center justify-center text-white text-sm font-semibold">
                    HB
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Hiking Buddies</div>
                    <div className="text-[11px] text-gray-500">8 members</div>
                  </div>
                </div>
                <div className="self-start max-w-[80%] bg-white rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 shadow-sm">
                  See you there! 🥾
                </div>
                <div className="self-end max-w-[70%] bg-chat-outgoing rounded-2xl rounded-tr-sm p-3 text-sm text-gray-800 shadow-sm">
                  Sounds great, I&rsquo;ll bring snacks.
                </div>
                <div className="self-start max-w-[60%] bg-white rounded-2xl rounded-tl-sm p-3 text-sm text-gray-800 shadow-sm">
                  Awesome!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Ads Section (Signal dark navy) */}
      <div className="bg-[#25292e] text-white py-24 px-5">
        <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-white/5 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl">
              <Shield className="w-28 h-28 text-white/90" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">No ads. No trackers. No kidding.</h2>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              There are no ads, no affiliate marketers, and no creepy tracking in Signal. So focus on sharing the moments that matter with the people who matter to you.
            </p>
          </div>
        </div>
      </div>

      {/* Free Section (Signal light blue) */}
      <div id="donate" className="bg-[#eaf3ff] py-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Globe className="w-10 h-10 text-signal-blue" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Free for Everyone</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Signal is an independent nonprofit. We&rsquo;re not tied to any major tech companies, and we can never be acquired by one either. Development is supported by grants and donations from people like you.
          </p>
          <a href="#donate" className="inline-block bg-signal-blue text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors shadow-sm">
            Donate to Signal
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111b21] text-gray-400 pt-16 pb-10 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <SignalLogo className="w-7 h-7" />
              <span className="font-bold text-white text-lg">Signal</span>
            </div>
            <p className="text-xs leading-relaxed">
              © 2013&ndash;2026 Signal, a 501c3 nonprofit. &ldquo;Signal&rdquo;, Signal logos, and other trademarks are trademarks or registered trademarks of Signal Technology Foundation in the United States and other countries.
            </p>
            <p className="text-xs mt-3">For media inquiries, contact press@signal.org</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Organization</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#donate" className="hover:text-white transition-colors">Donate</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brand Assets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Download</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#get-signal" className="hover:text-white transition-colors">Android</a></li>
              <li><a href="#get-signal" className="hover:text-white transition-colors">iPhone & iPad</a></li>
              <li><a href="#get-signal" className="hover:text-white transition-colors">Windows</a></li>
              <li><a href="#get-signal" className="hover:text-white transition-colors">Mac</a></li>
              <li><a href="#get-signal" className="hover:text-white transition-colors">Linux</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Social</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Bluesky</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mastodon</a></li>
              <li><a href="#" className="hover:text-white transition-colors">X</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}