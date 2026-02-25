'use client';

import { useState } from 'react';
import { TranscriptSegment } from '@/lib/transcript';
import {
  transcriptToTxt,
  transcriptToSrt,
  transcriptToJson,
  downloadFile,
} from '@/lib/utils';

interface ActionBarProps {
  transcript: TranscriptSegment[];
}

export default function ActionBar({ transcript }: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = transcript.map((seg) => seg.text).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'srt' | 'json') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'txt':
        content = transcriptToTxt(transcript);
        filename = 'transcript.txt';
        mimeType = 'text/plain';
        break;
      case 'srt':
        content = transcriptToSrt(transcript);
        filename = 'transcript.srt';
        mimeType = 'text/plain';
        break;
      case 'json':
        content = transcriptToJson(transcript);
        filename = 'transcript.json';
        mimeType = 'application/json';
        break;
    }

    downloadFile(content, filename, mimeType);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl">
      <button
        onClick={() => handleDownload('txt')}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        TXT
      </button>
      <button
        onClick={() => handleDownload('srt')}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        SRT
      </button>
      <button
        onClick={() => handleDownload('json')}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        JSON
      </button>
      <button
        onClick={handleCopy}
        className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {copied ? '✓ Copied!' : '📋 Copy All'}
      </button>
    </div>
  );
}
