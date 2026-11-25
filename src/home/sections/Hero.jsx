import { Suspense, lazy, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { MARQUEE } from '../data/content';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMedia';
import { useScrollTo } from '../providers/SmoothScroll';
import MaskLines from '../components/ui/MaskLines';
import Marquee from '../components/ui/Marquee';
import MagneticButton, { ArrowIcon } from '../components/ui/MagneticButton';

// Three.js грузится отдельным чанком — первый экран рендерится мгновенно.
const HeroScene = lazy(() => import('./HeroScene'));

const EASE = [0.16, 1, 0.3, 1];

export default function Hero({ ready }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const inView = useInView(ref);
  const scrollTo = useScrollTo();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });

  return (
    <section ref={ref} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24">
      {/* Фоновые свечения на градиентах (без blur-фильтров — дешево для GPU) */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 -z-20" />
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 -z-20 opacity-[0.06]" />

      <motion.div
        style={{ scale: sceneScale, opacity: sceneOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0 -z-10"
      >
        {!reducedMotion && (
          <Suspense fallback={null}>
            <HeroScene active={inView} mobile={isMobile} />
          </Suspense>
        )}
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent md:h-1/2" />

      <motion.div style={{ y: contentY }} className="container-x relative flex flex-1 flex-col justify-end pb-10 md:pb-14">
        <motion.div
          {...fadeUp(0.1)}
          className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50 md:mb-10"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
            </span>
            Принимаем проекты на 2027
          </span>
          <span className="hidden sm:inline">Digital-агентство · Астана → Worldwide</span>
        </motion.div>

        <MaskLines
          as="h1"
          trigger="mount"
          play={ready}
          delay={0.15}
          className="font-grotesk text-[clamp(2.6rem,8.4vw,9.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
          lines={[
            'Создаём',
            <span className="md:pl-[10vw]">цифровые продукты</span>,
            <>
              с <span className="font-serif font-normal italic tracking-[-0.03em] text-acid">характером</span>
              <sup className="ml-1 align-super font-mono text-[0.18em] font-normal tracking-normal text-white/50">®</sup>
            </>,
          ]}
        />

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
          <motion.p {...fadeUp(0.55)} className="max-w-md text-base leading-relaxed text-white/60 md:col-span-5 md:text-lg">
            Сайты, сервисы и бренды, которые выглядят дорого, работают быстро и приносят заявки. От идеи до цифрового
            результата.
          </motion.p>
          <motion.div {...fadeUp(0.7)} className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
            <MagneticButton
              label="Обсудить проект"
              icon={<ArrowIcon />}
              onClick={() => scrollTo('#brief')}
            />
            <MagneticButton variant="ghost" label="Смотреть кейсы" onClick={() => scrollTo('#cases')} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative border-y border-white/10 bg-ink/85 py-4 md:bg-ink/40 md:py-5 md:backdrop-blur-md"
      >
        <Marquee
          items={MARQUEE}
          duration={36}
          itemClassName="font-grotesk text-xl font-medium tracking-[-0.03em] text-white/80 md:text-3xl"
        />
      </motion.div>
    </section>
  );
}
