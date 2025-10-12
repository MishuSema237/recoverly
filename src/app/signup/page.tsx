'use client';

import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

const SignupPage = () => {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const { setLoading } = useLoading();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Create user with Firebase Auth
      await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      // Redirect to email activation page
      router.push(`/activate-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error: unknown) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'An error occurred during signup';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'This email address is already registered. Please try signing in instead.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters long.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = firebaseError.message || 'An error occurred during signup';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || 'An error occurred during signup';
      } else {
        errorMessage = 'An unknown error occurred during signup';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Platform',
      description: 'Bank-level security for all transactions',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Access',
      description: 'Start investing immediately after signup',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Support',
      description: '24/7 customer support and guidance',
    },
  ];



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join Tesla Capital and start investing today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      {error}
                      {error.includes('already registered') && (
                        <div className="mt-2">
                          <Link 
                            href="/login" 
                            className="text-red-600 hover:text-red-800 underline font-medium"
                          >
                            Sign in to your existing account →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="Create a strong password"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-to-terms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-to-terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-red-600 hover:text-red-700 font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-red-600 hover:text-red-700 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>

          {/* Right Side - Benefits & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Start Your <span className="text-red-600">Investment Journey</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of investors who trust Tesla Capital for their investment needs.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="bg-red-600 p-3 rounded-lg text-white">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>


            <div className="bg-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Choose Tesla Capital?</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Industry-leading security
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Transparent fee structure
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Expert financial guidance
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  24/7 customer support
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
