import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { STEPS } from '../data/content';
import MaskLines from '../components/ui/MaskLines';
import SectionLabel from '../components/ui/SectionLabel';

const EASE = [0.16, 1, 0.3, 1];

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
    <div className="mt-16 grid gap-12 border-t border-white/10 pt-16 md:mt-24 md:pt-24 lg:grid-cols-12">
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
        <SectionLabel index="03" label="Процесс работы" className="mb-6" />
        <MaskLines
          lines={['Прозрачный процесс,', <span className="text-white/35">предсказуемый результат</span>]}
          className="font-grotesk text-[clamp(2.4rem,6.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]"
        />
        <Steps />
      </div>
    </section>
  );
}
