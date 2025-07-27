'use client';

import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Users, Award } from 'lucide-react';
import { IncidentReporter } from '@/components/reporting/IncidentReporter';
import { dataService, type IncidentReport } from '@/services/dataService';
import { currentCityConfig } from '@/config/cityConfig';

export function ReportingPanel() {
  const [recentReports, setRecentReports] = useState<IncidentReport[]>([]);
  const [userStats, setUserStats] = useState({
    totalReports: 127,
    verifiedReports: 98,
    reputation: 85,
    level: 'Civic Champion'
  });

  useEffect(() => {
    loadRecentReports();
  }, []);

  const loadRecentReports = async () => {
    try {
      const reports = await dataService.getIncidents(currentCityConfig.id);
      setRecentReports(reports.slice(0, 10));
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const handleReportSubmitted = (newReport: IncidentReport) => {
    setRecentReports(prev => [newReport, ...prev.slice(0, 9)]);
    setUserStats(prev => ({
      ...prev,
      totalReports: prev.totalReports + 1
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'verified': return 'bg-yellow-100 text-yellow-700';
      case 'reported': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full bg-white p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Smart Reporting System</h1>
              <p className="text-gray-600">AI-powered citizen engagement for {currentCityConfig.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Report Submission */}
          <IncidentReporter onReportSubmitted={handleReportSubmitted} />

          {/* Recent Reports & Analytics */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Recent Reports
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-black font-medium">{report.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm">{report.location.address}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(report.timestamps.reported).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">{report.type}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 capitalize">{report.severity}</span>
                      {report.votes && (
                        <>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-green-600">↑{report.votes.upvotes}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Verification Status */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4">AI Verification System</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto-categorization</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Image Analysis</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-blue-600 text-sm">Processing</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Duplicate Detection</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sentiment Analysis</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-purple-600 text-sm">Learning</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Gamification */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Your Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalReports}</div>
                  <div className="text-xs text-gray-500">Total Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.verifiedReports}</div>
                  <div className="text-xs text-gray-500">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.reputation}</div>
                  <div className="text-xs text-gray-500">Reputation</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-yellow-600">{userStats.level}</div>
                  <div className="text-xs text-gray-500">Level</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress to next level</span>
                  <span className="text-xs text-gray-500">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-400" />
                Community Impact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Active Reporters</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Issues Resolved</span>
                  <span className="text-green-400 font-medium">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Avg Response Time</span>
                  <span className="text-blue-400 font-medium">2.3 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">City Satisfaction</span>
                  <span className="text-purple-400 font-medium">82%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
