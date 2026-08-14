// frontend/src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, go straight to app
  useEffect(() => {
    if (user) navigate('/app');
  }, [user, navigate]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.requestOTP(phoneNumber);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.verifyOTP(phoneNumber, otp);
      
      if (res.data.isNewUser) {
        navigate('/register', { state: { phone_number: phoneNumber } });
      } else {
        login(res.data.user, res.data.token);
        navigate('/app'); // <-- Updated to /app
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-signal-blue rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {step === 1 ? 'Signal Clone' : 'Verify your number'}
          </h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            {step === 1 
              ? 'Enter your phone number to get started.' 
              : `We've sent a code to ${phoneNumber}. (Mocked: use 123456)`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., 1234567890"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-signal-blue focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-signal-blue text-white font-medium py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength="6"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-signal-blue focus:border-transparent tracking-widest text-center text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-signal-blue text-white font-medium py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="w-full flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}