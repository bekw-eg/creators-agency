import { useEffect, useState } from 'react';

// Реактивный matchMedia. Начальное значение считается синхронно, чтобы избежать «мигания» на первом рендере.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Устройство с мышью/тачпадом (десктоп) — включаем курсор и магнитные эффекты. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
