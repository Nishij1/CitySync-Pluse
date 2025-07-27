'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Brain, 
  Map, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  LogOut,
  Menu,
  X,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onLogin?: () => void;
  onLogout?: () => void;
}

export function LandingPage({ onLogin, onLogout }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Trigger animations on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate');
            if (id) {
              setAnimatedElements(prev => new Set(prev).add(id));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms provide real-time insights and predictive analytics for urban planning.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Map,
      title: 'Interactive Mapping',
      description: 'Dynamic city maps with real-time data visualization and incident tracking across all districts.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Citizen Engagement',
      description: 'Direct citizen reporting system with AI verification and gamification for community participation.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Smart Security',
      description: 'Integrated surveillance and emergency response systems for enhanced public safety.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Real-Time Monitoring',
      description: 'Live monitoring of traffic, infrastructure, utilities, and environmental conditions.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      title: 'Multi-City Support',
      description: 'Universal platform that adapts to any city worldwide with customizable configurations.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const stats = [
    { number: '50+', label: 'Cities Supported', icon: Globe },
    { number: '2.3M', label: 'Data Points/Hour', icon: TrendingUp },
    { number: '847', label: 'Active Sensors', icon: Zap },
    { number: '99.8%', label: 'Uptime', icon: Shield }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'City Manager',
      city: 'New York',
      content: 'CitySync Plus has revolutionized how we manage our urban infrastructure. The AI insights are invaluable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Urban Planner',
      city: 'Singapore',
      content: 'The real-time monitoring capabilities have significantly improved our response times to urban issues.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Emergency Coordinator',
      city: 'London',
      content: 'The citizen engagement features have created a stronger connection between our city and its residents.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
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

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 glass">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-fade-in-down">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center animate-glow">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CitySync Plus</h1>
              <p className="text-sm text-slate-400">Universal Urban Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-blue-500 hover:text-white transition-colors hover:scale-105">Features</a>
            <a href="#about" className="text-blue-500 hover:text-white transition-colors hover:scale-105">About</a>
            <a href="#testimonials" className="text-blue-500 hover:text-white transition-colors hover:scale-105">Testimonials</a>
            <a href="#contact" className="text-blue-500 hover:text-white transition-colors hover:scale-105">Contact</a>
            {onLogout ? (
              <button
                onClick={onLogout}
                className="btn-primary bg-red-600 hover:bg-red-700 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-slate-700 animate-fade-in-down">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#about" className="block text-slate-300 hover:text-white transition-colors">About</a>
              <a href="#testimonials" className="block text-slate-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#contact" className="block text-slate-300 hover:text-white transition-colors">Contact</a>
              {onLogout ? (
                <button
                  onClick={onLogout}
                  className="btn-primary bg-red-600 hover:bg-red-700 flex items-center space-x-2 w-full justify-center"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="btn-primary flex items-center space-x-2 w-full justify-center"
                >
                  <span>Login</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div 
            data-animate="hero"
            className={`animate-fade-in-up ${animatedElements.has('hero') ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
              The Future of
              <span className="gradient-text-blue block">
                Urban Intelligence
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto text-pretty">
              CitySync Plus is the next-generation AI-powered platform that transforms how cities operate, 
              making urban environments smarter, safer, and more sustainable for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!onLogout && (
                <button
                  onClick={onLogin}
                  className="btn-primary text-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
              <button className="btn-outline text-lg flex items-center justify-center space-x-2">
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center card-hover p-6 animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="features-header"
            className={`text-center mb-16 ${animatedElements.has('features-header') ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto text-pretty">
              Everything you need to transform your city into a smart, connected, and intelligent urban environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  data-animate={`feature-${index}`}
                  className={`card-hover p-6 ${animatedElements.has(`feature-${index}`) ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 animate-glow`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 text-pretty">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate="testimonials-header"
            className={`text-center mb-16 ${animatedElements.has('testimonials-header') ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Cities Say</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto text-pretty">
              Trusted by city managers and urban planners worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                data-animate={`testimonial-${index}`}
                className={`card p-6 ${animatedElements.has(`testimonial-${index}`) ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 text-pretty">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}, {testimonial.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              data-animate="about-text"
              className={`${animatedElements.has('about-text') ? 'animate-slide-in-left' : 'opacity-0'}`}
            >
              <h2 className="text-4xl font-bold text-white mb-6">About CitySync Plus</h2>
              <p className="text-lg text-slate-300 mb-6 text-pretty">
                CitySync Plus is a revolutionary urban intelligence platform that combines cutting-edge AI technology 
                with real-time data analytics to create smarter, more efficient cities.
              </p>
              <p className="text-slate-300 mb-8 text-pretty">
                Our platform supports cities worldwide, providing comprehensive solutions for traffic management, 
                infrastructure monitoring, citizen engagement, and emergency response systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Global Support</span>
                </div>
              </div>
            </div>
            <div 
              data-animate="about-card"
              className={`relative ${animatedElements.has('about-card') ? 'animate-slide-in-right' : 'opacity-0'}`}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white card-hover">
                <h3 className="text-2xl font-bold mb-4">Why Choose CitySync Plus?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Universal compatibility with any city</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Advanced AI and machine learning</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Real-time data processing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Comprehensive security features</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            data-animate="contact"
            className={`${animatedElements.has('contact') ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your City?</h2>
            <p className="text-xl text-slate-300 mb-8 text-pretty">
              Join the future of urban intelligence and make your city smarter today.
            </p>
            {!onLogout && (
              <button
                onClick={onLogin}
                className="btn-primary text-lg font-semibold flex items-center justify-center space-x-2 mx-auto"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-700 glass">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-white font-semibold">CitySync Plus</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 CitySync Plus. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 