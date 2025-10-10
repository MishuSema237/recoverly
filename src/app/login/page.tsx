'use client';

import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Zap, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import InstantLink from '@/components/InstantLink';

const LoginPage = () => {
  const { signIn, resetPassword, user, getRememberedEmail } = useAuth();
  const { setLoading } = useLoading();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showActivationSuccess, setShowActivationSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  useEffect(() => {
    // Check if user came from email activation
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('activated') === 'true') {
      setShowActivationSuccess(true);
      // Pre-fill email if provided
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setFormData(prev => ({ ...prev, email: emailParam }));
      }
      // Hide success message after 5 seconds
      setTimeout(() => setShowActivationSuccess(false), 5000);
    }

    // Load remembered email
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, [getRememberedEmail]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setLoading(true, 'Signing you in...');
    
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      await signIn(formData.email, formData.password, formData.rememberMe);
      setLoading(true, 'Redirecting to dashboard...');
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'An error occurred during login';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address. Please sign up first.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            break;
          case 'auth/email-not-verified':
            errorMessage = 'Please verify your email address before signing in. Check your inbox for verification email.';
            break;
          default:
            errorMessage = firebaseError.message || 'An error occurred during login';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || 'An error occurred during login';
      } else {
        errorMessage = 'An unknown error occurred during login';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    setError('');
    
    try {
      if (!forgotPasswordEmail) {
        throw new Error('Please enter your email address');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(forgotPasswordEmail)) {
        throw new Error('Please enter a valid email address');
      }

      await resetPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
      setForgotPasswordEmail('');
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      let errorMessage = 'An error occurred while sending reset email';
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          default:
            errorMessage = firebaseError.message || 'An error occurred while sending reset email';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || 'An error occurred while sending reset email';
      }
      setError(errorMessage);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Login',
      description: 'Bank-level security for your account',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Access',
      description: 'Access your portfolio instantly',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your Tesla Capital account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {showActivationSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Email activated successfully! You can now sign in.
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      {error}
                      {error.includes('No account found') && (
                        <div className="mt-2">
                          <InstantLink 
                            href="/signup" 
                            className="text-red-600 hover:text-red-800 underline font-medium"
                          >
                            Create a new account →
                          </InstantLink>
                        </div>
                      )}
                      {error.includes('verify your email') && (
                        <div className="mt-2">
                          <InstantLink 
                            href="/activate-email" 
                            className="text-red-600 hover:text-red-800 underline font-medium"
                          >
                            Resend verification email →
                          </InstantLink>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <InstantLink href="/signup" className="text-red-600 hover:text-red-700 font-semibold">
                  Sign up here
                </InstantLink>
              </p>
            </div>
          </motion.div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError('');
                      setForgotPasswordSuccess(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                </div>

                {forgotPasswordSuccess ? (
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Reset Email Sent!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      We&apos;ve sent a password reset link to your email address. 
                      Please check your inbox and follow the instructions.
                    </p>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordSuccess(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isForgotPasswordLoading}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                    >
                      {isForgotPasswordLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Reset Email'
                      )}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setError('');
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}

          {/* Right Side - Features & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Access Your <span className="text-red-600">Investment Portfolio</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Sign in to manage your investments, track performance, and access exclusive features.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  className="flex items-center space-x-4"
                >
                  <div className="bg-red-600 p-3 rounded-lg text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">New to Tesla Capital?</h3>
              <p className="text-red-100 mb-4">
                Join thousands of investors who trust Tesla Capital for their investment needs.
              </p>
              <InstantLink
                href="/signup"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
              >
                Create Account
              </InstantLink>
            </div>

            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is available 24/7 to assist you.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 support@teslacapital.com</p>
                <p>📞 +1 (555) 123-4567</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
