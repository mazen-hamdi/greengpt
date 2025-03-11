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
            return total + message.content.reduce((subtotal, part) => {
              if (part.text) {
                return subtotal + estimateTokenCount(part.text);
              }
              return subtotal;
            }, 0);
          }
          return total;
        }, 0);

        // Call token counter callback if provided
        if (options?.onTokenCount) {
          options.onTokenCount(totalTokens);
        }
      }
    },
    
    onResponse: (response: string | { content?: string }) => {
      let tokenCount = 0;
      
      // Extract content from string or object response
      if (typeof response === 'string') {
        tokenCount = estimateTokenCount(response);
      } else if (response.content) {
        tokenCount = estimateTokenCount(response.content);
      }
      
      // Call token counter callback if provided
      if (tokenCount > 0 && options?.onTokenCount) {
        options.onTokenCount(tokenCount);
      }
      
      return response;
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
