// Type declarations for Shery.js
declare module 'sheryjs' {
  interface MagnetOptions {
    ease?: string;
    duration?: number;
  }

  interface MouseFollowerOptions {
    skew?: boolean;
    ease?: string;
    duration?: number;
  }

  interface ImageEffectOptions {
    style?: number;
    config?: Record<string, any>;
    preset?: string;
  }

  const Shery: {
    makeMagnet: (selector: string, options?: MagnetOptions) => void;
    mouseFollower: (options?: MouseFollowerOptions) => void;
    imageEffect: (selector: string, options?: ImageEffectOptions) => void;
  };

  export default Shery;
}

// Global window interface
declare global {
  interface Window {
    Shery?: {
      makeMagnet: (selector: string, options?: {
        ease?: string;
        duration?: number;
      }) => void;
      mouseFollower: (options?: {
        skew?: boolean;
        ease?: string;
        duration?: number;
      }) => void;
      imageEffect: (selector: string, options?: {
        style?: number;
        config?: Record<string, any>;
        preset?: string;
      }) => void;
    };
  }
}

export {};
