import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Построчное появление текста из-под маски (overflow-hidden).
 * trigger="inView" — запуск при попадании во вьюпорт; trigger="mount" — по флагу play.
 */
export default function MaskLines({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.1,
  trigger = 'inView',
  play = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const show = trigger === 'mount' ? play : inView;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className={`block origin-top-left will-change-transform ${lineClassName}`}
            initial={{ y: '115%', rotate: 4 }}
            animate={show ? { y: '0%', rotate: 0 } : undefined}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
