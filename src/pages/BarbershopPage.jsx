import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  BARBER_MASTERS,
  BARBER_REVIEWS,
  BARBER_SERVICES,
  BARBER_TIME_SLOTS,
} from '../data/barbershopData';
import MaskLines from '../home/components/ui/MaskLines';
import Marquee from '../home/components/ui/Marquee';
import { ArrowIcon } from '../home/components/ui/MagneticButton';
import { useScrollTo } from '../home/providers/SmoothScroll';
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

const CATEGORIES = ['Все', 'Стрижки', 'Борода', 'Комплексы'];

// Реалистичные занятые слоты по мастерам (чтобы расписание выглядело живым)
const BUSY_SLOTS = {
  'm-1': ['11:30', '16:00'],
  'm-2': ['13:00', '19:00'],
  'm-3': ['10:00', '14:30'],
  'm-4': ['16:00', '20:30'],
};

// Правила совместимости услуг: нельзя выбрать 2 стрижки или комплекс + дублирующую стрижку/бороду
const HAIRCUT_IDS = ['srv-1', 'srv-2', 'srv-3', 'srv-4'];
const BEARD_MAIN_IDS = ['srv-5', 'srv-6'];
const COMPLEX_IDS = ['srv-8', 'srv-9', 'srv-10'];

function applyServiceSelection(prevIds, id) {
  if (prevIds.includes(id)) {
    return { ids: prevIds.filter((x) => x !== id), notice: '' };
  }

  let next = [...prevIds];
  let notice = '';

  if (COMPLEX_IDS.includes(id)) {
    // Комплекс заменяет другой комплекс и входящие в него отдельные услуги
    const removeSet = new Set(COMPLEX_IDS);
    HAIRCUT_IDS.forEach((h) => removeSet.add(h));
    if (id === 'srv-8' || id === 'srv-10') {
      BEARD_MAIN_IDS.forEach((b) => removeSet.add(b));
    }
    const hadConflict = next.some((x) => removeSet.has(x));
    next = next.filter((x) => !removeSet.has(x));
    if (hadConflict) {
      notice = 'Комплекс уже включает базовые услуги — дублирующие позиции заменены автоматически.';
    }
  } else if (HAIRCUT_IDS.includes(id)) {
    const removeSet = new Set([...HAIRCUT_IDS, ...COMPLEX_IDS]);
    const hadConflict = next.some((x) => removeSet.has(x));
    next = next.filter((x) => !removeSet.has(x));
    if (hadConflict) {
      notice = 'В один визит можно выбрать одну стрижку — предыдущий вариант заменён.';
    }
  } else if (id === 'srv-6') {
    // Королевское бритьё несовместимо с моделированием, камуфляжем бороды и комплексами с бородой
    const removeSet = new Set(['srv-5', 'srv-7', 'srv-8', 'srv-10']);
    const hadConflict = next.some((x) => removeSet.has(x));
    next = next.filter((x) => !removeSet.has(x));
    if (hadConflict) {
      notice = 'Королевское бритьё заменило несовместимые услуги по уходу за бородой.';
    }
  } else if (id === 'srv-5') {
    const removeSet = new Set(['srv-6', 'srv-8', 'srv-10']);
    const hadConflict = next.some((x) => removeSet.has(x));
    next = next.filter((x) => !removeSet.has(x));
    if (hadConflict) {
      notice = 'Моделирование бороды заменило конфликтующую услугу или комплекс.';
    }
  } else if (id === 'srv-7') {
    // Камуфляж седины бороды несовместим с полным бритьём
    if (next.includes('srv-6')) {
      next = next.filter((x) => x !== 'srv-6');
      notice = 'Камуфляж бороды несовместим с королевским бритьём — бритьё снято.';
    }
  }

  return { ids: [...next, id], notice };
}

const DATES = (() => {
  const days = [];
  const fmtDay = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });
  const fmtDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      id: d.toISOString().slice(0, 10),
      weekday: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : fmtDay.format(d),
      label: fmtDate.format(d),
    });
  }
  return days;
})();

function BarbershopContent() {
  const scrollTo = useScrollTo();

  const [category, setCategory] = useState('Все');
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState(['srv-1']);
  const [selectionNotice, setSelectionNotice] = useState('');
  const [masterId, setMasterId] = useState(BARBER_MASTERS[0].id);
  const [dateId, setDateId] = useState(DATES[0].id);
  const [timeSlot, setTimeSlot] = useState('17:30');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const filteredServices = useMemo(
    () => (category === 'Все' ? BARBER_SERVICES : BARBER_SERVICES.filter((s) => s.category === category)),
    [category]
  );

  const selectedServices = useMemo(
    () => BARBER_SERVICES.filter((s) => selectedIds.includes(s.id)),
    [selectedIds]
  );

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const selectedMaster = BARBER_MASTERS.find((m) => m.id === masterId) || BARBER_MASTERS[0];
  const selectedDate = DATES.find((d) => d.id === dateId) || DATES[0];

  const busySlots = BUSY_SLOTS[masterId] || [];

  const toggleService = (id) => {
    setSelectedIds((prev) => {
      const { ids, notice } = applyServiceSelection(prev, id);
      setSelectionNotice(notice);
      return ids;
    });
  };

  const selectMaster = (id) => {
    setMasterId(id);
    const busy = BUSY_SLOTS[id] || [];
    if (busy.includes(timeSlot)) {
      const firstFree = BARBER_TIME_SLOTS.find((s) => !busy.includes(s));
      if (firstFree) setTimeSlot(firstFree);
    }
  };

  const quickBookMaster = (id) => {
    selectMaster(id);
    setConfirmed(false);
    setStep(selectedIds.length ? 3 : 1);
    scrollTo('#booking');
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (clientName.trim().length < 2 || clientPhone.trim().length < 7) {
      setError('Укажите имя и номер телефона для подтверждения записи.');
      return;
    }
    setError('');
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setConfirmed(true);
  };

  return (
    <>
      <ShowcaseHeader
        brand="BLADE & CRAFT"
        subtitle="Astana · Grooming Club"
        nav={[
          { label: 'Услуги', href: '#services' },
          { label: 'Мастера', href: '#masters' },
          { label: 'Онлайн-запись', href: '#booking' },
          { label: 'Отзывы', href: '#reviews' },
        ]}
        ctaLabel="Записаться"
        ctaHref="#booking"
      />

      {/* Hero */}
      <section id="top" className="relative isolate flex min-h-[95svh] flex-col justify-end overflow-hidden pt-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1800&q=85"
            alt="BLADE & CRAFT интерьер барбершопа"
            className="h-full w-full scale-105 object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/75 to-[#0A0A0C]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(50vmax_50vmax_at_80%_20%,rgba(212,175,106,0.16),transparent_65%)]" />
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
              Открыты сегодня · 10:00 — 22:00
            </span>
            <span>Астана · Левый берег, пр. Мангилик Ел, 38</span>
          </motion.div>

          <MaskLines
            as="h1"
            trigger="mount"
            play
            delay={0.08}
            className="font-grotesk text-[clamp(2.6rem,8.5vw,8.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
            lines={[
              'Мужской клуб',
              <>
                точной{' '}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-[var(--accent)]">
                  геометрии
                </span>
              </>,
            ]}
          />

          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
              className="max-w-md text-base leading-relaxed text-white/60 md:col-span-5 md:text-lg"
            >
              Архитектурные мужские стрижки, королевское бритьё опасной бритвой и спешелти-эспрессо в спокойной
              атмосфере закрытого клуба.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
              className="flex flex-wrap gap-3 md:col-span-7 md:justify-end"
            >
              <AccentButton href="#booking">
                <span>Записаться онлайн</span>
                <ArrowIcon className="h-4 w-4" />
              </AccentButton>
              <AccentButton href="#services" variant="ghost" label="Прайс-лист (10)" />
            </motion.div>
          </div>
        </div>

        <div className="border-y border-white/10 bg-[#0A0A0C]/80 py-4 backdrop-blur-md">
          <Marquee
            items={['Signature Cut', 'Skin Fade', 'Royal Shave', 'Hot Towel Ritual', 'Black Mask', 'Lock Stock & Barrel']}
            duration={34}
            itemClassName="font-grotesk text-lg font-medium tracking-[-0.02em] text-white/75 md:text-2xl [&_.text-acid]:text-[var(--accent)]"
          />
        </div>
      </section>

      {/* Services Price List */}
      <section id="services" className="py-24 md:py-36">
        <div className="container-x">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <AccentLabel index="01" label="Прайс-лист" className="mb-5" />
              <MaskLines
                lines={['Услуги и ритуалы', <span className="text-white/35">ухода</span>]}
                className="font-grotesk text-[clamp(2.2rem,5.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition ${
                    category === cat
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0C]'
                      : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <SpotlightGrid className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4">
            {filteredServices.map((srv) => {
              const chosen = selectedIds.includes(srv.id);
              return (
                <SpotlightCard key={srv.id} innerClassName="p-6 sm:p-7 flex flex-col justify-between gap-5">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                          <span>{srv.category}</span>
                          {srv.popular && (
                            <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 text-[var(--accent)]">
                              Популярно
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 font-grotesk text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                          {srv.name}
                        </h3>
                      </div>
                      <span className="shrink-0 font-grotesk text-xl font-semibold text-[var(--accent)] tabular-nums sm:text-2xl">
                        {formatKzt(srv.price)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{srv.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-white/45">
                      <ClockIcon className="h-4 w-4 text-[var(--accent)]" />
                      {srv.duration} мин
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleService(srv.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
                        chosen
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0C]'
                          : 'border-white/15 text-white/80 hover:border-[var(--accent)] hover:text-[var(--accent)]'
                      }`}
                    >
                      {chosen ? (
                        <>
                          <CheckIcon className="h-3.5 w-3.5" /> В записи
                        </>
                      ) : (
                        '+ Выбрать'
                      )}
                    </button>
                  </div>
                </SpotlightCard>
              );
            })}
          </SpotlightGrid>
        </div>
      </section>

      {/* Masters */}
      <section id="masters" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x">
          <AccentLabel index="02" label="Команда" className="mb-5" />
          <MaskLines
            lines={['Мастера клуба']}
            className="mb-14 font-grotesk text-[clamp(2.2rem,5.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
          />

          <SpotlightGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BARBER_MASTERS.map((m) => (
              <SpotlightCard key={m.id} innerClassName="flex flex-col">
                <div className="relative aspect-[4/4] overflow-hidden bg-white/5">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-xs backdrop-blur-md">
                    <StarIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
                    {m.rating}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
                      {m.role} · {m.experience}
                    </p>
                    <h3 className="mt-2 font-grotesk text-xl font-semibold tracking-[-0.03em]">{m.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/55">{m.specialty}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => quickBookMaster(m.id)}
                    className="mt-6 w-full rounded-full border border-white/15 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0A0A0C]"
                  >
                    Записаться к мастеру
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      {/* 4-Step Interactive Online Booking */}
      <section id="booking" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x">
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <AccentLabel index="03" label="Онлайн-запись" className="mb-5" />
              <MaskLines
                lines={['Забронируйте кресло', <span className="text-[var(--accent)]">за 60 секунд</span>]}
                className="font-grotesk text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              />
            </div>
            <div className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end">
              {[
                { n: 1, label: 'Услуги' },
                { n: 2, label: 'Мастер' },
                { n: 3, label: 'Время' },
                { n: 4, label: 'Контакт' },
              ].map((s) => (
                <button
                  key={s.n}
                  type="button"
                  disabled={s.n > 1 && !selectedIds.length}
                  onClick={() => !confirmed && setStep(s.n)}
                  className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition disabled:cursor-not-allowed disabled:opacity-35 ${
                    step === s.n
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0C]'
                      : step > s.n
                        ? 'border-[var(--accent)]/40 text-[var(--accent)]'
                        : 'border-white/15 text-white/40'
                  }`}
                >
                  0{s.n} · {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="rounded-[28px] border border-white/10 bg-[#101014] p-6 sm:p-8 lg:col-span-8">
              <AnimatePresence mode="wait">
                {confirmed ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center"
                  >
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--accent)] text-[#0A0A0C]">
                      <CheckIcon className="h-8 w-8" />
                    </span>
                    <h3 className="mt-6 font-grotesk text-3xl font-semibold tracking-tight">
                      Запись подтверждена, {clientName}!
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
                      Ждём вас {selectedDate.weekday.toLowerCase()} ({selectedDate.label}) в {timeSlot} у мастера{' '}
                      <span className="text-white">{selectedMaster.name}</span>. SMS-напоминание придёт на{' '}
                      {clientPhone}.
                    </p>
                    <div className="mt-8">
                      <AccentButton
                        variant="ghost"
                        label="Создать ещё одну запись"
                        onClick={() => {
                          setConfirmed(false);
                          setStep(1);
                          setClientName('');
                          setClientPhone('');
                        }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {step === 1 && (
                      <div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                            Шаг 01 — Выберите стрижку, уход за бородой или готовый комплекс
                          </p>
                          <span className="font-mono text-[11px] text-white/40">
                            Совместимые услуги подбираются автоматически
                          </span>
                        </div>
                        {selectionNotice && (
                          <div className="mb-4 rounded-xl border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2.5 text-xs text-[var(--accent)]">
                            {selectionNotice}
                          </div>
                        )}
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {BARBER_SERVICES.map((srv) => {
                            const active = selectedIds.includes(srv.id);
                            return (
                              <button
                                key={srv.id}
                                type="button"
                                onClick={() => toggleService(srv.id)}
                                className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                                  active
                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium">{srv.name}</div>
                                  <div className="mt-0.5 font-mono text-[11px] text-white/45">
                                    {srv.duration} мин · {formatKzt(srv.price)}
                                  </div>
                                </div>
                                <span
                                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                                    active ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0C]' : 'border-white/20'
                                  }`}
                                >
                                  {active && <CheckIcon className="h-3.5 w-3.5" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-8 flex justify-end">
                          <AccentButton
                            label="Далее: выбрать мастера →"
                            disabled={!selectedIds.length}
                            onClick={() => setStep(2)}
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                          Шаг 02 — Выберите барбера
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {BARBER_MASTERS.map((m) => {
                            const active = m.id === masterId;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => selectMaster(m.id)}
                                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                                  active
                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                                }`}
                              >
                                <img src={m.avatar} alt={m.name} className="h-14 w-14 rounded-full object-cover" />
                                <div>
                                  <div className="font-semibold">{m.name}</div>
                                  <div className="text-xs text-white/50">{m.role}</div>
                                  <div className="mt-1 font-mono text-[11px] text-[var(--accent)]">★ {m.rating}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-8 flex justify-between gap-3">
                          <AccentButton variant="ghost" label="← Назад" onClick={() => setStep(1)} />
                          <AccentButton label="Далее: дата и время →" onClick={() => setStep(3)} />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                          Шаг 03 — Дата и свободный слот
                        </p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                          {DATES.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setDateId(d.id)}
                              className={`rounded-2xl border px-3 py-3 text-center transition ${
                                dateId === d.id
                                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0C]'
                                  : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30'
                              }`}
                            >
                              <div className="text-[10px] uppercase">{d.weekday}</div>
                              <div className="mt-1 font-grotesk text-sm font-semibold">{d.label}</div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {BARBER_TIME_SLOTS.map((slot) => {
                            const isBusy = busySlots.includes(slot);
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isBusy}
                                onClick={() => setTimeSlot(slot)}
                                className={`rounded-xl border py-3 font-mono text-sm transition ${
                                  isBusy
                                    ? 'cursor-not-allowed border-white/5 bg-white/[0.01] text-white/25 line-through'
                                    : timeSlot === slot
                                      ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[#0A0A0C]'
                                      : 'border-white/10 bg-white/[0.02] text-white/75 hover:border-white/30'
                                }`}
                              >
                                {slot}
                                {isBusy && <span className="ml-1.5 text-[10px] no-underline">занято</span>}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-8 flex justify-between gap-3">
                          <AccentButton variant="ghost" label="← Назад" onClick={() => setStep(2)} />
                          <AccentButton label="Далее: контакты →" onClick={() => setStep(4)} />
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <form onSubmit={handleConfirm} className="space-y-6">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                          Шаг 04 — Ваши контакты
                        </p>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                              Ваше имя *
                            </label>
                            <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Тимур"
                              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--accent)]"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                              Телефон *
                            </label>
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="+7 (701) 000-00-00"
                              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none focus:border-[var(--accent)]"
                            />
                          </div>
                        </div>
                        {error && <p className="text-xs text-red-400">{error}</p>}
                        <div className="flex flex-wrap justify-between gap-3 pt-2">
                          <AccentButton variant="ghost" label="← Назад" onClick={() => setStep(3)} />
                          <AccentButton
                            type="submit"
                            disabled={submitting}
                            label={submitting ? 'Подтверждаем…' : 'Подтвердить запись'}
                          />
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Booking Summary */}
            <aside className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 lg:col-span-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                  <SparklesIcon className="h-4 w-4" />
                  <span>Ваш визит</span>
                </div>
                <div className="mt-6 space-y-3 border-b border-white/10 pb-5 text-sm">
                  {selectedServices.length ? (
                    selectedServices.map((s) => (
                      <div key={s.id} className="flex justify-between gap-3">
                        <span className="text-white/80">{s.name}</span>
                        <span className="shrink-0 font-mono text-white/60">{formatKzt(s.price)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40">Выберите хотя бы одну услугу</p>
                  )}
                </div>
                <dl className="mt-5 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-white/45">Мастер</dt>
                    <dd className="font-medium">{selectedMaster.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-white/45">Дата и время</dt>
                    <dd className="font-mono">
                      {selectedDate.label}, {timeSlot}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-white/45">Длительность</dt>
                    <dd className="font-mono">{totalDuration} мин</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">Итого</span>
                  <span className="font-grotesk text-3xl font-semibold text-[var(--accent)] tabular-nums">
                    {formatKzt(totalPrice)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Reviews & Footer */}
      <section id="reviews" className="border-t border-white/10 py-24">
        <div className="container-x">
          <AccentLabel index="04" label="Отзывы" className="mb-5" />
          <div className="grid gap-4 md:grid-cols-3">
            {BARBER_REVIEWS.map((r) => (
              <div key={r.id} className="rounded-[24px] border border-white/10 bg-[#101014] p-6">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.author} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{r.author}</div>
                    <div className="font-mono text-[11px] text-white/45">
                      {r.date} · {r.master}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/65">«{r.text}»</p>
                <div className="mt-4 font-mono text-[11px] text-[var(--accent)]">{r.service}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="container-x flex flex-col items-start justify-between gap-4 text-xs text-white/45 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em]">
            <MapPinIcon className="h-4 w-4 text-[var(--accent)]" />
            <span>BLADE & CRAFT · Астана, пр. Мангилик Ел, 38</span>
          </div>
          <span className="font-mono">Ежедневно 10:00 – 22:00</span>
        </div>
      </footer>
    </>
  );
}

export default function BarbershopPage() {
  return (
    <ShowcaseShell title="BLADE & CRAFT — Мужской барбершоп в Астане" accent="#D4AF6A" bg="#0A0A0C">
      <BarbershopContent />
    </ShowcaseShell>
  );
}
