import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../data/content';
import { useFinePointer } from '../hooks/useMedia';
import MaskLines from '../components/ui/MaskLines';
import SectionLabel from '../components/ui/SectionLabel';
import { ArrowIcon } from '../components/ui/MagneticButton';
import { PREVIEWS } from './ServicePreviews';

function ServiceCard({ service, index }) {
  const Preview = PREVIEWS[service.preview];
  const isHero = service.preview === 'browser';

  return (
    <motion.article
      data-spotlight
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
      className={`spotlight-card group relative rounded-[28px] bg-white/[0.07] p-px ${service.className}`}
    >
      {/* Граница, подсвечиваемая за курсором */}
      <div aria-hidden className="spotlight-border pointer-events-none absolute inset-0 rounded-[inherit]" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-ink-900 p-6 sm:p-8">
        <div aria-hidden className="spotlight-glow pointer-events-none absolute inset-0" />

        <div className="relative flex items-start justify-between">
          <span className="font-mono text-xs text-white/40">({service.index})</span>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/60 transition-all duration-500 ease-expo group-hover:rotate-45 group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className={`relative flex flex-1 items-center ${isHero ? 'py-6 md:py-10' : 'py-6'}`}>
          <Preview />
        </div>

        <div className="relative">
          <h3
            className={`font-grotesk font-semibold tracking-[-0.04em] ${isHero ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}
          >
            {service.title}
          </h3>
          <p className={`mt-3 text-sm leading-relaxed text-white/55 ${isHero ? 'max-w-lg md:text-base' : ''}`}>
            {service.desc}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-white/50">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export default function Services() {
  const gridRef = useRef(null);
  const finePointer = useFinePointer();

  // Один обработчик на всю сетку: координаты курсора пишутся в CSS-переменные каждой карточки,
  // поэтому граница подсвечивается даже у соседних карточек (эффект «фонарика»).
  const onPointerMove = (e) => {
    const cards = gridRef.current.querySelectorAll('[data-spotlight]');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  };

  return (
    <section id="services" className="relative py-24 md:py-40">
      <div className="container-x">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="01" label="Услуги" className="mb-6" />
            <MaskLines
              lines={['Полный цикл —', 'от стратегии до кода']}
              className="font-grotesk text-[clamp(2.4rem,6.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.055em]"
            />
          </div>
          <p className="text-white/55 md:col-span-4 md:text-lg">
            Собираем команду под задачу: дизайнеры, разработчики и аналитики работают в одном ритме и отвечают за
            результат.
          </p>
        </div>

        <div
          ref={gridRef}
          onPointerMove={finePointer ? onPointerMove : undefined}
          className="spotlight-grid grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:auto-rows-[minmax(280px,auto)] lg:grid-cols-6"
        >
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
