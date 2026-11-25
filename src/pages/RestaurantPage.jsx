import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  FireIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { RESTAURANT_HALLS, RESTAURANT_MENU } from '../data/restaurantData';
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

const COURSES = ['Все', 'Закуски', 'Горячее', 'Гриль', 'Десерты', 'Напитки'];
const TAGS = ['Все теги', 'Хит', 'Шеф рекомендует', 'Острое', 'Новинка'];
const RESERVE_DATES = (() => {
  const res = [];
  const fmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    res.push({ id: d.toISOString().slice(0, 10), label: i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : fmt.format(d) });
  }
  return res;
})();

function RestaurantContent() {
  const scrollTo = useScrollTo();

  const [course, setCourse] = useState('Все');
  const [tag, setTag] = useState('Все теги');
  const [query, setQuery] = useState('');
  const [preOrder, setPreOrder] = useState([]);

  const [hallId, setHallId] = useState(RESTAURANT_HALLS[0].id);
  const [dateId, setDateId] = useState(RESERVE_DATES[0].id);
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState('20:00');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reserved, setReserved] = useState(false);

  const filteredDishes = useMemo(() => {
    return RESTAURANT_MENU.filter((dish) => {
      if (course !== 'Все' && dish.category !== course) return false;
      if (tag !== 'Все теги' && !dish.tags.includes(tag)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return dish.name.toLowerCase().includes(q) || dish.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [course, tag, query]);

  const toggleDish = (dish) => {
    setPreOrder((prev) => {
      const exists = prev.find((i) => i.dish.id === dish.id);
      if (exists) return prev.filter((i) => i.dish.id !== dish.id);
      return [...prev, { dish, qty: 1 }];
    });
  };

  const updateDishQty = (id, delta) => {
    setPreOrder((prev) =>
      prev
        .map((entry) => (entry.dish.id === id ? { ...entry, qty: Math.min(10, entry.qty + delta) } : entry))
        .filter((entry) => entry.qty > 0)
    );
  };

  const preOrderTotal = preOrder.reduce((acc, e) => acc + e.dish.price * e.qty, 0);
  const preOrderCount = preOrder.reduce((acc, e) => acc + e.qty, 0);
  const selectedHall = RESTAURANT_HALLS.find((h) => h.id === hallId) || RESTAURANT_HALLS[0];
  const selectedDate = RESERVE_DATES.find((d) => d.id === dateId) || RESERVE_DATES[0];

  const handleReserve = async (e) => {
    e.preventDefault();
    if (guestName.trim().length < 2 || guestPhone.trim().length < 7) {
      setError('Пожалуйста, укажите ваше имя и телефон для подтверждения брони.');
      return;
    }
    setError('');
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setReserved(true);
  };

  return (
    <>
      <ShowcaseHeader
        brand="TERRA & FIRE"
        subtitle="Open Fire Gastronomy"
        nav={[
          { label: 'Меню', href: '#menu' },
          { label: 'Залы', href: '#halls' },
          { label: 'Резерв стола', href: '#reserve' },
        ]}
        ctaLabel={preOrderCount ? `Бронь · ${preOrderCount} блюд` : 'Забронировать стол'}
        ctaHref="#reserve"
      />

      {/* Hero */}
      <section id="top" className="relative isolate flex min-h-[95svh] flex-col justify-end overflow-hidden pt-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
            alt="TERRA & FIRE ресторан"
            className="h-full w-full scale-105 object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-[#0B0908]/70 to-[#0B0908]/35" />
          <div className="absolute inset-0 bg-[radial-gradient(50vmax_50vmax_at_80%_25%,rgba(224,90,58,0.18),transparent_65%)]" />
        </div>

        <div className="container-x pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60"
          >
            <span className="flex items-center gap-2">
              <FireIcon className="h-4 w-4 text-[var(--accent)]" />
              Испанский хоспер · Дровяная печь
            </span>
            <span>Бульвар Нуржол · Астана</span>
          </motion.div>

          <MaskLines
            as="h1"
            trigger="mount"
            play
            delay={0.08}
            className="font-grotesk text-[clamp(2.6rem,8.5vw,8.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
            lines={[
              'Гастрономия',
              <>
                живого{' '}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-[var(--accent)]">огня</span>
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
              Выдержанные стейки Prime, фермерские продукты Казахстана, винная карта на 180 позиций и открытая кухня в
              сердце Левого берега.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
              className="flex flex-wrap gap-3 md:col-span-7 md:justify-end"
            >
              <AccentButton href="#reserve">
                <span>Забронировать стол</span>
                <ArrowIcon className="h-4 w-4" />
              </AccentButton>
              <AccentButton href="#menu" variant="ghost" label="Смотреть меню" />
            </motion.div>
          </div>
        </div>

        <div className="border-y border-white/10 bg-[#0B0908]/80 py-4 backdrop-blur-md">
          <Marquee
            items={['Dry-Aged Prime', 'Wood Oven', 'Chef Tasting Set', 'Sommelier Selection', 'VIP Fireplace Hall']}
            duration={34}
            itemClassName="font-grotesk text-lg font-medium tracking-[-0.02em] text-white/75 md:text-2xl [&_.text-acid]:text-[var(--accent)]"
          />
        </div>
      </section>

      {/* Interactive Menu */}
      <section id="menu" className="py-24 md:py-36">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <AccentLabel index="01" label="Авторское меню" className="mb-5" />
              <MaskLines
                lines={['Вкус огня', <span className="text-white/35">и сезонности</span>]}
                className="font-grotesk text-[clamp(2.2rem,5.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              />
            </div>

            <div className="relative w-full max-w-sm">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по блюдам и ингредиентам..."
                className="w-full rounded-full border border-white/15 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {COURSES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCourse(c)}
                className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition ${
                  course === c
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0B0908]'
                    : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition ${
                  tag === t ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>

          <SpotlightGrid className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => {
              const inSet = preOrder.some((e) => e.dish.id === dish.id);
              return (
                <SpotlightCard key={dish.id} innerClassName="flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-black/20" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                      {dish.tags.map((tg) => (
                        <span
                          key={tg}
                          className="rounded-full border border-white/15 bg-black/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur-md"
                        >
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[11px] text-white/45">
                        <span>{dish.category}</span>
                        <span>{dish.weight}</span>
                      </div>
                      <h3 className="mt-2 font-grotesk text-xl font-semibold leading-snug tracking-[-0.02em]">
                        {dish.name}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-white/55">{dish.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="font-grotesk text-xl font-semibold text-[var(--accent)] tabular-nums">
                        {formatKzt(dish.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleDish(dish)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
                          inSet
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0B0908]'
                            : 'border-white/15 text-white/80 hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        }`}
                      >
                        {inSet ? (
                          <>
                            <CheckIcon className="h-3.5 w-3.5" /> В сете
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-3.5 w-3.5" /> К столу
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </SpotlightGrid>
        </div>
      </section>

      {/* Halls */}
      <section id="halls" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x">
          <AccentLabel index="02" label="Пространство" className="mb-5" />
          <MaskLines
            lines={['Три зала для', <span className="text-[var(--accent)]">вашего вечера</span>]}
            className="mb-14 font-grotesk text-[clamp(2.2rem,5.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
          />
          <SpotlightGrid className="grid gap-4 lg:grid-cols-3">
            {RESTAURANT_HALLS.map((h) => (
              <SpotlightCard key={h.id} innerClassName="flex flex-col">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={h.image}
                    alt={h.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 font-mono text-[11px] backdrop-blur-md">
                    {h.capacity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-grotesk text-2xl font-semibold tracking-tight">{h.name}</h3>
                    <p className="mt-1 font-mono text-xs text-[var(--accent)]">{h.atmosphere}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{h.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHallId(h.id);
                      setReserved(false);
                      scrollTo('#reserve');
                    }}
                    className="mt-6 w-full rounded-full border border-white/15 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0B0908]"
                  >
                    Выбрать этот зал
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      {/* Reservation */}
      <section id="reserve" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <AccentLabel index="03" label="Резерв стола" className="mb-5" />
            <MaskLines
              lines={['Забронируйте', <span className="text-[var(--accent)]">вечер</span>]}
              className="font-grotesk text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Можно предварительно выбрать блюда из меню выше — мы подадим закуски и вино точно к вашему приходу.
            </p>

            {preOrder.length > 0 && (
              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  <span>Предварительный сет ({preOrderCount})</span>
                  <span>{formatKzt(preOrderTotal)}</span>
                </div>
                <ul className="space-y-2.5 text-xs">
                  {preOrder.map(({ dish, qty }) => (
                    <li key={dish.id} className="flex items-center justify-between gap-2 text-white/75">
                      <span className="truncate">{dish.name}</span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateDishQty(dish.id, -1)}
                          className="grid h-6 w-6 place-items-center rounded-full border border-white/15"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-mono">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateDishQty(dish.id, 1)}
                          className="grid h-6 w-6 place-items-center rounded-full border border-white/15"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleDish(dish)}
                          className="ml-1 text-white/40 hover:text-red-400"
                          aria-label="Удалить блюдо"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#101014] p-6 sm:p-8 lg:col-span-7">
            {reserved ? (
              <div className="py-10 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--accent)] text-[#0B0908]">
                  <CheckIcon className="h-8 w-8" />
                </span>
                <h3 className="mt-6 font-grotesk text-3xl font-semibold">Стол забронирован, {guestName}!</h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
                  {selectedHall.name} · {selectedDate.label} в {time} · {guests} гостей. Хостес подтвердит бронь по
                  номеру {guestPhone}.
                </p>
                <div className="mt-8">
                  <AccentButton variant="ghost" label="Изменить бронь" onClick={() => setReserved(false)} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="space-y-6">
                <div>
                  <label className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    Зал
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {RESTAURANT_HALLS.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHallId(h.id)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                          hallId === h.id
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0B0908]'
                            : 'border-white/15 text-white/70 hover:border-white/35'
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    Дата
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {RESERVE_DATES.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDateId(d.id)}
                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                          dateId === d.id
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0B0908]'
                            : 'border-white/15 text-white/70 hover:border-white/35'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                      Количество гостей
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 4, 6, 8, 12].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGuests(g)}
                          className={`h-10 w-10 rounded-full border font-mono text-xs transition ${
                            guests === g
                              ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[#0B0908]'
                              : 'border-white/15 text-white/70'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                      Время
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['18:30', '19:30', '20:00', '21:00'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`rounded-full border px-3.5 py-2 font-mono text-xs transition ${
                            time === t
                              ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[#0B0908]'
                              : 'border-white/15 text-white/70'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ваше имя *"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-[var(--accent)]"
                  />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Телефон +7 (701) 000-00-00 *"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <AccentButton
                  type="submit"
                  disabled={submitting}
                  label={submitting ? 'Бронируем…' : 'Подтвердить резерв'}
                  className="w-full sm:w-auto"
                />
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="container-x flex flex-col items-start justify-between gap-4 text-xs text-white/45 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em]">
            <MapPinIcon className="h-4 w-4 text-[var(--accent)]" />
            <span>TERRA & FIRE · Астана, бульвар Нуржол, 12</span>
          </div>
          <span className="font-mono">Ежедневно 12:00 – 00:00</span>
        </div>
      </footer>
    </>
  );
}

export default function RestaurantPage() {
  return (
    <ShowcaseShell title="TERRA & FIRE — Ресторан авторской кухни в Астане" accent="#E05A3A" bg="#0B0908">
      <RestaurantContent />
    </ShowcaseShell>
  );
}
