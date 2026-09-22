import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0347-');
  const [city, setCity] = useState('Karachi');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, switchDemoUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields');
        }
        await register({ name, email, password, phone, city });
      } else {
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        await login(email, password);
      }
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'admin' | 'customer') => {
    switchDemoUser(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8C2B3E] px-3 py-1 bg-[#FCE7EC] rounded-full">
          <Sparkles className="w-3 h-3 text-[#B76E79]" /> Studio Account Access
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#3A121A]">
          {isRegister ? 'Create Salon Profile' : 'Welcome to Hira Farooq'}
        </h1>
        <p className="text-xs text-gray-500">
          {isRegister
            ? 'Sign up to track orders, save bridal appointments, and receive VIP offers'
            : 'Sign in to access your orders, bookings, and customer account'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#FAF0F2] p-1 rounded-2xl border border-[#F2D8DC]">
        <button
          type="button"
          onClick={() => {
            setIsRegister(false);
            setError('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            !isRegister ? 'bg-[#3A121A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegister(true);
            setError('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            isRegister ? 'bg-[#3A121A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          New Client Register
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-8 shadow-xs space-y-4">
        {isRegister && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Maria Sheikh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                  required
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="0347-xxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Karachi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
              required
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-gray-700">Password *</label>
            {!isRegister && (
              <span className="text-[11px] text-[#8C2B3E] hover:underline cursor-pointer">
                Forgot password?
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
              required
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          id="auth-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 mt-2"
        >
          {loading ? 'Processing...' : isRegister ? 'Create Studio Account' : 'Sign In'}
        </button>

        {/* Instant 1-Click Demo Evaluation Switcher */}
        <div className="pt-4 border-t border-[#F2D8DC] space-y-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block text-center">
            Or Test Immediately With Demo Profiles:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-2.5 px-3 rounded-xl bg-[#FAF0F2] text-[#8C2B3E] hover:bg-[#FCE7EC] text-xs font-bold uppercase transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2.5 px-3 rounded-xl bg-[#3A121A] text-white hover:bg-[#260B11] text-xs font-bold uppercase transition-colors"
            >
              Demo Admin (Hira)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
