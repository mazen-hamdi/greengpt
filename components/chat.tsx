'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { useCompletion } from 'ai/react';
import { useEnvironmentalImpact, estimateTokenCount } from '@/lib/environmental-impact';
import { tokenCounterMiddleware } from '@/lib/token-middleware';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();

  // Get the token tracking function from environmental impact
  const { addTokens } = useEnvironmentalImpact();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: (message) => {
      // Track tokens when a message completes
      if (message.content) {
        const completionTokens = estimateTokenCount(message.content);
        addTokens(completionTokens);
      }
      mutate('/api/history');
    },
    onError: () => {
      toast.error('An error occured, please try again!');
    },
    // Track prompt tokens before sending
    onRequest: (request) => {
      // Get the last user message from the request
      const userMessages = request.messages.filter(msg => msg.role === 'user');
      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        if (typeof lastUserMessage.content === 'string') {
          const promptTokens = estimateTokenCount(lastUserMessage.content);
          addTokens(promptTokens);
        }
      }
    }
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  // Use completion hook with token tracking
  const { completion, input: completionInput, handleInputChange, handleSubmit: handleCompletionSubmit } = useCompletion({
    api: '/api/completion',
    onResponse: (response) => {
      // Estimate token usage when response is received
      if (response.ok) {
        // Track completion tokens on response
        response.text().then(text => {
          if (text) {
            const completionTokenCount = estimateTokenCount(text);
            addTokens(completionTokenCount);
          }
        }).catch(err => {
          console.error('Error estimating completion tokens:', err);
        });
      }
    },
    onFinish: (prompt, completion) => {
      // Track input tokens
      if (prompt) {
        const promptTokenCount = estimateTokenCount(prompt);
        addTokens(promptTokenCount);
      }
    }
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
