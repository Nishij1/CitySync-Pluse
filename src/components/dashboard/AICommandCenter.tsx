'use client';

import { useState, useEffect } from 'react';
import { Brain, Mic, MicOff, Send, Zap, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { aiService, type AIInsight, type AIResponse } from '@/services/aiService';
import { speechService, type SpeechToTextResult } from '@/services/speechService';

export function AICommandCenter() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial insights
    loadRealtimeInsights();

    // Set up real-time updates
    const interval = setInterval(loadRealtimeInsights, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRealtimeInsights = async () => {
    try {
      const newInsights = await aiService.getRealtimeInsights();
      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await aiService.processQuery({
        query,
        context: 'Urban intelligence dashboard',
        timeframe: 'current'
      });
      setAiResponse(response);
      setQuery('');
    } catch (error) {
      console.error('AI query failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceToggle = async () => {
    if (!speechService.isSupported()) {
      setSpeechError('Speech recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      return; // Prevent multiple clicks while processing
    }

    setSpeechError(null);
    setIsListening(true);

    try {
      const result = await speechService.recognizeSpeech();

      if (result.text.trim()) {
        setQuery(result.text.trim());
      } else {
        setSpeechError('No speech detected. Please try again.');
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setSpeechError(error instanceof Error ? error.message : 'Failed to recognize speech');
    } finally {
      setIsListening(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'anomaly': return AlertCircle;
      case 'optimization': return Sparkles;
      case 'alert': return AlertCircle;
      default: return Brain;
    }
  };

  return (
    <div className="h-full bg-white p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">AI Command Center</h1>
              <p className="text-gray-600">Natural language urban intelligence</p>
            </div>
          </div>
        </div>

        {/* AI Query Interface */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-lg">
          <h2 className="text-lg font-semibold text-black mb-4">Ask the City AI</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything... 'Show me traffic patterns during monsoon' or 'Predict crowd density for tomorrow's event'"
                className="w-full p-4 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-24"
                disabled={isProcessing}
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={isTranscribing}
                  className={`p-2 transition-colors ${
                    isListening
                      ? 'text-red-600 hover:text-red-700 bg-red-50'
                      : isTranscribing
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  } ${isTranscribing ? 'cursor-not-allowed' : ''}`}
                  title={
                    isListening
                      ? 'Stop recording'
                      : isTranscribing
                      ? 'Processing speech...'
                      : 'Start voice input'
                  }
                >
                  {isTranscribing ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !query.trim()}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Status Messages */}
            {isProcessing && (
              <div className="flex items-center space-x-2 text-purple-600">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>AI is analyzing your query...</span>
              </div>
            )}
            {isListening && (
              <div className="flex items-center space-x-2 text-red-600">
                <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                <span>Listening... Click the microphone again to stop</span>
              </div>
            )}
            {isTranscribing && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Converting speech to text...</span>
              </div>
            )}
            {speechError && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{speechError}</span>
                <button
                  onClick={() => setSpeechError(null)}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  ×
                </button>
              </div>
            )}
          </form>
        </div>

        {/* AI Response Display */}
        {aiResponse && (
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-lg">
            <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI Analysis Results
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-800 leading-relaxed">{aiResponse.response}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Confidence: {Math.round(aiResponse.confidence)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {aiResponse.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-black mb-2">Recommended Actions:</h4>
                  <div className="space-y-2">
                    {aiResponse.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predictive Insights */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Predictive Insights
            </h3>
            <div className="space-y-4">
              {insights.map((insight) => {
                const TypeIcon = getTypeIcon(insight.type);
                return (
                  <div key={insight.id} className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4" />
                        <h4 className="font-medium text-black">{insight.title}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          insight.type === 'prediction' ? 'bg-blue-600' :
                          insight.type === 'anomaly' ? 'bg-red-600' :
                          insight.type === 'optimization' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}></div>
                        <span className="text-xs text-gray-500">{insight.confidence}%</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(insight.timestamp).toLocaleTimeString()}
                        </span>
                        {insight.location && (
                          <>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{insight.location}</span>
                          </>
                        )}
                      </div>
                      {insight.actionable && (
                        <button className="text-xs text-purple-600 hover:text-purple-700 transition-colors">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Processing */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Real-time Processing
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black font-medium">Traffic Analysis</span>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Processing 847 camera feeds</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black font-medium">Sentiment Analysis</span>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Analyzing social media feeds</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black font-medium">Anomaly Detection</span>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-5/6"></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Monitoring city infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
