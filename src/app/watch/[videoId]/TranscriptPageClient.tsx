'use client';

import { useState } from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import TranscriptViewer from '@/components/TranscriptViewer';
import ActionBar from '@/components/ActionBar';
import { TranscriptSegment } from '@/lib/transcript';

interface TranscriptPageClientProps {
  videoId: string;
  transcript: TranscriptSegment[];
}

export default function TranscriptPageClient({
  videoId,
  transcript,
}: TranscriptPageClientProps) {
  const [seekTo, setSeekTo] = useState<number>(0);

  const handleTimestampClick = (offset: number) => {
    setSeekTo(offset);
  };

  const fullText = transcript.map((seg) => seg.text).join(' ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `YouTube Video Transcript - ${videoId}`,
    description: fullText.slice(0, 160),
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

          <ActionBar transcript={transcript} />

          <div className="mt-6">
            <TranscriptViewer
              transcript={transcript}
              onTimestampClick={handleTimestampClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
