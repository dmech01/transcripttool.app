import { NextRequest, NextResponse } from 'next/server';

interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

function extractCaptionTracks(html: string): { baseUrl: string; lang: string }[] {
  const regex = /"captionTracks":(\[.*?\])/;
  const match = html.match(regex);
  if (!match) return [];
  
  try {
    const tracks = JSON.parse(match[1]);
    return tracks.map((t: { baseUrl: string; languageCode: string }) => ({
      baseUrl: t.baseUrl,
      lang: t.languageCode,
    }));
  } catch {
    return [];
  }
}

function parseCaptionXml(xml: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  const regex = /<p[^>]*t="(\d+)"[^>]*d="(\d+)"[^>]*>([^<]*)<\/p>/g;
  
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const offset = parseInt(match[1]) / 1000;
    const duration = parseInt(match[2]) / 1000;
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    
    if (text) {
      segments.push({ text, offset, duration });
    }
  }
  
  return segments;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    const html = await response.text();
    
    const tracks = extractCaptionTracks(html);
    if (tracks.length === 0) {
      return NextResponse.json({ error: 'No captions found' }, { status: 404 });
    }
    
    const englishTrack = tracks.find((t) => t.lang === 'en') || tracks[0];
    
    let captionUrl = englishTrack.baseUrl.replace(/\\u0026/g, '&');
    captionUrl = decodeURIComponent(captionUrl);
    
    const captionResponse = await fetch(captionUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.youtube.com/watch?v=' + videoId,
      },
    });
    const xml = await captionResponse.text();
    
    const segments = parseCaptionXml(xml);
    if (segments.length === 0) {
      return NextResponse.json({ error: 'Failed to parse captions' }, { status: 404 });
    }
    
    return NextResponse.json({ transcript: segments });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
}
