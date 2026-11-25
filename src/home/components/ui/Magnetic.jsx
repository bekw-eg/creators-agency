import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useMedia';

const SPRING = { stiffness: 180, damping: 14, mass: 0.35 };

/**
 * Магнитная обёртка: элемент «притягивается» к курсору в пределах своих границ.
 * На тач-устройствах отключается полностью (без лишних слушателей и пересчётов).
 */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);
  const finePointer = useFinePointer();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  if (!finePointer) return <div className={`inline-block ${className}`}>{children}</div>;

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
