export interface WaterData {
  state: string;
  district: string;
  waterLevel: number;
  temperature: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  quality: {
    ph: number;
    tds: number;
    hardness: number;
  };
}

export interface StateData {
  name: string;
  districts: DistrictData[];
  averageWaterLevel: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface DistrictData {
  name: string;
  waterLevel: number;
  temperature: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}