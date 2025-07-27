'use client';

import React, { useState } from 'react';
import { Plus, Save, X, MapPin, AlertTriangle, Clock } from 'lucide-react';
import { addIncident, updateIncident, IncidentData } from '../../services/incidentService';

interface IncidentManagerProps {
  onClose: () => void;
  editingIncident?: IncidentData | null;
}

export function IncidentManager({ onClose, editingIncident }: IncidentManagerProps) {
  const [formData, setFormData] = useState<Partial<IncidentData>>({
    type: editingIncident?.type || '',
    location: editingIncident?.location || '',
    coordinates: editingIncident?.coordinates || [12.9716, 77.5946],
    severity: editingIncident?.severity || 'medium',
    description: editingIncident?.description || '',
    status: editingIncident?.status || 'active',
    city: editingIncident?.city || 'Bengaluru',
    area: editingIncident?.area || '',
    priority: editingIncident?.priority || 2,
    reportedBy: editingIncident?.reportedBy || 'Admin'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const incidentData = {
        ...formData,
        time: new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit'
        }) + ' ago'
      } as Omit<IncidentData, 'id' | 'createdAt' | 'updatedAt'>;

      if (editingIncident?.id) {
        await updateIncident(editingIncident.id, incidentData);
      } else {
        await addIncident(incidentData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving incident:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof IncidentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const incidentTypes = [
    'Traffic Jam', 'Pothole', 'Power Outage', 'Waterlogging', 
    'Road Closure', 'Fire Emergency', 'Medical Emergency', 
    'Construction Work', 'Accident', 'Protest', 'Other'
  ];

  const bengaluruAreas = [
    'Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City',
    'Marathahalli', 'Hebbal', 'Jayanagar', 'Rajajinagar',
    'Malleshwaram', 'Banashankari', 'BTM Layout', 'HSR Layout',
    'Sarjapur Road', 'Outer Ring Road', 'Central Bengaluru'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            {editingIncident ? (
              <>
                <AlertTriangle className="h-5 w-5 mr-2" />
                Edit Incident
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add New Incident
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type and Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Incident Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select type...</option>
                {incidentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value as 'low' | 'medium' | 'high')}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Location and Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Silk Board Junction"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Area
              </label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select area...</option>
                {bengaluruAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.coordinates?.[0] || ''}
                onChange={(e) => handleInputChange('coordinates', [parseFloat(e.target.value), formData.coordinates?.[1] || 77.5946])}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12.9716"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.coordinates?.[1] || ''}
                onChange={(e) => handleInputChange('coordinates', [formData.coordinates?.[0] || 12.9716, parseFloat(e.target.value)])}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="77.5946"
                required
              />
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="active">Active</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={1}>1 - Critical</option>
                <option value={2}>2 - High</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - Low</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Detailed description of the incident..."
              required
            />
          </div>

          {/* Reported By */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Reported By
            </label>
            <input
              type="text"
              value={formData.reportedBy}
              onChange={(e) => handleInputChange('reportedBy', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Traffic Control, Citizen Report"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingIncident ? 'Update' : 'Create'} Incident
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
