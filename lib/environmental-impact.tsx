'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

// Create a Zustand store for persisting environmental impact data
interface EnvironmentalImpactStore {
  tokens: number;
  sessionHistory: SessionStats[];
  addTokens: (count: number) => void;
  resetImpact: () => void;
}

const useEnvironmentalImpactStore = create<EnvironmentalImpactStore>()(
  persist(
    (set) => ({
      tokens: 0,
      sessionHistory: [],
      addTokens: (count: number) => 
        set((state) => {
          const currentDate = new Date();
          const sessionId = currentDate.toISOString().split('T')[0]; // Use date as session ID
          
          // Check if we already have a session for today
          const existingSessionIndex = state.sessionHistory.findIndex(
            session => session.id === sessionId
          );
          
          let updatedHistory = [...state.sessionHistory];
          
          if (existingSessionIndex >= 0) {
            // Update existing session
            updatedHistory[existingSessionIndex] = {
              ...updatedHistory[existingSessionIndex],
              tokens: updatedHistory[existingSessionIndex].tokens + count
            };
          } else {
            // Create new session
            updatedHistory.push({
              id: sessionId,
              timestamp: currentDate,
              tokens: count
            });
          }
          
          // Limit history to last 30 days
          if (updatedHistory.length > 30) {
            updatedHistory = updatedHistory.slice(-30);
          }
          
          return {
            tokens: state.tokens + count,
            sessionHistory: updatedHistory
          };
        }),
      resetImpact: () => set({ tokens: 0, sessionHistory: [] }),
    }),
    {
      name: 'environmental-impact-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Create the context
const EnvironmentalImpactContext = createContext<EnvironmentalImpactContextType | null>(null);

// Create a provider component
export function EnvironmentalImpactProvider({ children }: { children: ReactNode }) {
  const { tokens, addTokens, resetImpact, sessionHistory } = useEnvironmentalImpactStore();
  
  // Calculate environmental impact based on tokens
  const waterUsage = tokens * WATER_PER_TOKEN; // in liters
  const co2Emissions = tokens * CO2_PER_TOKEN; // in grams

  return (
    <EnvironmentalImpactContext.Provider 
      value={{ 
        tokens, 
        waterUsage, 
        co2Emissions, 
        addTokens, 
        resetImpact, 
        sessionHistory 
      }}
    >
      {children}
    </EnvironmentalImpactContext.Provider>
  );
}

// Hook for accessing the environmental impact context
export function useEnvironmentalImpact() {
  const context = useContext(EnvironmentalImpactContext);
  
  if (!context) {
    throw new Error('useEnvironmentalImpact must be used within an EnvironmentalImpactProvider');
  }
  
  return context;
}

// Helper function to estimate token count from a string
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  
  // A simple estimation: roughly 4 characters per token for English text
  // This is a rough approximation used by many token counting libraries
  return Math.ceil(text.length / 4);
}
