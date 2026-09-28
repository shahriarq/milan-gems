"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

interface CinematicVideoProps {
  src: string;
  poster: string;
  className?: string;
  /** Defer loading until the video nears the viewport (below-the-fold use). */
  lazy?: boolean;
}

/**
 * Muted, looping background film. Plays only while on screen (so off-screen
 * films don't burn bandwidth or battery), is fetched lazily when requested,
 * and stays on its poster frame for visitors who prefer reduced motion.
 */
export default function CinematicVideo({ src, poster, className = "", lazy = false }: CinematicVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.pause();
      return;
    }

    const play = () => {
      if (!video.src) {
        video.src = src;
        video.load();
      }
      video.play().catch(() => {
        /* autoplay refused (e.g. low-power mode): the poster remains */
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: lazy ? "300px 0px" : "0px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src, lazy]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={lazy ? undefined : src}
      autoPlay={!lazy}
      muted
      loop
      playsInline
      preload={lazy ? "none" : "auto"}
      aria-hidden="true"
    />
  );
}
