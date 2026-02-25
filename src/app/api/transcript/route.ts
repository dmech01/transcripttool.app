import { NextRequest, NextResponse } from 'next/server';

interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://youtubetranscriptapi.com/api/transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: videoId,
        lang: 'en',
      }),
    });

    if (!response.ok) {
      console.error('Transcript API error:', await response.text());
      return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
    }

    const data = await response.json();
    
    if (!data.transcript) {
      return NextResponse.json({ error: 'No transcript found' }, { status: 404 });
    }

    const segments: TranscriptSegment[] = data.transcript.map((item: { text: string; start: number; duration: number }) => ({
      text: item.text,
      offset: item.start,
      duration: item.duration,
    }));

    return NextResponse.json({ transcript: segments });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
}
