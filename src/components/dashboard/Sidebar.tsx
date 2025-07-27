'use client';

import {
  Map,
  Brain,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
  Shield,
  Camera,
  Activity
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePanel: 'dashboard' | 'map' | 'ai' | 'reports' | 'analytics';
  onPanelChange: (panel: 'dashboard' | 'map' | 'ai' | 'reports' | 'analytics') => void;
}

export function Sidebar({ collapsed, onToggle, activePanel, onPanelChange }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard' as const,
      icon: Activity,
      label: 'Real-Time Pulse',
      description: 'Live city monitoring'
    },
    {
      id: 'map' as const,
      icon: Map,
      label: 'Living City Map',
      description: 'Interactive visualization'
    },
    {
      id: 'ai' as const,
      icon: Brain,
      label: 'AI Command Center',
      description: 'Intelligent insights'
    },
    {
      id: 'reports' as const,
      icon: FileText,
      label: 'Smart Reports',
      description: 'Citizen submissions'
    },
    {
      id: 'analytics' as const,
      icon: BarChart3,
      label: 'Analytics',
      description: 'Temporal analysis'
    }
  ];

  const quickActions = [
    { icon: Layers, label: 'Toggle Layers', count: 12 },
    { icon: Zap, label: 'Active Alerts', count: 5 },
    { icon: Shield, label: 'Emergency Mode', count: 0 },
    { icon: Camera, label: 'Live Cameras', count: 847 }
  ];

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 shadow-sm ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="p-4 space-y-2">
        {!collapsed && (
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Modules
          </h3>
        )}
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPanelChange(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="ml-3 text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4" />
                    <span className="ml-2 text-sm">{action.label}</span>
                  </div>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {action.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 mt-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">AI Processing</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Data Streams</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600">Live</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Edge Network</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-600">Syncing</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
