'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  Mic,
  MicOff,
  MapPin,
  Send,
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { dataService, type IncidentReport } from '@/services/dataService';
import { currentCityConfig } from '@/config/cityConfig';
import { speechService, type SpeechToTextResult } from '@/services/speechService';

interface IncidentReporterProps {
  onReportSubmitted?: (report: IncidentReport) => void;
}

export function IncidentReporter({ onReportSubmitted }: IncidentReporterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: '' as IncidentReport['type'],
    title: '',
    description: '',
    location: '',
    severity: 'medium' as IncidentReport['severity']
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const incidentTypes = [
    { id: 'traffic', label: 'Traffic Issue', icon: '🚗', color: 'bg-red-500' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: 'bg-orange-500' },
    { id: 'safety', label: 'Safety Concern', icon: '⚠️', color: 'bg-yellow-500' },
    { id: 'environment', label: 'Environmental', icon: '🌱', color: 'bg-green-500' },
    { id: 'utilities', label: 'Utilities', icon: '⚡', color: 'bg-blue-500' },
    { id: 'other', label: 'Other', icon: '📝', color: 'bg-purple-500' }
  ];

  const severityLevels = [
    { id: 'low', label: 'Low', color: 'bg-green-500' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { id: 'high', label: 'High', color: 'bg-orange-500' },
    { id: 'critical', label: 'Critical', color: 'bg-red-500' }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceRecord = async () => {
    if (!speechService.isSupported()) {
      setSpeechError('Speech recognition is not supported in this browser');
      return;
    }

    setSpeechError(null);

    if (!isRecording) {
      // Start recording
      try {
        setIsRecording(true);
        const result = await speechService.startContinuousRecognition();

        // This will resolve when the user stops recording
        if (result.text.trim()) {
          const transcribedText = result.text.trim();
          setVoiceNote(transcribedText);

          // If description is empty, use the voice note as description
          if (!formData.description.trim()) {
            setFormData(prev => ({
              ...prev,
              description: transcribedText
            }));
          } else {
            // Append to existing description
            setFormData(prev => ({
              ...prev,
              description: prev.description + '\n\nVoice Note: ' + transcribedText
            }));
          }
        } else {
          setSpeechError('No speech detected. Please try again.');
        }
      } catch (error) {
        console.error('Speech recognition error:', error);
        setSpeechError(error instanceof Error ? error.message : 'Failed to recognize speech');
      } finally {
        setIsRecording(false);
      }
    } else {
      // Stop recording
      setIsRecording(false);
      speechService.stopRecognition();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.title || !formData.description) return;

    setIsSubmitting(true);
    try {
      const newReport = await dataService.createIncident({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.location,
          coordinates: currentLocation || { lat: 0, lng: 0 },
          district: 'downtown' // TODO: Determine district from coordinates
        },
        severity: formData.severity,
        status: 'reported',
        reporter: {
          id: 'current-user', // TODO: Get from auth
          verified: true,
          reputation: 85
        },
        media: {
          images: selectedImages.map(file => file.name), // TODO: Upload to storage
          videos: [],
          audio: []
        },
        cityId: currentCityConfig.id
      });

      setIsSuccess(true);
      onReportSubmitted?.(newReport);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          type: '' as IncidentReport['type'],
          title: '',
          description: '',
          location: '',
          severity: 'medium'
        });
        setSelectedImages([]);
        setCurrentLocation(null);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-lg text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-black mb-2">Report Submitted Successfully!</h3>
        <p className="text-gray-700 mb-4">
          Your report has been received and is being processed by our AI system.
        </p>
        <div className="text-sm text-gray-500">
          You'll receive updates on the status of your report.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
      <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
        Report an Incident
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Incident Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What type of incident are you reporting?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {incidentTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.id as IncidentReport['type'] }))}
                className={`p-3 rounded-lg border transition-colors ${
                  formData.type === type.id
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brief Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Large pothole on Main Street"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Provide more details about the incident..."
            rows={4}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter address or description"
              className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Use current location"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Severity Level
          </label>
          <div className="flex space-x-2">
            {severityLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, severity: level.id as IncidentReport['severity'] }))}
                className={`flex-1 p-3 rounded-lg border transition-colors ${
                  formData.severity === level.id
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${level.color} mx-auto mb-1`}></div>
                <div className="text-sm">{level.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Add Photos or Audio (Optional)
          </label>
          <div className="flex space-x-2 mb-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Photos
            </button>
            <button
              type="button"
              onClick={handleVoiceRecord}
              className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center ${
                isRecording
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              title={
                isRecording
                  ? 'Stop recording'
                  : 'Record voice note'
              }
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Voice Note
                </>
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Selected Images */}
          {selectedImages.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Voice Note Display */}
          {voiceNote && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800 mb-1">Voice Note:</p>
                  <p className="text-sm text-blue-700">{voiceNote}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVoiceNote('')}
                  className="text-blue-400 hover:text-blue-600 ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Speech Error Display */}
          {speechError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-700">{speechError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSpeechError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Recording Status */}
          {isRecording && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording... Click "Stop Recording" when finished</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.type || !formData.title || !formData.description}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Submitting Report...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
