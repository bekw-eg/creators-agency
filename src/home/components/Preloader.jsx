import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { BRAND } from '../data/content';

// Интро показываем один раз за сессию SPA: при возврате из демо-кейса оно не мешает.
let introPlayed = false;

const EASE = [0.76, 0, 0.24, 1];

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(!introPlayed);
  const counterRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (introPlayed) {
      onComplete();
      return undefined;
    }

    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, '0');
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
      onComplete: () => {
        introPlayed = true;
        setVisible(false);
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink px-5 py-6 sm:px-8 lg:px-12"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
            <span>{BRAND.name}</span>
            <span>{BRAND.city}</span>
          </div>

          <div className="overflow-hidden">
            <motion.p
              className="font-grotesk text-[clamp(2rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em]"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              От идеи — <span className="font-serif font-normal italic text-acid">к результату</span>
            </motion.p>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <span
                ref={counterRef}
                className="font-grotesk text-[clamp(4.5rem,18vw,16rem)] font-semibold leading-[0.8] tracking-[-0.06em] tabular-nums"
              >
                000
              </span>
              <span className="pb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">Загрузка</span>
            </div>
            <div className="mt-6 h-px w-full bg-white/10">
              <div ref={barRef} className="h-full origin-left scale-x-0 bg-acid" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
