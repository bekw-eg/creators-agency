import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { RESTAURANT_MENU, RESTAURANT_HALLS } from '../data/restaurantData';

// 1. Страница ресторана «TERRA & FIRE»: редакционная гастрономическая вёрстка (#F6F3EE фон, #FFFFFF блоки, #E6DFD3 линии, #8C3B2B терракота)
export default function RestaurantPage() {
  // 2. Состояния для фильтрации меню, поиска и тегов
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedTag, setSelectedTag] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [tastingSelection, setTastingSelection] = useState(['dish-1', 'dish-7']);

  // 3. Состояния формы бронирования столика
  const [resDate, setResDate] = useState('2026-11-26');
  const [resTime, setResTime] = useState('19:30');
  const [resGuests, setResGuests] = useState(2);
  const [resZone, setResZone] = useState('Основной зал');
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resWishes, setResWishes] = useState('');
  const [resError, setResError] = useState('');
  const [resConfirmed, setResConfirmed] = useState(null);

  const categories = ['Все', 'Закуски', 'Горячее', 'Гриль', 'Десерты', 'Напитки'];
  const tagFilters = ['Все', 'Хит', 'Острое', 'Шеф рекомендует', 'Новинка'];

  // 4. Реактивная фильтрация блюд по категории, тегам и поисковому запросу
  const filteredDishes = useMemo(() => {
    return RESTAURANT_MENU.filter((dish) => {
      const matchCat =
        selectedCategory === 'Все' || dish.category === selectedCategory;
      const matchTag =
        selectedTag === 'Все' || dish.tags.includes(selectedTag);
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q);
      return matchCat && matchTag && matchSearch;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  // 5. Подборка блюд к предзаказу для стола
  const selectedTastingDishes = useMemo(
    () => RESTAURANT_MENU.filter((d) => tastingSelection.includes(d.id)),
    [tastingSelection]
  );

  const tastingTotal = useMemo(
    () => selectedTastingDishes.reduce((sum, d) => sum + d.price, 0),
    [selectedTastingDishes]
  );

  const toggleDishInTasting = (id) => {
    setTastingSelection((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectHallForBooking = (hallName) => {
    setResZone(hallName);
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (!resName.trim() || resPhone.trim().length < 6) {
      setResError('Пожалуйста, укажите ваше имя и контактный телефон для подтверждения резерва.');
      return;
    }
    if (!resDate || !resTime) {
      setResError('Выберите желаемую дату и время визита.');
      return;
    }
    setResError('');
    setResConfirmed({
      id: `TF-${Math.floor(100 + Math.random() * 900)}`,
      date: resDate,
      time: resTime,
      guests: resGuests,
      zone: resZone,
      name: resName.trim(),
      phone: resPhone.trim(),
      wishes: resWishes.trim(),
      preselectedDishes: selectedTastingDishes,
      preselectedSum: tastingTotal,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1C1917] font-sans pb-24 selection:bg-[#8C3B2B] selection:text-white">
      {/* 6. Верхняя навигация ресторана */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-semibold tracking-tight text-[#1C1917]">
              TERRA & FIRE
            </span>
            <span className="hidden sm:inline-block text-xs text-[#57534E] border-l border-[#E6DFD3] pl-4">
              Wood-Fired Gastronomy • Бульвар Нуржол
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider text-[#57534E] font-medium">
            <a href="#menu" className="hover:text-[#1C1917] transition">
              Меню кухни
            </a>
            <a href="#halls" className="hover:text-[#1C1917] transition">
              Залы
            </a>
            <a href="#reservation" className="hover:text-[#1C1917] transition">
              Резерв стола
            </a>
          </nav>

          <a
            href="#reservation"
            className="px-4 py-2 rounded-md bg-[#8C3B2B] hover:bg-[#743022] text-white text-xs font-medium uppercase tracking-wider transition"
          >
            Бронь стола
          </a>
        </div>
      </header>

      {/* 7. Редакционный Hero-блок */}
      <section className="border-b border-[#E6DFD3] py-14 sm:py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-widest text-[#8C3B2B] mb-4">
              АСТАНА, УЛ. ДОСТЫК, 16 • ОТКРЫТЫЙ ОГОНЬ И ЭНОТЕКА
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#1C1917] leading-[1.14]">
              Гастрономия живого огня, выдержанного мяса и локальных фермерских продуктов
            </h1>

            <p className="mt-5 text-base text-[#57534E] leading-relaxed max-w-xl">
              Мы готовим в испанском хоспере и дровяной печи на углях карельской берёзы и яблони. Мраморная говядина 28-дневного влажного вызревания, дикая рыба и ремесленный хлеб собственной выпечки.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#reservation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#8C3B2B] hover:bg-[#743022] text-white font-medium text-xs uppercase tracking-wider transition"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Забронировать столик</span>
              </a>
              <a
                href="#menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#F6F3EE] hover:bg-[#EAE4DA] text-[#1C1917] font-medium text-xs uppercase tracking-wider border border-[#E6DFD3] transition"
              >
                <span>Меню кухни ({RESTAURANT_MENU.length} блюд)</span>
              </a>
            </div>

            {/* Бренд-шеф с реалистичной круглой аватаркой */}
            <div className="mt-10 pt-6 border-t border-[#E6DFD3] flex items-center gap-3.5">
              <img
                src="https://randomuser.me/api/portraits/men/36.jpg"
                alt="Бренд-шеф Руслан Бекетов"
                className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#1C1917]">
                  Руслан Бекетов — Бренд-шеф TERRA & FIRE
                </div>
                <div className="text-[#57534E] mt-0.5">
                  Собственная камера вызревания мяса и открытая кухня в основном зале
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-md overflow-hidden border border-[#E6DFD3] bg-[#F6F3EE]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Подача блюд TERRA & FIRE"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-[#FFFFFF] border-t border-[#E6DFD3] flex items-center justify-between text-xs">
                <span className="font-serif text-sm font-semibold text-[#1C1917]">
                  Рибай Prime на берёзовых углях (380 г)
                </span>
                <span className="font-mono font-semibold text-[#8C3B2B]">
                  14 500 ₸
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Интерактивное гастрономическое меню в редакционном табличном формате */}
      <section id="menu" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E6DFD3] mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8C3B2B] font-mono mb-1">
              01 / Гастрономическая карта
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Основное меню кухни
            </h2>
          </div>

          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#57534E] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск блюда или ингредиента..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-[#FFFFFF] border border-[#E6DFD3] text-sm text-[#1C1917] placeholder:text-[#8A847C] focus:outline-none focus:border-[#8C3B2B]"
            />
          </div>
        </div>

        {/* Фильтры курса и тегов */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition border ${
                  selectedCategory === cat
                    ? 'bg-[#1C1917] text-white border-[#1C1917]'
                    : 'bg-[#FFFFFF] text-[#57534E] border-[#E6DFD3] hover:border-[#1C1917]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#57534E] mr-1 font-mono">ОТМЕТКИ:</span>
            {tagFilters.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition border ${
                  selectedTag === tag
                    ? 'bg-[#8C3B2B] text-white border-[#8C3B2B]'
                    : 'bg-[#FFFFFF] text-[#57534E] border-[#E6DFD3] hover:border-[#8C3B2B]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Редакционный двухколоночный список блюд */}
        {filteredDishes.length === 0 ? (
          <div className="p-10 rounded-md bg-[#FFFFFF] border border-[#E6DFD3]">
            <p className="font-serif text-lg text-[#1C1917]">
              По выбранному фильтру позиций не найдено
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Все');
                setSelectedTag('Все');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-md bg-[#8C3B2B] text-white text-xs font-medium"
            >
              Сбросить параметры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 border border-[#E6DFD3] rounded-md bg-[#FFFFFF] divide-y divide-[#E6DFD3]">
            {filteredDishes.map((dish) => {
              const inTasting = tastingSelection.includes(dish.id);
              return (
                <div
                  key={dish.id}
                  className="p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-[#FAF8F4] transition md:odd:border-r md:odd:border-[#E6DFD3]"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-20 h-20 rounded-md object-cover border border-[#E6DFD3] shrink-0"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono uppercase text-[#8C3B2B]">
                        {dish.category} • {dish.weight}
                      </span>
                      {dish.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#F6F3EE] border border-[#E6DFD3] text-[#57534E]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#1C1917] mt-1 leading-snug">
                      {dish.name}
                    </h3>

                    <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                      {dish.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#E6DFD3] flex items-center justify-between gap-2">
                      <span className="font-serif text-base font-semibold text-[#1C1917]">
                        {dish.price.toLocaleString('ru-RU')} ₸
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleDishInTasting(dish.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition border ${
                          inTasting
                            ? 'bg-[#1C1917] text-white border-[#1C1917]'
                            : 'bg-[#F6F3EE] hover:bg-[#8C3B2B] text-[#1C1917] hover:text-white border-[#E6DFD3] hover:border-[#8C3B2B]'
                        }`}
                      >
                        {inTasting ? (
                          <>
                            <CheckIcon className="w-3.5 h-3.5" />
                            <span>В сете стола</span>
                          </>
                        ) : (
                          <span>Отметить к столу</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 9. Галерея залов ресторана */}
      <section id="halls" className="py-16 bg-[#FFFFFF] border-y border-[#E6DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-[#E6DFD3] mb-8">
            <div className="text-xs uppercase tracking-widest text-[#8C3B2B] font-mono mb-1">
              02 / Зонирование ресторана
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Залы и всесезонная терраса
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E6DFD3] rounded-md divide-y md:divide-y-0 md:divide-x divide-[#E6DFD3] bg-[#F6F3EE]">
            {RESTAURANT_HALLS.map((hall) => (
              <div
                key={hall.id}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 border-b border-[#E6DFD3] overflow-hidden">
                    <img
                      src={hall.image}
                      alt={hall.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs font-mono text-[#8C3B2B]">
                      <span>{hall.capacity}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#1C1917] mt-1">
                      {hall.name}
                    </h3>
                    <div className="text-xs font-medium text-[#57534E] mt-1">
                      {hall.atmosphere}
                    </div>
                    <p className="text-xs text-[#57534E] mt-2.5 leading-relaxed">
                      {hall.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    type="button"
                    onClick={() => handleSelectHallForBooking(hall.name)}
                    className="w-full py-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#8C3B2B] text-[#1C1917] hover:text-white border border-[#E6DFD3] hover:border-[#8C3B2B] text-xs font-medium uppercase tracking-wider transition"
                  >
                    Выбрать зал для резерва
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Форма бронирования столика */}
      <section id="reservation" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3] mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#8C3B2B] font-mono mb-1">
                03 / Онлайн-резерв
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Бронирование стола
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-[#F6F3EE] px-3.5 py-2.5 rounded-md border border-[#E6DFD3] shrink-0">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Старший хостес Анель"
                className="w-10 h-10 rounded-full object-cover border border-neutral-200"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#1C1917]">Анель — Старший хостес</div>
                <div className="text-[#57534E]">Служба гостеприимства</div>
              </div>
            </div>
          </div>

          {resConfirmed ? (
            <div className="p-6 rounded-md bg-[#F6F3EE] border border-[#8C3B2B]">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircleIcon className="w-6 h-6 text-[#8C3B2B] shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#8C3B2B] font-mono">
                    Резерв подтверждён • #{resConfirmed.id}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                    Ждём вас, {resConfirmed.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[#E6DFD3] text-xs">
                <div>
                  <span className="text-[#57534E] block">Дата</span>
                  <span className="font-semibold text-sm text-[#1C1917]">{resConfirmed.date}</span>
                </div>
                <div>
                  <span className="text-[#57534E] block">Время</span>
                  <span className="font-semibold text-sm text-[#1C1917]">{resConfirmed.time}</span>
                </div>
                <div>
                  <span className="text-[#57534E] block">Гостей</span>
                  <span className="font-semibold text-sm text-[#1C1917]">{resConfirmed.guests} перс.</span>
                </div>
                <div>
                  <span className="text-[#57534E] block">Зал</span>
                  <span className="font-semibold text-sm text-[#8C3B2B]">{resConfirmed.zone}</span>
                </div>
              </div>

              {resConfirmed.preselectedDishes.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-[#1C1917] mb-2">
                    Предварительный сет к столу ({resConfirmed.preselectedSum.toLocaleString('ru-RU')} ₸):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resConfirmed.preselectedDishes.map((d) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#E6DFD3] text-xs text-[#1C1917]"
                      >
                        {d.name} ({d.price.toLocaleString('ru-RU')} ₸)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-[#57534E]">
                  Подтверждение отправлено на {resConfirmed.phone}
                </span>
                <button
                  type="button"
                  onClick={() => setResConfirmed(null)}
                  className="px-4 py-2 rounded-md bg-[#1C1917] text-white text-xs font-medium"
                >
                  Изменить бронь
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReservationSubmit} className="space-y-5">
              {resError && (
                <div className="p-3 rounded-md bg-[#F6F3EE] border border-[#8C3B2B] text-[#8C3B2B] text-xs flex items-center gap-2 font-medium">
                  <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
                  <span>{resError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                    Дата визита
                  </label>
                  <div className="relative">
                    <CalendarDaysIcon className="w-4 h-4 text-[#57534E] absolute left-3.5 top-3" />
                    <input
                      type="date"
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-md bg-[#F6F3EE] border border-[#E6DFD3] text-sm text-[#1C1917] focus:outline-none focus:border-[#8C3B2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                    Время
                  </label>
                  <div className="relative">
                    <ClockIcon className="w-4 h-4 text-[#57534E] absolute left-3.5 top-3" />
                    <select
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-md bg-[#F6F3EE] border border-[#E6DFD3] text-sm text-[#1C1917] focus:outline-none focus:border-[#8C3B2B]"
                    >
                      <option>13:00</option>
                      <option>15:00</option>
                      <option>18:00</option>
                      <option>19:30</option>
                      <option>20:30</option>
                      <option>21:30</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                    Количество гостей
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 4, 6, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setResGuests(num)}
                        className={`flex-1 py-2 rounded-md text-xs font-semibold border transition ${
                          resGuests === num
                            ? 'bg-[#1C1917] text-white border-[#1C1917]'
                            : 'bg-[#F6F3EE] text-[#1C1917] border-[#E6DFD3]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                  Зона размещения
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Основной зал', 'Всесезонная Терраса', 'Каминный VIP-зал'].map(
                    (zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => setResZone(zone)}
                        className={`py-2.5 px-4 rounded-md border text-xs font-medium transition ${
                          resZone === zone
                            ? 'bg-[#8C3B2B] text-white border-[#8C3B2B]'
                            : 'bg-[#F6F3EE] text-[#1C1917] border-[#E6DFD3] hover:border-[#8C3B2B]'
                        }`}
                      >
                        {zone}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    placeholder="Например, Динара"
                    className="w-full px-3.5 py-2 rounded-md bg-[#F6F3EE] border border-[#E6DFD3] text-sm text-[#1C1917] focus:outline-none focus:border-[#8C3B2B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                    Контактный телефон *
                  </label>
                  <input
                    type="tel"
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    placeholder="+7 (702) 000-00-00"
                    className="w-full px-3.5 py-2 rounded-md bg-[#F6F3EE] border border-[#E6DFD3] text-sm text-[#1C1917] focus:outline-none focus:border-[#8C3B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1.5">
                  Пожелания к столу
                </label>
                <input
                  type="text"
                  value={resWishes}
                  onChange={(e) => setResWishes(e.target.value)}
                  placeholder="Столик у окна, детский стульчик и т.д."
                  className="w-full px-3.5 py-2 rounded-md bg-[#F6F3EE] border border-[#E6DFD3] text-sm text-[#1C1917] focus:outline-none focus:border-[#8C3B2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#8C3B2B] hover:bg-[#743022] text-white font-medium text-xs uppercase tracking-wider transition"
              >
                Подтвердить резерв ({resZone} • {resGuests} гостей)
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 11. Футер */}
      <footer className="py-10 border-t border-[#E6DFD3] bg-[#FFFFFF] text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-serif text-base font-semibold text-[#1C1917]">
            TERRA & FIRE • АСТАНА
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-[#8C3B2B]" />
              ул. Достык, 16 (бульвар Нуржол)
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-[#8C3B2B]" />
              12:00 – 00:00
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-[#8C3B2B]" />
              +7 (7172) 79-40-15
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
