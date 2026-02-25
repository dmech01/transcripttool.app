import { Metadata } from 'next';
import TranscriptPageClient from './TranscriptPageClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { videoId } = await params;
  return {
    title: `YouTube Transcript - ${videoId}`,
    description: 'View and download the transcript for this YouTube video',
  };
}

export default async function Page({ params }: PageProps) {
  const { videoId } = await params;
  return <TranscriptPageClient videoId={videoId} />;
}
