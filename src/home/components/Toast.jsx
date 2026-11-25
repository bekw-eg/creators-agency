import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const DURATION = 6000;

/** Уведомление об отправке (успех/ошибка) с анимированной иконкой и таймером автозакрытия. */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(onClose, DURATION);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  const success = toast?.type === 'success';

  return createPortal(
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 z-[90] overflow-hidden rounded-3xl border border-white/10 bg-ink-800/80 p-5 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[400px]"
        >
          <div className="flex items-start gap-4">
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${success ? 'bg-acid text-ink' : 'bg-red-500/90 text-white'}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {success ? (
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
                  />
                ) : (
                  <motion.path
                    d="M7 7l10 10M17 7L7 17"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-grotesk text-lg font-semibold tracking-tight">{toast.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть уведомление"
              className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
          <motion.div
            aria-hidden
            className={`absolute bottom-0 left-0 h-0.5 w-full origin-left ${success ? 'bg-acid' : 'bg-red-500'}`}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: DURATION / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
