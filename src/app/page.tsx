'use client';

import { useState, useEffect } from 'react';
import { LandingPage } from '@/components/auth/LandingPage';
import { LoginPage } from '@/components/auth/LoginPage';
import { CityDashboard } from '@/components/dashboard/CityDashboard';
import { UserDashboard } from '@/components/auth/UserDashboard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('citysync-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserRole(authData.role);
    }
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (role: 'admin' | 'user') => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('citysync-auth', JSON.stringify({ role }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('citysync-auth');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If user is authenticated and is admin, show dashboard
  if (isAuthenticated && userRole === 'admin') {
    return <CityDashboard onLogout={handleLogout} />;
  }

  // If user is authenticated but is regular user, show user dashboard
  if (isAuthenticated && userRole === 'user') {
    return <UserDashboard onLogout={handleLogout} />;
  }

  // Show login page if not authenticated
  if (showLogin) {
    return <LoginPage onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
  }

  // Show landing page by default
  return <LandingPage onLogin={() => setShowLogin(true)} />;
}
