'use client';

import { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  seekTo?: number;
}

export default function VideoPlayer({ videoId, seekTo }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [startTime, setStartTime] = useState(seekTo || 0);

  useEffect(() => {
    if (seekTo !== undefined && seekTo !== startTime) {
      setStartTime(seekTo);
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        const baseUrl = currentSrc.split('&')[0];
        iframeRef.current.src = `${baseUrl}&start=${Math.floor(seekTo)}`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekTo]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
      <iframe
        ref={iframeRef}
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?start=${Math.floor(startTime)}&rel=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
