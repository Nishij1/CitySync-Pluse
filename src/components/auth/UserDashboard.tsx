'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Camera, 
  MessageCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Plus,
  X,
  Send,
  Upload,
  FileImage,
  Info
} from 'lucide-react';
import { dataService, type IncidentReport } from '@/services/dataService';
import { currentCityConfig } from '@/config/cityConfig';

interface UserDashboardProps {
  onLogout?: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [recentIncidents, setRecentIncidents] = useState<IncidentReport[]>([]);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CitySync+ assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Incident form state
  const [incidentForm, setIncidentForm] = useState({
    type: '' as IncidentReport['type'],
    title: '',
    description: '',
    location: '',
    severity: 'medium' as IncidentReport['severity']
  });

  useEffect(() => {
    loadRecentIncidents();
    getCurrentLocation();
  }, []);

  const loadRecentIncidents = async () => {
    try {
      const incidents = await dataService.getIncidents(currentCityConfig.id);
      setRecentIncidents(incidents.slice(0, 10));
    } catch (error) {
      console.error('Failed to load incidents:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleIncidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.type || !incidentForm.title || !incidentForm.description) return;

    setIsSubmitting(true);
    try {
      const newReport = await dataService.createIncident({
        type: incidentForm.type,
        title: incidentForm.title,
        description: incidentForm.description,
        location: {
          address: incidentForm.location || 'Current Location',
          coordinates: currentLocation || { lat: 0, lng: 0 },
          district: 'downtown'
        },
        severity: incidentForm.severity,
        status: 'reported',
        reporter: {
          id: 'user-' + Date.now(),
          verified: false,
          reputation: 50
        },
        media: {
          images: selectedImage ? [selectedImage.name] : [],
          videos: [],
          audio: []
        },
        cityId: currentCityConfig.id
      });

      // Reset form
      setIncidentForm({
        type: '' as IncidentReport['type'],
        title: '',
        description: '',
        location: '',
        severity: 'medium'
      });
      setSelectedImage(null);
      setShowIncidentForm(false);
      
      // Reload incidents
      loadRecentIncidents();
    } catch (error) {
      console.error('Failed to submit incident:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoadingChat(true);

    try {
      // Call the chatbot API with the provided key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for CitySync+, a smart city management platform. A user is asking: "${chatInput}". Please provide a helpful response related to city services, incident reporting, or general assistance. Keep your response concise and friendly.`
            }]
          }]
        })
      });

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        'I apologize, but I\'m having trouble processing your request right now. Please try again later.';

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'verified': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 shadow-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-white">CitySync+</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChatbot(true)}
                className="p-2 bg-white hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Welcome to CitySync+</h2>
          <p className="text-gray-600">Stay informed about incidents in your city and help improve your community.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowIncidentForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Report Incident</span>
          </button>
          <button
            onClick={loadRecentIncidents}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-lg transition-colors shadow-md"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Refresh Incidents</span>
          </button>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-semibold text-black mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
            Recent Incidents
          </h3>
          <div className="grid gap-4">
            {recentIncidents.length === 0 ? (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No incidents reported yet. Be the first to report one!</p>
              </div>
            ) : (
              recentIncidents.map((incident) => (
                <div key={incident.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)}`}></div>
                        <h4 className="text-black font-semibold">{incident.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {incident.location.address}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(incident.timestamps.reported).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">Report New Incident</h3>
              <button
                onClick={() => setShowIncidentForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleIncidentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                <select
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, type: e.target.value as IncidentReport['type'] }))}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="traffic">Traffic</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="safety">Safety</option>
                  <option value="environment">Environment</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={incidentForm.title}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the incident"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of the incident"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={incidentForm.location}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Address or location description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={incidentForm.severity}
                  onChange={(e) => setIncidentForm(prev => ({ ...prev, severity: e.target.value as IncidentReport['severity'] }))}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-black cursor-pointer hover:bg-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </label>
                  {selectedImage && (
                    <span className="text-green-600 text-sm">{selectedImage.name}</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIncidentForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-96 border border-gray-200 shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">CitySync+ Assistant</h3>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoadingChat && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-black px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoadingChat}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={isLoadingChat || !chatInput.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 