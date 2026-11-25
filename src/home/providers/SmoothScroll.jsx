import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/useMedia';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

/**
 * Инерционный скролл Lenis, синхронизированный с тикером GSAP,
 * чтобы ScrollTrigger и Lenis работали в одном кадре без рассинхрона.
 * На тач-устройствах Lenis не перехватывает жесты (нативный скролл = стабильные 60 FPS).
 */
export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Плавная прокрутка к якорю/элементу с фолбэком на нативный scroll. */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target, options = {}) => {
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.6, ...options });
        return;
      }
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
      else el?.scrollIntoView({ behavior: 'smooth' });
    },
    [lenis]
  );
}
