import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CASES } from '../data/content';
import { useScrollTo } from '../providers/SmoothScroll';
import MaskLines from '../components/ui/MaskLines';
import SectionLabel from '../components/ui/SectionLabel';
import MagneticButton, { ArrowIcon } from '../components/ui/MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function CaseCard({ item }) {
  return (
    <Link
      to={item.path}
      data-cursor="view"
      data-cursor-label="Смотреть"
      className="case-card group relative block aspect-[4/5] w-full shrink-0 overflow-hidden rounded-[28px] bg-ink-800 sm:aspect-[4/3] md:aspect-auto md:h-[72vh] md:w-[min(56vw,860px)]"
    >
      {/* Обёртка для параллакса (GSAP), изображение — для зума при hover (CSS) */}
      <div data-case-media className="absolute inset-y-0 -left-[8%] w-[116%]">
        <img
          src={item.image}
          alt={`${item.title} — ${item.niche}`}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-110"
          decoding="async"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-700 md:from-black/80 md:via-black/10 md:group-hover:from-black/95 md:group-hover:via-black/50" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 md:p-7">
        <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
          {item.category}
        </span>
        <span className="font-mono text-sm text-white/70">{item.code}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-acid">{item.niche}</p>
        <h3 className="font-grotesk text-[clamp(2rem,4.6vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
          {item.title}
        </h3>

        {/* Описание и теги: на десктопе раскрываются при наведении, на мобильных видны всегда */}
        <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-expo md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="pt-4 transition-all duration-700 ease-expo md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">{item.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Cases() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const scrollTo = useScrollTo();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Горизонтальный скролл только на ≥768px. На мобильных — вертикальная лента (стабильные 60 FPS).
      mm.add('(min-width: 768px)', () => {
        const track = trackRef.current;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(barRef.current, { scaleX: self.progress }),
          },
        });

        // Параллакс изображений внутри карточек, привязанный к горизонтальному движению.
        gsap.utils.toArray('[data-case-media]', track).forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: media.parentElement,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="cases" ref={sectionRef} className="relative py-20 md:flex md:h-screen md:items-center md:overflow-hidden md:py-0">
      <div
        ref={trackRef}
        className="flex flex-col gap-5 px-5 sm:px-8 md:w-max md:flex-row md:items-center md:gap-6 md:px-[6vw] md:will-change-transform"
      >
        {/* Вводная панель */}
        <div className="mb-6 flex shrink-0 flex-col justify-between md:mb-0 md:h-[72vh] md:w-[34vw] md:pr-10">
          <div>
            <SectionLabel index="02" label="Избранные кейсы" className="mb-6" />
            <MaskLines
              lines={['Работы,', 'которые', <span className="font-serif font-normal italic text-acid">говорят</span>]}
              className="font-grotesk text-[clamp(2.6rem,6vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]"
            />
          </div>
          <div className="mt-8 md:mt-0">
            <p className="max-w-sm text-white/55 md:text-lg">
              {CASES.length} интерактивных отраслевых проектов: онлайн-запись, конструкторы, калькуляторы и каталоги.
              Каждый можно открыть и протестировать.
            </p>
            <div className="mt-8 hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40 md:flex">
              <span>Скролл</span>
              <div className="h-px w-40 bg-white/10">
                <div ref={barRef} className="h-full origin-left scale-x-0 bg-acid" />
              </div>
              <span>→</span>
            </div>
          </div>
        </div>

        {CASES.map((item) => (
          <CaseCard key={item.id} item={item} />
        ))}

        {/* Финальная панель-призыв */}
        <div className="flex shrink-0 flex-col items-start justify-center gap-8 rounded-[28px] border border-dashed border-white/15 p-8 md:h-[72vh] md:w-[30vw] md:p-12">
          <p className="font-grotesk text-4xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-6xl">
            Ваш проект — <span className="text-white/40">следующий</span>
          </p>
          <MagneticButton label="Начать проект" icon={<ArrowIcon />} onClick={() => scrollTo('#brief')} />
        </div>
      </div>
    </section>
  );
}
