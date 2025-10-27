// src/hooks/useLenis.ts
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      lerp: 0.08,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // Replace with a valid property
      // smoothTouch: true, // Removed as it is not a valid property
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
};