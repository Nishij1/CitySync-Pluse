// Firebase Data Service for CitySync Plus
// Real-time data synchronization with Firebase Firestore

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import type { IncidentReport, CityMetrics, AlertNotification } from './dataService';

// Firebase collections
const COLLECTIONS = {
  INCIDENTS: 'incidents',
  METRICS: 'cityMetrics',
  ALERTS: 'alerts',
  USERS: 'users',
  CITIES: 'cities'
} as const;

// Firebase Data Service Implementation
class FirebaseDataService {
  // Incident Management
  async createIncident(incident: Omit<IncidentReport, 'id' | 'timestamps'>): Promise<IncidentReport> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const incidentData = {
        ...incident,
        timestamps: {
          reported: serverTimestamp(),
          verified: null,
          resolved: null
        },
        votes: { upvotes: 0, downvotes: 0 },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.INCIDENTS), incidentData);

      // Return the created incident with the generated ID
      const newIncident: IncidentReport = {
        ...incident,
        id: docRef.id,
        timestamps: {
          reported: new Date(),
          verified: undefined,
          resolved: undefined
        },
        votes: { upvotes: 0, downvotes: 0 }
      };

      return newIncident;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw new Error('Failed to create incident');
    }
  }

  async getIncidents(cityId?: string): Promise<IncidentReport[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      let q = query(
        collection(db, COLLECTIONS.INCIDENTS),
        orderBy('timestamps.reported', 'desc'),
        limit(50)
      );

      if (cityId) {
        q = query(q, where('cityId', '==', cityId));
      }

      const querySnapshot = await getDocs(q);
      const incidents: IncidentReport[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        incidents.push({
          id: doc.id,
          ...data,
          timestamps: {
            reported: data.timestamps?.reported?.toDate() || new Date(),
            verified: data.timestamps?.verified?.toDate(),
            resolved: data.timestamps?.resolved?.toDate()
          }
        } as IncidentReport);
      });

      return incidents;
    } catch (error) {
      console.error('Error getting incidents:', error);
      return [];
    }
  }

  async updateIncidentStatus(incidentId: string, status: string): Promise<boolean> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const incidentRef = doc(db, COLLECTIONS.INCIDENTS, incidentId);
      await updateDoc(incidentRef, {
        status,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error updating incident status:', error);
      return false;
    }
  }

  async voteOnIncident(incidentId: string, voteType: 'upvote' | 'downvote'): Promise<boolean> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const incidentRef = doc(db, COLLECTIONS.INCIDENTS, incidentId);
      const incidentDoc = await getDoc(incidentRef);

      if (!incidentDoc.exists()) {
        throw new Error('Incident not found');
      }

      const currentVotes = incidentDoc.data().votes || { upvotes: 0, downvotes: 0 };
      const newVotes = {
        upvotes: voteType === 'upvote' ? currentVotes.upvotes + 1 : currentVotes.upvotes,
        downvotes: voteType === 'downvote' ? currentVotes.downvotes + 1 : currentVotes.downvotes
      };

      await updateDoc(incidentRef, {
        votes: newVotes,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error voting on incident:', error);
      return false;
    }
  }

  async saveCityMetrics(metrics: Omit<CityMetrics, 'timestamp'>): Promise<boolean> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const metricsData = {
        ...metrics,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, COLLECTIONS.METRICS), metricsData);
      return true;
    } catch (error) {
      console.error('Error saving city metrics:', error);
      return false;
    }
  }

  async getLatestCityMetrics(cityId: string): Promise<CityMetrics | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const q = query(
        collection(db, COLLECTIONS.METRICS),
        where('cityId', '==', cityId),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      // Create a properly typed CityMetrics object with defaults
      const metrics: CityMetrics = {
        cityId: data.cityId || cityId,
        timestamp: data.timestamp?.toDate() || new Date(),
        traffic: data.traffic || {
          averageSpeed: 0,
          congestionLevel: 0,
          incidents: 0
        },
        infrastructure: data.infrastructure || {
          activeIssues: 0,
          maintenanceScheduled: 0,
          systemHealth: 100
        },
        safety: data.safety || {
          emergencyResponses: 0,
          averageResponseTime: 0,
          safetyScore: 100
        },
        environment: data.environment || {
          airQuality: 50,
          noiseLevel: 30,
          weatherConditions: 'Clear'
        },
        utilities: data.utilities || {
          powerOutages: 0,
          waterIssues: 0,
          internetConnectivity: 100
        },
        citizenEngagement: data.citizenEngagement || {
          activeReports: 0,
          verifiedReporters: 0,
          satisfactionScore: 80
        }
      };

      return metrics;
    } catch (error) {
      console.error('Error getting latest city metrics:', error);
      return null;
    }
  }

  async createAlert(alert: Omit<AlertNotification, 'id' | 'createdAt'>): Promise<AlertNotification> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      const alertData = {
        ...alert,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.ALERTS), alertData);

      return {
        ...alert,
        id: docRef.id,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating alert:', error);
      throw new Error('Failed to create alert');
    }
  }

  async getActiveAlerts(cityId?: string): Promise<AlertNotification[]> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }

      let q = query(
        collection(db, COLLECTIONS.ALERTS),
        orderBy('createdAt', 'desc')
      );

      if (cityId) {
        q = query(q, where('cityId', '==', cityId));
      }

      const querySnapshot = await getDocs(q);
      const alerts: AlertNotification[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        alerts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate()
        } as AlertNotification);
      });

      return alerts;
    } catch (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }
  }

  async uploadFile(file: File, path: string): Promise<string> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage not initialized');
      }

      const fileRef = ref(storage, path);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  subscribeToIncidents(
    cityId: string,
    callback: (incidents: IncidentReport[]) => void,
    filters?: { type?: string; severity?: string; status?: string }
  ): () => void {
    if (!db) {
      console.error('Firebase not initialized');
      return () => {};
    }

    try {
      let q = query(
        collection(db, COLLECTIONS.INCIDENTS),
        where('cityId', '==', cityId),
        orderBy('timestamps.reported', 'desc'),
        limit(50)
      );

      // Apply filters
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters?.severity) {
        q = query(q, where('severity', '==', filters.severity));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      return onSnapshot(q, (querySnapshot) => {
        const incidents: IncidentReport[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          incidents.push({
            id: doc.id,
            ...data,
            timestamps: {
              reported: data.timestamps?.reported?.toDate() || new Date(),
              verified: data.timestamps?.verified?.toDate(),
              resolved: data.timestamps?.resolved?.toDate()
            }
          } as IncidentReport);
        });
        callback(incidents);
      });
    } catch (error) {
      console.error('Error subscribing to incidents:', error);
      return () => {};
    }
  }

  subscribeToAlerts(
    cityId: string,
    callback: (alerts: AlertNotification[]) => void
  ): () => void {
    if (!db) {
      console.error('Firebase not initialized');
      return () => {};
    }

    try {
      const q = query(
        collection(db, COLLECTIONS.ALERTS),
        where('cityId', '==', cityId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(q, (querySnapshot) => {
        const alerts: AlertNotification[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          alerts.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            expiresAt: data.expiresAt?.toDate()
          } as AlertNotification);
        });
        callback(alerts);
      });
    } catch (error) {
      console.error('Error subscribing to alerts:', error);
      return () => {};
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      if (!db) {
        return false;
      }

      // Try to read from a collection to test connection
      const testQuery = query(collection(db, COLLECTIONS.INCIDENTS), limit(1));
      await getDocs(testQuery);
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firebaseDataService = new FirebaseDataService();

// Export the class for testing
export { FirebaseDataService };
