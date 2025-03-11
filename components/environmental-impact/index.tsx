import { useEnvironmentalImpact } from '@/lib/environmental-impact';
import { SessionSummary } from './session-summary';

export function EnvironmentalSidebars() {
  const { tokens } = useEnvironmentalImpact();
  
  // Only show if there are tokens tracked
  if (tokens === 0) return null;
  
  return (
    <div className="fixed right-4 bottom-4 w-80 z-10">
      <SessionSummary />
    </div>
  );
}

export { SessionSummary };
