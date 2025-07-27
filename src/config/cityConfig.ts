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
  modes: ('bus' | 'metro' | 'tram' | 'bike' | 'taxi' | 'rideshare' | 'train' | 'auto')[];
  majorRoutes: string[];
  peakHours: {
    morning: string;
    evening: string;
  };
}

// Default city configurations - Indian Cities
export const cityConfigs: Record<string, CityConfig> = {
  'mumbai': {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 19.0760,
      lng: 72.8777,
      zoom: 11
    },
    language: {
      primary: 'hi',
      supported: ['hi', 'mr', 'en', 'gu', 'ur']
    },
    districts: [
      { id: 'south-mumbai', name: 'South Mumbai', type: 'commercial', coordinates: { lat: 18.9220, lng: 72.8347 }, population: 800000 },
      { id: 'bandra', name: 'Bandra', type: 'mixed', coordinates: { lat: 19.0596, lng: 72.8295 }, population: 600000 },
      { id: 'andheri', name: 'Andheri', type: 'mixed', coordinates: { lat: 19.1136, lng: 72.8697 }, population: 1200000 },
      { id: 'borivali', name: 'Borivali', type: 'residential', coordinates: { lat: 19.2307, lng: 72.8567 }, population: 900000 },
      { id: 'thane', name: 'Thane', type: 'mixed', coordinates: { lat: 19.2183, lng: 72.9781 }, population: 1800000 },
      { id: 'navi-mumbai', name: 'Navi Mumbai', type: 'mixed', coordinates: { lat: 19.0330, lng: 73.0297 }, population: 1100000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Mumbai Police', phone: '100' },
      { type: 'fire', name: 'Mumbai Fire Brigade', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Mumbai Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Gateway of India', coordinates: { lat: 18.9220, lng: 72.8347 }, importance: 'high' },
      { type: 'landmark', name: 'Marine Drive', coordinates: { lat: 18.9435, lng: 72.8234 }, importance: 'high' },
      { type: 'transport_hub', name: 'Chhatrapati Shivaji Terminus', coordinates: { lat: 18.9398, lng: 72.8355 }, importance: 'high' },
      { type: 'transport_hub', name: 'Mumbai Airport', coordinates: { lat: 19.0896, lng: 72.8656 }, importance: 'high' },
      { type: 'hospital', name: 'KEM Hospital', coordinates: { lat: 19.0030, lng: 72.8417 }, importance: 'high' },
      { type: 'government', name: 'Mantralaya', coordinates: { lat: 18.9322, lng: 72.8264 }, importance: 'high' }
    ],
    climate: {
      type: 'tropical',
      rainySeasons: ['monsoon'],
      commonDisasters: ['flooding', 'cyclones', 'heavy rainfall', 'waterlogging'],
      averageTemp: { summer: 32, winter: 24 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'rideshare', 'train'],
      majorRoutes: ['Western Express Highway', 'Eastern Express Highway', 'Sion-Panvel Highway', 'Mumbai-Pune Expressway'],
      peakHours: { morning: '8:00-11:00', evening: '18:00-21:00' }
    }
  },

  'delhi': {
    id: 'delhi',
    name: 'New Delhi',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 28.6139,
      lng: 77.2090,
      zoom: 11
    },
    language: {
      primary: 'hi',
      supported: ['hi', 'en', 'ur', 'pa', 'bn']
    },
    districts: [
      { id: 'central-delhi', name: 'Central Delhi', type: 'government', coordinates: { lat: 28.6507, lng: 77.2334 }, population: 600000 },
      { id: 'south-delhi', name: 'South Delhi', type: 'mixed', coordinates: { lat: 28.5355, lng: 77.2490 }, population: 2700000 },
      { id: 'north-delhi', name: 'North Delhi', type: 'mixed', coordinates: { lat: 28.7041, lng: 77.1025 }, population: 900000 },
      { id: 'east-delhi', name: 'East Delhi', type: 'residential', coordinates: { lat: 28.6508, lng: 77.3152 }, population: 1700000 },
      { id: 'west-delhi', name: 'West Delhi', type: 'mixed', coordinates: { lat: 28.6692, lng: 77.1031 }, population: 2500000 },
      { id: 'gurgaon', name: 'Gurgaon', type: 'commercial', coordinates: { lat: 28.4595, lng: 77.0266 }, population: 1100000 },
      { id: 'noida', name: 'Noida', type: 'commercial', coordinates: { lat: 28.5355, lng: 77.3910 }, population: 650000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Delhi Police', phone: '100' },
      { type: 'fire', name: 'Delhi Fire Service', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Delhi Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'India Gate', coordinates: { lat: 28.6129, lng: 77.2295 }, importance: 'high' },
      { type: 'landmark', name: 'Red Fort', coordinates: { lat: 28.6562, lng: 77.2410 }, importance: 'high' },
      { type: 'government', name: 'Parliament House', coordinates: { lat: 28.6170, lng: 77.2082 }, importance: 'high' },
      { type: 'transport_hub', name: 'New Delhi Railway Station', coordinates: { lat: 28.6431, lng: 77.2197 }, importance: 'high' },
      { type: 'transport_hub', name: 'IGI Airport', coordinates: { lat: 28.5562, lng: 77.1000 }, importance: 'high' },
      { type: 'hospital', name: 'AIIMS', coordinates: { lat: 28.5672, lng: 77.2100 }, importance: 'high' }
    ],
    climate: {
      type: 'continental',
      rainySeasons: ['monsoon'],
      commonDisasters: ['air pollution', 'heatwaves', 'flooding', 'dust storms'],
      averageTemp: { summer: 40, winter: 15 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'rideshare', 'auto'],
      majorRoutes: ['Ring Road', 'Outer Ring Road', 'NH-1', 'NH-8', 'DND Flyway'],
      peakHours: { morning: '8:00-10:00', evening: '18:00-20:00' }
    }
  },

  'bangalore': {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 12.9716,
      lng: 77.5946,
      zoom: 11
    },
    language: {
      primary: 'kn',
      supported: ['kn', 'en', 'hi', 'ta', 'te']
    },
    districts: [
      { id: 'central-bangalore', name: 'Central Bangalore', type: 'commercial', coordinates: { lat: 12.9716, lng: 77.5946 }, population: 400000 },
      { id: 'whitefield', name: 'Whitefield', type: 'commercial', coordinates: { lat: 12.9698, lng: 77.7500 }, population: 300000 },
      { id: 'electronic-city', name: 'Electronic City', type: 'commercial', coordinates: { lat: 12.8456, lng: 77.6603 }, population: 200000 },
      { id: 'koramangala', name: 'Koramangala', type: 'mixed', coordinates: { lat: 12.9279, lng: 77.6271 }, population: 150000 },
      { id: 'indiranagar', name: 'Indiranagar', type: 'mixed', coordinates: { lat: 12.9719, lng: 77.6412 }, population: 100000 },
      { id: 'jayanagar', name: 'Jayanagar', type: 'residential', coordinates: { lat: 12.9279, lng: 77.5937 }, population: 200000 },
      { id: 'malleshwaram', name: 'Malleshwaram', type: 'residential', coordinates: { lat: 13.0037, lng: 77.5727 }, population: 180000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Bangalore Police', phone: '100' },
      { type: 'fire', name: 'Karnataka Fire Service', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Bangalore Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Lalbagh Botanical Garden', coordinates: { lat: 12.9507, lng: 77.5848 }, importance: 'high' },
      { type: 'landmark', name: 'Bangalore Palace', coordinates: { lat: 12.9982, lng: 77.5920 }, importance: 'high' },
      { type: 'transport_hub', name: 'Kempegowda International Airport', coordinates: { lat: 13.1986, lng: 77.7066 }, importance: 'high' },
      { type: 'transport_hub', name: 'Bangalore City Railway Station', coordinates: { lat: 12.9767, lng: 77.5993 }, importance: 'high' },
      { type: 'hospital', name: 'Nimhans', coordinates: { lat: 12.9432, lng: 77.5955 }, importance: 'high' },
      { type: 'government', name: 'Vidhana Soudha', coordinates: { lat: 12.9794, lng: 77.5912 }, importance: 'high' }
    ],
    climate: {
      type: 'tropical',
      rainySeasons: ['monsoon'],
      commonDisasters: ['flooding', 'traffic congestion', 'water shortage'],
      averageTemp: { summer: 28, winter: 20 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'rideshare', 'auto'],
      majorRoutes: ['Outer Ring Road', 'Hosur Road', 'Bannerghatta Road', 'Mysore Road'],
      peakHours: { morning: '8:00-10:30', evening: '18:00-21:00' }
    }
  },

  'kolkata': {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 22.5726,
      lng: 88.3639,
      zoom: 11
    },
    language: {
      primary: 'bn',
      supported: ['bn', 'hi', 'en', 'ur', 'or']
    },
    districts: [
      { id: 'central-kolkata', name: 'Central Kolkata', type: 'commercial', coordinates: { lat: 22.5726, lng: 88.3639 }, population: 500000 },
      { id: 'north-kolkata', name: 'North Kolkata', type: 'mixed', coordinates: { lat: 22.6203, lng: 88.3758 }, population: 800000 },
      { id: 'south-kolkata', name: 'South Kolkata', type: 'mixed', coordinates: { lat: 22.5205, lng: 88.3573 }, population: 1200000 },
      { id: 'salt-lake', name: 'Salt Lake City', type: 'commercial', coordinates: { lat: 22.5958, lng: 88.4497 }, population: 300000 },
      { id: 'howrah', name: 'Howrah', type: 'industrial', coordinates: { lat: 22.5958, lng: 88.2636 }, population: 1100000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Kolkata Police', phone: '100' },
      { type: 'fire', name: 'West Bengal Fire Service', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Kolkata Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Victoria Memorial', coordinates: { lat: 22.5448, lng: 88.3426 }, importance: 'high' },
      { type: 'landmark', name: 'Howrah Bridge', coordinates: { lat: 22.5851, lng: 88.3468 }, importance: 'high' },
      { type: 'transport_hub', name: 'Howrah Railway Station', coordinates: { lat: 22.5851, lng: 88.3468 }, importance: 'high' },
      { type: 'transport_hub', name: 'Netaji Subhash Airport', coordinates: { lat: 22.6546, lng: 88.4467 }, importance: 'high' },
      { type: 'hospital', name: 'Medical College Hospital', coordinates: { lat: 22.5726, lng: 88.3639 }, importance: 'high' }
    ],
    climate: {
      type: 'tropical',
      rainySeasons: ['monsoon'],
      commonDisasters: ['flooding', 'cyclones', 'waterlogging'],
      averageTemp: { summer: 35, winter: 22 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'tram', 'auto'],
      majorRoutes: ['EM Bypass', 'VIP Road', 'AJC Bose Road', 'Park Street'],
      peakHours: { morning: '8:00-10:00', evening: '18:00-20:00' }
    }
  },

  'chennai': {
    id: 'chennai',
    name: 'Chennai',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 13.0827,
      lng: 80.2707,
      zoom: 11
    },
    language: {
      primary: 'ta',
      supported: ['ta', 'en', 'hi', 'te', 'ml']
    },
    districts: [
      { id: 'central-chennai', name: 'Central Chennai', type: 'commercial', coordinates: { lat: 13.0827, lng: 80.2707 }, population: 700000 },
      { id: 'north-chennai', name: 'North Chennai', type: 'industrial', coordinates: { lat: 13.1475, lng: 80.2197 }, population: 900000 },
      { id: 'south-chennai', name: 'South Chennai', type: 'mixed', coordinates: { lat: 12.9915, lng: 80.2337 }, population: 1100000 },
      { id: 'west-chennai', name: 'West Chennai', type: 'residential', coordinates: { lat: 13.0475, lng: 80.1564 }, population: 800000 },
      { id: 'omr', name: 'OMR (IT Corridor)', type: 'commercial', coordinates: { lat: 12.8406, lng: 80.1534 }, population: 400000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Chennai Police', phone: '100' },
      { type: 'fire', name: 'Tamil Nadu Fire Service', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Chennai Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Marina Beach', coordinates: { lat: 13.0475, lng: 80.2824 }, importance: 'high' },
      { type: 'landmark', name: 'Kapaleeshwarar Temple', coordinates: { lat: 13.0339, lng: 80.2619 }, importance: 'high' },
      { type: 'transport_hub', name: 'Chennai Central Railway Station', coordinates: { lat: 13.0827, lng: 80.2707 }, importance: 'high' },
      { type: 'transport_hub', name: 'Chennai Airport', coordinates: { lat: 12.9941, lng: 80.1709 }, importance: 'high' },
      { type: 'hospital', name: 'Apollo Hospital', coordinates: { lat: 13.0569, lng: 80.2091 }, importance: 'high' }
    ],
    climate: {
      type: 'tropical',
      rainySeasons: ['northeast-monsoon', 'southwest-monsoon'],
      commonDisasters: ['cyclones', 'flooding', 'heatwaves'],
      averageTemp: { summer: 38, winter: 25 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'rideshare', 'auto', 'train'],
      majorRoutes: ['GST Road', 'OMR', 'ECR', 'Mount Road', 'Anna Salai'],
      peakHours: { morning: '8:00-10:00', evening: '18:00-20:00' }
    }
  },

  'hyderabad': {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 17.3850,
      lng: 78.4867,
      zoom: 11
    },
    language: {
      primary: 'te',
      supported: ['te', 'hi', 'en', 'ur', 'ta']
    },
    districts: [
      { id: 'central-hyderabad', name: 'Central Hyderabad', type: 'commercial', coordinates: { lat: 17.3850, lng: 78.4867 }, population: 600000 },
      { id: 'hitech-city', name: 'Hitech City', type: 'commercial', coordinates: { lat: 17.4435, lng: 78.3772 }, population: 300000 },
      { id: 'gachibowli', name: 'Gachibowli', type: 'commercial', coordinates: { lat: 17.4399, lng: 78.3482 }, population: 200000 },
      { id: 'secunderabad', name: 'Secunderabad', type: 'mixed', coordinates: { lat: 17.5040, lng: 78.5040 }, population: 900000 },
      { id: 'banjara-hills', name: 'Banjara Hills', type: 'residential', coordinates: { lat: 17.4126, lng: 78.4482 }, population: 150000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Hyderabad Police', phone: '100' },
      { type: 'fire', name: 'Telangana Fire Service', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Hyderabad Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Charminar', coordinates: { lat: 17.3616, lng: 78.4747 }, importance: 'high' },
      { type: 'landmark', name: 'Golconda Fort', coordinates: { lat: 17.3833, lng: 78.4011 }, importance: 'high' },
      { type: 'transport_hub', name: 'Rajiv Gandhi International Airport', coordinates: { lat: 17.2403, lng: 78.4294 }, importance: 'high' },
      { type: 'transport_hub', name: 'Secunderabad Railway Station', coordinates: { lat: 17.5040, lng: 78.5040 }, importance: 'high' },
      { type: 'hospital', name: 'Nizam Institute of Medical Sciences', coordinates: { lat: 17.4126, lng: 78.4482 }, importance: 'high' }
    ],
    climate: {
      type: 'tropical',
      rainySeasons: ['monsoon'],
      commonDisasters: ['flooding', 'heatwaves', 'drought'],
      averageTemp: { summer: 42, winter: 22 }
    },
    transportation: {
      modes: ['metro', 'bus', 'taxi', 'rideshare', 'auto'],
      majorRoutes: ['Outer Ring Road', 'NH-44', 'Rajiv Rahadari', 'PV Narasimha Rao Expressway'],
      peakHours: { morning: '8:00-10:00', evening: '18:00-20:00' }
    }
  },

  'pune': {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    timezone: 'Asia/Kolkata',
    coordinates: {
      lat: 18.5204,
      lng: 73.8567,
      zoom: 11
    },
    language: {
      primary: 'mr',
      supported: ['mr', 'hi', 'en', 'gu']
    },
    districts: [
      { id: 'central-pune', name: 'Central Pune', type: 'commercial', coordinates: { lat: 18.5204, lng: 73.8567 }, population: 500000 },
      { id: 'hinjewadi', name: 'Hinjewadi', type: 'commercial', coordinates: { lat: 18.5912, lng: 73.7389 }, population: 200000 },
      { id: 'kothrud', name: 'Kothrud', type: 'residential', coordinates: { lat: 18.5074, lng: 73.8077 }, population: 300000 },
      { id: 'wakad', name: 'Wakad', type: 'mixed', coordinates: { lat: 18.5975, lng: 73.7898 }, population: 150000 },
      { id: 'pimpri-chinchwad', name: 'Pimpri-Chinchwad', type: 'industrial', coordinates: { lat: 18.6298, lng: 73.7997 }, population: 1700000 }
    ],
    emergencyServices: [
      { type: 'police', name: 'Pune Police', phone: '100' },
      { type: 'fire', name: 'Maharashtra Fire Service', phone: '101' },
      { type: 'medical', name: 'Ambulance Service', phone: '108' },
      { type: 'disaster', name: 'Disaster Management', phone: '1077' },
      { type: 'traffic', name: 'Pune Traffic Police', phone: '103' }
    ],
    localFeatures: [
      { type: 'landmark', name: 'Shaniwar Wada', coordinates: { lat: 18.5196, lng: 73.8553 }, importance: 'high' },
      { type: 'landmark', name: 'Aga Khan Palace', coordinates: { lat: 18.5314, lng: 73.8992 }, importance: 'high' },
      { type: 'transport_hub', name: 'Pune Airport', coordinates: { lat: 18.5821, lng: 73.9197 }, importance: 'high' },
      { type: 'transport_hub', name: 'Pune Railway Station', coordinates: { lat: 18.5204, lng: 73.8567 }, importance: 'high' },
      { type: 'hospital', name: 'Sassoon Hospital', coordinates: { lat: 18.5204, lng: 73.8567 }, importance: 'high' }
    ],
    climate: {
      type: 'tropical',
      rainySeasons: ['monsoon'],
      commonDisasters: ['flooding', 'drought'],
      averageTemp: { summer: 35, winter: 18 }
    },
    transportation: {
      modes: ['bus', 'taxi', 'rideshare', 'auto'],
      majorRoutes: ['Mumbai-Pune Expressway', 'Pune-Solapur Highway', 'Pune-Nashik Highway'],
      peakHours: { morning: '8:00-10:00', evening: '18:00-20:00' }
    }
  }
};

// Current city configuration (can be changed dynamically)
export let currentCityConfig: CityConfig = cityConfigs['mumbai'];

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
export function getLocalizedDistrictName(districtId: string, _language: string = 'en'): string {
  const district = currentCityConfig.districts.find(d => d.id === districtId);
  return district?.name || districtId;
}

// Helper function to format emergency numbers
export function getEmergencyNumber(type: EmergencyService['type']): string {
  const service = currentCityConfig.emergencyServices.find(s => s.type === type);
  return service?.phone || '911';
}
