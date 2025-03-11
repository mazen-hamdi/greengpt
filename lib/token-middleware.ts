import { estimateTokenCount } from './environmental-impact';

// Types
type TokenCountCallback = (count: number) => void;

interface RequestWithMessages {
  messages?: Array<{
    content: string | {text?: string}[];
  }>;
}

// Single middleware implementation that can be configured
export function tokenCounterMiddleware(options?: {
  onTokenCount?: TokenCountCallback;
}) {
  return {
    onRequest: (request: RequestWithMessages) => {
      // Count tokens in outgoing requests
      if (request.messages && Array.isArray(request.messages)) {
        const totalTokens = request.messages.reduce((total: number, message) => {
          if (typeof message.content === 'string') {
            return total + estimateTokenCount(message.content);
          } else if (Array.isArray(message.content)) {
            // Handle multimodal content
            return total + message.content.reduce((partTotal: number, part) => {
              if (typeof part === 'string') {
                return partTotal + estimateTokenCount(part);
              } else if (typeof part.text === 'string') {
                return partTotal + estimateTokenCount(part.text);
              }
              return partTotal;
            }, 0);
          }
          return total;
        }, 0);

        if (options?.onTokenCount) {
          options.onTokenCount(totalTokens);
        }
        
        return totalTokens;
      }
      return 0;
    },
    
    onResponse: (response: string | { content?: string }) => {
      // Count tokens in responses
      let tokens = 0;
      
      if (typeof response === 'string') {
        tokens = estimateTokenCount(response);
      } else if (response && typeof response.content === 'string') {
        tokens = estimateTokenCount(response.content);
      }
      
      if (options?.onTokenCount) {
        options.onTokenCount(tokens);
      }
      
      return tokens;
    }
  };
}

// Helper functions for token estimation
export function estimateTokensFromText(text: string): number {
  return estimateTokenCount(text || '');
}

export function estimateTokensFromMessages(messages: Array<{content: string | any[]}>): number {
  return messages.reduce((total: number, message) => {
    if (typeof message.content === 'string') {
      return total + estimateTokensFromText(message.content);
    } else if (Array.isArray(message.content)) {
      return total + message.content.reduce((partTotal: number, part) => {
        if (typeof part === 'string') {
          return partTotal + estimateTokensFromText(part);
        } else if (part?.text) {
          return partTotal + estimateTokensFromText(part.text);
        }
        return partTotal;
      }, 0);
    }
    return total;
  }, 0);
}
