'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  Thermometer,
  Wifi,
  Car,
  Building
} from 'lucide-react';
import { dataService, type CityMetrics, type IncidentReport } from '@/services/dataService';
import { currentCityConfig } from '@/config/cityConfig';

export function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<CityMetrics | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<IncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up real-time subscriptions
    const unsubscribeMetrics = dataService.subscribeToMetrics(
      currentCityConfig.id, 
      setMetrics
    );
    
    const unsubscribeIncidents = dataService.subscribeToIncidents(
      currentCityConfig.id,
      (incidents) => setRecentIncidents(incidents.slice(0, 5))
    );

    return () => {
      unsubscribeMetrics();
      unsubscribeIncidents();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [metricsData, incidentsData] = await Promise.all([
        dataService.getCityMetrics(currentCityConfig.id),
        dataService.getIncidents(currentCityConfig.id)
      ]);
      
      setMetrics(metricsData);
      setRecentIncidents(incidentsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-black">Loading real-time city data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-600" />
              Real-Time City Pulse
            </h1>
            <p className="text-gray-600">Live monitoring for {currentCityConfig.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Traffic */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Car className="h-8 w-8 text-red-500" />
                <span className="text-xs text-gray-500">Traffic</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-black">{metrics.traffic.averageSpeed} km/h</div>
                <div className="text-sm text-gray-600">Average Speed</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.traffic.congestionLevel * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{metrics.traffic.congestionLevel}/10</span>
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Building className="h-8 w-8 text-blue-600" />
                <span className="text-xs text-gray-500">Infrastructure</span>
              </div>
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${getHealthColor(metrics.infrastructure.systemHealth)}`}>
                  {metrics.infrastructure.systemHealth}%
                </div>
                <div className="text-sm text-gray-600">System Health</div>
                <div className="text-xs text-gray-500">
                  {metrics.infrastructure.activeIssues} active issues
                </div>
              </div>
            </div>

            {/* Safety */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-green-600" />
                <span className="text-xs text-gray-500">Safety</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-black">{metrics.safety.averageResponseTime}m</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
                <div className="text-xs text-gray-500">
                  {metrics.safety.emergencyResponses} responses today
                </div>
              </div>
            </div>

            {/* Citizen Engagement */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-purple-600" />
                <span className="text-xs text-gray-500">Engagement</span>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-black">{metrics.citizenEngagement.activeReports}</div>
                <div className="text-sm text-gray-600">Active Reports</div>
                <div className="text-xs text-gray-500">
                  {metrics.citizenEngagement.satisfactionScore}% satisfaction
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Incidents & Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Recent Incidents
            </h3>
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                        <span className="text-black font-medium text-sm">{incident.title}</span>
                      </div>
                      <p className="text-gray-600 text-xs mb-1">{incident.location.address}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{incident.type}</span>
                        <span>•</span>
                        <span>{new Date(incident.timestamps.reported).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      incident.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      incident.status === 'verified' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environment & Utilities */}
          {metrics && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-blue-600" />
                Environment & Utilities
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Air Quality</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${metrics.environment.airQuality}%` }}
                      ></div>
                    </div>
                    <span className="text-black text-sm">{metrics.environment.airQuality}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Noise Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${metrics.environment.noiseLevel}%` }}
                      ></div>
                    </div>
                    <span className="text-black text-sm">{metrics.environment.noiseLevel} dB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Power Grid
                  </span>
                  <span className="text-black text-sm">
                    {metrics.utilities.powerOutages} outages
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center">
                    <Wifi className="h-4 w-4 mr-1" />
                    Connectivity
                  </span>
                  <span className="text-green-600 text-sm">
                    {metrics.utilities.internetConnectivity}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            System Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">847</div>
              <div className="text-xs text-gray-500">Data Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.3M</div>
              <div className="text-xs text-gray-500">Data Points/Hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">23ms</div>
              <div className="text-xs text-gray-500">Avg Latency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
