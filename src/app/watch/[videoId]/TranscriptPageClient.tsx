'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import TranscriptViewer from '@/components/TranscriptViewer';
import ActionBar from '@/components/ActionBar';

interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

interface TranscriptPageClientProps {
  videoId: string;
}

export default function TranscriptPageClient({ videoId }: TranscriptPageClientProps) {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seekTo, setSeekTo] = useState<number>(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    fetch(`/api/transcript?videoId=${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTranscript(data.transcript);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [videoId]);

  const handleTimestampClick = (offset: number) => {
    setSeekTo(offset);
  };

  const fullText = transcript.map((seg) => seg.text).join(' ');
  const hasTranscript = transcript.length > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `YouTube Video Transcript - ${videoId}`,
    description: fullText.slice(0, 160) || 'No transcript available',
    transcript: fullText,
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <VideoPlayer videoId={videoId} seekTo={seekTo} />

        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Transcript
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading transcript...</p>
            </div>
          ) : !hasTranscript ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-medium mb-2">
                {error || 'No transcript available'}
              </p>
              <p className="text-yellow-600 text-sm">
                This video may not have captions enabled, or they may be disabled by the creator.
              </p>
            </div>
          ) : (
            <>
              <ActionBar transcript={transcript} />

              <div className="mt-6">
                <TranscriptViewer
                  transcript={transcript}
                  onTimestampClick={handleTimestampClick}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
