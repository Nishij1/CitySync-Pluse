'use client';

import { InteractiveMap } from '@/components/map/InteractiveMap';
import { AlertTriangle } from 'lucide-react';

export function MainMap() {
  const mockIncidents = [
    { id: 1, type: 'Traffic', location: 'Main Street', severity: 'high', time: '2 min ago' },
    { id: 2, type: 'Pothole', location: 'Downtown', severity: 'medium', time: '15 min ago' },
    { id: 3, type: 'Power Outage', location: 'Business Park', severity: 'high', time: '32 min ago' },
    { id: 4, type: 'Waterlogging', location: 'Industrial Zone', severity: 'low', time: '1 hr ago' }
  ];

  return (
    <div className="h-full relative bg-white">
      {/* Interactive Map */}
      <InteractiveMap />

      {/* Live Incidents Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-80 z-10">
        <h3 className="text-black font-semibold mb-3 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
          Live Incidents
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {mockIncidents.map((incident) => (
            <div key={incident.id} className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    incident.severity === 'high' ? 'bg-red-500' :
                    incident.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-black text-sm font-medium">{incident.type}</span>
                </div>
                <span className="text-xs text-gray-500">{incident.time}</span>
              </div>
              <p className="text-gray-600 text-xs mt-1">{incident.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200 z-10">
        <h3 className="text-black font-semibold mb-3">Real-time Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">847</div>
            <div className="text-xs text-gray-500">Active Cameras</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-xs text-gray-500">Data Sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-xs text-gray-500">Active Alerts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">1.2M</div>
            <div className="text-xs text-gray-500">Citizens</div>
          </div>
        </div>
      </div>
    </div>
  );
}
