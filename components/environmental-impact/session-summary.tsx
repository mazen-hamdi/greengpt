import { useEnvironmentalImpact } from '@/lib/environmental-impact';
import { LineChartIcon, WarningIcon } from '../icons';
import { formatDistanceToNow } from 'date-fns';

export function SessionSummary() {
  const { tokens, waterUsage, co2Emissions, sessionHistory } = useEnvironmentalImpact();

  // Format the data for display
  const formattedWater = waterUsage.toFixed(4);
  const formattedCO2 = co2Emissions.toFixed(2);

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <LineChartIcon size={18} />
          Environmental Impact
        </h3>
        {tokens > 1000 && (
          <div className="text-amber-500 flex items-center gap-1">
            <WarningIcon size={16} />
            <span className="text-xs">High usage</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Total tokens used:</span>
          <span className="text-xl font-semibold">{tokens.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Water usage:</span>
            <span className="font-medium">{formattedWater} L</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">CO₂ emissions:</span>
            <span className="font-medium">{formattedCO2} g</span>
          </div>
        </div>

        {sessionHistory.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Recent Sessions</h4>
            <div className="max-h-40 overflow-y-auto">
              {sessionHistory.slice().reverse().map(session => (
                <div key={session.id} className="flex justify-between py-1 text-sm border-b last:border-0">
                  <span className="text-muted-foreground">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </span>
                  <span>{session.tokens.toLocaleString()} tokens</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
