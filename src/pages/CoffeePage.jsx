import React, { useState, useMemo } from 'react';
import {
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  COFFEE_CUSTOMIZATION,
  COFFEE_MENU,
  COFFEE_LOCATIONS,
} from '../data/coffeeData';

// 1. Страница кофейни «ROASTERY 01»: минималистичная крафтовая сетка меню-борда (#F4F1EA фон, #FCFBF8 блоки, #E2DCD0 линии, #4A3222 эспрессо)
export default function CoffeePage() {
  // 2. Состояния для категории меню, конструктора напитка и корзины предзаказа
  const [activeCategory, setActiveCategory] = useState('Все');
  const [builderDrink, setBuilderDrink] = useState(null);
  const [selectedSize, setSelectedSize] = useState(COFFEE_CUSTOMIZATION.sizes[1]);
  const [selectedMilk, setSelectedMilk] = useState(COFFEE_CUSTOMIZATION.milks[0]);
  const [selectedSyrup, setSelectedSyrup] = useState(COFFEE_CUSTOMIZATION.syrups[0]);
  const [extraShot, setExtraShot] = useState(false);

  // 3. Корзина предзаказа «С собой»
  const [cart, setCart] = useState([
    {
      cartKey: 'cf-1-M-oat-none-false',
      itemId: 'cf-1',
      name: 'Флэт Уайт (Эфиопия Иргачефф)',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=80',
      customSummary: 'M (350 мл) • Овсяное Oatly Barista • Без сиропа',
      unitPrice: 2240,
      qty: 1,
    },
  ]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(COFFEE_LOCATIONS[0].name);
  const [pickupTime, setPickupTime] = useState('Через 10 минут');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const categories = ['Все', 'Кофе на эспрессо', 'Авторский кофе', 'Альтернатива', 'Выпечка и десерты'];

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'Все') return COFFEE_MENU;
    return COFFEE_MENU.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // 4. Мгновенный пересчёт цены напитка в конструкторе
  const currentBuilderPrice = useMemo(() => {
    if (!builderDrink) return 0;
    const shotAdd = extraShot ? 350 : 0;
    return (
      builderDrink.basePrice +
      selectedSize.priceAdd +
      selectedMilk.priceAdd +
      selectedSyrup.priceAdd +
      shotAdd
    );
  }, [builderDrink, selectedSize, selectedMilk, selectedSyrup, extraShot]);

  const openDrinkBuilder = (item) => {
    if (!item.isCustomizable) {
      addDirectItemToCart(item);
      return;
    }
    setBuilderDrink(item);
    setSelectedSize(COFFEE_CUSTOMIZATION.sizes[1]);
    setSelectedMilk(COFFEE_CUSTOMIZATION.milks[0]);
    setSelectedSyrup(COFFEE_CUSTOMIZATION.syrups[0]);
    setExtraShot(false);
  };

  const addDirectItemToCart = (item) => {
    const key = `${item.id}-standard`;
    setCart((prev) => {
      const existing = prev.find((c) => c.cartKey === key);
      if (existing) {
        return prev.map((c) => (c.cartKey === key ? { ...c, qty: c.qty + 1 } : c));
      }
      return [
        ...prev,
        {
          cartKey: key,
          itemId: item.id,
          name: item.name,
          image: item.image,
          customSummary: 'Стандартная подача',
          unitPrice: item.basePrice,
          qty: 1,
        },
      ];
    });
    setToastMsg(`«${item.name}» добавлен в предзаказ`);
    setTimeout(() => setToastMsg(''), 2400);
  };

  const confirmAddFromBuilder = () => {
    if (!builderDrink) return;
    const key = `${builderDrink.id}-${selectedSize.id}-${selectedMilk.id}-${selectedSyrup.id}-${extraShot}`;
    const summaryParts = [
      selectedSize.label,
      selectedMilk.label,
      selectedSyrup.label,
    ];
    if (extraShot) summaryParts.push('+ Доп. эспрессо-шот');

    setCart((prev) => {
      const existing = prev.find((c) => c.cartKey === key);
      if (existing) {
        return prev.map((c) => (c.cartKey === key ? { ...c, qty: c.qty + 1 } : c));
      }
      return [
        ...prev,
        {
          cartKey: key,
          itemId: builderDrink.id,
          name: builderDrink.name,
          image: builderDrink.image,
          customSummary: summaryParts.join(' • '),
          unitPrice: currentBuilderPrice,
          qty: 1,
        },
      ];
    });

    setToastMsg(`Собранный «${builderDrink.name}» добавлен в предзаказ`);
    setTimeout(() => setToastMsg(''), 2500);
    setBuilderDrink(null);
    setDrawerOpen(true);
  };

  const updateCartQty = (cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.cartKey === cartKey ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeCartItem = (cartKey) => {
    setCart((prev) => prev.filter((c) => c.cartKey !== cartKey));
  };

  const totalItemsCount = useMemo(
    () => cart.reduce((sum, c) => sum + c.qty, 0),
    [cart]
  );

  const totalOrderPrice = useMemo(
    () => cart.reduce((sum, c) => sum + c.unitPrice * c.qty, 0),
    [cart]
  );

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setCheckoutError('Корзина пуста. Добавьте напиток или выпечку.');
      return;
    }
    if (!customerName.trim() || customerPhone.trim().length < 6) {
      setCheckoutError('Укажите ваше имя (для надписи на стакане) и номер телефона.');
      return;
    }
    setCheckoutError('');
    setCompletedOrder({
      number: `R01-${Math.floor(10 + Math.random() * 89)}`,
      items: [...cart],
      total: totalOrderPrice,
      location: pickupLocation,
      readyIn: pickupTime,
      name: customerName.trim(),
      phone: customerPhone.trim(),
    });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#231B15] font-sans pb-24 selection:bg-[#4A3222] selection:text-white">
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#4A3222] text-white text-xs font-medium">
          <CheckCircleIcon className="w-4 h-4 text-white shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 5. Строгая верхняя полоса кофейни ROASTERY 01 */}
      <header className="sticky top-0 z-40 bg-[#FCFBF8] border-b border-[#E2DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-base font-bold tracking-tight text-[#231B15] font-mono">
              ROASTERY 01
            </span>
            <span className="hidden sm:inline-block text-xs text-[#6B5B4F] border-l border-[#E2DCD0] pl-4">
              Specialty Coffee & Bakery • Астана
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#6B5B4F]">
            <a href="#menu" className="hover:text-[#231B15] transition">
              Меню-борд
            </a>
            <a href="#roastery" className="hover:text-[#231B15] transition">
              Обжарочный цех
            </a>
            <a href="#locations" className="hover:text-[#231B15] transition">
              Локации (3)
            </a>
          </nav>

          <button
            type="button"
            onClick={() => {
              setCompletedOrder(null);
              setDrawerOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#4A3222] hover:bg-[#382519] text-white text-xs font-medium transition"
          >
            <ShoppingBagIcon className="w-4 h-4" />
            <span>Предзаказ</span>
            <span className="px-2 py-0.5 rounded-sm bg-[#231B15] text-white text-[11px] font-mono">
              {totalItemsCount} • {totalOrderPrice.toLocaleString('ru-RU')} ₸
            </span>
          </button>
        </div>
      </header>

      {/* 6. Редакционный Hero-блок кофейни */}
      <section className="border-b border-[#E2DCD0] py-14 sm:py-20 bg-[#FCFBF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-widest text-[#6B5B4F] mb-4">
              BATCH ROASTED IN ASTANA • Q-GRADE 86+ • TO-GO SERVICE
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#231B15] leading-[1.12]">
              Городская кофейня собственной обжарки и ремесленная пекарня
            </h1>

            <p className="mt-5 text-base text-[#6B5B4F] leading-relaxed max-w-xl">
              Нажмите на любой эспрессо-напиток в меню-борде ниже, чтобы выбрать объём стакана, растительное молоко и крафтовый сироп. Бариста приготовит заказ к вашему приходу в выбранной точке Астаны.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#4A3222] hover:bg-[#382519] text-white font-medium text-xs uppercase tracking-wider transition"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>Перейти к меню-борду</span>
              </a>
              <button
                type="button"
                onClick={() => openDrinkBuilder(COFFEE_MENU[0])}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#F4F1EA] hover:bg-[#E7E1D5] text-[#231B15] font-medium text-xs uppercase tracking-wider border border-[#E2DCD0] transition"
              >
                <span>Настроить Флэт Уайт (от 1 490 ₸)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-md overflow-hidden border border-[#E2DCD0] bg-[#F4F1EA]">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80"
                alt="ROASTERY 01 Astana"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="p-4 bg-[#FCFBF8] border-t border-[#E2DCD0] flex items-center justify-between text-xs font-mono">
                <span className="text-[#231B15]">ЛОТ НЕДЕЛИ: ЭФИОПИЯ ИРГАЧЕФФ</span>
                <span className="text-[#6B5B4F]">МЫТАЯ ОБРАБОТКА • Q-87.5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Меню-борд напитков и выпечки (таблично-редакционная сетка без шаблонных бейджей на фото) */}
      <section id="menu" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2DCD0] mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#6B5B4F] mb-1">
              01 / Меню-борд и конструктор
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#231B15]">
              Напитки и свежая выпечка
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition border ${
                  activeCategory === cat
                    ? 'bg-[#4A3222] text-white border-[#4A3222]'
                    : 'bg-[#FCFBF8] text-[#6B5B4F] border-[#E2DCD0] hover:border-[#4A3222]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[#E2DCD0] rounded-md bg-[#FCFBF8] divide-y md:divide-y-0 md:grid-flow-row">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              onClick={() => openDrinkBuilder(item)}
              className="cursor-pointer group p-5 sm:p-6 border-b border-r border-[#E2DCD0] hover:bg-[#F8F5EE] transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-[#6B5B4F]">
                      {item.category} • {item.calories}
                    </div>
                    <h3 className="text-base font-semibold text-[#231B15] mt-0.5">
                      {item.name}
                    </h3>
                  </div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-md object-cover border border-[#E2DCD0] shrink-0"
                    loading="lazy"
                  />
                </div>

                <p className="text-xs text-[#6B5B4F] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#E2DCD0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6B5B4F] block">
                    {item.isCustomizable ? 'БАЗОВАЯ ЦЕНА (250 МЛ)' : 'ПОРЦИЯ'}
                  </span>
                  <span className="text-base font-mono font-semibold text-[#231B15]">
                    {item.basePrice.toLocaleString('ru-RU')} ₸
                  </span>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F4F1EA] group-hover:bg-[#4A3222] text-[#231B15] group-hover:text-white border border-[#E2DCD0] group-hover:border-[#4A3222] text-xs font-medium transition">
                  {item.isCustomizable ? (
                    <>
                      <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                      <span>Собрать стакан</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Добавить</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Блок про обжарку зерна */}
      <section id="roastery" className="py-16 bg-[#FCFBF8] border-y border-[#E2DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="text-xs font-mono uppercase tracking-widest text-[#6B5B4F] mb-2">
              02 / Ростерия Probat UG-22
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#231B15] leading-tight">
              Собственная обжарка зерна и водоподготовка в Астане
            </h2>
            <p className="mt-4 text-sm text-[#6B5B4F] leading-relaxed">
              Мы обжариваем микролоты из Эфиопии, Колумбии, Кении и Бразилии в нашем цехе у EXPO. Каждая партия проверяется колориметром, а вода во всех кофейнях проходит 5 ступеней реминерализации под стандарты SCA.
            </p>

            <div className="mt-6 p-4 rounded-md bg-[#F4F1EA] border border-[#E2DCD0] flex items-center gap-3.5">
              <img
                src="https://randomuser.me/api/portraits/men/29.jpg"
                alt="Адильжан Сапаров — Шеф-обжарщик"
                className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#231B15]">
                  Адильжан Сапаров — Q-Grader и шеф-обжарщик ROASTERY 01
                </div>
                <div className="text-[#6B5B4F] mt-0.5">
                  Открытые каппинги свежей обжарки каждую субботу в 12:00
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-[#E2DCD0] font-mono">
              <div>
                <div className="text-lg font-semibold text-[#4A3222]">14 ДНЕЙ</div>
                <div className="text-[11px] text-[#6B5B4F] mt-1">Макс. срок зерна с даты обжарки</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#231B15]">93.5 °C</div>
                <div className="text-[11px] text-[#6B5B4F] mt-1">Экстракция на La Marzocco Linea PB</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#231B15]">4 ВИДА</div>
                <div className="text-[11px] text-[#6B5B4F] mt-1">Альтернативного молока</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-md overflow-hidden border border-[#E2DCD0]">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
                alt="Обжарка кофе ROASTERY 01"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Локации кофейни в Астане */}
      <section id="locations" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-[#E2DCD0] mb-8">
          <div className="text-xs font-mono uppercase tracking-widest text-[#6B5B4F] mb-1">
            03 / Адреса кофеен
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#231B15]">
            Точки выдачи предзаказа в Астане
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E2DCD0] rounded-md divide-y md:divide-y-0 md:divide-x divide-[#E2DCD0] bg-[#FCFBF8]">
          {COFFEE_LOCATIONS.map((loc, idx) => {
            const isSelected = pickupLocation === loc.name;
            return (
              <div
                key={loc.id}
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 font-mono text-xs">
                    <span className="text-[#6B5B4F]">ЛОКАЦИЯ 0{idx + 1}</span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-sm bg-[#4A3222] text-white text-[10px]">
                        ВЫБРАНА
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#231B15]">{loc.name}</h3>
                  <div className="text-xs font-medium text-[#6B5B4F] mt-1">
                    {loc.address}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B5B4F] mt-2 font-mono">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span>{loc.hours}</span>
                  </div>
                  <p className="text-xs text-[#6B5B4F] mt-3 pt-3 border-t border-[#E2DCD0]">
                    {loc.features}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPickupLocation(loc.name);
                    setToastMsg(`Точка выдачи: ${loc.name}`);
                    setTimeout(() => setToastMsg(''), 2300);
                  }}
                  className={`mt-5 w-full py-2 rounded-md text-xs font-medium transition border ${
                    isSelected
                      ? 'bg-[#4A3222] text-white border-[#4A3222]'
                      : 'bg-[#F4F1EA] hover:bg-[#4A3222] text-[#231B15] hover:text-white border-[#E2DCD0] hover:border-[#4A3222]'
                  }`}
                >
                  {isSelected ? 'Текущая точка выдачи' : 'Выбрать эту кофейню'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. Модальное окно конструктора напитка */}
      {builderDrink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-lg rounded-md bg-[#FCFBF8] border border-[#E2DCD0] text-[#231B15] p-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setBuilderDrink(null)}
              className="absolute top-4 right-4 p-1.5 rounded-md bg-[#F4F1EA] hover:bg-[#4A3222] hover:text-white transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-5 border-b border-[#E2DCD0]">
              <img
                src={builderDrink.image}
                alt={builderDrink.name}
                className="w-16 h-16 rounded-md object-cover border border-[#E2DCD0]"
              />
              <div>
                <span className="text-[11px] font-mono uppercase text-[#6B5B4F]">
                  Параметры стакана
                </span>
                <h3 className="text-lg font-semibold text-[#231B15]">
                  {builderDrink.name}
                </h3>
                <div className="text-xs text-[#6B5B4F] mt-0.5 font-mono">
                  База: {builderDrink.basePrice.toLocaleString('ru-RU')} ₸
                </div>
              </div>
            </div>

            <div className="space-y-5 py-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B4F] mb-2">
                  01 / Объём стакана
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COFFEE_CUSTOMIZATION.sizes.map((sz) => {
                    const active = selectedSize.id === sz.id;
                    return (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 px-3 rounded-md border text-xs font-medium transition ${
                          active
                            ? 'bg-[#4A3222] text-white border-[#4A3222]'
                            : 'bg-[#F4F1EA] text-[#231B15] border-[#E2DCD0]'
                        }`}
                      >
                        <div>{sz.label}</div>
                        <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                          {sz.priceAdd === 0 ? '0 ₸' : `+${sz.priceAdd} ₸`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B4F] mb-2">
                  02 / Молоко
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COFFEE_CUSTOMIZATION.milks.map((mk) => {
                    const active = selectedMilk.id === mk.id;
                    return (
                      <button
                        key={mk.id}
                        type="button"
                        onClick={() => setSelectedMilk(mk)}
                        className={`py-2 px-3 rounded-md border text-left text-xs font-medium flex items-center justify-between transition ${
                          active
                            ? 'bg-[#4A3222] text-white border-[#4A3222]'
                            : 'bg-[#F4F1EA] text-[#231B15] border-[#E2DCD0]'
                        }`}
                      >
                        <span>{mk.label}</span>
                        <span className="font-mono">
                          {mk.priceAdd === 0 ? '0 ₸' : `+${mk.priceAdd} ₸`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B4F] mb-2">
                  03 / Сироп
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COFFEE_CUSTOMIZATION.syrups.map((sr) => {
                    const active = selectedSyrup.id === sr.id;
                    return (
                      <button
                        key={sr.id}
                        type="button"
                        onClick={() => setSelectedSyrup(sr)}
                        className={`py-2 px-3 rounded-md border text-left text-xs font-medium flex items-center justify-between transition ${
                          active
                            ? 'bg-[#4A3222] text-white border-[#4A3222]'
                            : 'bg-[#F4F1EA] text-[#231B15] border-[#E2DCD0]'
                        }`}
                      >
                        <span>{sr.label}</span>
                        <span className="font-mono">
                          {sr.priceAdd === 0 ? '0 ₸' : `+${sr.priceAdd} ₸`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setExtraShot((prev) => !prev)}
                  className={`w-full py-2.5 px-3.5 rounded-md border text-xs font-medium flex items-center justify-between transition ${
                    extraShot
                      ? 'bg-[#4A3222] text-white border-[#4A3222]'
                      : 'bg-[#F4F1EA] text-[#231B15] border-[#E2DCD0]'
                  }`}
                >
                  <span>+ Дополнительный эспрессо-шот</span>
                  <span className="font-mono">+350 ₸</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2DCD0] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#6B5B4F] block">Стоимость стакана:</span>
                <span className="text-xl font-mono font-semibold text-[#231B15]">
                  {currentBuilderPrice.toLocaleString('ru-RU')} ₸
                </span>
              </div>
              <button
                type="button"
                onClick={confirmAddFromBuilder}
                className="px-5 py-2.5 rounded-md bg-[#4A3222] hover:bg-[#382519] text-white font-medium text-xs uppercase tracking-wider transition"
              >
                Добавить в заказ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Боковая панель предзаказа «С собой» */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <div className="w-full max-w-md bg-[#FCFBF8] text-[#231B15] h-full flex flex-col justify-between p-6 overflow-y-auto border-l border-[#E2DCD0]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DCD0]">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5 text-[#4A3222]" />
                  <h3 className="text-base font-semibold">Предзаказ «С собой»</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-md bg-[#F4F1EA] hover:bg-[#4A3222] hover:text-white transition"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {completedOrder ? (
                <div className="mt-6 p-5 rounded-md bg-[#F4F1EA] border border-[#4A3222] space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-[#4A3222] shrink-0" />
                    <div>
                      <div className="text-xs font-mono uppercase text-[#6B5B4F]">
                        Талон заказа #{completedOrder.number}
                      </div>
                      <h4 className="text-base font-semibold text-[#231B15]">
                        Передано на бар, {completedOrder.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 bg-[#FCFBF8] p-3.5 rounded-md border border-[#E2DCD0]">
                    <div>
                      <span className="text-[#6B5B4F]">Точка выдачи: </span>
                      <span className="font-semibold">{completedOrder.location}</span>
                    </div>
                    <div>
                      <span className="text-[#6B5B4F]">Готовность: </span>
                      <span className="font-semibold text-[#4A3222]">{completedOrder.readyIn}</span>
                    </div>
                    <div>
                      <span className="text-[#6B5B4F]">К оплате: </span>
                      <span className="font-mono font-semibold">
                        {completedOrder.total.toLocaleString('ru-RU')} ₸
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCompletedOrder(null);
                      setDrawerOpen(false);
                    }}
                    className="w-full py-2.5 rounded-md bg-[#4A3222] text-white text-xs font-medium"
                  >
                    Закрыть окно
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-semibold text-[#231B15]">
                    Список предзаказа пуст
                  </p>
                  <p className="text-xs text-[#6B5B4F] mt-1">
                    Выберите напиток или выпечку в меню-борде.
                  </p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-[#E2DCD0] border border-[#E2DCD0] rounded-md bg-[#F4F1EA]">
                  {cart.map((c) => (
                    <div
                      key={c.cartKey}
                      className="p-3.5 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#231B15] truncate">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-[#6B5B4F] mt-0.5 leading-snug">
                          {c.customSummary}
                        </div>
                        <div className="text-xs font-mono font-semibold text-[#4A3222] mt-1">
                          {(c.unitPrice * c.qty).toLocaleString('ru-RU')} ₸
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => removeCartItem(c.cartKey)}
                          className="text-[#6B5B4F] hover:text-[#231B15]"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-[#FCFBF8] px-2 py-1 rounded-md border border-[#E2DCD0]">
                          <button
                            type="button"
                            onClick={() => updateCartQty(c.cartKey, -1)}
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-semibold w-4 text-center">{c.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(c.cartKey, 1)}
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

            {!completedOrder && cart.length > 0 && (
              <form
                onSubmit={handleCheckoutSubmit}
                className="mt-6 pt-4 border-t border-[#E2DCD0] space-y-3"
              >
                {checkoutError && (
                  <div className="p-2.5 rounded-md bg-[#F4F1EA] border border-[#4A3222] text-[#231B15] text-xs flex items-center gap-1.5">
                    <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6B5B4F] mb-1">
                    Точка самовывоза
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#F4F1EA] border border-[#E2DCD0] text-xs font-medium"
                  >
                    {COFFEE_LOCATIONS.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name} ({l.address})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#6B5B4F] mb-1">
                    Время готовности
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Через 10 минут', 'Через 20 минут', 'Через 35 минут'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPickupTime(t)}
                        className={`py-2 rounded-md text-[11px] font-medium border ${
                          pickupTime === t
                            ? 'bg-[#4A3222] text-white border-[#4A3222]'
                            : 'bg-[#F4F1EA] text-[#231B15] border-[#E2DCD0]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Имя на стакане *"
                    className="px-3 py-2 rounded-md bg-[#F4F1EA] border border-[#E2DCD0] text-xs"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+7 (707) 000-00-00 *"
                    className="px-3 py-2 rounded-md bg-[#F4F1EA] border border-[#E2DCD0] text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-medium text-[#6B5B4F]">Сумма предзаказа:</span>
                  <span className="text-lg font-mono font-semibold text-[#231B15]">
                    {totalOrderPrice.toLocaleString('ru-RU')} ₸
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-[#4A3222] hover:bg-[#382519] text-white font-medium text-xs uppercase tracking-wider transition"
                >
                  Отправить заказ бариста
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 12. Футер */}
      <footer className="py-10 border-t border-[#E2DCD0] bg-[#FCFBF8] text-xs text-[#6B5B4F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono font-semibold text-[#231B15]">
            ROASTERY 01 • SPECIALTY COFFEE ASTANA
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-[#4A3222]" />
              EXPO • Ботанический сад • Кенесары, 40
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
