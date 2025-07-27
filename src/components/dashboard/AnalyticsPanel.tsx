'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Users, Zap, Calendar, Activity, AlertTriangle } from 'lucide-react';
import { dataService, type CityMetrics } from '@/services/dataService';
import { currentCityConfig } from '@/config/cityConfig';

export function AnalyticsPanel() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('traffic');
  const [cityMetrics, setCityMetrics] = useState<CityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();

    // Set up real-time updates
    const interval = setInterval(loadAnalyticsData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const metricsData = await dataService.getCityMetrics(currentCityConfig.id);
      setCityMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timeRanges = [
    { id: '1h', label: '1 Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' }
  ];

  const metrics = [
    { id: 'traffic', label: 'Traffic Flow', icon: BarChart3, color: 'text-red-600' },
    { id: 'incidents', label: 'Incidents', icon: Zap, color: 'text-yellow-600' },
    { id: 'sentiment', label: 'City Sentiment', icon: Users, color: 'text-blue-600' },
    { id: 'infrastructure', label: 'Infrastructure', icon: TrendingUp, color: 'text-green-600' }
  ];

  const mockData = {
    traffic: [
      { time: '00:00', value: 23 },
      { time: '06:00', value: 45 },
      { time: '12:00', value: 78 },
      { time: '18:00', value: 92 },
      { time: '24:00', value: 34 }
    ],
    incidents: [
      { type: 'Traffic', count: 23, trend: '+12%' },
      { type: 'Infrastructure', count: 15, trend: '-5%' },
      { type: 'Safety', count: 8, trend: '+3%' },
      { type: 'Environment', count: 12, trend: '-8%' }
    ]
  };

  return (
    <div className="h-full bg-white p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Temporal Analysis Engine</h1>
                <p className="text-gray-600">Pattern detection and predictive analytics</p>
              </div>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeRange === range.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Metrics Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Metrics</h3>
              <div className="space-y-2">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id)}
                      className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                        selectedMetric === metric.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 ${metric.color}`} />
                      <span>{metric.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">Key Stats</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">94.2%</div>
                  <div className="text-xs text-gray-500">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2.3M</div>
                  <div className="text-xs text-gray-500">Data Points/Hour</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">847</div>
                  <div className="text-xs text-gray-500">Active Sensors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">23ms</div>
                  <div className="text-xs text-gray-500">Avg Response</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analytics Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Area */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">
                  {metrics.find(m => m.id === selectedMetric)?.label} Trends
                </h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Last {timeRange}</span>
                </div>
              </div>
              
              {/* Placeholder Chart */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Interactive Chart Loading...</p>
                  <p className="text-xs text-gray-500">Real-time data visualization</p>
                </div>
              </div>
            </div>

            {/* Pattern Detection */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Pattern Detection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-black mb-2">Traffic Patterns</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Peak congestion detected at ORR junction during 8-9 AM
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence: 94%</span>
                    <span className="text-xs text-green-600">+12% from last week</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-black mb-2">Incident Correlation</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Power outages correlate with 23% increase in traffic reports
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence: 87%</span>
                    <span className="text-xs text-yellow-600">New pattern</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-black mb-2">Seasonal Trends</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Waterlogging reports increase 340% during monsoon onset
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence: 96%</span>
                    <span className="text-xs text-blue-600">Historical pattern</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-black mb-2">Sentiment Analysis</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    Positive sentiment in Koramangala after infrastructure upgrade
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Confidence: 91%</span>
                    <span className="text-xs text-purple-600">Improving trend</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictive Alerts */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-yellow-600" />
                Predictive Alerts
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-red-700 font-medium">High Traffic Expected</span>
                    <span className="text-xs text-red-600">Tomorrow 6-8 PM</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    Cricket match at Chinnaswamy Stadium - expect 40% increase in traffic
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-700 font-medium">Weather Impact</span>
                    <span className="text-xs text-yellow-600">Next 3 days</span>
                  </div>
                  <p className="text-yellow-600 text-sm mt-1">
                    Heavy rain predicted - potential waterlogging in low-lying areas
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-medium">Infrastructure Maintenance</span>
                    <span className="text-xs text-blue-600">Next week</span>
                  </div>
                  <p className="text-blue-600 text-sm mt-1">
                    Optimal time for road maintenance: Tuesday 2-4 AM (lowest traffic)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
