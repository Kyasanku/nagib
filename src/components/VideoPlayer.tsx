"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

// Supports direct video files and common embed URLs (YouTube / Vimeo).
export default function VideoPlayer({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com/.test(src);

  if (isEmbed) {
    const embedUrl = toEmbedUrl(src);
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-black/[0.05] bg-ink-800 shadow-cinematic">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-black/[0.05] bg-ink-800 shadow-cinematic">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
      />
      {!playing && (
        <button
          onClick={() => {
            setPlaying(true);
            videoRef.current?.play();
          }}
          className="group absolute inset-0 grid place-items-center"
        >
          <Image src={poster} alt={title} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-ink/40" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full border border-black/[0.16] bg-ink/40 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold/20">
            <Play size={28} className="translate-x-1 text-ivory" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}

function toEmbedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}
