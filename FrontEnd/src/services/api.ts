import { LocationMetrics, RiskHierarchy } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

export const api = {
    getStates: async (): Promise<string[]> => {
        const response = await fetch(`${API_BASE_URL}/states`);
        if (!response.ok) throw new Error('Failed to fetch states');
        return response.json();
    },

    getDistricts: async (state: string): Promise<string[]> => {
        const response = await fetch(`${API_BASE_URL}/districts?state=${encodeURIComponent(state)}`);
        if (!response.ok) throw new Error('Failed to fetch districts');
        return response.json();
    },

    getData: async (state: string, district: string): Promise<LocationMetrics> => {
        const response = await fetch(`${API_BASE_URL}/data?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
    },

    getRiskHierarchy: async (): Promise<RiskHierarchy> => {
        const response = await fetch(`${API_BASE_URL}/risk-hierarchy`);
        if (!response.ok) throw new Error('Failed to fetch risk hierarchy');
        return response.json();
    },

    queryAI: async (context: string, query: string): Promise<{ answer: string }> => {
        const response = await fetch(`${BASE_URL}/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context, query }),
        });
        if (!response.ok) throw new Error('AI service unavailable');
        return response.json();
    },

    getHistory: async (): Promise<{ query: string; answer: string; time: string }[]> => {
        const response = await fetch(`${API_BASE_URL}/history`);
        if (!response.ok) return [];
        return response.json();
    },

    saveHistory: async (query: string, answer: string) => {
        await fetch(`${API_BASE_URL}/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, answer }),
        });
    }
};
