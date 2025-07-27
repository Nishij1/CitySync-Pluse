import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface IncidentData {
  id?: string;
  type: string;
  location: string;
  coordinates: [number, number];
  severity: 'low' | 'medium' | 'high';
  time: string;
  description: string;
  status: 'active' | 'resolved' | 'investigating';
  reportedBy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  city: string;
  area: string;
  priority: number;
}

const COLLECTION_NAME = 'incidents';

/**
 * Get all incidents from Firestore
 */
export const getAllIncidents = async (): Promise<IncidentData[]> => {
  try {
    const incidentsRef = collection(db, COLLECTION_NAME);
    const q = query(incidentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IncidentData[];
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return [];
  }
};

/**
 * Get incidents by city
 */
export const getIncidentsByCity = async (city: string): Promise<IncidentData[]> => {
  try {
    const incidentsRef = collection(db, COLLECTION_NAME);
    const q = query(
      incidentsRef, 
      where('city', '==', city),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IncidentData[];
  } catch (error) {
    console.error('Error fetching incidents by city:', error);
    return [];
  }
};

/**
 * Add a new incident to Firestore
 */
export const addIncident = async (incident: Omit<IncidentData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
  try {
    const incidentData = {
      ...incident,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: incident.status || 'active'
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), incidentData);
    console.log('Incident added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding incident:', error);
    return null;
  }
};

/**
 * Update an existing incident
 */
export const updateIncident = async (id: string, updates: Partial<IncidentData>): Promise<boolean> => {
  try {
    const incidentRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(incidentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Incident updated:', id);
    return true;
  } catch (error) {
    console.error('Error updating incident:', error);
    return false;
  }
};

/**
 * Delete an incident
 */
export const deleteIncident = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('Incident deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting incident:', error);
    return false;
  }
};

/**
 * Subscribe to real-time incident updates
 */
export const subscribeToIncidents = (
  callback: (incidents: IncidentData[]) => void,
  city?: string
) => {
  const incidentsRef = collection(db, COLLECTION_NAME);
  let q;
  
  if (city) {
    q = query(
      incidentsRef,
      where('city', '==', city),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(incidentsRef, orderBy('createdAt', 'desc'));
  }

  return onSnapshot(q, (querySnapshot) => {
    const incidents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IncidentData[];
    
    callback(incidents);
  }, (error) => {
    console.error('Error in incident subscription:', error);
  });
};

/**
 * Initialize sample data for Bengaluru
 */
export const initializeBengaluruData = async (): Promise<void> => {
  try {
    // Check if data already exists
    const existingIncidents = await getIncidentsByCity('Bengaluru');
    if (existingIncidents.length > 0) {
      console.log('Bengaluru data already exists');
      return;
    }

    const bengaluruIncidents: Omit<IncidentData, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        type: 'Traffic Jam',
        location: 'Silk Board Junction',
        coordinates: [12.9165, 77.6224],
        severity: 'high',
        time: '2 min ago',
        description: 'Heavy traffic congestion due to signal malfunction',
        status: 'active',
        city: 'Bengaluru',
        area: 'Electronic City',
        priority: 1,
        reportedBy: 'Traffic Control'
      },
      {
        type: 'Pothole',
        location: 'Outer Ring Road',
        coordinates: [12.9698, 77.7500],
        severity: 'medium',
        time: '15 min ago',
        description: 'Large pothole causing vehicle damage',
        status: 'investigating',
        city: 'Bengaluru',
        area: 'Marathahalli',
        priority: 2,
        reportedBy: 'Citizen Report'
      },
      {
        type: 'Power Outage',
        location: 'Koramangala',
        coordinates: [12.9352, 77.6245],
        severity: 'high',
        time: '32 min ago',
        description: 'Power outage affecting multiple residential blocks',
        status: 'active',
        city: 'Bengaluru',
        area: 'Koramangala',
        priority: 1,
        reportedBy: 'BESCOM'
      },
      {
        type: 'Waterlogging',
        location: 'Hebbal Flyover',
        coordinates: [13.0358, 77.5970],
        severity: 'medium',
        time: '1 hr ago',
        description: 'Waterlogging due to heavy rainfall',
        status: 'investigating',
        city: 'Bengaluru',
        area: 'Hebbal',
        priority: 2,
        reportedBy: 'BBMP'
      },
      {
        type: 'Road Closure',
        location: 'MG Road',
        coordinates: [12.9716, 77.5946],
        severity: 'low',
        time: '45 min ago',
        description: 'Temporary road closure for metro construction',
        status: 'active',
        city: 'Bengaluru',
        area: 'Central Bengaluru',
        priority: 3,
        reportedBy: 'BMRCL'
      },
      {
        type: 'Fire Emergency',
        location: 'Whitefield',
        coordinates: [12.9698, 77.7500],
        severity: 'high',
        time: '20 min ago',
        description: 'Fire reported in commercial building',
        status: 'investigating',
        city: 'Bengaluru',
        area: 'Whitefield',
        priority: 1,
        reportedBy: 'Fire Department'
      }
    ];

    // Add all incidents
    for (const incident of bengaluruIncidents) {
      await addIncident(incident);
    }

    console.log('Bengaluru sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing Bengaluru data:', error);
  }
};
