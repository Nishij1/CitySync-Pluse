// Firebase Data Service for CitySync Plus
// Real-time data synchronization with Firebase Firestore
// TEMPORARILY DISABLED - Firebase not yet configured

/*
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
*/
import type { IncidentReport, CityMetrics, AlertNotification } from './dataService';

// Firebase collections
const COLLECTIONS = {
  INCIDENTS: 'incidents',
  METRICS: 'cityMetrics',
  ALERTS: 'alerts',
  USERS: 'users',
  CITIES: 'cities'
} as const;

// Temporarily disabled Firebase service
class FirebaseDataService {
  // Mock implementation for development
  async createIncident(): Promise<any> {
    throw new Error('Firebase not configured');
  }

  async getIncidents(): Promise<any[]> {
    return [];
  }

  async updateIncidentStatus(): Promise<boolean> {
    return false;
  }

  async voteOnIncident(): Promise<boolean> {
    return false;
  }

  async saveCityMetrics(): Promise<boolean> {
    return false;
  }

  async getLatestCityMetrics(): Promise<any> {
    return null;
  }

  async createAlert(): Promise<any> {
    throw new Error('Firebase not configured');
  }

  async getActiveAlerts(): Promise<any[]> {
    return [];
  }

  async uploadFile(): Promise<string> {
    throw new Error('Firebase not configured');
  }

  subscribeToIncidents(): () => void {
    return () => {};
  }

  subscribeToAlerts(): () => void {
    return () => {};
  }

  async checkConnection(): Promise<boolean> {
    return false;
  }
}

/*
// Original Firebase implementation - will be restored when Firebase is configured
class FirebaseDataService {
// Rest of the Firebase implementation commented out for now
/*
  // Incident Management
  async createIncident(incident: Omit<IncidentReport, 'id' | 'timestamps'>): Promise<IncidentReport> {
    try {
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

  async getIncidents(cityId: string, filters?: {
    type?: string;
    severity?: string;
    status?: string;
    district?: string;
    limit?: number;
  }): Promise<IncidentReport[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.INCIDENTS),
        where('cityId', '==', cityId),
        orderBy('timestamps.reported', 'desc')
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
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const incidents: IncidentReport[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        incidents.push({
          id: doc.id,
          ...data,
          timestamps: {
            reported: data.timestamps.reported?.toDate() || new Date(),
            verified: data.timestamps.verified?.toDate(),
            resolved: data.timestamps.resolved?.toDate()
          }
        } as IncidentReport);
      });

      return incidents;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  }

  async updateIncidentStatus(incidentId: string, status: IncidentReport['status']): Promise<boolean> {
    try {
      const incidentRef = doc(db, COLLECTIONS.INCIDENTS, incidentId);
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };

      // Set timestamp based on status
      if (status === 'verified') {
        updateData['timestamps.verified'] = serverTimestamp();
      } else if (status === 'resolved') {
        updateData['timestamps.resolved'] = serverTimestamp();
      }

      await updateDoc(incidentRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating incident status:', error);
      return false;
    }
  }

  async voteOnIncident(incidentId: string, vote: 'up' | 'down', userId: string): Promise<boolean> {
    try {
      const incidentRef = doc(db, COLLECTIONS.INCIDENTS, incidentId);
      const incidentDoc = await getDoc(incidentRef);
      
      if (!incidentDoc.exists()) {
        return false;
      }

      const data = incidentDoc.data();
      const currentVotes = data.votes || { upvotes: 0, downvotes: 0 };

      if (vote === 'up') {
        currentVotes.upvotes += 1;
      } else {
        currentVotes.downvotes += 1;
      }

      await updateDoc(incidentRef, {
        votes: currentVotes,
        updatedAt: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error voting on incident:', error);
      return false;
    }
  }

  // City Metrics Management
  async saveCityMetrics(metrics: Omit<CityMetrics, 'timestamp'>): Promise<boolean> {
    try {
      const metricsData = {
        ...metrics,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
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
      
      return {
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      } as CityMetrics;
    } catch (error) {
      console.error('Error fetching city metrics:', error);
      return null;
    }
  }

  // Alert Management
  async createAlert(alert: Omit<AlertNotification, 'id' | 'createdAt'>): Promise<AlertNotification> {
    try {
      const alertData = {
        ...alert,
        createdAt: serverTimestamp(),
        expiresAt: alert.expiresAt ? Timestamp.fromDate(alert.expiresAt) : null
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

  async getActiveAlerts(cityId: string): Promise<AlertNotification[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, COLLECTIONS.ALERTS),
        where('cityId', '==', cityId),
        where('expiresAt', '>', now),
        orderBy('expiresAt'),
        orderBy('createdAt', 'desc')
      );

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
      console.error('Error fetching active alerts:', error);
      return [];
    }
  }

  // File Upload (for incident media)
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Real-time subscriptions
  subscribeToIncidents(
    cityId: string, 
    callback: (incidents: IncidentReport[]) => void,
    filters?: { type?: string; severity?: string; status?: string }
  ): () => void {
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

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const incidents: IncidentReport[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        incidents.push({
          id: doc.id,
          ...data,
          timestamps: {
            reported: data.timestamps.reported?.toDate() || new Date(),
            verified: data.timestamps.verified?.toDate(),
            resolved: data.timestamps.resolved?.toDate()
          }
        } as IncidentReport);
      });

      callback(incidents);
    }, (error) => {
      console.error('Error in incidents subscription:', error);
    });

    return unsubscribe;
  }

  subscribeToAlerts(
    cityId: string,
    callback: (alerts: AlertNotification[]) => void
  ): () => void {
    const now = Timestamp.now();
    const q = query(
      collection(db, COLLECTIONS.ALERTS),
      where('cityId', '==', cityId),
      where('expiresAt', '>', now),
      orderBy('expiresAt'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    }, (error) => {
      console.error('Error in alerts subscription:', error);
    });

    return unsubscribe;
  }

  // Utility methods
  async checkConnection(): Promise<boolean> {
    try {
      // Try to read from a collection to test connection
      const q = query(collection(db, COLLECTIONS.CITIES), limit(1));
      await getDocs(q);
      return true;
    } catch (error) {
      console.error('Firebase connection error:', error);
      return false;
    }
  }
}

*/

// Export singleton instance
export const firebaseDataService = new FirebaseDataService();

// Export the class for testing
export { FirebaseDataService };
