import { useEnvironmentalImpact } from '@/lib/environmental-impact';
import { CrossIcon, WarningIcon } from '../icons';

interface SessionSummaryProps {
  onClose: () => void;
}

export function SessionSummary({ onClose }: SessionSummaryProps) {
  const { tokens, waterUsage, co2Emissions } = useEnvironmentalImpact();
  
  // Equivalent real-world examples
  const waterBottles = Math.round(waterUsage / 0.5); // 500ml water bottles
  const carKilometers = Math.round(co2Emissions / 120); // ~120g CO2 per km for average car
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Environmental Impact</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <CrossIcon size={20} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Tokens Used</p>
              <p className="text-2xl font-medium">{tokens.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v6m0 0c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Water Usage</h3>
                <p className="text-lg">{waterUsage.toFixed(2)} liters</p>
                <p className="text-sm text-muted-foreground">Equivalent to {waterBottles} bottles of water</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19a2 2 0 1 0 4 0a7 7 0 1 0-8 0a2 2 0 1 0 4 0m0-2a2 2 0 1 0 0-4a2 2 0 1 0 0 4z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">CO₂ Emissions</h3>
                <p className="text-lg">{co2Emissions.toFixed(2)} grams</p>
                <p className="text-sm text-muted-foreground">Equivalent to driving {carKilometers} km in a car</p>
              </div>
            </div>
          </div>
          
          {(waterUsage > 8 || co2Emissions > 1600) && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md flex items-start gap-2">
              <div className="shrink-0 mt-0.5">
                <WarningIcon size={16} />
              </div>
              <p className="text-sm">Your session is nearing capacity limits. Consider starting a new session soon.</p>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
