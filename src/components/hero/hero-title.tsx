"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Lazy-loaded, browser-only. Three.js never ships in the server bundle and the
// chunk is fetched only after the device is known to support hover/pointer.
const TextDistortion = dynamic(() => import("./text-distortion"), {
  ssr: false,
  loading: () => null,
});

type Mode = "static" | "touch" | "webgl";

export function HeroTitle({ text = "CMU MHCI" }: { text?: string }) {
  // Start "static": the plain heading is server-rendered and shown until the
  // client decides, so there is no layout shift or flash.
  const [mode, setMode] = useState<Mode>("static");
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    setMode(touch ? "touch" : "webgl");
  }, []);

  return (
    <div ref={containerRef} className="relative font-heading text-foreground">
      {/* Base heading: stays in the DOM for layout sizing, accessibility, and
          as the fallback while the WebGL chunk loads. */}
      <h1
        className={cn(
          "font-heading text-[clamp(4rem,16vw,14rem)] leading-none tracking-tight transition-opacity duration-700",
          mode === "touch" && "hero-shimmer",
          mode === "webgl" && ready && "opacity-0"
        )}
      >
        {text}
      </h1>

      {mode === "webgl" && (
        <TextDistortion
          text={text}
          containerRef={containerRef}
          onReady={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
