import { useEffect, useState, useRef } from 'react';
import { useEnvironmentalImpact } from '@/lib/environmental-impact';

export function CO2EmissionsDisplay() {
  const { co2Emissions, tokens } = useEnvironmentalImpact();
  const [fillPercentage, setFillPercentage] = useState(0);
  const [showCapacityMessage, setShowCapacityMessage] = useState(false);
  const tankRef = useRef<HTMLDivElement>(null);

  // Maximum CO2 emissions to display (when tank is 100% full)
  // Updated to reflect new CO2 per token ratio (0.02g per token)
  const MAX_CO2_DISPLAY = 2000; // grams (roughly 100,000 tokens)

  useEffect(() => {
    // Calculate fill percentage based on CO2 emissions
    const percentage = Math.min((co2Emissions / MAX_CO2_DISPLAY) * 100, 100);
    setFillPercentage(percentage);
    
    // Show capacity message when full
    if (percentage >= 100 && !showCapacityMessage) {
      setShowCapacityMessage(true);
      setTimeout(() => setShowCapacityMessage(false), 5000);
    }
  }, [co2Emissions, showCapacityMessage]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-sm font-medium">CO₂ Emissions</h3>
      <div className="relative h-40 w-28" ref={tankRef}>
        {/* 3D Tank Container */}
        <div className="absolute inset-0 perspective-500">
          {/* Tank Body */}
          <div className="relative h-full w-full rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700 transform-style-3d">
            {/* Tank structure with 3D effect */}
            <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 flex flex-col">
              <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-700 rounded-t-md flex items-center justify-center shadow-inner">
                <div className="h-2 w-8 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
              </div>
              
              {/* Tank sides and 3D effect */}
              <div className="absolute inset-y-6 inset-x-0 border-l border-r border-zinc-300 dark:border-zinc-600 opacity-50"></div>
              <div className="absolute inset-y-6 left-0 w-4 bg-gradient-to-r from-zinc-300 to-transparent dark:from-zinc-600 dark:to-transparent opacity-30"></div>
              <div className="absolute inset-y-6 right-0 w-4 bg-gradient-to-l from-zinc-300 to-transparent dark:from-zinc-600 dark:to-transparent opacity-30"></div>
            </div>
            
            {/* Gas visualization with 3D effect */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gray-500/60 backdrop-blur-sm transition-all duration-300 ease-in-out"
              style={{ height: `${fillPercentage}%` }}
            >
              {/* Animated gas particles */}
              <div className="absolute inset-0">
                <div className="w-full h-full bg-gradient-to-t from-gray-500/80 to-transparent animate-pulse">
                  <div className="gas-particle"></div>
                  <div className="gas-particle delay-1"></div>
                  <div className="gas-particle delay-2"></div>
                  <div className="gas-particle delay-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        {co2Emissions.toFixed(2)} g CO₂
      </p>
      
      {/* Capacity message */}
      {showCapacityMessage && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-4 py-2 rounded-md shadow-lg animate-bounce">
          CO₂ capacity reached!
        </div>
      )}
    </div>
  );
}
