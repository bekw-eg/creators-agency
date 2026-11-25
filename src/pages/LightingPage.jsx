import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckIcon,
  InformationCircleIcon,
  MapPinIcon,
  ShoppingBagIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { LIGHTING_PRODUCTS } from '../data/lightingData';
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

const CATEGORIES = ['Все', 'Люстры', 'Бра', 'Трековые системы', 'Торшеры'];
const STYLES = ['Все стили', 'Модерн', 'Минимализм', 'Лофт', 'Классика'];

function LightingContent() {
  const [category, setCategory] = useState('Все');
  const [style, setStyle] = useState('Все стили');
  const [sort, setSort] = useState('popular');
  const [inspecting, setInspecting] = useState(null);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [delivery, setDelivery] = useState('courier'); // courier | pickup
  const [withInstall, setWithInstall] = useState(true);
  const [buyerPhone, setBuyerPhone] = useState('');
  const [error, setError] = useState('');
  const [ordered, setOrdered] = useState(false);

  const products = useMemo(() => {
    const list = LIGHTING_PRODUCTS.filter((p) => {
      if (category !== 'Все' && p.category !== category) return false;
      if (style !== 'Все стили' && p.style !== style) return false;
      return true;
    });
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => b.popularity - a.popularity);
  }, [category, style, sort]);

  const addToCart = (product) => {
    setOrdered(false);
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        return prev.map((i, k) => (k === idx ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: Math.min(10, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  const deliveryCost = delivery === 'courier' && subtotal > 0 && subtotal < 120000 ? 3500 : 0;
  const installCost = withInstall ? Math.round(subtotal * 0.12) : 0;
  const grandTotal = subtotal + deliveryCost + installCost;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!cart.length) return;
    if (buyerPhone.trim().length < 7) {
      setError('Укажите телефон для согласования доставки и монтажа.');
      return;
    }
    setError('');
    setOrdered(true);
    setCart([]);
  };

  return (
    <>
      <ShowcaseHeader
        brand="LUMEN HOME"
        subtitle="Architectural Lighting"
        nav={[
          { label: 'Каталог', href: '#catalog' },
          { label: 'Шоурум', href: '#showroom-info' },
        ]}
        rightSlot={
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-xs font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <ShoppingBagIcon className="h-4 w-4 text-[var(--accent)]" />
            <span>Корзина ({totalItems})</span>
          </button>
        }
      />

      {/* Hero */}
      <section id="top" className="relative isolate flex min-h-[95svh] flex-col justify-end overflow-hidden pt-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="/lighting-store.jpg"
            alt="LUMEN HOME салон освещения"
            className="h-full w-full scale-105 object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/70 to-[#0A0A0B]/35" />
          <div className="absolute inset-0 bg-[radial-gradient(50vmax_50vmax_at_80%_20%,rgba(212,175,122,0.18),transparent_65%)]" />
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
              Галерея архитектурного света · CRI 97+
            </span>
            <span>Доставка и монтаж по Астане</span>
          </motion.div>

          <MaskLines
            as="h1"
            trigger="mount"
            play
            delay={0.08}
            className="font-grotesk text-[clamp(2.6rem,8.5vw,8.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
            lines={[
              'Архитектура',
              <>
                и скульптура{' '}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-[var(--accent)]">света</span>
              </>,
            ]}
          />

          <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="max-w-md text-base leading-relaxed text-white/60 md:col-span-5 md:text-lg">
              Дизайнерские люстры из анодированной латуни, магнитные трековые системы 48V и бра для интерьеров с
              бесплатным светотехническим расчётом.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
              <AccentButton href="#catalog">
                <span>Открыть каталог (10)</span>
                <ArrowIcon className="h-4 w-4" />
              </AccentButton>
              <AccentButton variant="ghost" label={`Корзина (${totalItems})`} onClick={() => setCartOpen(true)} />
            </div>
          </div>
        </div>

        <div className="border-y border-white/10 bg-[#0A0A0B]/80 py-4 backdrop-blur-md">
          <Marquee
            items={['Aurelia Gold', 'MagTrack 48V', 'K9 Optical Crystal', 'CRI 97+ LED', 'Профессиональный монтаж']}
            duration={34}
            itemClassName="font-grotesk text-lg font-medium tracking-[-0.02em] text-white/75 md:text-2xl [&_.text-acid]:text-[var(--accent)]"
          />
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="py-24 md:py-36">
        <div className="container-x">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <AccentLabel index="01" label="Каталог освещения" className="mb-5" />
              <MaskLines
                lines={['Коллекция', <span className="text-white/35">в наличии</span>]}
                className="font-grotesk text-[clamp(2.2rem,5.5vw,5.25rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full max-w-xs rounded-full border border-white/15 bg-[#121215] px-4 py-3 text-xs text-white outline-none focus:border-[var(--accent)]"
            >
              <option value="popular">Сначала популярные</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition ${
                  category === c
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0B]'
                    : 'border-white/15 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition ${
                  style === s ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <SpotlightGrid className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <SpotlightCard key={p.id} innerClassName="flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-black/20" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/90 backdrop-blur-md">
                    {p.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspecting(p)}
                    aria-label="Паспорт характеристик"
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/45">
                      <span>
                        {p.category} · {p.style}
                      </span>
                      <span>{p.sku}</span>
                    </div>
                    <h3 className="mt-2 font-grotesk text-lg font-semibold leading-snug">{p.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/55">{p.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div>
                      <div className="font-grotesk text-xl font-semibold text-[var(--accent)] tabular-nums">
                        {formatKzt(p.price)}
                      </div>
                      {p.oldPrice && (
                        <div className="font-mono text-[11px] text-white/35 line-through">{formatKzt(p.oldPrice)}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/85 transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0A0A0B]"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      {/* Showroom Info */}
      <footer id="showroom-info" className="border-t border-white/10 py-14">
        <div className="container-x flex flex-col items-start justify-between gap-4 text-xs text-white/50 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-mono uppercase tracking-[0.18em]">
            <MapPinIcon className="h-4 w-4 text-[var(--accent)]" />
            <span>LUMEN HOME · Астана, ТД «Армада» / Левый берег</span>
          </div>
          <span className="font-mono">Бесплатная доставка при заказе от 120 000 ₸</span>
        </div>
      </footer>

      {/* Product Specs Modal */}
      <AnimatePresence>
        {inspecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={() => setInspecting(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white/15 bg-[#111114] p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                    Паспорт светильника · {inspecting.sku}
                  </p>
                  <h3 className="mt-1 font-grotesk text-2xl font-semibold">{inspecting.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInspecting(null)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-xs">
                {[
                  ['Мощность', inspecting.specs.power],
                  ['Площадь освещения', inspecting.specs.area],
                  ['Цветовая температура', inspecting.specs.colorTemp],
                  ['Материалы', inspecting.specs.material],
                  ['Габариты', inspecting.specs.dimensions],
                  ['Гарантия', inspecting.specs.warranty],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3">
                    <dt className="text-white/45">{k}</dt>
                    <dd className="text-right font-medium text-white/90">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-grotesk text-2xl font-semibold text-[var(--accent)]">
                  {formatKzt(inspecting.price)}
                </span>
                <AccentButton
                  label="Добавить в корзину"
                  onClick={() => {
                    addToCart(inspecting);
                    setInspecting(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
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
              className="flex h-full w-full max-w-md flex-col justify-between border-l border-white/10 bg-[#101013] p-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-grotesk text-xl font-semibold">Корзина ({totalItems})</h3>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="my-5 flex-1 space-y-4 overflow-y-auto">
                {ordered ? (
                  <div className="rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-6 text-center">
                    <CheckIcon className="mx-auto h-10 w-10 text-[var(--accent)]" />
                    <h4 className="mt-3 font-grotesk text-xl font-semibold">Заказ оформлен!</h4>
                    <p className="mt-2 text-xs text-white/70">
                      Менеджер LUMEN HOME свяжется с вами по номеру {buyerPhone} в течение 15 минут.
                    </p>
                  </div>
                ) : cart.length === 0 ? (
                  <p className="py-12 text-center text-sm text-white/45">Корзина пуста — выберите светильники в каталоге.</p>
                ) : (
                  <>
                    <ul className="space-y-2.5">
                      {cart.map(({ product, qty }) => (
                        <li
                          key={product.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5"
                        >
                          <img src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-semibold">{product.name}</div>
                            <div className="mt-1 font-mono text-xs text-[var(--accent)]">
                              {formatKzt(product.price * qty)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, -1)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-xs"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-mono text-xs">{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, 1)}
                              className="grid h-7 w-7 place-items-center rounded-full border border-white/15 text-xs"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, -qty)}
                              className="ml-1 text-white/40 hover:text-red-400"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
                      {delivery === 'courier' && subtotal > 0 && subtotal < 120000 && (
                        <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3.5 py-2.5 text-[11px] text-[var(--accent)]">
                          До бесплатной доставки осталось {formatKzt(120000 - subtotal)}
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'courier', label: 'Курьером по Астане' },
                          { id: 'pickup', label: 'Самовывоз (0 ₸)' },
                        ].map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setDelivery(d.id)}
                            className={`rounded-xl border py-2.5 font-medium transition ${
                              delivery === d.id
                                ? 'border-[var(--accent)] bg-[var(--accent)] text-[#0A0A0B]'
                                : 'border-white/15 text-white/70'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setWithInstall((v) => !v)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                          withInstall ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-white/15'
                        }`}
                      >
                        <span>Монтаж штатным электриком (+12%)</span>
                        <span className="font-mono text-[var(--accent)]">{withInstall ? 'Да' : 'Нет'}</span>
                      </button>

                      <input
                        type="tel"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="Телефон +7 (701) 000-00-00 *"
                        className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-xs text-white placeholder:text-white/35 outline-none focus:border-[var(--accent)]"
                      />
                      {error && <p className="text-xs text-red-400">{error}</p>}
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <form onSubmit={handleCheckout} className="space-y-2 border-t border-white/10 pt-4 text-xs">
                  <div className="flex justify-between text-white/55">
                    <span>Доставка</span>
                    <span className="font-mono">{deliveryCost ? formatKzt(deliveryCost) : 'Бесплатно'}</span>
                  </div>
                  {withInstall && (
                    <div className="flex justify-between text-white/55">
                      <span>Монтаж</span>
                      <span className="font-mono">{formatKzt(installCost)}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between pt-2">
                    <span className="font-mono uppercase text-white/50">Итого</span>
                    <span className="font-grotesk text-2xl font-semibold text-[var(--accent)] tabular-nums">
                      {formatKzt(grandTotal)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-full bg-[var(--accent)] py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0B] transition hover:bg-white"
                  >
                    Оформить заказ
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

export default function LightingPage() {
  return (
    <ShowcaseShell title="LUMEN HOME — Салон дизайнерского освещения в Астане" accent="#D4AF7A" bg="#0A0A0B">
      <LightingContent />
    </ShowcaseShell>
  );
}
