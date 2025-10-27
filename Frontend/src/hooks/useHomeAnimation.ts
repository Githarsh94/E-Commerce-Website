import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Simple homepage animation hook.
 * - Animates nav + hero on load (single timeline)
 * - Animates Hero2 and Categories via ScrollTrigger only (no duplicate animations)
 */
export default function useHomeAnimation() {
  useEffect(() => {
    let tl: any = null;
    try {
      if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

      // Simple selector arrays
      const navTargets = gsap.utils.toArray('.nav-logo, .nav-links > *, .nav-search, .nav-right > *');
      const heroText = gsap.utils.toArray('.hero-text-main');
      const heroBtns = gsap.utils.toArray('.hero-buttons button');
      const heroImg = gsap.utils.toArray('.hero-image');
      const features = gsap.utils.toArray('.hero-features .feature');
      const hero2Els = gsap.utils.toArray('.main'); // Hero2 root
      const categoryItems = gsap.utils.toArray('#page5 .elem');

      // Set initial states to avoid flash / partial visibility
      try {
        if (navTargets.length) gsap.set(navTargets, { autoAlpha: 0, y: -20 });
        if (heroText.length) gsap.set(heroText, { autoAlpha: 0, y: -20, scale: 0, transformOrigin: '50% 50%' });
        if (heroBtns.length) gsap.set(heroBtns, { autoAlpha: 0, y: -20 });
        if (heroImg.length) gsap.set(heroImg, { autoAlpha: 0, x: 100 });
        if (features.length) gsap.set(features, { autoAlpha: 0, y: 12 });
        if (hero2Els.length) gsap.set(hero2Els, { autoAlpha: 0, y: 20 });
        if (categoryItems.length) gsap.set(categoryItems, { autoAlpha: 0, y: 20 });
      } catch (e) {}

      // Entrance timeline for nav + hero
      tl = gsap.timeline({ defaults: { duration: 0.55, ease: 'power3.out' } });
      if (navTargets.length) tl.to(navTargets, { autoAlpha: 1, y: 0, stagger: 0.1 }, 0);
    if (heroText.length) tl.to(heroText, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.1)' }, 0.12);
      if (heroBtns.length) tl.to(heroBtns, { autoAlpha: 1, y: 0, stagger: 0.3 }, 0.18);
      if (heroImg.length) tl.to(heroImg, { autoAlpha: 1, x: 0 }, 0.22);
      if (features.length) tl.to(features, { autoAlpha: 1, y: 0, stagger: 0.3 }, 0.34);

      // Clear props to let CSS take over after animation
      tl.call(() => {
        try {
          gsap.set([].concat(navTargets as any, heroText as any, heroBtns as any, heroImg as any, features as any), { clearProps: 'all' });
        } catch (e) {}
      });

      // Scroll-triggered reveal for Hero2 (only on scroll)
      try {
        if (hero2Els.length) {
          gsap.fromTo(
            hero2Els,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.3,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: hero2Els[0] as Element,
                start: 'top 80%',
                end: 'bottom 20%',
                // symmetric toggle so it reverses when scrolling back up
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      } catch (e) {}

      // Scroll-triggered stagger for Categories
      try {
        const root = document.querySelector('#page5');
        if (categoryItems.length) {
          gsap.fromTo(
            categoryItems,
            { autoAlpha: 0, x: 100 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.3,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: categoryItems[0] as Element,
                start: 'top 80%',
                end: 'bottom 20%',
                // symmetric toggle so it reverses when scrolling back up
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      } catch (e) {}
    } catch (err) {
      // keep simple: swallow errors but do not break app
    }

    return () => {
      try {
        if (tl && tl.kill) tl.kill();
        const sts = (ScrollTrigger as any).getAll ? (ScrollTrigger as any).getAll() : [];
        sts.forEach((s: any) => s.kill && s.kill());
      } catch (err) {}
    };
  }, []);
}
