import { useEffect, useState, useRef } from 'react';
import { useEnvironmentalImpact } from '@/lib/environmental-impact';
import { cn } from '@/lib/utils';

export function WaterUsageDisplay() {
  const { waterUsage, tokens } = useEnvironmentalImpact();
  const [fillPercentage, setFillPercentage] = useState(0);
  const [showCapacityMessage, setShowCapacityMessage] = useState(false);
  const cylinderRef = useRef<HTMLDivElement>(null);

  // Maximum water usage to display (when cylinder is 100% full)
  const MAX_WATER_DISPLAY = 10; // Liters

  useEffect(() => {
    // Calculate fill percentage based on water usage
    const percentage = Math.min((waterUsage / MAX_WATER_DISPLAY) * 100, 100);
    setFillPercentage(percentage);
    
    // Show capacity message when full
    if (percentage >= 100 && !showCapacityMessage) {
      setShowCapacityMessage(true);
      setTimeout(() => setShowCapacityMessage(false), 5000);
    }
  }, [waterUsage, showCapacityMessage]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-sm font-medium">Water Usage</h3>
      <div className="relative h-40 w-24">
        {/* 3D Cylinder Container */}
        <div 
          ref={cylinderRef} 
          className="absolute inset-0 perspective-500"
        >
          {/* Cylinder Body */}
          <div className="relative h-full w-full rounded-b-3xl rounded-t-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 transform-style-3d">
            {/* Cylinder Bottom (3D effect) */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-zinc-100/80 dark:bg-zinc-800/80 transform-3d rotate-x-70 origin-bottom"></div>
            
            {/* Cylinder sides */}
            <div className="absolute inset-0 bg-zinc-50/80 dark:bg-zinc-900/80"></div>
            
            {/* Water fill with 3D effect */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-500/80 transition-all duration-300 ease-in-out"
              style={{ height: `${fillPercentage}%` }}
            >
              {/* Water surface with ripple effect */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 animate-wave overflow-hidden">
                <div className="absolute inset-0 animate-ripple opacity-50"></div>
              </div>
            </div>
            
            {/* Glass highlight effect */}
            <div className="absolute inset-x-0 top-0 bottom-0 w-1/4 bg-white/10 dark:bg-white/5"></div>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {waterUsage.toFixed(2)} liters
      </div>
      <p className="text-xs text-center text-muted-foreground">
        {tokens} tokens used
      </p>
      
      {/* Capacity message */}
      {showCapacityMessage && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-4 py-2 rounded-md shadow-lg animate-bounce">
          Session's usage reached capacity!
        </div>
      )}
    </div>
  );
}
