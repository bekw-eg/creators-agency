import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { STATS, STEPS } from '../data/content';
import MaskLines from '../components/ui/MaskLines';
import SectionLabel from '../components/ui/SectionLabel';

const EASE = [0.16, 1, 0.3, 1];

/** Счётчик: анимируется от 0 при первом попадании в область видимости. Пишет напрямую в DOM (без ре-рендеров). */
function Counter({ value, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals).replace('.', ',');
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>{(0).toFixed(decimals).replace('.', ',')}</span>
      <span className="text-acid">{suffix}</span>
    </span>
  );
}

function Stats() {
  return (
    <dl className="mt-16 grid grid-cols-2 border-t border-white/10 md:mt-24 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
          className={`flex flex-col border-b border-white/10 py-8 pr-4 md:py-12 ${i % 2 ? 'pl-4 md:pl-8' : ''} ${
            i > 0 ? 'lg:border-l lg:pl-8' : ''
          } ${i % 2 ? 'border-l' : ''}`}
        >
          <dt className="order-2 mt-3 text-sm text-white/50">{s.label}</dt>
          <dd className="font-grotesk text-[clamp(2.75rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.06em]">
            <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}

function Steps() {
  const listRef = useRef(null);
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(v <= 0.01 ? -1 : Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)));
  });

  const current = STEPS[Math.max(active, 0)];

  return (
    <div className="mt-24 grid gap-12 md:mt-32 lg:grid-cols-12">
      <div className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">Текущий этап</p>
          <div className="mt-4 flex items-end gap-3 font-grotesk font-semibold">
            <div className="relative h-[8rem] overflow-hidden text-[8.5rem] leading-[0.92] tracking-[-0.06em] tabular-nums">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current.index}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-105%' }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="block text-acid"
                >
                  {current.index}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="pb-3 font-mono text-2xl tracking-normal text-white/30">/ 0{STEPS.length}</span>
          </div>
          <p className="mt-6 max-w-xs text-white/50">
            Работаем спринтами с еженедельными демо: вы всегда видите прогресс и влияете на результат.
          </p>
        </div>
      </div>

      <ol ref={listRef} className="relative lg:col-span-8">
        {/* Линия прогресса, заполняющаяся по мере скролла */}
        <div aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-white/10">
          <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-acid shadow-[0_0_14px_rgba(198,255,0,0.7)]" />
        </div>

        {STEPS.map((step, i) => {
          const reached = i <= active;
          return (
            <li key={step.index} className="relative pb-16 pl-12 last:pb-0 md:pb-24 md:pl-20">
              <span
                className={`absolute left-0 top-1.5 grid h-6 w-6 place-items-center rounded-full border transition-all duration-500 ${
                  reached ? 'scale-110 border-acid bg-acid' : 'border-white/20 bg-ink'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${reached ? 'bg-ink' : 'bg-white/30'}`} />
              </span>

              <div className={`transition-opacity duration-700 ${reached ? 'opacity-100' : 'opacity-35'}`}>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                  <span className="text-acid">Этап {step.index}</span>
                  <span className="h-px w-6 bg-white/20" />
                  <span>{step.duration}</span>
                </div>
                <h3 className="mt-4 font-grotesk text-4xl font-semibold tracking-[-0.05em] md:text-6xl">{step.title}</h3>
                <p className="mt-4 max-w-xl leading-relaxed text-white/60 md:text-lg">{step.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {step.deliverables.map((d) => (
                    <li key={d} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Process() {
  return (
    <section id="process" className="relative py-24 md:py-40">
      <div className="container-x">
        <SectionLabel index="03" label="Процесс и цифры" className="mb-6" />
        <MaskLines
          lines={['Прозрачный процесс,', <span className="text-white/35">измеримый результат</span>]}
          className="font-grotesk text-[clamp(2.4rem,6.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]"
        />
        <Stats />
        <Steps />
      </div>
    </section>
  );
}
