'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Maximize2,
  RotateCcw,
  Zap,
  Thermometer,
  Droplets,
  Car,
  Users,
  AlertTriangle,
  Eye,
  EyeOff,
  Search,
  Filter,
  Play,
  Pause,
  TrendingUp,
  Plus
} from 'lucide-react';
import GoogleMapComponent from './GoogleMapComponent';
import { IncidentAnalytics } from '../analytics/IncidentAnalytics';
import { IncidentManager } from '../admin/IncidentManager';
import { firebaseDataService } from '../../services/firebaseDataService';
import type { IncidentReport } from '../../services/dataService';

interface MapLayer {
  id: string;
  label: string;
  icon: any;
  color: string;
  visible: boolean;
  opacity: number;
}

interface IncidentData {
  id: number;
  type: string;
  location: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high';
  time: string;
  description: string;
}

export function InteractiveMap() {
  const [is3DMode, setIs3DMode] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null);
  
  // Google Maps configuration with your API key
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDuSaYOV26dBzQpvWg-F6YF7ySmesPahwM';
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai, India (default city)
  const [mapZoom, setMapZoom] = useState(11);
  
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'traffic', label: 'Traffic Flow', icon: Car, color: 'bg-red-500', visible: true, opacity: 0.8 },
    { id: 'weather', label: 'Weather', icon: Thermometer, color: 'bg-blue-500', visible: false, opacity: 0.6 },
    { id: 'flooding', label: 'Flood Risk', icon: Droplets, color: 'bg-cyan-500', visible: false, opacity: 0.7 },
    { id: 'crowds', label: 'Crowd Density', icon: Users, color: 'bg-purple-500', visible: false, opacity: 0.5 },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, color: 'bg-yellow-500', visible: true, opacity: 0.9 },
    { id: 'power', label: 'Power Grid', icon: Zap, color: 'bg-green-500', visible: false, opacity: 0.6 }
  ]);

  // Real-time updates simulation
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
  const [showIncidentManager, setShowIncidentManager] = useState(false);
  const [editingIncident, setEditingIncident] = useState<IncidentReport | null>(null);

  // Initialize Firebase data and subscribe to real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeData = async () => {
      try {
        setIsLoadingIncidents(true);

        // Subscribe to real-time updates for Mumbai (default city)
        unsubscribe = firebaseDataService.subscribeToIncidents(
          'mumbai', // Default to Mumbai
          (firebaseIncidents: IncidentReport[]) => {
            console.log('Received incidents from Firebase:', firebaseIncidents.length);
            setIncidents(firebaseIncidents);
            setIsLoadingIncidents(false);
            setLastUpdate(new Date());
          }
        );

      } catch (error) {
        console.error('Error initializing Firebase data:', error);
        setIsLoadingIncidents(false);
      }
    };

    initializeData();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    setMapZoom(prev => {
      if (direction === 'in') return Math.min(20, prev + 1);
      return Math.max(1, prev - 1);
    });
  };

  const resetView = () => {
    setMapCenter({ lat: 12.9716, lng: 77.5946 }); // Bengaluru center
    setMapZoom(12);
  };

  // Keyboard controls for Google Maps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const panAmount = 0.01; // Degrees for lat/lng
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setMapCenter(prev => ({ ...prev, lat: prev.lat + panAmount }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setMapCenter(prev => ({ ...prev, lat: prev.lat - panAmount }));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setMapCenter(prev => ({ ...prev, lng: prev.lng - panAmount }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setMapCenter(prev => ({ ...prev, lng: prev.lng + panAmount }));
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoom('in');
          break;
        case '-':
          e.preventDefault();
          handleZoom('out');
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetView();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
  };

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity }
        : layer
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 border-red-400';
      case 'medium': return 'bg-yellow-500 border-yellow-400';
      case 'low': return 'bg-green-500 border-green-400';
      default: return 'bg-gray-500 border-gray-400';
    }
  };



  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In a real app, this would fetch new incident data
      console.log('Checking for new incidents...');
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Performance optimization: memoize filtered incidents
  // Convert IncidentReport to IncidentData format for components
  const convertIncidentForDisplay = (incident: IncidentReport) => ({
    id: incident.id || '0',
    type: incident.type,
    location: incident.location.address,
    coordinates: [incident.location.coordinates.lat, incident.location.coordinates.lng] as [number, number],
    severity: incident.severity === 'critical' ? 'high' : incident.severity as 'low' | 'medium' | 'high',
    time: incident.timestamps.reported.toLocaleString(),
    description: incident.description,
    status: incident.status,
    reportedBy: incident.reporter.name || 'Anonymous'
  });

  const memoizedFilteredIncidents = useMemo(() => {
    return incidents
      .filter((incident: IncidentReport) => {
        const severity = incident.severity === 'critical' ? 'high' : incident.severity;
        const matchesFilter = incidentFilter === 'all' || severity === incidentFilter;
        const matchesSearch = searchQuery === '' ||
          incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          incident.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .map(convertIncidentForDisplay);
  }, [incidents, incidentFilter, searchQuery]);

  if (isLoadingIncidents) {
    return (
      <div className="h-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-white text-lg font-semibold mb-2">Loading CitySync+ Bengaluru</h3>
          <p className="text-slate-400">Connecting to Firebase and loading incident data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-slate-900 overflow-hidden">
      {/* Google Maps Container */}
      <div className="absolute inset-0">
        <GoogleMapComponent
          center={mapCenter}
          zoom={mapZoom}
          incidents={memoizedFilteredIncidents}
          layers={layers}
          onMapLoad={(map: google.maps.Map) => {
            console.log('Google Maps loaded:', map);
          }}
          onIncidentClick={(incident) => {
            setSelectedIncident(incident);
          }}
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="absolute top-4 left-4 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 max-w-sm space-y-4">
        {/* Search Bar */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search Incidents
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by type, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Severity Filter */}
        <div className="space-y-2">
          <h4 className="text-white font-medium flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter by Severity
          </h4>
          <div className="flex space-x-2">
            {(['all', 'high', 'medium', 'low'] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => setIncidentFilter(severity)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  incidentFilter === severity
                    ? severity === 'high' ? 'bg-red-600 text-white'
                      : severity === 'medium' ? 'bg-yellow-600 text-white'
                      : severity === 'low' ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                }`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Live Mode Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Real-time Updates</h4>
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                isLiveMode
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {isLiveMode ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              <span>{isLiveMode ? 'Live' : 'Paused'}</span>
            </button>
          </div>
          <div className="text-xs text-slate-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
          Showing {memoizedFilteredIncidents.length} of {incidents.length} incidents
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 left-80 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 max-w-xs">
        <h3 className="text-white font-semibold mb-3 flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          Map Layers
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      layer.visible 
                        ? 'bg-slate-700 text-white' 
                        : 'bg-slate-600 text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{layer.label}</span>
                  </button>
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
                {layer.visible && (
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Opacity:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layer.opacity}
                        onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xs text-slate-400 w-8">
                        {Math.round(layer.opacity * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button 
          onClick={() => handleZoom('in')}
          className="p-3 bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          title="Zoom In"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button 
          onClick={() => handleZoom('out')}
          className="p-3 bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          title="Zoom Out"
        >
          <span className="text-lg font-bold">-</span>
        </button>
        <button 
          onClick={() => setIs3DMode(!is3DMode)}
          className={`p-3 rounded-lg shadow-lg border border-slate-700 transition-colors ${
            is3DMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle 3D Mode"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        <button
          onClick={resetView}
          className="p-3 bg-slate-800 rounded-lg shadow-lg border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`p-3 rounded-lg shadow-lg border border-slate-700 transition-colors ${
            showAnalytics
              ? 'bg-purple-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Toggle Analytics"
        >
          <TrendingUp className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowIncidentManager(true)}
          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg border border-slate-700 transition-colors"
          title="Add New Incident"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Status Bar with Quick Stats */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        {/* Zoom Level Indicator */}
        <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700">
          <span className="text-sm">Zoom: {mapZoom}</span>
        </div>

        {/* Active Layers Count */}
        <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700">
          <span className="text-sm">
            {layers.filter(l => l.visible).length} layers active
          </span>
        </div>

        {/* Incident Stats */}
        <div className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700">
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{incidents.filter(i => i.severity === 'high').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{incidents.filter(i => i.severity === 'medium').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{incidents.filter(i => i.severity === 'low').length}</span>
            </div>
          </div>
        </div>

        {/* Live Status */}
        <div className={`px-3 py-2 rounded-lg shadow-lg border border-slate-700 ${
          isLiveMode ? 'bg-green-800 text-green-200' : 'bg-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
            <span>{isLiveMode ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
      </div>

      {/* Incident Details Panel */}
      {selectedIncident && (
        <div className="absolute top-4 right-4 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 max-w-sm">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center">
              <AlertTriangle className={`h-4 w-4 mr-2 ${
                selectedIncident.severity === 'high' ? 'text-red-400' :
                selectedIncident.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
              }`} />
              {selectedIncident.type}
            </h3>
            <button
              onClick={() => setSelectedIncident(null)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-400">Location:</span>
              <span className="text-white ml-2">{selectedIncident.location}</span>
            </div>
            <div>
              <span className="text-slate-400">Severity:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                selectedIncident.severity === 'high' ? 'bg-red-600 text-white' :
                selectedIncident.severity === 'medium' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {selectedIncident.severity.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Time:</span>
              <span className="text-white ml-2">{selectedIncident.time}</span>
            </div>
            <div>
              <span className="text-slate-400">Description:</span>
              <p className="text-white mt-1">{selectedIncident.description}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
              View Full Details
            </button>
          </div>
        </div>
      )}

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="absolute top-4 right-4 w-80">
          <IncidentAnalytics
            incidents={memoizedFilteredIncidents}
            className="max-h-96 overflow-y-auto"
          />
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700 max-w-xs">
        <h4 className="text-white font-semibold mb-2 text-sm">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-300">High Priority Incidents</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-300">Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-300">Low Priority</span>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <h5 className="text-white font-medium mb-1 text-xs">Controls</h5>
          <div className="space-y-1 text-xs text-slate-400">
            <div>Arrow keys: Pan</div>
            <div>+/- : Zoom</div>
            <div>R: Reset view</div>
            <div>Mouse wheel: Zoom</div>
            <div>Drag: Pan map</div>
          </div>
        </div>
      </div>

      {/* Incident Manager Modal */}
      {showIncidentManager && (
        <IncidentManager
          onClose={() => {
            setShowIncidentManager(false);
            setEditingIncident(null);
          }}
          editingIncident={editingIncident}
        />
      )}
    </div>
  );
}
