import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import SmoothScroll, { useLenis, useScrollTo } from '../home/providers/SmoothScroll';
import { useFinePointer } from '../home/hooks/useMedia';
import Cursor from '../home/components/ui/Cursor';
import Magnetic from '../home/components/ui/Magnetic';

export const EASE = [0.16, 1, 0.3, 1];

export function formatKzt(value) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₸`;
}

/** Общая оболочка для нишевых демо-сайтов: Lenis, кастомный курсор, зерно, тёмная тема и автоскролл наверх. */
export function ShowcaseShell({ title, accent = '#C6FF00', bg = '#0A0A0C', children }) {
  const finePointer = useFinePointer();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    document.documentElement.classList.add('theme-creators');
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      document.documentElement.classList.remove('theme-creators');
    };
  }, [title]);

  return (
    <SmoothScroll>
      <div
        style={{ backgroundColor: bg, '--accent': accent }}
        className="relative min-h-screen pb-24 font-sans text-white antialiased selection:bg-[var(--accent)] selection:text-[#0A0A0C]"
      >
        {finePointer && <Cursor />}
        <div aria-hidden className="noise-overlay" />
        {children}
      </div>
    </SmoothScroll>
  );
}

/** Адаптивная шапка со стеклянной капсулой навигации и мобильным меню. */
export function ShowcaseHeader({ brand, subtitle, nav = [], ctaLabel, ctaHref, onCtaClick, rightSlot }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 320);
    setScrolled(latest > 40);
  });

  useEffect(() => {
    if (!open) return undefined;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  const go = (href) => (e) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setTimeout(() => scrollTo(href), 350);
    } else {
      scrollTo(href);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
          scrolled ? 'border-b border-white/10 bg-[#0A0A0C]/75 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      >
        <div className="container-x flex h-20 items-center justify-between md:h-24">
          <a
            href="#top"
            onClick={go('#top')}
            className="group flex items-baseline gap-2 font-grotesk text-lg font-semibold tracking-[-0.04em] sm:text-xl"
          >
            <span>{brand}</span>
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] transition-transform duration-500 group-hover:scale-150" />
            {subtitle && <span className="hidden text-xs font-normal text-white/40 lg:inline">{subtitle}</span>}
          </a>

          <nav
            aria-label="Навигация"
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border p-1.5 transition-all duration-500 md:flex ${
              scrolled ? 'border-white/10 bg-[#0E0E11]/80 shadow-2xl shadow-black/50 backdrop-blur-xl' : 'border-transparent'
            }`}
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={go(item.href)}
                className="rounded-full px-4 py-2 text-sm text-white/70 transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {rightSlot}
            {ctaLabel && (
              <Magnetic strength={0.25} className="hidden md:inline-block">
                <button
                  type="button"
                  onClick={onCtaClick || (() => ctaHref && scrollTo(ctaHref))}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-xs font-semibold uppercase tracking-[0.1em] text-[#0A0A0C] transition hover:bg-white"
                >
                  <span>{ctaLabel}</span>
                </button>
              </Magnetic>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0A0A0C]/70 backdrop-blur md:hidden"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={open}
            >
              <span className={`absolute h-px w-5 bg-white transition-transform duration-500 ease-expo ${open ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-5 bg-white transition-transform duration-500 ease-expo ${open ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="showcase-menu"
            className="fixed inset-0 z-30 flex flex-col justify-between bg-[#0A0A0C] px-5 pb-28 pt-28 md:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 42px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 42px) 40px)' }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-2">
              {nav.map((item, i) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={go(item.href)}
                    className="flex items-baseline gap-3 font-grotesk text-[11vw] font-semibold leading-[1.1] tracking-[-0.05em]"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.05 }}
                  >
                    <span className="font-mono text-xs tracking-normal text-[var(--accent)]">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            {ctaLabel && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => (onCtaClick ? onCtaClick() : ctaHref && scrollTo(ctaHref)), 350);
                }}
                className="h-14 w-full rounded-full bg-[var(--accent)] text-sm font-semibold uppercase tracking-[0.12em] text-[#0A0A0C]"
              >
                {ctaLabel}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Сетка с эффектом spotlight-подсветки границ за курсором (один слушатель на всю сетку). */
export function SpotlightGrid({ className = '', children }) {
  const ref = useRef(null);
  const finePointer = useFinePointer();

  const onPointerMove = (e) => {
    const cards = ref.current?.querySelectorAll('[data-spotlight]');
    cards?.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  };

  return (
    <div ref={ref} onPointerMove={finePointer ? onPointerMove : undefined} className={`spotlight-grid ${className}`}>
      {children}
    </div>
  );
}

/** Карточка внутри SpotlightGrid с подсветкой границы в цвете --accent. */
export function SpotlightCard({ className = '', innerClassName = '', children, ...rest }) {
  return (
    <div
      data-spotlight
      className={`spotlight-card group relative rounded-[24px] bg-white/[0.08] p-px ${className}`}
      {...rest}
    >
      <div
        aria-hidden
        className="spotlight-border pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background:
            'radial-gradient(380px circle at var(--mx, -999px) var(--my, -999px), var(--accent), transparent 45%)',
        }}
      />
      <div className={`relative h-full overflow-hidden rounded-[23px] bg-[#101014] ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

/** Моно-лейбл секции с цветом --accent. */
export function AccentLabel({ index, label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50 ${className}`}>
      <span className="text-[var(--accent)]">({index})</span>
      <span className="h-px w-8 bg-white/20" />
      <span>{label}</span>
    </div>
  );
}

/** Магнитная кнопка-пилюля в акцентном цвете ниши. */
export function AccentButton({ label, onClick, href, variant = 'solid', size = 'md', className = '', type = 'button', disabled = false, children }) {
  const scrollTo = useScrollTo();
  const sizes = {
    sm: 'h-11 px-5 text-xs',
    md: 'h-14 px-7 text-sm',
    lg: 'h-16 px-9 text-base',
  };
  const styles =
    variant === 'solid'
      ? 'bg-[var(--accent)] text-[#0A0A0C] hover:bg-white'
      : 'border border-white/15 bg-white/[0.03] text-white hover:border-[var(--accent)] hover:text-[var(--accent)]';

  const handleClick = (e) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      scrollTo(href);
    }
    onClick?.(e);
  };

  const Comp = href ? 'a' : 'button';

  return (
    <Magnetic strength={0.25}>
      <Comp
        href={href}
        type={href ? undefined : type}
        disabled={disabled}
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-tight transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${styles} ${className}`}
      >
        {children || label}
      </Comp>
    </Magnetic>
  );
}
