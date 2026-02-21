export interface DistrictMetrics {
  stage: number;
  rainfall: number;
  recharge: number;
  extraction_irrigation: number;
  extraction_domestic: number;
}

export interface District {
  id: string;
  name: string;
  status: string; // 'Critical', 'Safe', 'Semi-Critical' etc
  risk: 'High' | 'Medium' | 'Low';
  metrics: DistrictMetrics;
}

export interface StateData {
  name: string;
  risk: 'High' | 'Medium' | 'Low';
  avg_extraction: number;
  districts: District[];
}

export interface RiskHierarchy extends Array<StateData> { }

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
  isStreaming?: boolean;
}

// For the /api/data endpoint which returns a flat object of metrics
export interface LocationMetrics {
  [key: string]: number;
}