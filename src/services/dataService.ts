// Universal Data Service for CitySync Plus
// Handles real-time data synchronization across any city

export interface IncidentReport {
  id: string;
  type: 'traffic' | 'infrastructure' | 'safety' | 'environment' | 'utilities' | 'other';
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    district?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'verified' | 'in_progress' | 'resolved' | 'closed';
  reporter: {
    id: string;
    name?: string;
    verified: boolean;
    reputation: number;
  };
  media: {
    images: string[];
    videos: string[];
    audio: string[];
  };
  timestamps: {
    reported: Date;
    verified?: Date;
    resolved?: Date;
  };
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  };
  cityId: string;
  municipalTicketId?: string;
  aiAnalysis?: {
    confidence: number;
    category: string;
    urgency: number;
    estimatedCost?: number;
    similarIncidents: string[];
  };
}

export interface CityMetrics {
  cityId: string;
  timestamp: Date;
  traffic: {
    averageSpeed: number;
    congestionLevel: number;
    incidents: number;
  };
  infrastructure: {
    activeIssues: number;
    maintenanceScheduled: number;
    systemHealth: number;
  };
  safety: {
    emergencyResponses: number;
    averageResponseTime: number;
    safetyScore: number;
  };
  environment: {
    airQuality: number;
    noiseLevel: number;
    weatherConditions: string;
  };
  utilities: {
    powerOutages: number;
    waterIssues: number;
    internetConnectivity: number;
  };
  citizenEngagement: {
    activeReports: number;
    verifiedReporters: number;
    satisfactionScore: number;
  };
}

export interface AlertNotification {
  id: string;
  type: 'emergency' | 'warning' | 'info' | 'update';
  title: string;
  message: string;
  cityId: string;
  targetAudience: 'all' | 'district' | 'custom';
  targetArea?: {
    districts: string[];
    radius?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
  channels: ('app' | 'sms' | 'email' | 'social')[];
  relatedIncidents?: string[];
}

class DataService {
  private mockData: {
    incidents: IncidentReport[];
    metrics: CityMetrics[];
    alerts: AlertNotification[];
  } = {
    incidents: [],
    metrics: [],
    alerts: []
  };

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock incidents for different cities
    this.mockData.incidents = [
      {
        id: '1',
        type: 'traffic',
        title: 'Traffic Signal Malfunction',
        description: 'Traffic light stuck on red causing major delays',
        location: {
          address: 'Main Street & 5th Avenue',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          district: 'downtown'
        },
        severity: 'high',
        status: 'verified',
        reporter: {
          id: 'user1',
          name: 'John Doe',
          verified: true,
          reputation: 85
        },
        media: { images: [], videos: [], audio: [] },
        timestamps: {
          reported: new Date(Date.now() - 3600000), // 1 hour ago
          verified: new Date(Date.now() - 3000000)   // 50 minutes ago
        },
        votes: { upvotes: 12, downvotes: 1 },
        cityId: 'new-york',
        aiAnalysis: {
          confidence: 94,
          category: 'traffic_infrastructure',
          urgency: 8,
          estimatedCost: 500,
          similarIncidents: []
        }
      },
      {
        id: '2',
        type: 'infrastructure',
        title: 'Large Pothole on Main Road',
        description: 'Deep pothole causing vehicle damage',
        location: {
          address: 'Broadway & 42nd Street',
          coordinates: { lat: 40.7580, lng: -73.9855 },
          district: 'midtown'
        },
        severity: 'medium',
        status: 'in_progress',
        reporter: {
          id: 'user2',
          verified: false,
          reputation: 45
        },
        media: { images: ['pothole1.jpg'], videos: [], audio: [] },
        timestamps: {
          reported: new Date(Date.now() - 7200000) // 2 hours ago
        },
        votes: { upvotes: 8, downvotes: 0 },
        cityId: 'new-york',
        municipalTicketId: 'NYC-2024-001234'
      }
    ];

    // Mock city metrics
    this.mockData.metrics = [
      {
        cityId: 'new-york',
        timestamp: new Date(),
        traffic: {
          averageSpeed: 25,
          congestionLevel: 7,
          incidents: 23
        },
        infrastructure: {
          activeIssues: 45,
          maintenanceScheduled: 12,
          systemHealth: 85
        },
        safety: {
          emergencyResponses: 8,
          averageResponseTime: 6.5,
          safetyScore: 78
        },
        environment: {
          airQuality: 65,
          noiseLevel: 72,
          weatherConditions: 'partly_cloudy'
        },
        utilities: {
          powerOutages: 3,
          waterIssues: 1,
          internetConnectivity: 98
        },
        citizenEngagement: {
          activeReports: 156,
          verifiedReporters: 1247,
          satisfactionScore: 82
        }
      }
    ];

    // Mock alerts
    this.mockData.alerts = [
      {
        id: 'alert1',
        type: 'warning',
        title: 'Heavy Traffic Expected',
        message: 'Major event at Madison Square Garden will cause heavy traffic from 6-10 PM',
        cityId: 'new-york',
        targetAudience: 'district',
        targetArea: {
          districts: ['midtown', 'downtown']
        },
        priority: 'medium',
        expiresAt: new Date(Date.now() + 14400000), // 4 hours from now
        createdAt: new Date(),
        createdBy: 'system',
        channels: ['app', 'sms'],
        relatedIncidents: ['1']
      }
    ];
  }

  // Incident Management
  async getIncidents(cityId: string, filters?: {
    type?: string;
    severity?: string;
    status?: string;
    district?: string;
  }): Promise<IncidentReport[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let incidents = this.mockData.incidents.filter(incident => incident.cityId === cityId);
    
    if (filters) {
      if (filters.type) incidents = incidents.filter(i => i.type === filters.type);
      if (filters.severity) incidents = incidents.filter(i => i.severity === filters.severity);
      if (filters.status) incidents = incidents.filter(i => i.status === filters.status);
      if (filters.district) incidents = incidents.filter(i => i.location.district === filters.district);
    }
    
    return incidents.sort((a, b) => b.timestamps.reported.getTime() - a.timestamps.reported.getTime());
  }

  async createIncident(incident: Omit<IncidentReport, 'id' | 'timestamps' | 'votes'>): Promise<IncidentReport> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const newIncident: IncidentReport = {
      ...incident,
      id: Date.now().toString(),
      timestamps: {
        reported: new Date()
      },
      votes: { upvotes: 0, downvotes: 0 }
    };
    
    this.mockData.incidents.push(newIncident);
    return newIncident;
  }

  async updateIncidentStatus(incidentId: string, status: IncidentReport['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const incident = this.mockData.incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.status = status;
      if (status === 'verified' && !incident.timestamps.verified) {
        incident.timestamps.verified = new Date();
      }
      if (status === 'resolved' && !incident.timestamps.resolved) {
        incident.timestamps.resolved = new Date();
      }
      return true;
    }
    return false;
  }

  async voteOnIncident(incidentId: string, vote: 'up' | 'down'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const incident = this.mockData.incidents.find(i => i.id === incidentId);
    if (incident) {
      if (vote === 'up') {
        incident.votes.upvotes++;
      } else {
        incident.votes.downvotes++;
      }
      incident.votes.userVote = vote;
      return true;
    }
    return false;
  }

  // City Metrics
  async getCityMetrics(cityId: string): Promise<CityMetrics | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockData.metrics.find(m => m.cityId === cityId) || null;
  }

  // Alerts Management
  async getActiveAlerts(cityId: string): Promise<AlertNotification[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const now = new Date();
    return this.mockData.alerts.filter(alert => 
      alert.cityId === cityId && 
      (!alert.expiresAt || alert.expiresAt > now)
    );
  }

  async createAlert(alert: Omit<AlertNotification, 'id' | 'createdAt'>): Promise<AlertNotification> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newAlert: AlertNotification = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this.mockData.alerts.push(newAlert);
    return newAlert;
  }

  // Real-time subscriptions (mock implementation)
  subscribeToIncidents(cityId: string, callback: (incidents: IncidentReport[]) => void): () => void {
    const interval = setInterval(async () => {
      const incidents = await this.getIncidents(cityId);
      callback(incidents);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }

  subscribeToMetrics(cityId: string, callback: (metrics: CityMetrics) => void): () => void {
    const interval = setInterval(async () => {
      const metrics = await this.getCityMetrics(cityId);
      if (metrics) callback(metrics);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }
}

// Export singleton instance
export const dataService = new DataService();

// Types are already exported above
