'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainMap } from './MainMap';
import { AICommandCenter } from './AICommandCenter';
import { ReportingPanel } from './ReportingPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { RealTimeDashboard } from './RealTimeDashboard';

interface CityDashboardProps {
  onLogout?: () => void;
}

export function CityDashboard({ onLogout }: CityDashboardProps) {
  const [activePanel, setActivePanel] = useState<'dashboard' | 'map' | 'ai' | 'reports' | 'analytics'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <Header onLogout={onLogout} />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Main Panel */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'dashboard' && <RealTimeDashboard />}
            {activePanel === 'map' && <MainMap />}
            {activePanel === 'ai' && <AICommandCenter />}
            {activePanel === 'reports' && <ReportingPanel />}
            {activePanel === 'analytics' && <AnalyticsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
