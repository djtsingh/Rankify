'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import anime from 'animejs';
import { useAuth } from '@/lib/auth/auth-context';

// Google Icon SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Microsoft Icon SVG
const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
    <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'signin' | 'signup';
}

type ModalView = 'signin' | 'signup' | 'forgot-password' | 'reset-sent';

export function AuthModal({ isOpen, onClose, defaultView = 'signin' }: AuthModalProps) {
  const { signInWithGoogle, signInWithMicrosoft, signInWithEmail, signUpWithEmail, resetPassword, isLoading, error, clearError } = useAuth();
  
  const [view, setView] = useState<ModalView>(defaultView);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setView(defaultView);
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      setFormErrors({});
      setShowPassword(false);
      setAgreeToTerms(false);
      clearError();
    }
  }, [isOpen, defaultView, clearError]);

  // Modal animation
  useEffect(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      anime({
        targets: modalRef.current,
        opacity: [0, 1],
        duration: 200,
        easing: 'easeOutQuad',
      });
      
      anime({
        targets: contentRef.current,
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 300,
        easing: 'easeOutCubic',
      });
    }
  }, [isOpen]);

  // View transition animation
  const transitionView = (newView: ModalView) => {
    if (contentRef.current) {
      anime({
        targets: contentRef.current,
        opacity: [1, 0],
        translateX: [0, -20],
        duration: 150,
        easing: 'easeInQuad',
        complete: () => {
          setView(newView);
          clearError();
          anime({
            targets: contentRef.current,
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 200,
            easing: 'easeOutQuad',
          });
        },
      });
    } else {
      setView(newView);
      clearError();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (view === 'signup') {
      if (!formData.name) {
        errors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.password = 'Password must include uppercase, lowercase, and number';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (!agreeToTerms) {
        errors.terms = 'You must agree to the terms and privacy policy';
      }
    }
    
    if (view === 'signin' && !formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (view === 'signin') {
        await signInWithEmail(formData.email, formData.password);
        onClose();
      } else if (view === 'signup') {
        await signUpWithEmail(formData.email, formData.password, formData.name);
        onClose();
      } else if (view === 'forgot-password') {
        await resetPassword(formData.email);
        transitionView('reset-sent');
      }
    } catch {
      // Error handled by context
    }
  };

  // Handle OAuth
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleMicrosoftSignIn = async () => {
    await signInWithMicrosoft();
    onClose();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm opacity-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-2">
            {(view === 'forgot-password' || view === 'reset-sent') && (
              <button
                onClick={() => transitionView('signin')}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <img src="/logo-horizontal.svg" alt="Rankify" className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {view === 'signin' && 'Welcome back'}
            {view === 'signup' && 'Create your account'}
            {view === 'forgot-password' && 'Reset your password'}
            {view === 'reset-sent' && 'Check your email'}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {view === 'signin' && 'Sign in to continue to Rankify'}
            {view === 'signup' && 'Start your SEO journey with Rankify'}
            {view === 'forgot-password' && "We'll send you a reset link"}
            {view === 'reset-sent' && 'A password reset link has been sent'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Reset Sent View */}
          {view === 'reset-sent' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-zinc-300 mb-4">
                We&apos;ve sent a password reset link to <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-zinc-500">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => transitionView('forgot-password')}
                  className="text-coral hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          {/* Sign In / Sign Up / Forgot Password Views */}
          {view !== 'reset-sent' && (
            <>
              {/* OAuth Buttons */}
              {view !== 'forgot-password' && (
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-zinc-900 font-medium rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>
                  <button
                    onClick={handleMicrosoftSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#2F2F2F] text-white font-medium rounded-lg hover:bg-[#3F3F3F] transition-colors disabled:opacity-50"
                  >
                    <MicrosoftIcon />
                    Continue with Microsoft
                  </button>
                </div>
              )}

              {/* Divider */}
              {view !== 'forgot-password' && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-sm text-zinc-500">or continue with email</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (Sign Up only) */}
                {view === 'signup' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all ${
                          formErrors.name ? 'border-red-500' : 'border-zinc-700 focus:border-coral'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all ${
                        formErrors.email ? 'border-red-500' : 'border-zinc-700 focus:border-coral'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                {view !== 'forgot-password' && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={view === 'signup' ? 'Create a strong password' : 'Enter your password'}
                        className={`w-full pl-10 pr-12 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all ${
                          formErrors.password ? 'border-red-500' : 'border-zinc-700 focus:border-coral'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
                    )}
                    {view === 'signup' && (
                      <p className="mt-1 text-xs text-zinc-500">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password (Sign Up only) */}
                {view === 'signup' && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className={`w-full pl-10 pr-4 py-3 bg-zinc-800 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-coral/50 transition-all ${
                          formErrors.confirmPassword ? 'border-red-500' : 'border-zinc-700 focus:border-coral'
                        }`}
                      />
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Forgot Password Link (Sign In only) */}
                {view === 'signin' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => transitionView('forgot-password')}
                      className="text-sm text-coral hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms Checkbox (Sign Up only) */}
                {view === 'signup' && (
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => {
                          setAgreeToTerms(e.target.checked);
                          if (formErrors.terms) {
                            setFormErrors(prev => ({ ...prev, terms: '' }));
                          }
                        }}
                        className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-coral focus:ring-coral"
                      />
                      <span className="text-sm text-zinc-400">
                        I agree to the{' '}
                        <a href="/terms" className="text-coral hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-coral hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    {formErrors.terms && (
                      <p className="mt-1 text-sm text-red-400">{formErrors.terms}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-coral to-coral-dark text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {view === 'signin' && 'Signing in...'}
                      {view === 'signup' && 'Creating account...'}
                      {view === 'forgot-password' && 'Sending...'}
                    </>
                  ) : (
                    <>
                      {view === 'signin' && 'Sign In'}
                      {view === 'signup' && 'Create Account'}
                      {view === 'forgot-password' && 'Send Reset Link'}
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Sign In / Sign Up */}
              {view !== 'forgot-password' && (
                <p className="mt-6 text-center text-sm text-zinc-400">
                  {view === 'signin' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <button
                        onClick={() => transitionView('signup')}
                        className="text-coral font-medium hover:underline"
                      >
                        Sign up for free
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => transitionView('signin')}
                        className="text-coral font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              )}

              {/* Security Note */}
              <div className="mt-6 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <Shield className="w-4 h-4" />
                  <span>Secured with 256-bit SSL encryption</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
