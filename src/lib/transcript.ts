export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

interface CaptionTrack {
  baseUrl: string;
  name: { simpleText: string };
  languageCode: string;
  kind: string;
}

interface CaptionTrack {
  baseUrl: string;
  name: { simpleText: string };
  languageCode: string;
  kind: string;
}

async function fetchYouTubePage(videoId: string): Promise<string> {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  return response.text();
}

function extractCaptionTracks(html: string): CaptionTrack[] {
  const regex = /"captionTracks":(\[.*?\])/;
  const match = html.match(regex);
  if (!match) return [];
  
  try {
    const tracks = JSON.parse(match[1]);
    return tracks;
  } catch {
    return [];
  }
}

async function fetchCaptionXml(baseUrl: string): Promise<string> {
  const response = await fetch(baseUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  return response.text();
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

export async function getTranscript(videoId: string): Promise<TranscriptSegment[]> {
  try {
    const html = await fetchYouTubePage(videoId);
    const tracks = extractCaptionTracks(html);
    
    if (tracks.length === 0) {
      throw new Error('No captions available');
    }
    
    const englishTrack = tracks.find(t => t.languageCode === 'en' && t.kind === 'asr') 
      || tracks.find(t => t.languageCode === 'en')
      || tracks[0];
    
    if (!englishTrack?.baseUrl) {
      throw new Error('No English captions found');
    }
    
    const xml = await fetchCaptionXml(englishTrack.baseUrl);
    const segments = parseCaptionXml(xml);
    
    if (segments.length === 0) {
      throw new Error('Failed to parse captions');
    }
    
    return segments;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
