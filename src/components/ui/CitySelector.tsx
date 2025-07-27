'use client';

import { useState } from 'react';
import { Globe, ChevronDown, MapPin, Check } from 'lucide-react';
import { getAvailableCities, setCurrentCity, currentCityConfig } from '@/config/cityConfig';

interface CitySelectorProps {
  onCityChange?: (cityId: string) => void;
}

export function CitySelector({ onCityChange }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(currentCityConfig.id);
  const availableCities = getAvailableCities();

  const handleCitySelect = (cityId: string) => {
    if (setCurrentCity(cityId)) {
      setSelectedCity(cityId);
      setIsOpen(false);
      onCityChange?.(cityId);
    }
  };

  const selectedCityInfo = availableCities.find(city => city.id === selectedCity);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {selectedCityInfo?.name || 'Select City'}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Select Your City
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Choose a city to customize your urban intelligence experience
            </p>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {availableCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCitySelect(city.id)}
                className={`w-full flex items-center justify-between p-3 hover:bg-slate-700 transition-colors ${
                  selectedCity === city.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
              >
                <div className="text-left">
                  <div className="text-sm font-medium text-white">{city.name}</div>
                  <div className="text-xs text-slate-400">{city.country}</div>
                </div>
                {selectedCity === city.id && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              Don't see your city? Contact us to add support for your location.
            </p>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
