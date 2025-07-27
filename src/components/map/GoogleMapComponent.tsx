'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

interface GoogleMapComponentProps {
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
    status?: string;
    reportedBy?: string;
  }>;
  layers?: Array<{
    id: string;
    label: string;
    visible: boolean;
    opacity: number;
  }>;
  onMapLoad?: (map: google.maps.Map) => void;
  onIncidentClick?: (incident: any) => void;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center,
  zoom,
  incidents = [],
  layers = [],
  onMapLoad,
  onIncidentClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key not found');
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMap`;
        script.async = true;
        script.defer = true;

        // Set up global callback
        (window as any).initGoogleMap = () => {
          initializeMap();
        };

        script.onerror = () => {
          setError('Failed to load Google Maps API');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      // Create map
      const map = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#193341' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#2c5234' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#29323c' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      setIsLoading(false);
      setError(null);

      if (onMapLoad) {
        onMapLoad(map);
      }

      console.log('Google Maps initialized successfully');
    } catch (err) {
      setError('Failed to initialize map');
      setIsLoading(false);
      console.error('Map initialization error:', err);
    }
  };

  // Update map center and zoom
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Update incident markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    incidents.forEach((incident, index) => {
      const position = {
        lat: incident.coordinates[0],
        lng: incident.coordinates[1]
      };

      const marker = new google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        title: incident.type,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getSeverityColor(incident.severity),
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      // Add click listener
      marker.addListener('click', () => {
        const content = `
          <div style="padding: 12px; max-width: 300px; color: #333;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${incident.type}</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;"><strong>Location:</strong> ${incident.location}</p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(incident.severity)};">${incident.severity}</span></p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;"><strong>Time:</strong> ${incident.time}</p>
            ${incident.status ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;"><strong>Status:</strong> ${incident.status}</p>` : ''}
            ${incident.reportedBy ? `<p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;"><strong>Reported by:</strong> ${incident.reportedBy}</p>` : ''}
            <p style="margin: 0; color: #374151; font-size: 14px;">${incident.description}</p>
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }

        if (onIncidentClick) {
          onIncidentClick(incident);
        }
      });

      markersRef.current.push(marker);
    });

    console.log(`Added ${incidents.length} incident markers to map`);
  }, [incidents, onIncidentClick]);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (error) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-400 text-lg font-semibold mb-2">Map Error</div>
          <div className="text-slate-400 text-sm mb-4">{error}</div>
          <div className="text-xs text-slate-500">
            Please check your Google Maps API key configuration
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <div className="text-white text-lg font-semibold mb-2">Loading Google Maps</div>
          <div className="text-slate-400 text-sm">Initializing map with Indian city data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Info Overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="text-white text-sm font-medium mb-1">Live Map</div>
        <div className="text-xs text-slate-300">
          Incidents: {incidents.length} | Zoom: {zoom}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
