// app/components/SmoothScroll.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis();

    // Optional: Log scroll events
    lenis.on("scroll", (e: any) => {
      console.log(e);
    });

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup on component unmount
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array ensures this runs only once

  return <>{children}</>;
}