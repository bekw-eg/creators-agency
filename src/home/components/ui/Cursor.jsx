import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = '[data-cursor], a, button, input, textarea, select, label';

const VARIANTS = {
  default: { width: 12, height: 12, borderRadius: 999, backgroundColor: '#ffffff' },
  hover: { width: 64, height: 64, borderRadius: 999, backgroundColor: '#ffffff' },
  text: { width: 3, height: 30, borderRadius: 2, backgroundColor: '#ffffff' },
  view: { width: 148, height: 56, borderRadius: 999, backgroundColor: '#C6FF00' },
};

/**
 * Кастомный курсор. Рендерится только на устройствах с точным указателем.
 * - ссылки/кнопки: увеличивается (mix-blend-difference инвертирует контент под ним);
 * - [data-cursor="view"]: превращается в неоновую плашку «Смотреть»;
 * - поля ввода: превращается в каретку.
 */
export default function Cursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 600, damping: 42, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 600, damping: 42, mass: 0.4 });

  const [variant, setVariant] = useState('default');
  const [label, setLabel] = useState('Смотреть');
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (!el) return setVariant('default');
      const type = el.getAttribute('data-cursor');
      if (type === 'view') {
        setLabel(el.getAttribute('data-cursor-label') || 'Смотреть');
        setVariant('view');
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        setVariant('text');
      } else {
        setVariant(type && VARIANTS[type] ? type : 'hover');
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [x, y]);

  const isView = variant === 'view';

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        mixBlendMode: isView ? 'normal' : 'difference',
      }}
      animate={{ ...VARIANTS[variant], opacity: visible ? 1 : 0, scale: pressed ? 0.85 : 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.6 }}
    >
      <motion.span
        className="flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.12em] text-ink"
        animate={{ opacity: isView ? 1 : 0, y: isView ? 0 : 8 }}
        transition={{ duration: 0.25 }}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H3.5M10 2V8.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </motion.span>
    </motion.div>
  );
}
