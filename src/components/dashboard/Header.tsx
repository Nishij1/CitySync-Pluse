'use client';

import { useState } from 'react';
import { Search, Bell, User, Mic, MicOff, LogOut } from 'lucide-react';
import { CitySelector } from '@/components/ui/CitySelector';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // TODO: Implement Web Speech API integration
  };

  return (
    <header className="bg-blue-600 border-b border-blue-700 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CitySync Plus</h1>
            <p className="text-xs text-blue-100">Universal Urban Intelligence</p>
          </div>
        </div>

        {/* Search Bar with Voice */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything... 'Show power outages near business districts'"
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button
              onClick={handleVoiceToggle}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          </div>
          {isListening && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 text-sm">Listening...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* City Selector */}
          <CitySelector onCityChange={(cityId) => console.log('City changed to:', cityId)} />

          {/* Notifications */}
          <button className="relative p-2 text-white hover:text-blue-100 transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-blue-100">AI Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">Live Data</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-white hidden md:block">Admin</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-sm text-black border-b border-gray-200">
                  <div className="font-medium">Administrator</div>
                  <div className="text-xs text-gray-500">Full Access</div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
