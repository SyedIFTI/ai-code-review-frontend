// src/hooks/useReviewStream.ts
import axios from 'axios'
import { useState, useCallback } from 'react'

interface ReviewIssue {
  severity: 'bug' | 'security' | 'performance' | 'style'
  title: string
  description: string
  location?: string
  recommendation?: string
}

interface ReviewResult {
  reviewId: string
  summary: string
  totalIssues: number
  issues: ReviewIssue[]
  recommendations: string[]
}

interface UseReviewStreamReturn {
  streamingText: string       // raw text as it arrives — for live display
  result: ReviewResult | null // final parsed result — for structured display
  isStreaming: boolean
  error: string | null
  startReview: (language: string, code: string) => void
  reset: () => void
}

export function useReviewStream(): UseReviewStreamReturn {
  const [streamingText, setStreamingText] = useState('')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStreamingText('')
    setResult(null)
    setIsStreaming(false)
    setError(null)
  }, [])

// src/hooks/useReviewStream.ts (fixed version)
const startReview = useCallback((language: string, code: string) => {
    reset();
    setIsStreaming(true);

    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';
    axios.post(`${serverUrl}/api/v1/ai/review-code`, {
        language,
        code
    }, {
        withCredentials: true,
        responseType: 'stream', // Important for streaming
        adapter: 'fetch', // Use fetch adapter for better streaming support
    }).then(async (response) => {
        if (response.status !== 200) {
            setError('Request failed');
            setIsStreaming(false);
            return;
        }

        // Use response.data directly as ReadableStream
        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop() ?? '';

            for (const eventBlock of events) {
                if (!eventBlock.trim()) continue;

                const lines = eventBlock.split('\n');
                const eventLine = lines.find(l => l.startsWith('event:'));
                const dataLine = lines.find(l => l.startsWith('data:'));

                if (!eventLine || !dataLine) continue;

                const eventType = eventLine.replace('event:', '').trim();
                const data = JSON.parse(dataLine.replace('data:', '').trim());

                switch (eventType) {
                    case 'chunk':
                        setStreamingText(prev => prev + data.text);
                        break;
                    case 'done':
                        setResult(data);
                        setIsStreaming(false);
                        break;
                    case 'error':
                        setError(data.message);
                        setIsStreaming(false);
                        break;
                }
            }
        }
    }).catch((err) => {
        console.error('Stream error:', err);
        setError('Connection failed');
        setIsStreaming(false);
    });
}, [reset]);

  return { streamingText, result, isStreaming, error, startReview, reset }
}