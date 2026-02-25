import { notFound } from 'next/navigation';
import { getTranscript } from '@/lib/transcript';
import TranscriptPageClient from './TranscriptPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { videoId } = await params;
  return {
    title: `YouTube Transcript - ${videoId}`,
    description: 'View and download the transcript for this YouTube video',
  };
}

export default async function Page({ params }: PageProps) {
  const { videoId } = await params;

  let transcript;
  try {
    transcript = await getTranscript(videoId);
  } catch (error) {
    console.error('Failed to fetch transcript:', error);
    notFound();
  }

  return <TranscriptPageClient videoId={videoId} transcript={transcript} />;
}
