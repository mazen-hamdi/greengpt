import { useEffect, ReactNode } from 'react';
import { useCompletion } from 'ai/react';
import { EnvironmentalImpactProvider, useEnvironmentalImpact, estimateTokenCount } from '@/lib/environmental-impact';
import { EnvironmentalSidebars } from './environmental-impact';

interface ChatWithImpactProps {
  children: ReactNode;
}

// This component wraps around the chat interface and observes messages
function ChatImpactObserver({ children }: ChatWithImpactProps) {
  const { addTokens } = useEnvironmentalImpact();
  
  // This will track messages from the AI SDK
  useEffect(() => {
    // This is a simplified approach, in a real implementation we would
    // need to hook into the actual message stream from the AI provider
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
      const response = await originalFetch(input, init);
      
      // Clone the response to read its body without consuming it
      const clone = response.clone();
      
      // Check if this is a chat API request
      if (typeof input === 'string' && input.includes('/api/chat')) {
        try {
          // Try to parse as JSON, but don't crash if it's not valid JSON
          clone.text().then(text => {
            try {
              const data = JSON.parse(text);
              // Process the response to extract tokens
              if (data && data.content) {
                const tokenCount = estimateTokenCount(data.content);
                addTokens(tokenCount);
              }
            } catch (error) {
              // Ignore errors when trying to parse non-JSON responses
            }
          }).catch(() => {
            // Ignore fetch errors
          });
        } catch (error) {
          // Ignore any other errors
        }
      }
      
      return response;
    };
    
    return () => {
      // Restore original fetch when component unmounts
      window.fetch = originalFetch;
    };
  }, [addTokens]);

  return <>{children}</>;
}

export function ChatWithImpact({ children }: ChatWithImpactProps) {
  return (
    <EnvironmentalImpactProvider>
      <div className="flex h-full w-full">
        <EnvironmentalSidebars />
        <div className="flex-1">
          <ChatImpactObserver>
            {children}
          </ChatImpactObserver>
        </div>
      </div>
    </EnvironmentalImpactProvider>
  );
}
