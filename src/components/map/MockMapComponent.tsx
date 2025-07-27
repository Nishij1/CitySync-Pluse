'use client';

import React from 'react';
import { MapPin, AlertTriangle, Info } from 'lucide-react';

interface MockMapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
  incidents?: Array<{
    id?: string | number;
    type: string;
    location: string;
    coordinates: [number, number];
    severity: 'low' | 'medium' | 'high';
    time: string;
    description: string;
  }>;
  layers?: Array<{
    id: string;
    label: string;
    visible: boolean;
    opacity: number;
  }>;
  onMapLoad?: (map: any) => void;
}

const MockMapComponent: React.FC<MockMapComponentProps> = ({
  center,
  zoom,
  incidents = [],
  layers = [],
  onMapLoad
}) => {
  React.useEffect(() => {
    // Simulate map load
    if (onMapLoad) {
      setTimeout(() => {
        onMapLoad({ center, zoom });
      }, 100);
    }
  }, [center, zoom, onMapLoad]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4K')]"></div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="text-white text-sm font-medium mb-2">Map Controls</div>
        <div className="space-y-2">
          <div className="text-xs text-slate-300">
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </div>
          <div className="text-xs text-slate-300">
            Zoom: {zoom}
          </div>
          <div className="text-xs text-slate-300">
            Incidents: {incidents.length}
          </div>
        </div>
      </div>

      {/* Incident Markers */}
      {incidents.map((incident, index) => (
        <div
          key={incident.id || index}
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${50 + (index * 10) % 60}%`,
            top: `${30 + (index * 15) % 50}%`,
          }}
        >
          <div className={`w-4 h-4 rounded-full ${getSeverityColor(incident.severity)} border-2 border-white shadow-lg relative group cursor-pointer`}>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-800 rounded-lg p-3 border border-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="text-white text-sm font-medium mb-1">{incident.type}</div>
              <div className="text-slate-300 text-xs mb-1">{incident.location}</div>
              <div className="text-slate-400 text-xs">{incident.time}</div>
              <div className="text-slate-300 text-xs mt-1">{incident.description}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Layer Toggle */}
      {layers.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
          <div className="text-white text-sm font-medium mb-2">Layers</div>
          <div className="space-y-1">
            {layers.map((layer) => (
              <div key={layer.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => {}}
                  className="w-3 h-3 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-slate-300">{layer.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Info */}
      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="flex items-center space-x-2 text-white text-sm">
          <Info className="w-4 h-4" />
          <span>Mock Map View</span>
        </div>
        <div className="text-xs text-slate-300 mt-1">
          Real map integration requires Google Maps API
        </div>
      </div>
    </div>
  );
};

export default MockMapComponent; 