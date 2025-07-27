'use client';

import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, MapPin } from 'lucide-react';

interface IncidentData {
  id?: string | number;
  type: string;
  location: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high';
  time: string;
  description: string;
  status?: string;
  city?: string;
  area?: string;
  priority?: number;
  reportedBy?: string;
}

interface IncidentAnalyticsProps {
  incidents: IncidentData[];
  className?: string;
}

export function IncidentAnalytics({ incidents, className = '' }: IncidentAnalyticsProps) {
  // Calculate analytics
  const totalIncidents = incidents.length;
  const highSeverityCount = incidents.filter(i => i.severity === 'high').length;
  const mediumSeverityCount = incidents.filter(i => i.severity === 'medium').length;
  const lowSeverityCount = incidents.filter(i => i.severity === 'low').length;

  // Get incident types distribution
  const incidentTypes = incidents.reduce((acc, incident) => {
    acc[incident.type] = (acc[incident.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topIncidentTypes = Object.entries(incidentTypes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Get location distribution
  const locations = incidents.reduce((acc, incident) => {
    acc[incident.location] = (acc[incident.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Calculate severity percentage
  const highSeverityPercentage = totalIncidents > 0 ? (highSeverityCount / totalIncidents) * 100 : 0;
  const mediumSeverityPercentage = totalIncidents > 0 ? (mediumSeverityCount / totalIncidents) * 100 : 0;
  const lowSeverityPercentage = totalIncidents > 0 ? (lowSeverityCount / totalIncidents) * 100 : 0;

  return (
    <div className={`bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 ${className}`}>
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2" />
        Incident Analytics
      </h3>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Incidents</p>
              <p className="text-white text-2xl font-bold">{totalIncidents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">High Priority</p>
              <p className="text-red-400 text-2xl font-bold">{highSeverityCount}</p>
            </div>
            <div className="flex items-center">
              {highSeverityPercentage > 30 ? (
                <TrendingUp className="h-6 w-6 text-red-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-green-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Severity Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-300 text-sm">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-slate-700 rounded-full h-2 w-20">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${highSeverityPercentage}%` }}
                ></div>
              </div>
              <span className="text-slate-400 text-sm w-8">{highSeverityCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-300 text-sm">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-slate-700 rounded-full h-2 w-20">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mediumSeverityPercentage}%` }}
                ></div>
              </div>
              <span className="text-slate-400 text-sm w-8">{mediumSeverityCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-300 text-sm">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-slate-700 rounded-full h-2 w-20">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${lowSeverityPercentage}%` }}
                ></div>
              </div>
              <span className="text-slate-400 text-sm w-8">{lowSeverityCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Incident Types */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Top Incident Types
        </h4>
        <div className="space-y-2">
          {topIncidentTypes.map(([type, count], index) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{type}</span>
              <div className="flex items-center space-x-2">
                <div className="bg-slate-700 rounded-full h-2 w-16">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(count / totalIncidents) * 100}%` }}
                  ></div>
                </div>
                <span className="text-slate-400 text-sm w-6">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div>
        <h4 className="text-white font-medium mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Top Locations
        </h4>
        <div className="space-y-2">
          {topLocations.map(([location, count], index) => (
            <div key={location} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm truncate">{location}</span>
              <div className="flex items-center space-x-2">
                <div className="bg-slate-700 rounded-full h-2 w-16">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(count / totalIncidents) * 100}%` }}
                  ></div>
                </div>
                <span className="text-slate-400 text-sm w-6">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <span>{totalIncidents} total incidents</span>
        </div>
      </div>
    </div>
  );
}
