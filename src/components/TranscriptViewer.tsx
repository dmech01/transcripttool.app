'use client';

import { TranscriptSegment } from '@/lib/transcript';
import { formatTime } from '@/lib/utils';

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
  onTimestampClick: (offset: number) => void;
}

export default function TranscriptViewer({
  transcript,
  onTimestampClick,
}: TranscriptViewerProps) {
  return (
    <div className="space-y-4">
      {transcript.map((segment, index) => (
        <div
          key={`${segment.offset}-${index}`}
          className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onTimestampClick(segment.offset)}
        >
          <span className="text-blue-600 font-mono text-sm min-w-[60px] hover:text-blue-800 transition-colors">
            {formatTime(segment.offset)}
          </span>
          <span className="text-gray-700 leading-relaxed">{segment.text}</span>
        </div>
      ))}
    </div>
  );
}
