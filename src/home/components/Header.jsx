import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { BRAND, CONTACTS, NAV } from '../data/content';
import { useLenis, useScrollTo } from '../providers/SmoothScroll';
import MagneticButton, { ArrowIcon } from './ui/MagneticButton';

const EASE = [0.76, 0, 0.24, 1];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  // Прячем шапку при скролле вниз, показываем при скролле вверх.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 320);
    setScrolled(latest > 40);
  });

  // Блокируем прокрутку под открытым мобильным меню.
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
      setTimeout(() => scrollTo(href), 450);
    } else {
      scrollTo(href);
    }
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="container-x flex h-20 items-center justify-between md:h-24">
          <a
            href="#top"
            onClick={go('#top')}
            className="group flex items-baseline gap-1.5 font-grotesk text-xl font-semibold tracking-[-0.04em]"
            aria-label={`${BRAND.name} — на главную`}
          >
            <span>{BRAND.short}</span>
            <span className="inline-block h-2 w-2 rounded-full bg-acid transition-transform duration-500 group-hover:scale-150" />
            <span className="text-sm font-normal tracking-tight text-white/40">digital</span>
          </a>

          <nav
            aria-label="Основная навигация"
            className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border p-1.5 transition-all duration-500 md:flex ${
              scrolled ? 'border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl' : 'border-transparent'
            }`}
          >
            {NAV.map((item) => (
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

          <div className="hidden md:block">
            <MagneticButton size="sm" label="Обсудить проект" icon={<ArrowIcon className="h-3.5 w-3.5" />} href="#brief" onClick={go('#brief')} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-ink/60 backdrop-blur md:hidden"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
          >
            <span
              className={`absolute h-px w-5 bg-white transition-transform duration-500 ease-expo ${open ? 'rotate-45' : '-translate-y-1'}`}
            />
            <span
              className={`absolute h-px w-5 bg-white transition-transform duration-500 ease-expo ${open ? '-rotate-45' : 'translate-y-1'}`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-8 pt-28 md:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 42px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 42px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 42px) 40px)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav aria-label="Мобильная навигация" className="flex flex-col gap-1">
              {[...NAV, { label: 'Бриф', href: '#brief' }].map((item, i) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.a
                    href={item.href}
                    onClick={go(item.href)}
                    className="flex items-baseline gap-3 font-grotesk text-[13vw] font-semibold leading-[1.05] tracking-[-0.05em]"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.05 }}
                  >
                    <span className="font-mono text-xs tracking-normal text-acid">0{i + 1}</span>
                    {item.label}
                  </motion.a>
                </div>
              ))}
            </nav>

            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              exit={{ opacity: 0 }}
            >
              {CONTACTS.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="hover:text-white">
                  {c.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
