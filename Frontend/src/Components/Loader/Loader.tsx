import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Loader.css';

type LoaderProps = {
  percent?: number; // optional controlled percent
  onComplete?: () => void; // called when progress reaches 100
};

const Loader: React.FC<LoaderProps> = ({ percent: controlledPercent, onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  // internal percent if parent doesn't control it
  const [internalPercent, setInternalPercent] = useState<number>(0);
  const percent = typeof controlledPercent === 'number' ? controlledPercent : internalPercent;

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    tl.from(logoRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    })
      .from(
        textRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      .from(
        subtextRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        cartRef.current,
        {
          x: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        },
        '-=0.5'
      );

    gsap.to('.circle', {
      scale: 1.5,
      opacity: 0.3,
      duration: 1.5,
      stagger: 0.2,
      repeat: -1,
      ease: 'power1.inOut',
    });

    gsap.to('.dot', {
      y: -20,
      duration: 0.6,
      stagger: 0.15,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    gsap.to('.shine', {
      x: 300,
      duration: 2,
      repeat: -1,
      ease: 'power2.inOut',
      repeatDelay: 0.5,
    });

    return () => {
      tl.kill();
    };
  }, []);

  // If parent doesn't control percent, animate it here and call onComplete
  useEffect(() => {
    if (typeof controlledPercent === 'number') return undefined;

    let id: any = null;
    id = setInterval(() => {
      setInternalPercent((p) => {
        const step = Math.floor(Math.random() * 10) + 6; // random-ish step
        const np = Math.min(100, p + step);
        return np;
      });
    }, 150);

    return () => clearInterval(id);
  }, [controlledPercent]);

  // notify when reaches 100
  useEffect(() => {
    if (percent >= 100) {
      // slight delay for UX
      const t = setTimeout(() => {
        onComplete && onComplete();
      }, 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [percent, onComplete]);

  return (
    <div className="loader-container" ref={loaderRef}>
      <div className="circles-background" ref={circlesRef}>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="loader-content">
        <div className="logo-container" ref={logoRef}>
          <div className="cart-icon" ref={cartRef}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 2L7.17 4H3C2.45 4 2 4.45 2 5C2 5.55 2.45 6 3 6H4L7.6 14.59L6.25 17.03C5.52 18.37 6.48 20 8 20H19C19.55 20 20 19.55 20 19C20 18.45 19.55 18 19 18H8L9 16H16.55C17.3 16 17.96 15.59 18.3 14.97L21.88 7.48C22.25 6.82 21.77 6 21.01 6H8.31L7.17 4H9ZM16 21C14.9 21 14 21.9 14 23C14 24.1 14.9 25 16 25C17.1 25 18 24.1 18 23C18 21.9 17.1 21 16 21ZM8 21C6.9 21 6 21.9 6 23C6 24.1 6.9 25 8 25C9.1 25 10 24.1 10 23C10 21.9 9.1 21 8 21Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="shine"></div>
        </div>

        <h1 className="loader-title" ref={textRef}>
          <span className="brand-name">Eazy</span>
          <span className="brand-name-accent">Kart</span>
        </h1>

        <p className="loader-subtitle" ref={subtextRef}>
          Your Shopping Paradise
        </p>

        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="progress-bar" aria-hidden>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="progress-percent" aria-live="polite">{Math.min(100, Math.floor(percent))}%</div>
      </div>
    </div>
  );
};

export default Loader;
