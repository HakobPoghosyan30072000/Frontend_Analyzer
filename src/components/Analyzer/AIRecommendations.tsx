'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AIRecommendationsProps {
  code: string;
}

export default function AIRecommendations({ code }: AIRecommendationsProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAISuggestion = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setSuggestion(null);

    try {
      // Example using OpenAI API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze this React component for performance and code-quality improvements:\n\n${code}`,
        }),
      });
      const data = await response.json();
      setSuggestion(data.suggestion || data.result || 'No suggestions found.');
    } catch (error) {
        console.log(error)
        
      setSuggestion('⚠️ Failed to get AI suggestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="text-yellow-500" />
          AI Recommendations
        </h3>
        <button
          onClick={getAISuggestion}
          disabled={loading}
          className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Get Suggestion'}
        </button>
      </div>

      <div className="mt-3 text-sm whitespace-pre-wrap">
        {suggestion ? (
          <p>{suggestion}</p>
        ) : (
          <p className="text-gray-500 italic">
            Click Get Suggestion to analyze code.
          </p>
        )}
      </div>
    </div>
  );
}
