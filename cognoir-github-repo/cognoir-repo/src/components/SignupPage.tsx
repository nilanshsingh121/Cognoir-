import { useState } from 'react';
import { Mail, Lock, User, Loader, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import type { AuthContextType } from '../auth.types';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup, loading, error, clearError } = useAuth() as AuthContextType;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, name);
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen meshBg noise flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 aUp">
          <h1 className="text-4xl font-bold mb-2 gG">Cognoir</h1>
          <p className="text-[#B4B8C8]">AI Research Studio</p>
          <p className="text-sm text-[#9299A8] mt-3">Create your research workspace</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-12 text-green-300 text-sm aSi flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            Account created! Redirecting to login...
          </div>
        )}

        {/* Signup Card */}
        <div className="gb glass sR p-8 rounded-[20px] aUp" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#D4AF61] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF61]/50" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Researcher"
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-12 text-[#F0EBE1] placeholder-[#9299A8] focus:outline-none focus:ring-0 transition-all"
                  disabled={loading}
                  required
                />
              </div>
            </div>

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
              {password && (
                <p className={`text-xs mt-1 ${passwordStrength === 'strong' ? 'text-green-400' : passwordStrength === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#D4AF61] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF61]/50" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-12 text-[#F0EBE1] placeholder-[#9299A8] focus:outline-none focus:ring-0 transition-all"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9299A8] hover:text-[#D4AF61] transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
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

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#D4AF61] to-[#F0DFB0] text-[#070709] font-semibold rounded-12 hover:shadow-lg hover:shadow-[rgba(212,175,97,.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="goldLine"></div>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-[#9299A8]">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#D4AF61] hover:text-[#F0DFB0] font-medium transition-colors"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-6 p-4 glass sB rounded-12 aUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-[#D4AF61] text-xs font-medium mb-2">Password Requirements:</p>
          <ul className="space-y-1 text-[#9299A8] text-xs">
            <li>✓ At least 6 characters</li>
            <li>✓ Must match confirmation password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
