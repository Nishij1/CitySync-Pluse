// Universal City Configuration System
// Allows CitySync Plus to adapt to any city worldwide

export interface CityConfig {
  id: string;
  name: string;
  country: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
  language: {
    primary: string;
    supported: string[];
  };
  districts: District[];
  emergencyServices: EmergencyService[];
  municipalAPI?: MunicipalAPI;
  localFeatures: LocalFeature[];
  climate: ClimateInfo;
  transportation: TransportationInfo;
}

export interface District {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'mixed' | 'government';
  coordinates: {
    lat: number;
    lng: number;
  };
  population?: number;
  area?: number; // in square kilometers
}

export interface EmergencyService {
  type: 'police' | 'fire' | 'medical' | 'disaster' | 'traffic';
  name: string;
  phone: string;
  email?: string;
  website?: string;
}

export interface MunicipalAPI {
  baseUrl: string;
  apiKey?: string;
  endpoints: {
    workOrders?: string;
    incidents?: string;
    traffic?: string;
    utilities?: string;
  };
  authType: 'none' | 'apikey' | 'oauth' | 'basic';
}

export interface LocalFeature {
  type: 'landmark' | 'transport_hub' | 'hospital' | 'school' | 'government' | 'stadium' | 'mall';
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  importance: 'high' | 'medium' | 'low';
}

export interface ClimateInfo {
  type: 'tropical' | 'temperate' | 'arid' | 'continental' | 'polar';
  rainySeasons?: string[];
  commonDisasters: string[];
  averageTemp: {
    summer: number;
    winter: number;
  };
}

export interface TransportationInfo {
  modes: ('bus' | 'metro' | 'tram' | 'bike' | 'taxi' | 'rideshare')[];
  majorRoutes: string[];
  peakHours: {
    morning: string;
    evening: string;
  };
}

// Default city configurations
export const cityConfigs: Record<string, CityConfig> = {
  'new-york': {
    id: 'new-york',
    name: 'New York City',
    country: 'United States',
    timezone: 'America/New_York',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060,
      zoom: 11
    },
    language: {
      primary: 'en',
      supported: ['en', 'es', 'zh', 'ru', 'ar']
    },
    districts: [
      { id: 'manhattan', name: 'Manhattan', type: 'mixed', coordinates: { lat: 40.7831, lng: -73.9712 } },
      { id: 'brooklyn', name: 'Brooklyn', type: 'residential', coordinates: { lat: 40.6782, lng: -73.9442 } },
      { id: 'queens', name: 'Queens', type: 'mixed', coordinates: { lat: 40.7282, lng: -73.7949 } },
      { id: 'bronx', name: 'The Bronx', type: 'residential', coordinates: { lat: 40.8448, lng: -73.8648 } },
      { id: 'staten-island', name: 'Staten Island', type: 'residential', coordinates: { lat: 40.5795, lng: -74.1502 } }
    ],
    emergencyServices: [
      { type: 'police', name: 'NYPD', phone: '911' },
      { type: 'fire', name: 'FDNY', phone: '911' },
      { type: 'medical', name: 'EMS', phone: '911' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Times Square', coordinates: { lat: 40.7580, lng: -73.9855 }, importance: 'high' },
      { type: 'landmark', name: 'Central Park', coordinates: { lat: 40.7829, lng: -73.9654 }, importance: 'high' },
      { type: 'transport_hub', name: 'Grand Central', coordinates: { lat: 40.7527, lng: -73.9772 }, importance: 'high' }
    ],
    climate: {
      type: 'temperate',
      rainySeasons: ['spring', 'summer'],
      commonDisasters: ['flooding', 'snowstorms', 'heatwaves'],
      averageTemp: { summer: 25, winter: 2 }
    },
    transportation: {
      modes: ['bus', 'metro', 'taxi', 'rideshare', 'bike'],
      majorRoutes: ['FDR Drive', 'West Side Highway', 'Brooklyn Bridge'],
      peakHours: { morning: '7:00-9:00', evening: '17:00-19:00' }
    }
  },
  
  'london': {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    coordinates: {
      lat: 51.5074,
      lng: -0.1278,
      zoom: 11
    },
    language: {
      primary: 'en',
      supported: ['en', 'fr', 'es', 'ar', 'hi']
    },
    districts: [
      { id: 'city', name: 'City of London', type: 'commercial', coordinates: { lat: 51.5155, lng: -0.0922 } },
      { id: 'westminster', name: 'Westminster', type: 'government', coordinates: { lat: 51.4994, lng: -0.1319 } },
      { id: 'camden', name: 'Camden', type: 'mixed', coordinates: { lat: 51.5290, lng: -0.1255 } }
    ],
    emergencyServices: [
      { type: 'police', name: 'Metropolitan Police', phone: '999' },
      { type: 'fire', name: 'London Fire Brigade', phone: '999' },
      { type: 'medical', name: 'NHS Emergency', phone: '999' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Big Ben', coordinates: { lat: 51.4994, lng: -0.1245 }, importance: 'high' },
      { type: 'landmark', name: 'Tower Bridge', coordinates: { lat: 51.5055, lng: -0.0754 }, importance: 'high' }
    ],
    climate: {
      type: 'temperate',
      rainySeasons: ['autumn', 'winter'],
      commonDisasters: ['flooding', 'fog'],
      averageTemp: { summer: 18, winter: 5 }
    },
    transportation: {
      modes: ['bus', 'metro', 'taxi', 'bike'],
      majorRoutes: ['M25', 'A4', 'Thames'],
      peakHours: { morning: '7:30-9:30', evening: '17:00-19:00' }
    }
  },

  'tokyo': {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    coordinates: {
      lat: 35.6762,
      lng: 139.6503,
      zoom: 11
    },
    language: {
      primary: 'ja',
      supported: ['ja', 'en', 'ko', 'zh']
    },
    districts: [
      { id: 'shibuya', name: 'Shibuya', type: 'commercial', coordinates: { lat: 35.6598, lng: 139.7006 } },
      { id: 'shinjuku', name: 'Shinjuku', type: 'mixed', coordinates: { lat: 35.6896, lng: 139.6917 } },
      { id: 'ginza', name: 'Ginza', type: 'commercial', coordinates: { lat: 35.6719, lng: 139.7658 } }
    ],
    emergencyServices: [
      { type: 'police', name: 'Tokyo Metropolitan Police', phone: '110' },
      { type: 'fire', name: 'Tokyo Fire Department', phone: '119' },
      { type: 'medical', name: 'Emergency Medical', phone: '119' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Tokyo Tower', coordinates: { lat: 35.6586, lng: 139.7454 }, importance: 'high' },
      { type: 'transport_hub', name: 'Shinjuku Station', coordinates: { lat: 35.6896, lng: 139.7006 }, importance: 'high' }
    ],
    climate: {
      type: 'temperate',
      rainySeasons: ['summer'],
      commonDisasters: ['earthquakes', 'typhoons', 'flooding'],
      averageTemp: { summer: 26, winter: 6 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'bike'],
      majorRoutes: ['Yamanote Line', 'Chuo Line', 'Metropolitan Expressway'],
      peakHours: { morning: '7:00-9:00', evening: '17:30-19:30' }
    }
  }
};

// Current city configuration (can be changed dynamically)
export let currentCityConfig: CityConfig = cityConfigs['new-york'];

// Function to set the current city
export function setCurrentCity(cityId: string): boolean {
  if (cityConfigs[cityId]) {
    currentCityConfig = cityConfigs[cityId];
    return true;
  }
  return false;
}

// Function to get available cities
export function getAvailableCities(): Array<{id: string, name: string, country: string}> {
  return Object.values(cityConfigs).map(config => ({
    id: config.id,
    name: config.name,
    country: config.country
  }));
}

// Function to add a new city configuration
export function addCityConfig(config: CityConfig): void {
  cityConfigs[config.id] = config;
}

// Helper function to get localized district names
export function getLocalizedDistrictName(districtId: string, language: string = 'en'): string {
  const district = currentCityConfig.districts.find(d => d.id === districtId);
  return district?.name || districtId;
}

// Helper function to format emergency numbers
export function getEmergencyNumber(type: EmergencyService['type']): string {
  const service = currentCityConfig.emergencyServices.find(s => s.type === type);
  return service?.phone || '911';
}
