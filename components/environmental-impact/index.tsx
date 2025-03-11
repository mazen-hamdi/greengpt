import { WaterUsageDisplay } from './water-usage-display';
import { CO2EmissionsDisplay } from './co2-emissions-display';
import { SessionSummary } from './session-summary';
import { useState } from 'react';

export function EnvironmentalSidebars() {
  const [showSummary, setShowSummary] = useState(false);
  
  return (
    <>
      {/* Left sidebar with water usage */}
      <div className="hidden md:flex flex-col w-20 border-r border-border items-center justify-center">
        <WaterUsageDisplay />
        <button 
          onClick={() => setShowSummary(true)}
          className="text-xs text-muted-foreground hover:text-primary mt-2 cursor-pointer"
        >
          View Details
        </button>
      </div>
      
      {/* Right sidebar with CO2 emissions */}
      <div className="hidden md:flex flex-col w-20 border-l border-border items-center justify-center">
        <CO2EmissionsDisplay />
      </div>
      
      {/* Session summary modal */}
      {showSummary && (
        <SessionSummary onClose={() => setShowSummary(false)} />
      )}
    </>
  );
}
