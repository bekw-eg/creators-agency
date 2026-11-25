import React, { useState, useMemo } from 'react';
import {
  ShoppingBagIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { LIGHTING_PRODUCTS } from '../data/lightingData';

// 1. Страница салона освещения «LUMEN HOME»: галерейный европейский каталог (#FFFFFF фон, #F8F8F6 карточки, #E5E5E0 линии, #9A7B4F бронза)
export default function LightingPage() {
  // 2. Состояния для фильтрации каталога по категории, стилю, бюджету и сортировки
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedStyle, setSelectedStyle] = useState('Все стили');
  const [maxPriceLimit, setMaxPriceLimit] = useState(250000);
  const [sortBy, setSortBy] = useState('popular');

  // 3. Состояние модального окна технических характеристик
  const [modalProduct, setModalProduct] = useState(null);

  // 4. Состояние корзины покупок
  const [cart, setCart] = useState([
    {
      product: LIGHTING_PRODUCTS[0],
      qty: 1,
    },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [needInstallation, setNeedInstallation] = useState(true);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const categories = ['Все', 'Люстры', 'Бра', 'Трековые системы', 'Торшеры'];
  const styles = ['Все стили', 'Модерн', 'Классика', 'Лофт', 'Минимализм'];

  // 5. Многоступенчатая фильтрация и сортировка товаров
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = LIGHTING_PRODUCTS.filter((item) => {
      const matchCat =
        selectedCategory === 'Все' || item.category === selectedCategory;
      const matchStyle =
        selectedStyle === 'Все стили' || item.style === selectedStyle;
      const matchPrice = item.price <= maxPriceLimit;
      return matchCat && matchStyle && matchPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.popularity - a.popularity;
    });
  }, [selectedCategory, selectedStyle, maxPriceLimit, sortBy]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setToastMsg(`«${product.name}» добавлен в корзину`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleQtyChange = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // 6. Расчёт стоимости заказа, доставки и монтажа
  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart]
  );

  const subtotalPrice = useMemo(
    () => cart.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [cart]
  );

  const deliveryCost = useMemo(() => {
    if (deliveryMethod === 'pickup') return 0;
    return subtotalPrice >= 100000 ? 0 : 3500;
  }, [deliveryMethod, subtotalPrice]);

  const installationCost = useMemo(
    () => (needInstallation && cartCount > 0 ? cartCount * 8500 : 0),
    [needInstallation, cartCount]
  );

  const grandTotal = subtotalPrice + deliveryCost + installationCost;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setOrderError('Ваша корзина пуста.');
      return;
    }
    if (!buyerName.trim() || buyerPhone.trim().length < 6) {
      setOrderError('Укажите имя получателя и контактный телефон.');
      return;
    }
    if (deliveryMethod === 'delivery' && !buyerAddress.trim()) {
      setOrderError('Укажите адрес доставки в Астане.');
      return;
    }
    setOrderError('');
    setOrderSuccess({
      orderId: `LH-${Math.floor(10000 + Math.random() * 90000)}`,
      name: buyerName.trim(),
      phone: buyerPhone.trim(),
      deliveryMethod,
      address:
        deliveryMethod === 'pickup'
          ? 'Самовывоз: г. Астана, пр. Кабанбай Батыра, 58Б (Салон LUMEN HOME)'
          : buyerAddress.trim(),
      needInstallation,
      total: grandTotal,
      itemsCount: cartCount,
    });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#18181B] font-sans pb-24 selection:bg-[#9A7B4F] selection:text-white">
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#18181B] text-white text-xs font-medium border border-[#9A7B4F]">
          <CheckCircleIcon className="w-4 h-4 text-[#9A7B4F] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 7. Галерейная шапка LUMEN HOME */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-base font-bold tracking-widest uppercase text-[#18181B]">
              LUMEN HOME
            </span>
            <span className="hidden sm:inline-block text-xs text-[#71717A] border-l border-[#E5E5E0] pl-4">
              Архитектурный и интерьерный свет • Астана
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#71717A]">
            <a href="#catalog" className="hover:text-[#18181B] transition">
              Каталог ({LIGHTING_PRODUCTS.length})
            </a>
            <a href="#service-matrix" className="hover:text-[#18181B] transition">
              Сервис и монтаж
            </a>
            <a href="#showroom-info" className="hover:text-[#18181B] transition">
              Шоурум
            </a>
          </nav>

          <button
            type="button"
            onClick={() => {
              setOrderSuccess(null);
              setCartOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#18181B] hover:bg-neutral-800 text-white text-xs font-medium transition"
          >
            <ShoppingBagIcon className="w-4 h-4 text-[#9A7B4F]" />
            <span>Корзина</span>
            <span className="px-2 py-0.5 rounded-sm bg-[#9A7B4F] text-white font-mono text-[11px]">
              {cartCount} • {subtotalPrice.toLocaleString('ru-RU')} ₸
            </span>
          </button>
        </div>
      </header>

      {/* 8. Галерейный Hero-блок */}
      <section className="bg-[#F8F8F6] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-widest text-[#9A7B4F] mb-4">
              ARCHITECTURAL & DECORATIVE LIGHTING • ASTANA SHOWROOM
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#18181B] leading-[1.12]">
              Салон интерьерного освещения и магнитных трековых систем
            </h1>

            <p className="mt-5 text-base text-[#71717A] leading-relaxed max-w-xl">
              Подвесные люстры из латуни и хрусталя K9, низковольтные трековые системы 48V, бра из матового стекла и торшеры на мраморном основании. Доставка со склада в Астане и чистый монтаж в день заказа.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#9A7B4F] hover:bg-[#866941] text-white font-medium text-xs uppercase tracking-wider transition"
              >
                <span>Смотреть каталог ({LIGHTING_PRODUCTS.length} моделей)</span>
              </a>
              <button
                type="button"
                onClick={() => setModalProduct(LIGHTING_PRODUCTS[0])}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#FFFFFF] hover:bg-neutral-100 text-[#18181B] font-medium text-xs uppercase tracking-wider border border-[#E5E5E0] transition"
              >
                <EyeIcon className="w-4 h-4 text-[#9A7B4F]" />
                <span>Спецификация: Aurelia Gold Ring</span>
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E5E5E0] flex items-center gap-3.5">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Светотехник Камила Омарова"
                className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#18181B]">
                  Камила Омарова — Ведущий инженер-светотехник LUMEN HOME
                </div>
                <div className="text-[#71717A] mt-0.5">
                  Расчёт освещённости в люксах по дизайн-проекту вашей квартиры
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-md overflow-hidden border border-[#E5E5E0] bg-[#FFFFFF]">
              <img
                src="/lighting-store.jpg"
                alt="Дизайнерские люстры LUMEN HOME"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 border-t border-[#E5E5E0] flex items-center justify-between text-xs font-mono">
                <span className="text-[#18181B]">AURELIA GOLD RING 800 (78W)</span>
                <span className="text-[#9A7B4F] font-semibold">168 000 ₸</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Табличная полоса сервиса */}
      <section id="service-matrix" className="bg-[#FFFFFF] border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E5E0]">
            <div className="py-6 md:pr-6">
              <div className="text-xs font-mono uppercase text-[#9A7B4F]">01 / Логистика</div>
              <div className="text-sm font-semibold text-[#18181B] mt-1">
                Бесплатная доставка по Астане от 100 000 ₸
              </div>
              <p className="text-xs text-[#71717A] mt-1">
                Доставка день в день собственным курьером с проверкой комплектации.
              </p>
            </div>
            <div className="py-6 md:px-6">
              <div className="text-xs font-mono uppercase text-[#9A7B4F]">02 / Установка</div>
              <div className="text-sm font-semibold text-[#18181B] mt-1">
                Монтаж на потолки до 4.5 метров
              </div>
              <p className="text-xs text-[#71717A] mt-1">
                Сборка и подключение люстр и магнитных шин на натяжные и ГКЛ-потолки.
              </p>
            </div>
            <div className="py-6 md:pl-6">
              <div className="text-xs font-mono uppercase text-[#9A7B4F]">03 / Сервис</div>
              <div className="text-sm font-semibold text-[#18181B] mt-1">
                Гарантия от 24 до 60 месяцев
              </div>
              <p className="text-xs text-[#71717A] mt-1">
                Оригинальные драйверы MeanWell и светодиоды с индексом цветопередачи CRI 95+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Каталог освещения в галерейном формате (чистые изображения без оверлейных пилюль) */}
      <section id="catalog" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-[#E5E5E0] mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#9A7B4F] mb-1">
            01 / Каталог продукции
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#18181B]">
            Интерьерные светильники в наличии
          </h2>
        </div>

        {/* Строгая панель фильтрации */}
        <div className="p-5 rounded-md bg-[#F8F8F6] border border-[#E5E5E0] mb-10 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono uppercase text-[#71717A] mb-2">
                Раздел каталога:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition border ${
                      selectedCategory === cat
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-[#FFFFFF] text-[#71717A] border-[#E5E5E0] hover:border-[#18181B] hover:text-[#18181B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-[#71717A] mb-2">
                Направление дизайна:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {styles.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStyle(st)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition border ${
                      selectedStyle === st
                        ? 'bg-[#9A7B4F] text-white border-[#9A7B4F]'
                        : 'bg-[#FFFFFF] text-[#71717A] border-[#E5E5E0] hover:border-[#9A7B4F] hover:text-[#18181B]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E5E0] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-2">
                <span className="text-[#71717A] flex items-center gap-1.5 font-mono uppercase">
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-[#9A7B4F]" />
                  <span>Лимит цены:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-sm bg-[#18181B] text-white font-mono">
                  до {maxPriceLimit.toLocaleString('ru-RU')} ₸
                </span>
              </div>
              <input
                type="range"
                min={25000}
                max={250000}
                step={5000}
                value={maxPriceLimit}
                onChange={(e) => setMaxPriceLimit(Number(e.target.value))}
                className="w-full h-2 bg-neutral-300 rounded-md appearance-none cursor-pointer accent-[#9A7B4F]"
              />
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3">
              <span className="text-xs font-mono uppercase text-[#71717A] flex items-center gap-1">
                <ArrowsUpDownIcon className="w-4 h-4" />
                <span>Сортировка:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#E5E5E0] text-xs font-medium text-[#18181B] focus:outline-none focus:border-[#9A7B4F]"
              >
                <option value="popular">По популярности</option>
                <option value="price-asc">По возрастанию цены (₸)</option>
                <option value="price-desc">По убыванию цены (₸)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Галерейная сетка товаров */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="p-10 rounded-md bg-[#F8F8F6] border border-[#E5E5E0]">
            <p className="text-base font-semibold text-[#18181B]">
              По выбранным параметрам моделей не найдено
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Все');
                setSelectedStyle('Все стили');
                setMaxPriceLimit(250000);
              }}
              className="mt-4 px-4 py-2 rounded-md bg-[#9A7B4F] text-white text-xs font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-md bg-[#F8F8F6] border border-[#E5E5E0] hover:border-[#9A7B4F] overflow-hidden transition flex flex-col justify-between"
              >
                <div>
                  {/* Чистое изображение без наложенных бейджей */}
                  <div
                    onClick={() => setModalProduct(product)}
                    className="cursor-pointer h-60 overflow-hidden bg-neutral-100 border-b border-[#E5E5E0]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:opacity-95 transition"
                      loading="lazy"
                    />
                  </div>

                  {/* Строгий паспорт под фото */}
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-[#71717A] font-mono pb-2 border-b border-[#E5E5E0]">
                      <span>{product.sku}</span>
                      <span>{product.category.toUpperCase()} • {product.style.toUpperCase()}</span>
                    </div>

                    <h3
                      onClick={() => setModalProduct(product)}
                      className="cursor-pointer text-base font-semibold text-[#18181B] hover:text-[#9A7B4F] mt-3 leading-snug transition"
                    >
                      {product.name}
                    </h3>

                    <div className="mt-3 space-y-1 text-xs text-[#71717A] font-mono">
                      <div className="flex justify-between">
                        <span>Мощность:</span>
                        <span className="text-[#18181B]">{product.specs.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Освещение:</span>
                        <span className="text-[#18181B]">{product.specs.area}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-[#FFFFFF] border-t border-[#E5E5E0] flex items-center justify-between gap-2">
                  <div>
                    {product.oldPrice && (
                      <span className="text-[11px] font-mono text-[#71717A] line-through block">
                        {product.oldPrice.toLocaleString('ru-RU')} ₸
                      </span>
                    )}
                    <span className="text-base font-mono font-semibold text-[#18181B]">
                      {product.price.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalProduct(product)}
                      className="px-2.5 py-2 rounded-md bg-[#F8F8F6] hover:bg-neutral-200 text-[#18181B] border border-[#E5E5E0] text-xs font-medium transition"
                      title="Паспорт модели"
                    >
                      Паспорт
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-[#9A7B4F] hover:bg-[#866941] text-white text-xs font-medium transition"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>В корзину</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 11. Модальное окно технического паспорта светильника */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-2xl rounded-md bg-[#FFFFFF] border border-[#E5E5E0] text-[#18181B] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-md bg-[#F8F8F6] hover:bg-[#18181B] hover:text-white border border-[#E5E5E0] transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              <div className="sm:col-span-5">
                <img
                  src={modalProduct.image}
                  alt={modalProduct.name}
                  className="w-full h-60 object-cover rounded-md border border-[#E5E5E0]"
                />
                <div className="mt-3 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9A7B4F]">В НАЛИЧИИ • АСТАНА</span>
                  <span className="text-[#71717A]">{modalProduct.sku}</span>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#9A7B4F]">
                    {modalProduct.category} • {modalProduct.style}
                  </span>
                  <h3 className="text-lg font-semibold text-[#18181B] mt-1">
                    {modalProduct.name}
                  </h3>
                  <p className="text-xs text-[#71717A] mt-2 leading-relaxed">
                    {modalProduct.description}
                  </p>
                </div>

                <div className="p-4 rounded-md bg-[#F8F8F6] border border-[#E5E5E0] space-y-2 text-xs">
                  <div className="font-mono font-semibold text-[#18181B] uppercase tracking-wider mb-1">
                    Спецификация изделия:
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E5E0]">
                    <span className="text-[#71717A]">Мощность:</span>
                    <span className="font-medium text-right">{modalProduct.specs.power}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E5E0]">
                    <span className="text-[#71717A]">Площадь освещения:</span>
                    <span className="font-medium text-right">{modalProduct.specs.area}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E5E0]">
                    <span className="text-[#71717A]">Температура света:</span>
                    <span className="font-medium text-right">{modalProduct.specs.colorTemp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E5E0]">
                    <span className="text-[#71717A]">Материалы:</span>
                    <span className="font-medium text-right">{modalProduct.specs.material}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E5E0]">
                    <span className="text-[#71717A]">Габариты:</span>
                    <span className="font-medium text-right">{modalProduct.specs.dimensions}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#71717A]">Гарантия:</span>
                    <span className="font-semibold text-[#9A7B4F]">{modalProduct.specs.warranty}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <div>
                    {modalProduct.oldPrice && (
                      <span className="text-xs font-mono text-[#71717A] line-through block">
                        {modalProduct.oldPrice.toLocaleString('ru-RU')} ₸
                      </span>
                    )}
                    <span className="text-2xl font-mono font-semibold text-[#18181B]">
                      {modalProduct.price.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(modalProduct);
                      setModalProduct(null);
                      setCartOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-md bg-[#9A7B4F] hover:bg-[#866941] text-white font-medium text-xs uppercase tracking-wider transition"
                  >
                    Добавить в корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. Выдвижная корзина заказа */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <div className="w-full max-w-md bg-[#FFFFFF] text-[#18181B] h-full flex flex-col justify-between p-6 overflow-y-auto border-l border-[#E5E5E0]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E0]">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-[#9A7B4F]" />
                  <h3 className="text-base font-semibold">Корзина заказа</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-md bg-[#F8F8F6] hover:bg-[#18181B] hover:text-white border border-[#E5E5E0] transition"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="mt-6 p-5 rounded-md bg-[#F8F8F6] border border-[#9A7B4F] space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-[#9A7B4F] shrink-0" />
                    <div>
                      <div className="text-xs font-mono uppercase text-[#9A7B4F]">
                        Накладная #{orderSuccess.orderId}
                      </div>
                      <h4 className="text-base font-semibold text-[#18181B]">
                        Заказ принят, {orderSuccess.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 bg-[#FFFFFF] p-4 rounded-md border border-[#E5E5E0]">
                    <div>
                      <span className="text-[#71717A]">Доставка / получение: </span>
                      <span className="font-semibold">{orderSuccess.address}</span>
                    </div>
                    <div>
                      <span className="text-[#71717A]">Монтаж: </span>
                      <span className="font-semibold">
                        {orderSuccess.needInstallation ? 'Включён' : 'Без монтажа'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71717A]">Итого: </span>
                      <span className="font-mono font-semibold text-sm text-[#18181B]">
                        {orderSuccess.total.toLocaleString('ru-RU')} ₸
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOrderSuccess(null);
                      setCartOpen(false);
                    }}
                    className="w-full py-2.5 rounded-md bg-[#9A7B4F] text-white text-xs font-medium"
                  >
                    Вернуться в каталог
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold text-[#18181B]">Корзина пуста</p>
                  <p className="text-xs text-[#71717A] mt-1">
                    Выберите модели освещения в каталоге.
                  </p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-[#E5E5E0] border border-[#E5E5E0] rounded-md bg-[#F8F8F6]">
                  {cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-[#71717A]">{product.sku}</div>
                        <div className="text-xs font-semibold text-[#18181B] truncate">
                          {product.name}
                        </div>
                        <div className="text-xs font-mono font-semibold text-[#9A7B4F] mt-0.5">
                          {(product.price * qty).toLocaleString('ru-RU')} ₸
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(product.id)}
                          className="text-[#71717A] hover:text-[#18181B]"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-[#FFFFFF] px-2 py-1 rounded-md border border-[#E5E5E0]">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(product.id, -1)}
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-semibold w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(product.id, 1)}
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!orderSuccess && cart.length > 0 && (
              <form
                onSubmit={handleOrderSubmit}
                className="mt-6 pt-4 border-t border-[#E5E5E0] space-y-3"
              >
                {orderError && (
                  <div className="p-2.5 rounded-md bg-[#F8F8F6] border border-[#9A7B4F] text-[#18181B] text-xs flex items-center gap-1.5">
                    <ExclamationCircleIcon className="w-4 h-4 text-[#9A7B4F] shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#71717A] mb-1.5">
                    Способ получения
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`py-2 px-3 rounded-md text-xs font-medium border transition ${
                        deliveryMethod === 'delivery'
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-[#F8F8F6] text-[#18181B] border-[#E5E5E0]'
                      }`}
                    >
                      Доставка курьером
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`py-2 px-3 rounded-md text-xs font-medium border transition ${
                        deliveryMethod === 'pickup'
                          ? 'bg-[#18181B] text-white border-[#18181B]'
                          : 'bg-[#F8F8F6] text-[#18181B] border-[#E5E5E0]'
                      }`}
                    >
                      Самовывоз
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setNeedInstallation((prev) => !prev)}
                  className={`w-full py-2.5 px-3.5 rounded-md border text-xs font-medium flex items-center justify-between transition ${
                    needInstallation
                      ? 'bg-[#F8F8F6] border-[#9A7B4F] text-[#18181B]'
                      : 'bg-[#F8F8F6] border-[#E5E5E0] text-[#71717A]'
                  }`}
                >
                  <span>Услуга монтажа (+8 500 ₸ / шт.)</span>
                  <span className="font-mono font-semibold text-[#9A7B4F]">{needInstallation ? 'ДА' : 'НЕТ'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Ваше имя *"
                    className="px-3 py-2 rounded-md bg-[#F8F8F6] border border-[#E5E5E0] text-xs"
                  />
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+7 (701) 000-00-00 *"
                    className="px-3 py-2 rounded-md bg-[#F8F8F6] border border-[#E5E5E0] text-xs"
                  />
                </div>

                {deliveryMethod === 'delivery' && (
                  <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    placeholder="Адрес доставки в Астане *"
                    className="w-full px-3 py-2 rounded-md bg-[#F8F8F6] border border-[#E5E5E0] text-xs"
                  />
                )}

                <div className="p-3 rounded-md bg-[#F8F8F6] border border-[#E5E5E0] text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">ТОВАРЫ ({cartCount}):</span>
                    <span>{subtotalPrice.toLocaleString('ru-RU')} ₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">ДОСТАВКА:</span>
                    <span>
                      {deliveryCost === 0 ? '0 ₸' : `${deliveryCost.toLocaleString('ru-RU')} ₸`}
                    </span>
                  </div>
                  {needInstallation && (
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">МОНТАЖ:</span>
                      <span>{installationCost.toLocaleString('ru-RU')} ₸</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-[#E5E5E0] text-sm font-semibold">
                    <span>ИТОГО:</span>
                    <span className="text-[#9A7B4F]">{grandTotal.toLocaleString('ru-RU')} ₸</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-[#9A7B4F] hover:bg-[#866941] text-white font-medium text-xs uppercase tracking-wider transition"
                >
                  Оформить заказ ({grandTotal.toLocaleString('ru-RU')} ₸)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 13. Футер */}
      <footer id="showroom-info" className="py-10 bg-[#F8F8F6] border-t border-[#E5E5E0] text-[#71717A] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-[#18181B]">
            LUMEN HOME • САЛОН ОСВЕЩЕНИЯ АСТАНА
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-[#9A7B4F]" />
              пр. Кабанбай Батыра, 58Б (ТЦ Декор Центр)
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-[#9A7B4F]" />
              +7 (7172) 55-19-80
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
