import SearchBar from '@/components/SearchBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube Transcript - Free Instant Transcript Extractor',
  description: 'Get instant transcripts from any YouTube video. Free, no signup required. Download as TXT, SRT, or JSON.',
  keywords: ['youtube transcript', 'youtube caption', 'video transcript', 'youtube subtitle', 'free transcript'],
  openGraph: {
    title: 'YouTube Transcript - Free Instant Transcript Extractor',
    description: 'Get instant transcripts from any YouTube video. Free, no signup required.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            transcripttool.app
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Free YouTube Transcript • No Sign Up • Instant
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <SearchBar />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Paste a YouTube URL or video ID to get the transcript instantly</p>
        </div>
      </div>
    </div>
  );
}
