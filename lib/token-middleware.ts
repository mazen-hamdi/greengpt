import { estimateTokenCount } from './environmental-impact';

type TokenCountCallback = (count: number) => void;

type TokenCounterMiddlewareParams = {
  onTokenCount: TokenCountCallback;
};

// Middleware to count tokens for AI SDK
export function tokenCounterMiddleware({ 
  onTokenCount 
}: TokenCounterMiddlewareParams) {
  return {
    before: async (options: any) => {
      try {
        // Estimate input tokens
        if (options.messages) {
          const inputTokens = estimateTokensFromMessages(options.messages);
          onTokenCount(inputTokens);
        } else if (options.prompt) {
          const promptTokens = estimateTokensFromText(
            typeof options.prompt === 'string' ? options.prompt : JSON.stringify(options.prompt)
          );
          onTokenCount(promptTokens);
        }
      } catch (error) {
        console.error('Error estimating input tokens:', error);
      }
      return options;
    },
    
    after: async (completion: any, options: any) => {
      try {
        // Estimate completion tokens
        if (typeof completion === 'string') {
          const completionTokens = estimateTokensFromText(completion);
          onTokenCount(completionTokens);
        } else if (completion?.content) {
          const contentTokens = estimateTokensFromText(completion.content);
          onTokenCount(contentTokens);
        }
      } catch (error) {
        console.error('Error estimating completion tokens:', error);
      }
      return completion;
    }
  };
}

// Estimate tokens from text
function estimateTokensFromText(text: string): number {
  // Simple estimation - about 4 characters per token for English text
  return Math.ceil((text || '').length / 4);
}

// Estimate tokens from chat messages
function estimateTokensFromMessages(messages: any[]): number {
  let total = 0;
  for (const message of messages) {
    if (typeof message.content === 'string') {
      total += estimateTokensFromText(message.content);
    } else if (Array.isArray(message.content)) {
      // Handle content arrays (e.g., with images or other content types)
      for (const part of message.content) {
        if (typeof part === 'string') {
          total += estimateTokensFromText(part);
        } else if (part?.text) {
          total += estimateTokensFromText(part.text);
        }
      }
    }
  }
  return total;
}
