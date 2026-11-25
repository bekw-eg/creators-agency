import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import {
  BEFORE_AFTER_SCENES,
  RENOVATION_ADDONS,
  RENOVATION_PORTFOLIO,
  RENOVATION_STEPS,
  RENOVATION_TYPES,
} from '../data/renovationData';
import MaskLines from '../home/components/ui/MaskLines';
import Marquee from '../home/components/ui/Marquee';
import { ArrowIcon } from '../home/components/ui/MagneticButton';
import {
  AccentButton,
  AccentLabel,
  EASE,
  ShowcaseHeader,
  ShowcaseShell,
  SpotlightCard,
  SpotlightGrid,
  formatKzt,
} from '../showcase/ShowcaseShell';

function RenovationContent() {
  const [area, setArea] = useState(76);
  const [typeId, setTypeId] = useState('capital');
  const [addonIds, setAddonIds] = useState(['design-project']);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(52);

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadError, setLeadError] = useState('');
  const [leadSent, setLeadSent] = useState(false);

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 60%'] });
  const lineFill = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  const selectedType = RENOVATION_TYPES.find((t) => t.id === typeId) || RENOVATION_TYPES[1];

  const estimate = useMemo(() => {
    const baseCost = area * selectedType.ratePerSqm;
    const baseDays = Math.round(area * selectedType.daysPerSqm);
    let addonsCost = 0;
    let extraDays = 0;
    RENOVATION_ADDONS.forEach((a) => {
      if (addonIds.includes(a.id)) {
        addonsCost += a.fixedPrice + a.pricePerSqm * area;
        extraDays += a.extraDays;
      }
    });
    const total = baseCost + addonsCost;
    return {
      total,
      perSqm: Math.round(total / area),
      days: baseDays + extraDays,
    };
  }, [area, selectedType, addonIds]);

  const toggleAddon = (id) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const scene = BEFORE_AFTER_SCENES[sceneIdx];

  const handleLead = (e) => {
    e.preventDefault();
    if (leadName.trim().length < 2 || leadPhone.trim().length < 7) {
      setLeadError('Укажите имя и телефон — инженер приедет на бесплатный лазерный замер.');
      return;
    }
    setLeadError('');
    setLeadSent(true);
  };

  return (
    <>
      <ShowcaseHeader
        brand="STROY LINE"
        subtitle="Astana · Engineering"
        nav={[
          { label: 'Калькулятор', href: '#calc' },
          { label: 'До / После', href: '#compare' },
          { label: 'Объекты', href: '#portfolio' },
          { label: 'Этапы', href: '#steps' },
        ]}
        ctaLabel="Вызвать инженера"
        ctaHref="#calc"
      />

      {/* Hero */}
      <section id="top" className="relative isolate flex min-h-[95svh] flex-col justify-end overflow-hidden pt-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="/renovation-interior.jpg"
            alt="STROY LINE ASTANA интерьер"
            className="h-full w-full scale-105 object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-[#090B0E]/75 to-[#090B0E]/40" />
          <div aria-hidden className="hero-grid absolute inset-0 opacity-[0.07]" />
          <div className="absolute inset-0 bg-[radial-gradient(50vmax_50vmax_at_80%_20%,rgba(59,130,246,0.2),transparent_65%)]" />
        </div>

        <div className="container-x pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Фиксированная смета в ₸ · Гарантия 3 года
            </span>
            <span>ЖК Астаны · СНиП РК & Технадзор</span>
          </motion.div>

          <MaskLines
            as="h1"
            trigger="mount"
            play
            delay={0.08}
            className="font-grotesk text-[clamp(2.4rem,8vw,8.25rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
            lines={[
              'Инженерный ремонт',
              <>
                с точностью{' '}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-[var(--accent)]">до 1 мм</span>
              </>,
            ]}
          />

          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-white/60 md:col-span-5 md:text-lg">
              Рассчитайте точную стоимость и сроки ремонта в Астане онлайн, сравните реальные объекты «До / После» и
              зафиксируйте цену в договоре.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
              <AccentButton href="#calc">
                <span>Рассчитать смету</span>
                <ArrowIcon className="h-4 w-4" />
              </AccentButton>
              <AccentButton href="#compare" variant="ghost" label="Смотреть До / После" />
            </div>
          </div>
        </div>

        <div className="border-y border-white/10 bg-[#090B0E]/80 py-4 backdrop-blur-md">
          <Marquee
            items={['Лазерный замер 0 ₸', 'Геометрия 90°', 'Rehau & Schneider', 'Теневые профили', 'Еженедельный фотоотчёт']}
            duration={34}
            itemClassName="font-grotesk text-lg font-medium tracking-[-0.02em] text-white/75 md:text-2xl [&_.text-acid]:text-[var(--accent)]"
          />
        </div>
      </section>

      {/* Parametric Calculator */}
      <section id="calc" className="py-24 md:py-36">
        <div className="container-x">
          <AccentLabel index="01" label="Калькулятор сметы" className="mb-5" />
          <MaskLines
            lines={['Параметрический', <span className="text-white/35">расчёт бюджета</span>]}
            className="mb-14 font-grotesk text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
          />

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 rounded-[28px] border border-white/10 bg-[#0F1218] p-6 sm:p-8 lg:col-span-8">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">Площадь квартиры</span>
                  <span className="font-grotesk text-4xl font-semibold text-[var(--accent)] tabular-nums">{area} м²</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  step={2}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#3B82F6]"
                />
                <div className="mt-2 flex justify-between font-mono text-[11px] text-white/40">
                  <span>30 м²</span>
                  <span>115 м²</span>
                  <span>200 м²</span>
                </div>
              </div>

              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-white/50">Класс ремонта</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {RENOVATION_TYPES.map((t) => {
                    const active = t.id === typeId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTypeId(t.id)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent)]/15'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                        }`}
                      >
                        <div className="font-grotesk text-base font-semibold">{t.name}</div>
                        <div className="mt-1 font-mono text-xs text-[var(--accent)]">{formatKzt(t.ratePerSqm)} / м²</div>
                        <p className="mt-2 text-xs leading-relaxed text-white/55">{t.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-white/50">Дополнительные опции</p>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {RENOVATION_ADDONS.map((a) => {
                    const checked = addonIds.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAddon(a.id)}
                        className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                          checked
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                        }`}
                      >
                        <span className="text-xs leading-relaxed text-white/80">{a.label}</span>
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${
                            checked ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-white/25'
                          }`}
                        >
                          {checked && <CheckIcon className="h-3.5 w-3.5" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Estimate Card */}
            <aside className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:col-span-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">Предварительная смета</p>
                <div className="mt-4 font-grotesk text-4xl font-semibold tracking-[-0.04em] tabular-nums">
                  {formatKzt(estimate.total)}
                </div>
                <div className="mt-2 flex gap-4 font-mono text-xs text-white/55">
                  <span>{formatKzt(estimate.perSqm)} / м²</span>
                  <span>·</span>
                  <span>~ {estimate.days} дней</span>
                </div>

                <ul className="mt-6 space-y-2 border-y border-white/10 py-5 text-xs text-white/70">
                  {selectedType.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {leadSent ? (
                <div className="mt-6 rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/15 p-5 text-center">
                  <CheckIcon className="mx-auto h-8 w-8 text-[var(--accent)]" />
                  <p className="mt-2 font-semibold">Заявка на замер принята, {leadName}!</p>
                  <p className="mt-1 text-xs text-white/65">Инженер свяжется по номеру {leadPhone}.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadSent(false);
                      setLeadName('');
                      setLeadPhone('');
                    }}
                    className="mt-4 rounded-full border border-white/20 px-4 py-1.5 text-[11px] text-white/80 hover:border-white"
                  >
                    Новая заявка
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLead} className="mt-6 space-y-3">
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Ваше имя *"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-[var(--accent)]"
                  />
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="Телефон +7 (701) 000-00-00 *"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-[var(--accent)]"
                  />
                  {leadError && <p className="text-xs text-red-400">{leadError}</p>}
                  <button
                    type="submit"
                    className="h-12 w-full rounded-full bg-[var(--accent)] text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-blue-400"
                  >
                    Зафиксировать смету и замер
                  </button>
                </form>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Before / After Interactive Slider */}
      <section id="compare" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <AccentLabel index="02" label="Сравнение До / После" className="mb-5" />
              <MaskLines
                lines={['От бетона', <span className="text-[var(--accent)]">до заселения</span>]}
                className="font-grotesk text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {BEFORE_AFTER_SCENES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSceneIdx(idx)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    sceneIdx === idx
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                      : 'border-white/15 text-white/60 hover:text-white'
                  }`}
                >
                  Объект 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0F1218]">
            <div className="relative aspect-[16/9] w-full select-none overflow-hidden">
              <img src={scene.afterImage} alt={scene.afterLabel} className="h-full w-full object-cover" />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img src={scene.beforeImage} alt={scene.beforeLabel} className="h-full w-full object-cover" />
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--accent)] shadow-[0_0_20px_rgba(59,130,246,0.9)]"
                style={{ left: `${sliderPos}%` }}
              >
                <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[var(--accent)] font-mono text-xs font-bold text-white shadow-xl">
                  ⇄
                </span>
              </div>

              <input
                type="range"
                min={5}
                max={95}
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                aria-label="Сравнить До и После"
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />

              <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md">
                {scene.beforeLabel}
              </span>
              <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-[var(--accent)]/60 bg-black/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-md">
                {scene.afterLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 p-6 text-sm">
              <div className="font-grotesk text-lg font-semibold">{scene.title}</div>
              <div className="flex flex-wrap gap-4 font-mono text-xs text-white/60">
                <span>{scene.duration}</span>
                <span className="text-[var(--accent)]">{scene.budget}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="border-t border-white/10 py-24">
        <div className="container-x">
          <AccentLabel index="03" label="Сданные ЖК Астаны" className="mb-8" />
          <SpotlightGrid className="grid gap-4 md:grid-cols-3">
            {RENOVATION_PORTFOLIO.map((obj) => (
              <SpotlightCard key={obj.id} innerClassName="flex flex-col">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={obj.image}
                    alt={obj.complex}
                    className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex justify-between font-mono text-[11px] text-[var(--accent)]">
                      <span>{obj.area}</span>
                      <span>{obj.days}</span>
                    </div>
                    <h3 className="mt-2 font-grotesk text-xl font-semibold">{obj.complex}</h3>
                    <p className="mt-1 text-xs text-white/55">{obj.type}</p>
                    <ul className="mt-4 space-y-1.5 text-xs text-white/70">
                      {obj.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5">
                          <CheckIcon className="h-3.5 w-3.5 text-[var(--accent)]" /> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 border-t border-white/10 pt-4 font-grotesk text-lg font-semibold tabular-nums">
                    {obj.cost}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      {/* Scroll Progress Steps */}
      <section id="steps" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x max-w-4xl">
          <AccentLabel index="04" label="Этапы реализации" className="mb-10" />
          <ol ref={timelineRef} className="relative">
            <div aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-white/10">
              <motion.div
                style={{ scaleY: lineFill }}
                className="h-full w-full origin-top bg-[var(--accent)] shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              />
            </div>
            {RENOVATION_STEPS.map((st) => (
              <li key={st.step} className="relative pb-12 pl-12 last:pb-0">
                <span className="absolute left-0 top-1.5 grid h-6 w-6 place-items-center rounded-full border border-[var(--accent)] bg-[#090B0E]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
                <span className="font-mono text-xs text-[var(--accent)]">Этап {st.step}</span>
                <h3 className="mt-1 font-grotesk text-2xl font-semibold tracking-tight">{st.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{st.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="container-x flex flex-col items-start justify-between gap-4 text-xs text-white/45 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em]">
            <MapPinIcon className="h-4 w-4 text-[var(--accent)]" />
            <span>STROY LINE ASTANA · Договор и технадзор</span>
          </div>
          <span className="font-mono">Гарантия на все работы — 36 месяцев</span>
        </div>
      </footer>
    </>
  );
}

export default function RenovationPage() {
  return (
    <ShowcaseShell title="STROY LINE ASTANA — Инженерный ремонт квартир" accent="#3B82F6" bg="#090B0E">
      <RenovationContent />
    </ShowcaseShell>
  );
}
