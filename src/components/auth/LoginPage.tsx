'use client';

import { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'user') => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Login logic
      if (formData.username === 'Admin' && formData.password === 'Admin') {
        setSuccess('Admin login successful!');
        setTimeout(() => onLogin('admin'), 1000);
      } else {
        // Check if it's a regular user (for demo purposes, accept any other credentials)
        if (formData.username && formData.password) {
          setSuccess('User login successful!');
          setTimeout(() => onLogin('user'), 1000);
        } else {
          setError('Invalid credentials. For admin access, use username: "Admin" and password: "Admin"');
        }
      }
    } else {
      // Registration logic
      if (!formData.username || !formData.password || !formData.email || !formData.fullName) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.username === 'Admin') {
        setError('Username "Admin" is reserved for administrators');
        return;
      }

      // For demo purposes, accept any registration
      setSuccess('Account created successfully! You can now login.');
      setIsLogin(true);
      setFormData({
        username: formData.username,
        password: '',
        confirmPassword: '',
        email: '',
        fullName: ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-300 hover:text-white mb-8 transition-colors animate-fade-in-down"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </button>

        {/* Login/Register Card */}
        <div className="glass rounded-lg p-8 shadow-strong animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
              {isLogin ? (
                <Shield className="h-8 w-8 text-white" />
              ) : (
                <Users className="h-8 w-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-400 text-pretty">
              {isLogin 
                ? 'Sign in to access CitySync Plus' 
                : 'Join the future of urban intelligence'
              }
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-900 border border-red-700 rounded-lg mb-6 animate-fade-in-up">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-200 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-900 border border-green-700 rounded-lg mb-6 animate-fade-in-up">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-200 text-sm">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div className="animate-slide-in-left">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="input-primary"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="animate-slide-in-left">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-primary"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Username */}
            <div className="animate-slide-in-left">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="input-primary pl-10"
                  placeholder={isLogin ? "Enter username" : "Choose a username"}
                />
                <User className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div className="animate-slide-in-left">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="input-primary pl-10 pr-10"
                  placeholder={isLogin ? "Enter password" : "Choose a password"}
                />
                <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLogin && (
              <div className="animate-slide-in-left">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="input-primary pl-10"
                    placeholder="Confirm your password"
                  />
                  <Lock className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            )}

            {/* Admin Login Info */}
            {isLogin && (
              <div className="p-3 bg-blue-900 border border-blue-700 rounded-lg animate-fade-in-up">
                <p className="text-blue-200 text-sm">
                  <strong>Admin Access:</strong> Username: "Admin", Password: "Admin"
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <Sparkles className="h-4 w-4" />
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    fullName: ''
                  });
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-slate-700 rounded-lg">
            <p className="text-slate-300 text-xs text-pretty">
              <strong>Demo Mode:</strong> This is a demonstration application. 
              {isLogin 
                ? ' Use "Admin"/"Admin" for admin access, or any other credentials for user access.' 
                : ' Registration creates a user account with limited access.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 