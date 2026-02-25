import { TranscriptSegment } from './transcript';

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeSrt(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

export function transcriptToTxt(transcript: TranscriptSegment[]): string {
  return transcript.map((seg) => seg.text).join('\n\n');
}

export function transcriptToSrt(transcript: TranscriptSegment[]): string {
  return transcript
    .map((seg, index) => {
      return `${index + 1}\n${formatTimeSrt(seg.offset)} --> ${formatTimeSrt(seg.offset + seg.duration)}\n${seg.text}\n`;
    })
    .join('\n');
}

export function transcriptToJson(transcript: TranscriptSegment[]): string {
  return JSON.stringify(transcript, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
