import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND, CONTACTS, NAV } from '../data/content';
import { useScrollTo } from '../providers/SmoothScroll';
import Magnetic from '../components/ui/Magnetic';

function LocalTime() {
  const format = () =>
    new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: BRAND.timeZone }).format(new Date());
  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <span className="tabular-nums">{time}</span>;
}

const WORDMARK = 'CREATORS'.split('');

export default function Footer() {
  const scrollTo = useScrollTo();

  const go = (href) => (e) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-20 md:pt-28">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="max-w-sm font-grotesk text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-4xl">
            {BRAND.tagline}.
          </p>
          <p className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-acid" />
            Астана · <LocalTime />
          </p>
        </div>

        <nav aria-label="Навигация в подвале" className="md:col-span-2 md:col-start-7">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Меню</p>
          <ul className="space-y-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={go(item.href)} className="link-underline text-white/80 hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Соцсети</p>
          <ul className="space-y-3">
            {CONTACTS.map((c) => (
              <li key={c.label}>
                <a href={c.href} target="_blank" rel="noreferrer" className="link-underline text-white/80 hover:text-white">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex md:col-span-2 md:justify-end">
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={() => scrollTo(0, { duration: 2 })}
              aria-label="Наверх"
              className="group grid h-20 w-20 place-items-center rounded-full border border-white/15 transition-colors duration-500 hover:border-acid hover:bg-acid hover:text-ink"
            >
              <svg className="h-5 w-5 transition-transform duration-500 ease-expo group-hover:-translate-y-1" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:justify-between">
        <span>
          © {new Date().getFullYear()} {BRAND.name}
        </span>
        <span>{BRAND.domain}</span>
      </div>

      {/* Гигантский вордмарк с побуквенным появлением */}
      <div aria-hidden className="mt-6 select-none overflow-hidden px-2">
        <div className="flex justify-center font-grotesk text-[18.5vw] font-bold leading-[0.78] tracking-[-0.07em]">
          {WORDMARK.map((char, i) => (
            <motion.span
              key={i}
              className="wordmark-gradient inline-block"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </footer>
  );
}
