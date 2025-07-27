'use client';

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing CitySync Plus...');

  const loadingSteps = [
    'Initializing CitySync Plus...',
    'Connecting to AI Command Center...',
    'Loading City Digital Twin...',
    'Syncing Real-time Data Streams...',
    'Activating Urban Intelligence...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 20);
        if (stepIndex < loadingSteps.length) {
          setCurrentStep(loadingSteps[stepIndex]);
        }
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo/Title */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">CitySync Plus</h1>
          <p className="text-blue-200 text-lg">Universal Urban Intelligence Platform</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto space-y-4">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-blue-200 text-sm">{currentStep}</p>
          <p className="text-slate-400 text-xs">{progress}% Complete</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mt-12 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI Command Center</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Real-time Analytics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Digital Twin</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Predictive Alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
