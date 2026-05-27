import { useState } from 'react';
import { Mail, Lock, Loader, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../AuthContext';
import type { AuthContextType } from '../auth.types';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

export default function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { login, loading, error, clearError } = useAuth() as AuthContextType;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const demoLogin = async () => {
    setEmail('demo@cognoir.ai');
    setPassword('demo123');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen meshBg noise flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 aUp">
          <h1 className="text-4xl font-bold mb-2 gG">Cognoir</h1>
          <p className="text-[#B4B8C8]">AI Research Studio</p>
          <p className="text-sm text-[#9299A8] mt-3">Login to your research workspace</p>
        </div>

        {/* Login Card */}
        <div className="gb glass sR p-8 rounded-[20px] aUp" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#D4AF61] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF61]/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-12 text-[#F0EBE1] placeholder-[#9299A8] focus:outline-none focus:ring-0 transition-all"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#D4AF61] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF61]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-12 text-[#F0EBE1] placeholder-[#9299A8] focus:outline-none focus:ring-0 transition-all"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9299A8] hover:text-[#D4AF61] transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-12 text-red-300 text-sm aSi">
                {displayError}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#D4AF61] to-[#F0DFB0] text-[#070709] font-semibold rounded-12 hover:shadow-lg hover:shadow-[rgba(212,175,97,.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="goldLine"></div>
          </div>

          {/* Demo Login */}
          <button
            onClick={demoLogin}
            type="button"
            className="w-full py-2.5 border border-[rgba(212,175,97,.3)] rounded-12 text-[#D4AF61] hover:bg-[rgba(212,175,97,.1)] transition-all font-medium text-sm"
            disabled={loading}
          >
            Demo Account (demo@cognoir.ai)
          </button>

          {/* Signup Link */}
          <div className="mt-6 text-center text-sm text-[#9299A8]">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-[#D4AF61] hover:text-[#F0DFB0] font-medium transition-colors"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 glass sB rounded-12 text-center text-[#9299A8] text-xs aUp" style={{ animationDelay: '0.2s' }}>
          <p className="mb-2">Demo Account Credentials:</p>
          <code className="text-[#D4AF61]">demo@cognoir.ai / demo123</code>
        </div>
      </div>
    </div>
  );
}
