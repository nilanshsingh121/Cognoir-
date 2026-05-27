import { useState } from 'react';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

interface RegisterProps {
  onRegister: (email: string, username: string, password: string) => boolean;
  onSwitchToLogin: () => void;
  error: string | null;
  clearError: () => void;
}

export default function Register({ onRegister, onSwitchToLogin, error, clearError }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMatch(password === value || value === '');
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setIsSubmitting(true);
    const success = onRegister(email, username, password);

    if (!success) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden noise">
      {/* Mesh background */}
      <div className="absolute inset-0 meshBg -z-10" />

      {/* Animated orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full aMp" style={{ background: 'radial-gradient(circle, rgba(212,175,97,.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full aMp" style={{ background: 'radial-gradient(circle, rgba(180,184,200,.06) 0%, transparent 70%)', animationDelay: '2s' }} />

      {/* Main card */}
      <div className="w-full max-w-md px-6 z-10 aUp">
        <div className="glass sR gb p-8 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 text-4xl">✨</div>
            <h1 className="text-3xl font-bold gG mb-2">Join Cognoir</h1>
            <p className="text-sm text-[var(--iv)]/70">Create your AI research studio</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--iv)]/90 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--iv)]/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.1)] rounded-lg text-[var(--iv)] placeholder-[var(--iv)]/40 focus:outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--iv)]/90 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--iv)]/40" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearError();
                  }}
                  placeholder="yourname"
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.1)] rounded-lg text-[var(--iv)] placeholder-[var(--iv)]/40 focus:outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-[var(--iv)]/50 mt-1">3+ characters, letters and numbers</p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--iv)]/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--iv)]/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordMatch(true);
                    clearError();
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.1)] rounded-lg text-[var(--iv)] placeholder-[var(--iv)]/40 focus:outline-none transition-all"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-[var(--iv)]/50 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--iv)]/90 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--iv)]/40" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,.04)] border rounded-lg text-[var(--iv)] placeholder-[var(--iv)]/40 focus:outline-none transition-all ${
                    !passwordMatch ? 'border-red-500/40' : 'border-[rgba(255,255,255,.1)]'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {!passwordMatch && <p className="text-xs text-red-400 mt-1">Passwords do not match</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !email || !username || !password || !confirmPassword || !passwordMatch}
              className="w-full py-2.5 px-4 mt-6 bg-gradient-to-r from-[#D4AF61] to-[#F0DFB0] text-[#070709] font-semibold rounded-lg hover:shadow-lg hover:shadow-[rgba(212,175,97,.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#070709]/20 border-t-[#070709] rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(212,175,97,.2)] to-transparent" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[rgba(14,14,22,.75)] text-[var(--iv)]/50">or</span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-[var(--iv)]/70">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#D4AF61] font-semibold hover:text-[#F0DFB0] transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-xs text-[var(--iv)]/50">
          <p>Start your AI research journey today.</p>
        </div>
      </div>
    </div>
  );
}
