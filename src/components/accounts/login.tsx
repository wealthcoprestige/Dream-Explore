"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../axios/axiosInsatance';

interface LoginResponse {
  message: string;
  token: {
    access: string;
    refresh: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleLogin = async (loginData: LoginRequest) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authApi.post<LoginResponse>('login/', loginData);
      // Remove .data since the API returns LoginResponse directly
      localStorage.setItem('access_token', response.token.access);
      localStorage.setItem('refresh_token', response.token.refresh);
      console.log('Login successful:', response.message);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Handle sign up logic here
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!formData.firstName || !formData.lastName) {
        setError('Please fill in all fields');
        return;
      }
      console.log('Sign up form submitted:', formData);
      // Add your sign up API call here
      return;
    }

    // Login validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    await handleLogin({
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-2">
              <i className="fas fa-globe text-white text-lg"></i>
            </div>
            <h1 className="text-xl font-bold">DreamExplore</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-blue-100 text-sm">
            {isLogin 
              ? 'Sign in to your account' 
              : 'Start your global journey today'
            }
          </p>
        </div>
        <div className="p-6">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                isLogin 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="First Name"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Last Name"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Email Address"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            {!isLogin && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Confirm Password"
                  required={!isLogin}
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            )}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Forgot password?
                </a>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-bold text-sm shadow-lg transition-all duration-300 ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                <i className="fab fa-google text-red-500 mr-2 text-sm"></i>
                Google
              </button>
              <button
                type="button"
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                <i className="fab fa-linkedin text-blue-600 mr-2 text-sm"></i>
                LinkedIn
              </button>
            </div>
            {!isLogin && (
              <p className="text-center text-xs text-gray-600 mt-4">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Privacy Policy
                </a>
              </p>
            )}
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                  });
                }}
                disabled={isLoading}
                className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;