import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckIcon,
  MapPinIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { COFFEE_CUSTOMIZATION, COFFEE_LOCATIONS, COFFEE_MENU } from '../data/coffeeData';
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

const CATEGORIES = ['Все', 'Кофе на эспрессо', 'Авторский кофе', 'Альтернатива', 'Выпечка и десерты'];
const PICKUP_TIMES = ['Через 10 мин', 'Через 20 мин', 'Через 30 мин', 'К точному времени'];

function CoffeeContent() {
  const [category, setCategory] = useState('Все');
  const [customizing, setCustomizing] = useState(null);
  const [sizeId, setSizeId] = useState('M');
  const [milkId, setMilkId] = useState('regular');
  const [syrupId, setSyrupId] = useState('none');

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [locationId, setLocationId] = useState(COFFEE_LOCATIONS[0].id);
  const [pickupTime, setPickupTime] = useState(PICKUP_TIMES[0]);
  const [exactTime, setExactTime] = useState('14:00');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderDone, setOrderDone] = useState(false);

  const filtered = useMemo(
    () => (category === 'Все' ? COFFEE_MENU : COFFEE_MENU.filter((i) => i.category === category)),
    [category]
  );

  const openBuilder = (item) => {
    setSizeId('M');
    setMilkId('regular');
    setSyrupId('none');
    setCustomizing(item);
  };

  const sizeObj = COFFEE_CUSTOMIZATION.sizes.find((s) => s.id === sizeId) || COFFEE_CUSTOMIZATION.sizes[0];
  const milkObj = COFFEE_CUSTOMIZATION.milks.find((m) => m.id === milkId) || COFFEE_CUSTOMIZATION.milks[0];
  const syrupObj = COFFEE_CUSTOMIZATION.syrups.find((s) => s.id === syrupId) || COFFEE_CUSTOMIZATION.syrups[0];

  const customPrice = customizing
    ? customizing.basePrice + sizeObj.priceAdd + milkObj.priceAdd + syrupObj.priceAdd
    : 0;

  const addToCart = (item, meta = null, price = item.basePrice) => {
    setOrderDone(false);
    const key = `${item.id}::${meta || 'base'}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (existing) {
        return prev.map((c) => (c.key === key ? { ...c, qty: Math.min(10, c.qty + 1) } : c));
      }
      return [...prev, { key, item, meta, price, qty: 1 }];
    });
    setCustomizing(null);
    setCartOpen(true);
  };

  const updateCartQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.key === key ? { ...c, qty: Math.min(10, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeFromCart = (key) => setCart((prev) => prev.filter((c) => c.key !== key));
  const cartCount = cart.reduce((acc, c) => acc + c.qty, 0);
  const cartTotal = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  const selectedLocation = COFFEE_LOCATIONS.find((l) => l.id === locationId) || COFFEE_LOCATIONS[0];

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    if (customerPhone.trim().length < 7) {
      setOrderError('Укажите номер телефона — пришлём уведомление о готовности.');
      return;
    }
    setOrderError('');
    setOrderDone(true);
    setCart([]);
  };

  return (
    <>
      <ShowcaseHeader
        brand="ROASTERY 01"
        subtitle="Specialty Coffee · Astana"
        nav={[
          { label: 'Меню и конструктор', href: '#menu' },
          { label: 'Кофейни', href: '#locations' },
        ]}
        rightSlot={
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <ShoppingBagIcon className="h-4 w-4 text-[var(--accent)]" />
            <span>To-Go ({cartCount})</span>
          </button>
        }
      />

      {/* Hero */}
      <section id="top" className="relative isolate flex min-h-[95svh] flex-col justify-end overflow-hidden pt-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1800&q=85"
            alt="ROASTERY 01 спешелти кофейня"
            className="h-full w-full scale-105 object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0908] via-[#0B0908]/75 to-[#0B0908]/35" />
          <div className="absolute inset-0 bg-[radial-gradient(50vmax_50vmax_at_80%_20%,rgba(217,155,82,0.18),transparent_65%)]" />
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
              Собственная обжарка Probat · Q-Grade 87+
            </span>
            <span>3 кофейни в Астане · Предзаказ To-Go</span>
          </motion.div>

          <MaskLines
            as="h1"
            trigger="mount"
            play
            delay={0.08}
            className="font-grotesk text-[clamp(2.6rem,8.5vw,8.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
            lines={[
              'Спешелти кофе',
              <>
                свежей{' '}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-[var(--accent)]">обжарки</span>
              </>,
            ]}
          />

          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-white/60 md:col-span-5 md:text-lg">
              Соберите идеальный напиток в конструкторе — выберите объём, альтернативное молоко и крафтовый сироп, а мы
              приготовим заказ точно к вашему приходу.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
              <AccentButton href="#menu">
                <span>Собрать напиток</span>
                <ArrowIcon className="h-4 w-4" />
              </AccentButton>
              <AccentButton href="#locations" variant="ghost" label="Локации в Астане" />
            </div>
          </div>
        </div>

        <div className="border-y border-white/10 bg-[#0B0908]/80 py-4 backdrop-blur-md">
          <Marquee
            items={['Ethiopia Yirgacheffe', 'Oatly Barista', 'V60 Pour Over', 'Uji Matcha', 'Artisan Croissants', 'To-Go in 10 min']}
            duration={34}
            itemClassName="font-grotesk text-lg font-medium tracking-[-0.02em] text-white/75 md:text-2xl [&_.text-acid]:text-[var(--accent)]"
          />
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-24 md:py-36">
        <div className="container-x">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <AccentLabel index="01" label="Кофейная карта" className="mb-5" />
              <MaskLines
                lines={['Напитки и свежая', <span className="text-white/35">выпечка</span>]}
                className="font-grotesk text-[clamp(2.2rem,5.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition ${
                    category === c
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0B0908]'
                      : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <SpotlightGrid className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <SpotlightCard key={item.id} innerClassName="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-black/20" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur-md">
                    {item.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-white/45">
                      <span>{item.category}</span>
                      <span>{item.calories}</span>
                    </div>
                    <h3 className="mt-2 font-grotesk text-xl font-semibold tracking-[-0.02em]">{item.name}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/55">{item.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="font-grotesk text-xl font-semibold text-[var(--accent)] tabular-nums">
                      {item.isCustomizable ? `от ${formatKzt(item.basePrice)}` : formatKzt(item.basePrice)}
                    </span>
                    <button
                      type="button"
                      onClick={() => (item.isCustomizable ? openBuilder(item) : addToCart(item))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/85 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0B0908]"
                    >
                      <PlusIcon className="h-3.5 w-3.5" />
                      {item.isCustomizable ? 'Настроить' : 'В заказ'}
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="border-t border-white/10 py-24 md:py-36">
        <div className="container-x">
          <AccentLabel index="02" label="Наши точки" className="mb-5" />
          <MaskLines
            lines={['Три кофейни', <span className="text-[var(--accent)]">в Астане</span>]}
            className="mb-14 font-grotesk text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
          />
          <SpotlightGrid className="grid gap-4 md:grid-cols-3">
            {COFFEE_LOCATIONS.map((loc, idx) => (
              <SpotlightCard key={loc.id} innerClassName="p-7 flex flex-col justify-between gap-6">
                <div>
                  <span className="font-mono text-xs text-[var(--accent)]">0{idx + 1}</span>
                  <h3 className="mt-3 font-grotesk text-xl font-semibold">{loc.name}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                    {loc.address}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-white/50">{loc.features}</p>
                </div>
                <div className="border-t border-white/10 pt-4 font-mono text-[11px] text-white/45">{loc.hours}</div>
              </SpotlightCard>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      {/* Drink Builder Modal */}
      <AnimatePresence>
        {customizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={() => setCustomizing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-white/15 bg-[#12100E] p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">Конструктор напитка</p>
                  <h3 className="mt-1 font-grotesk text-2xl font-semibold">{customizing.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomizing(null)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">Объём</p>
                  <div className="grid grid-cols-3 gap-2">
                    {COFFEE_CUSTOMIZATION.sizes.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSizeId(s.id)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                          sizeId === s.id
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0B0908]'
                            : 'border-white/15 text-white/75'
                        }`}
                      >
                        <div>{s.label}</div>
                        <div className="mt-0.5 font-mono text-[10px] opacity-80">
                          {s.priceAdd ? `+${s.priceAdd} ₸` : 'База'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">Молоко</p>
                  <div className="flex flex-wrap gap-2">
                    {COFFEE_CUSTOMIZATION.milks.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMilkId(m.id)}
                        className={`rounded-full border px-3.5 py-2 text-xs transition ${
                          milkId === m.id
                            ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[#0B0908]'
                            : 'border-white/15 text-white/75'
                        }`}
                      >
                        {m.label} {m.priceAdd > 0 && `(+${m.priceAdd} ₸)`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">Сироп</p>
                  <div className="flex flex-wrap gap-2">
                    {COFFEE_CUSTOMIZATION.syrups.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSyrupId(s.id)}
                        className={`rounded-full border px-3.5 py-2 text-xs transition ${
                          syrupId === s.id
                            ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[#0B0908]'
                            : 'border-white/15 text-white/75'
                        }`}
                      >
                        {s.label} {s.priceAdd > 0 && `(+${s.priceAdd} ₸)`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div>
                  <div className="font-mono text-[10px] uppercase text-white/45">Цена стакана</div>
                  <div className="font-grotesk text-2xl font-semibold text-[var(--accent)] tabular-nums">
                    {formatKzt(customPrice)}
                  </div>
                </div>
                <AccentButton
                  label="Добавить в To-Go"
                  onClick={() =>
                    addToCart(customizing, `${sizeObj.id} · ${milkObj.label} · ${syrupObj.label}`, customPrice)
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over To-Go Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col justify-between border-l border-white/10 bg-[#100E0D] p-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-grotesk text-xl font-semibold">Предзаказ To-Go</h3>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="my-5 flex-1 space-y-4 overflow-y-auto">
                {orderDone ? (
                  <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-6 text-center">
                    <CheckIcon className="mx-auto h-10 w-10 text-[var(--accent)]" />
                    <h4 className="mt-3 font-grotesk text-xl font-semibold">Заказ передан бариста!</h4>
                    <p className="mt-2 text-xs text-white/70">
                      {selectedLocation.name} ·{' '}
                      {pickupTime === 'К точному времени' ? `к ${exactTime}` : pickupTime}. Напишем на {customerPhone},
                      как только всё будет готово.
                    </p>
                  </div>
                ) : cart.length === 0 ? (
                  <p className="py-12 text-center text-sm text-white/45">Корзина пуста — выберите кофе или выпечку.</p>
                ) : (
                  <>
                    <ul className="space-y-2.5">
                      {cart.map((entry) => (
                        <li
                          key={entry.key}
                          className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold">{entry.item.name}</div>
                            {entry.meta && <div className="mt-1 text-[11px] text-white/50">{entry.meta}</div>}
                            <div className="mt-1.5 font-mono text-xs text-[var(--accent)]">
                              {formatKzt(entry.price * entry.qty)}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, -1)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-xs"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-mono text-xs">{entry.qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(entry.key, 1)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-xs"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(entry.key)}
                              className="ml-1 text-white/40 hover:text-red-400"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <div>
                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                          Кофейня
                        </label>
                        <select
                          value={locationId}
                          onChange={(e) => setLocationId(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-[#171412] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[var(--accent)]"
                        >
                          {COFFEE_LOCATIONS.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {PICKUP_TIMES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setPickupTime(t)}
                            className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                              pickupTime === t
                                ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[#0B0908]'
                                : 'border-white/15 text-white/65'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      {pickupTime === 'К точному времени' && (
                        <div>
                          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                            Удобное время выдачи (08:00 – 22:00)
                          </label>
                          <input
                            type="time"
                            min="08:00"
                            max="22:00"
                            value={exactTime}
                            onChange={(e) => setExactTime(e.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-[#171412] px-4 py-2.5 font-mono text-xs text-white outline-none focus:border-[var(--accent)]"
                          />
                        </div>
                      )}
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ваш телефон +7 (701) 000-00-00 *"
                        className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder:text-white/35 outline-none focus:border-[var(--accent)]"
                      />
                      {orderError && <p className="text-xs text-red-400">{orderError}</p>}
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <form onSubmit={handleCheckout} className="border-t border-white/10 pt-4">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase text-white/50">К оплате</span>
                    <span className="font-grotesk text-2xl font-semibold text-[var(--accent)] tabular-nums">
                      {formatKzt(cartTotal)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="h-13 w-full rounded-full bg-[var(--accent)] py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0B0908] transition hover:bg-white"
                  >
                    Оформить предзаказ
                  </button>
                </form>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CoffeePage() {
  return (
    <ShowcaseShell title="ROASTERY 01 — Спешелти-кофейня в Астане" accent="#D99B52" bg="#0B0908">
      <CoffeeContent />
    </ShowcaseShell>
  );
}
