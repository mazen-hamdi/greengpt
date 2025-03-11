'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ENV_IMPACT } from './constants';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Constants for environmental impact calculations - exact ratios
const CO2_PER_TOKEN = 0.02; // 0.02 grams CO2 per token (direct ratio)
const WATER_PER_TOKEN = 0.0001; // 0.1 milliliters = 0.0001 liters per token

interface EnvironmentalImpactContextType {
  tokens: number;
  waterUsage: number;
  co2Emissions: number;
  addTokens: (count: number) => void;
  resetImpact: () => void;
  sessionHistory: SessionStats[];
}

interface SessionStats {
  id: string;
  timestamp: Date;
  tokens: number;
  waterUsage: number;
  co2Emissions: number;
}

const EnvironmentalImpactContext = createContext<EnvironmentalImpactContextType | undefined>(undefined);

// Local storage key for saving session history
const LOCAL_STORAGE_KEY = 'green-gpt-environmental-impact';

export function EnvironmentalImpactProvider({ children }: { children: ReactNode }): JSX.Element {
  const [tokens, setTokens] = useState(0);
  const [waterUsage, setWaterUsage] = useState(0);
  const [co2Emissions, setCO2Emissions] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<SessionStats[]>([]);

  // Load previous session data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSessionHistory(parsedData.sessionHistory || []);
        
        // Optionally restore the current session
        if (parsedData.currentSession) {
          setTokens(parsedData.currentSession.tokens || 0);
          setWaterUsage(parsedData.currentSession.waterUsage || 0);
          setCO2Emissions(parsedData.currentSession.co2Emissions || 0);
        }
      }
    } catch (error) {
      console.error("Failed to load environmental impact data:", error);
    }
  }, []);

  // Save data to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        sessionHistory,
        currentSession: {
          tokens,
          waterUsage,
          co2Emissions
        }
      }));
    } catch (error) {
      console.error("Failed to save environmental impact data:", error);
    }
  }, [tokens, waterUsage, co2Emissions, sessionHistory]);

  const addTokens = (count: number) => {
    setTokens(prev => prev + count);
    setWaterUsage(prev => prev + (count * WATER_PER_TOKEN));
    setCO2Emissions(prev => prev + (count * CO2_PER_TOKEN));
  };

  const resetImpact = () => {
    // Store the current session before resetting
    if (tokens > 0) {
      const newSession: SessionStats = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        tokens,
        waterUsage,
        co2Emissions
      };
      
      setSessionHistory(prev => [...prev, newSession]);
    }
    
    // Reset current values
    setTokens(0);
    setWaterUsage(0);
    setCO2Emissions(0);
  };

  return (
    <EnvironmentalImpactContext.Provider value={{ 
      tokens, 
      waterUsage, 
      co2Emissions, 
      addTokens, 
      resetImpact,
      sessionHistory
    }}>
      {children}
    </EnvironmentalImpactContext.Provider>
  );
}

export function useEnvironmentalImpact() {
  const context = useContext(EnvironmentalImpactContext);
  if (context === undefined) {
    throw new Error('useEnvironmentalImpact must be used within an EnvironmentalImpactProvider');
  }
  return context;
}

// Utility to estimate token count from text
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}
