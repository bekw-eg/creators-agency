import React, { useState, useMemo } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
  UserIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  BARBER_SERVICES,
  BARBER_MASTERS,
  BARBER_TIME_SLOTS,
  BARBER_REVIEWS,
} from '../data/barbershopData';

// 1. Генерация ближайших 6 дат для записи
function getUpcomingDates() {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = [
    'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
  ];
  const result = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label =
      i === 0
        ? `Сегодня, ${d.getDate()} ${months[d.getMonth()]}`
        : i === 1
        ? `Завтра, ${d.getDate()} ${months[d.getMonth()]}`
        : `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
    result.push({
      id: `date-${i}`,
      label,
    });
  }
  return result;
}

// 2. Страница Барбершопа «BLADE & CRAFT»: строгий табличный прейскурант и журнальная сетка (#121212 фон, #1A1A1A блоки, #2A2A2A линии, #B89768 латунь)
export default function BarbershopPage() {
  const upcomingDates = useMemo(() => getUpcomingDates(), []);

  // 3. Состояния для фильтрации прейскуранта и 4-шаговой онлайн-записи
  const [activePriceTab, setActivePriceTab] = useState('Все');
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState(['srv-1']);
  const [selectedMasterId, setSelectedMasterId] = useState(BARBER_MASTERS[0].id);
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].label);
  const [selectedSlot, setSelectedSlot] = useState('16:00');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientComment, setClientComment] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const priceCategories = ['Все', 'Стрижки', 'Борода', 'Комплексы'];

  const filteredPriceList = useMemo(() => {
    if (activePriceTab === 'Все') return BARBER_SERVICES;
    return BARBER_SERVICES.filter((s) => s.category === activePriceTab);
  }, [activePriceTab]);

  // 4. Вычисление выбранных услуг, общей стоимости в ₸ и суммарной длительности в минутах
  const selectedServices = useMemo(
    () => BARBER_SERVICES.filter((s) => selectedServiceIds.includes(s.id)),
    [selectedServiceIds]
  );

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.price, 0),
    [selectedServices]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.duration, 0),
    [selectedServices]
  );

  const currentMaster = useMemo(
    () => BARBER_MASTERS.find((m) => m.id === selectedMasterId) || BARBER_MASTERS[0],
    [selectedMasterId]
  );

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    setFormError('');
  };

  const quickBookService = (serviceId) => {
    if (!selectedServiceIds.includes(serviceId)) {
      setSelectedServiceIds((prev) => [...prev, serviceId]);
    }
    setBookingStep(1);
    setConfirmedBooking(null);
    setToastMessage('Услуга добавлена в лист записи');
    setTimeout(() => setToastMessage(''), 2500);
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickBookMaster = (masterId) => {
    setSelectedMasterId(masterId);
    if (selectedServiceIds.length === 0) {
      setSelectedServiceIds(['srv-1']);
    }
    setBookingStep(3);
    setConfirmedBooking(null);
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && selectedServiceIds.length === 0) {
      setFormError('Отметьте хотя бы одну позицию в прейскуранте.');
      return;
    }
    if (bookingStep === 2 && !selectedMasterId) {
      setFormError('Пожалуйста, выберите мастера.');
      return;
    }
    if (bookingStep === 3 && (!selectedDate || !selectedSlot)) {
      setFormError('Укажите дату и время.');
      return;
    }
    setFormError('');
    setBookingStep((prev) => Math.min(prev + 1, 4));
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!clientName.trim() || clientPhone.trim().length < 6) {
      setFormError('Введите имя и контактный телефон для подтверждения.');
      return;
    }
    setFormError('');
    const bookingCode = `BC-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBooking({
      code: bookingCode,
      services: selectedServices,
      master: currentMaster,
      date: selectedDate,
      time: selectedSlot,
      totalPrice,
      totalDuration,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientComment: clientComment.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F5F5F4] font-sans pb-24 selection:bg-[#B89768] selection:text-[#121212]">
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1A1A1A] border border-[#B89768] text-[#F5F5F4] text-xs font-medium">
          <CheckCircleIcon className="w-4 h-4 text-[#B89768] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 5. Строгая верхняя полоса навигации */}
      <header className="sticky top-0 z-40 bg-[#121212] border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display text-xl font-semibold tracking-wider uppercase text-[#F5F5F4]">
              BLADE & CRAFT
            </span>
            <span className="hidden sm:inline-block text-xs text-[#A1A1AA] border-l border-[#2A2A2A] pl-4 font-mono">
              ASTANA • МАНГИЛИК ЕЛ, 41/1
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider text-[#A1A1AA] font-medium">
            <a href="#prices" className="hover:text-[#F5F5F4] transition">
              Прейскурант
            </a>
            <a href="#booking-section" className="hover:text-[#F5F5F4] transition">
              Запись
            </a>
            <a href="#masters" className="hover:text-[#F5F5F4] transition">
              Мастера
            </a>
            <a href="#reviews" className="hover:text-[#F5F5F4] transition">
              Отзывы
            </a>
          </nav>

          <a
            href="#booking-section"
            className="px-4 py-2 rounded-md bg-[#B89768] hover:bg-[#a68658] text-[#121212] font-semibold text-xs uppercase tracking-wider transition"
          >
            Онлайн-запись
          </a>
        </div>
      </header>

      {/* 6. Журнальный Hero-блок с чётким разделением по линиям */}
      <section className="border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="text-xs font-mono uppercase tracking-widest text-[#B89768] mb-4">
              EST. 2021 • МУЖСКОЙ ПАРИКМАХЕРСКИЙ ЗАЛ • ЛЕВЫЙ БЕРЕГ
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-semibold uppercase tracking-tight text-[#F5F5F4] leading-[1.05]">
              Классическая мужская стрижка и бритьё опасной бритвой
            </h1>

            <p className="mt-6 text-base text-[#A1A1AA] leading-relaxed max-w-xl">
              Работаем на японском инструменте и британской косметике Lock Stock & Barrel. Без навязанных услуг: фиксированный прейскурант, стерилизация в автоклаве и запись к конкретному мастеру по времени.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#booking-section"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#B89768] hover:bg-[#a68658] text-[#121212] font-semibold text-xs uppercase tracking-wider transition"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                <span>Выбрать время визита</span>
              </a>
              <a
                href="#prices"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#1A1A1A] hover:bg-[#242424] text-[#F5F5F4] font-medium text-xs uppercase tracking-wider border border-[#2A2A2A] transition"
              >
                <span>Прейскурант (10 позиций)</span>
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 border-t border-[#2A2A2A] pt-6 gap-6">
              <div>
                <div className="text-xs font-mono uppercase text-[#A1A1AA]">График</div>
                <div className="text-sm font-semibold text-[#F5F5F4] mt-1">10:00 – 22:00</div>
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-[#A1A1AA]">Кресла</div>
                <div className="text-sm font-semibold text-[#F5F5F4] mt-1">Takara Belmont</div>
              </div>
              <div>
                <div className="text-xs font-mono uppercase text-[#A1A1AA]">Рейтинг 2ГИС</div>
                <div className="text-sm font-semibold text-[#B89768] mt-1">4.97 / 5.0</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[#2A2A2A] rounded-md overflow-hidden bg-[#1A1A1A]">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80"
                alt="Зал BLADE & CRAFT"
                className="w-full h-80 object-cover"
              />
              <div className="p-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono">
                <span className="text-[#A1A1AA]">АСТАНА, ПР. МАНГИЛИК ЕЛ, 41/1</span>
                <span className="text-[#B89768]">+7 (7172) 64-88-20</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Строгий табличный прейскурант (вместо карточной сетки) */}
      <section id="prices" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#2A2A2A] mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#B89768] font-mono mb-1">
              01 / Прейскурант
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-[#F5F5F4]">
              Стоимость услуг в тенге
            </h2>
          </div>

          <div className="flex flex-wrap gap-1 bg-[#1A1A1A] p-1 rounded-md border border-[#2A2A2A]">
            {priceCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActivePriceTab(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition ${
                  activePriceTab === cat
                    ? 'bg-[#B89768] text-[#121212] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Табличный список услуг */}
        <div className="border border-[#2A2A2A] rounded-md divide-y divide-[#2A2A2A] bg-[#1A1A1A]">
          {filteredPriceList.map((srv, idx) => {
            const isSelected = selectedServiceIds.includes(srv.id);
            return (
              <div
                key={srv.id}
                className={`p-4 sm:px-6 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                  isSelected ? 'bg-[#201D18]' : 'hover:bg-[#1E1E1E]'
                }`}
              >
                <div className="flex items-start gap-4 max-w-2xl">
                  <span className="text-xs font-mono text-[#A1A1AA] pt-1 w-6 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-[#F5F5F4]">
                        {srv.name}
                      </h3>
                      <span className="text-[11px] font-mono uppercase text-[#B89768]">
                        [{srv.category}]
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pl-10 md:pl-0 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="font-display text-lg font-semibold text-[#F5F5F4]">
                      {srv.price.toLocaleString('ru-RU')} ₸
                    </div>
                    <div className="text-[11px] font-mono text-[#A1A1AA] flex items-center md:justify-end gap-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{srv.duration} мин</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => quickBookService(srv.id)}
                    className={`px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition border ${
                      isSelected
                        ? 'bg-[#B89768] text-[#121212] border-[#B89768]'
                        : 'bg-[#121212] hover:bg-[#B89768] text-[#F5F5F4] hover:text-[#121212] border-[#2A2A2A] hover:border-[#B89768]'
                    }`}
                  >
                    {isSelected ? 'Выбрано' : 'Записаться'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Пошаговый интерактивный модуль онлайн-записи (4 шага) */}
      <section
        id="booking-section"
        className="py-16 sm:py-20 bg-[#1A1A1A] border-y border-[#2A2A2A]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-[#2A2A2A] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#B89768] font-mono mb-1">
                02 / Система резерва
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-[#F5F5F4]">
                Онлайн-запись к мастеру
              </h2>
            </div>
            <div className="text-xs font-mono text-[#A1A1AA]">
              Выбрано позиций: {selectedServiceIds.length} • {totalDuration} мин • {totalPrice.toLocaleString('ru-RU')} ₸
            </div>
          </div>

          {confirmedBooking ? (
            <div className="rounded-md bg-[#121212] border border-[#B89768] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-[#B89768] shrink-0" />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#B89768] font-mono">
                      Талон записи #{confirmedBooking.code}
                    </div>
                    <h3 className="text-xl font-semibold text-[#F5F5F4]">
                      Запись оформлена, {confirmedBooking.clientName}
                    </h3>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-[#A1A1AA]">Итоговая сумма:</div>
                  <div className="font-display text-2xl font-semibold text-[#B89768]">
                    {confirmedBooking.totalPrice.toLocaleString('ru-RU')} ₸
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#2A2A2A] text-sm">
                <div>
                  <div className="text-xs text-[#A1A1AA] font-mono uppercase mb-1">Дата и время</div>
                  <div className="font-semibold text-[#F5F5F4]">
                    {confirmedBooking.date}, {confirmedBooking.time}
                  </div>
                  <div className="text-xs text-[#B89768] mt-1">
                    Длительность: {confirmedBooking.totalDuration} мин
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={confirmedBooking.master.avatar}
                    alt={confirmedBooking.master.name}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-800 shrink-0"
                  />
                  <div>
                    <div className="text-xs text-[#A1A1AA] font-mono uppercase">Мастер</div>
                    <div className="font-semibold text-[#F5F5F4]">
                      {confirmedBooking.master.name}
                    </div>
                    <div className="text-xs text-[#A1A1AA]">
                      {confirmedBooking.master.role}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#A1A1AA] font-mono uppercase mb-1">Адрес и контакт</div>
                  <div className="font-semibold text-[#F5F5F4]">пр. Мангилик Ел, 41/1</div>
                  <div className="text-xs text-[#A1A1AA] mt-1">
                    Клиент: {confirmedBooking.clientPhone}
                  </div>
                </div>
              </div>

              <div className="py-5">
                <div className="text-xs text-[#A1A1AA] font-mono uppercase mb-2.5">
                  Состав записи ({confirmedBooking.services.length}):
                </div>
                <div className="divide-y divide-[#2A2A2A] border border-[#2A2A2A] rounded-md bg-[#1A1A1A]">
                  {confirmedBooking.services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between text-xs px-4 py-2.5"
                    >
                      <span className="text-[#F5F5F4] font-medium">{s.name}</span>
                      <span className="text-[#B89768] font-mono">
                        {s.price.toLocaleString('ru-RU')} ₸ ({s.duration} мин)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[#A1A1AA]">
                  Уведомление отправлено на номер {confirmedBooking.clientPhone}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setBookingStep(1);
                    setClientName('');
                    setClientPhone('');
                    setClientComment('');
                  }}
                  className="px-5 py-2 rounded-md bg-[#B89768] text-[#121212] font-semibold text-xs uppercase tracking-wider"
                >
                  Новая запись
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-[#121212] border border-[#2A2A2A] overflow-hidden">
              {/* Навигация по 4 шагам */}
              <div className="grid grid-cols-4 border-b border-[#2A2A2A] bg-[#161616]">
                {[
                  { num: 1, title: '01 / Услуги' },
                  { num: 2, title: '02 / Мастер' },
                  { num: 3, title: '03 / Время' },
                  { num: 4, title: '04 / Контакты' },
                ].map((stepObj) => {
                  const active = bookingStep === stepObj.num;
                  const done = bookingStep > stepObj.num;
                  return (
                    <button
                      key={stepObj.num}
                      type="button"
                      onClick={() => {
                        if (stepObj.num < bookingStep || selectedServiceIds.length > 0) {
                          setBookingStep(stepObj.num);
                          setFormError('');
                        }
                      }}
                      className={`py-3.5 px-3 text-left text-xs font-mono uppercase tracking-wider border-b-2 transition ${
                        active
                          ? 'border-[#B89768] text-[#B89768] bg-[#1A1A1A]'
                          : done
                          ? 'border-neutral-600 text-[#F5F5F4]'
                          : 'border-transparent text-[#A1A1AA]'
                      }`}
                    >
                      {stepObj.title}
                    </button>
                  );
                })}
              </div>

              <div className="p-6 sm:p-8">
                {formError && (
                  <div className="mb-6 p-3 rounded-md bg-[#1A1A1A] border border-[#B89768] text-[#F5F5F4] text-xs flex items-center gap-2">
                    <ExclamationCircleIcon className="w-4 h-4 text-[#B89768] shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {bookingStep === 1 && (
                  <div>
                    <h3 className="text-sm font-mono uppercase text-[#A1A1AA] mb-4">
                      Шаг 1. Отметьте одну или несколько услуг
                    </h3>
                    <div className="border border-[#2A2A2A] rounded-md divide-y divide-[#2A2A2A] max-h-[360px] overflow-y-auto bg-[#1A1A1A]">
                      {BARBER_SERVICES.map((srv) => {
                        const checked = selectedServiceIds.includes(srv.id);
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => toggleService(srv.id)}
                            className={`w-full text-left px-4 py-3.5 transition flex items-center justify-between gap-4 ${
                              checked ? 'bg-[#221E18]' : 'hover:bg-[#1E1E1E]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 ${
                                  checked
                                    ? 'bg-[#B89768] text-[#121212]'
                                    : 'border border-[#A1A1AA]'
                                }`}
                              >
                                {checked && <CheckIcon className="w-3 h-3" />}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[#F5F5F4]">
                                  {srv.name}
                                </div>
                                <div className="text-[11px] text-[#A1A1AA] font-mono">
                                  {srv.category} • {srv.duration} мин
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-mono font-semibold text-[#B89768] shrink-0">
                              {srv.price.toLocaleString('ru-RU')} ₸
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div>
                    <h3 className="text-sm font-mono uppercase text-[#A1A1AA] mb-4">
                      Шаг 2. Выберите барбера
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BARBER_MASTERS.map((master) => {
                        const isChosen = selectedMasterId === master.id;
                        return (
                          <button
                            key={master.id}
                            type="button"
                            onClick={() => setSelectedMasterId(master.id)}
                            className={`text-left p-4 rounded-md border transition flex items-center gap-3.5 bg-[#1A1A1A] ${
                              isChosen
                                ? 'border-[#B89768]'
                                : 'border-[#2A2A2A] hover:border-neutral-600'
                            }`}
                          >
                            <img
                              src={master.avatar}
                              alt={master.name}
                              className="w-12 h-12 rounded-full object-cover shrink-0 border border-neutral-800"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#B89768]">
                                  {master.role}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-mono text-[#B89768]">
                                  <StarIcon className="w-3.5 h-3.5" />
                                  {master.rating}
                                </span>
                              </div>
                              <div className="text-sm font-semibold text-[#F5F5F4] truncate mt-0.5">
                                {master.name}
                              </div>
                              <div className="text-xs text-[#A1A1AA] mt-0.5 truncate">
                                {master.specialty}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-mono uppercase text-[#A1A1AA] mb-3">
                        Шаг 3. День визита
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {upcomingDates.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelectedDate(d.label)}
                            className={`py-2.5 px-3 rounded-md border text-xs font-medium transition ${
                              selectedDate === d.label
                                ? 'bg-[#B89768] text-[#121212] border-[#B89768] font-semibold'
                                : 'bg-[#1A1A1A] text-[#F5F5F4] border-[#2A2A2A]'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-mono uppercase text-[#A1A1AA] mb-3">
                        Доступные слоты ({currentMaster.name}):
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {BARBER_TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 rounded-md border text-xs font-mono transition ${
                              selectedSlot === slot
                                ? 'bg-[#B89768] text-[#121212] border-[#B89768] font-semibold'
                                : 'bg-[#1A1A1A] text-[#F5F5F4] border-[#2A2A2A]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {bookingStep === 4 && (
                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <h3 className="text-sm font-mono uppercase text-[#A1A1AA] mb-2">
                      Шаг 4. Контактные данные гостя
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#A1A1AA] mb-1.5">
                          Ваше имя *
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Например, Нурсултан"
                            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#F5F5F4] focus:outline-none focus:border-[#B89768]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#A1A1AA] mb-1.5">
                          Телефон (WhatsApp) *
                        </label>
                        <div className="relative">
                          <PhoneIcon className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="+7 (701) 555-12-34"
                            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#F5F5F4] focus:outline-none focus:border-[#B89768]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A1A1AA] mb-1.5">
                        Комментарий к записи (необязательно)
                      </label>
                      <input
                        type="text"
                        value={clientComment}
                        onChange={(e) => setClientComment(e.target.value)}
                        placeholder="Например: подготовить эспрессо без сахара"
                        className="w-full px-4 py-2.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#F5F5F4] focus:outline-none focus:border-[#B89768]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-md bg-[#B89768] hover:bg-[#a68658] text-[#121212] font-semibold text-xs uppercase tracking-wider transition"
                      >
                        Подтвердить запись • {selectedDate}, {selectedSlot} ({totalPrice.toLocaleString('ru-RU')} ₸)
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-8 pt-5 border-t border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[#A1A1AA]">ИТОГО: </span>
                      <span className="text-sm font-semibold text-[#B89768]">
                        {totalPrice.toLocaleString('ru-RU')} ₸
                      </span>
                    </div>
                    <span className="text-[#2A2A2A]">/</span>
                    <div>
                      <span className="text-[#A1A1AA]">ВРЕМЯ: </span>
                      <span className="text-[#F5F5F4]">{totalDuration} мин</span>
                    </div>
                    <span className="text-[#2A2A2A]">/</span>
                    <div>
                      <span className="text-[#A1A1AA]">МАСТЕР: </span>
                      <span className="text-[#F5F5F4]">{currentMaster.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {bookingStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setBookingStep((prev) => prev - 1)}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#242424] text-[#F5F5F4] text-xs font-medium border border-[#2A2A2A] transition"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                        <span>Назад</span>
                      </button>
                    )}
                    {bookingStep < 4 && (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#B89768] hover:bg-[#a68658] text-[#121212] text-xs font-semibold uppercase tracking-wider transition"
                      >
                        <span>Далее</span>
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. Команда барберов */}
      <section id="masters" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-[#2A2A2A] mb-8">
          <div className="text-xs uppercase tracking-widest text-[#B89768] font-mono mb-1">
            03 / Мастера
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-[#F5F5F4]">
            Команда BLADE & CRAFT
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#2A2A2A] rounded-md divide-y sm:divide-y-0 sm:divide-x divide-[#2A2A2A] bg-[#1A1A1A]">
          {BARBER_MASTERS.map((master) => (
            <div
              key={master.id}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#2A2A2A]">
                  <img
                    src={master.avatar}
                    alt={master.name}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-800 shrink-0"
                  />
                  <div className="text-right font-mono text-xs">
                    <div className="inline-flex items-center gap-1 text-[#B89768]">
                      <StarIcon className="w-3.5 h-3.5" />
                      <span>{master.rating}</span>
                    </div>
                    <div className="text-[11px] text-[#A1A1AA]">{master.reviewsCount} виз.</div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-[11px] uppercase tracking-wider text-[#B89768] font-mono">
                    {master.role} • {master.experience}
                  </div>
                  <h3 className="text-base font-semibold text-[#F5F5F4] mt-1">{master.name}</h3>
                  <p className="text-xs text-[#A1A1AA] mt-2 leading-relaxed">
                    {master.specialty}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => quickBookMaster(master.id)}
                  className="w-full py-2 rounded-md bg-[#121212] hover:bg-[#B89768] text-[#F5F5F4] hover:text-[#121212] border border-[#2A2A2A] hover:border-[#B89768] text-xs font-semibold uppercase tracking-wider transition"
                >
                  Выбрать мастера
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Отзывы гостей */}
      <section id="reviews" className="py-16 bg-[#1A1A1A] border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-[#2A2A2A] mb-8">
            <div className="text-xs uppercase tracking-widest text-[#B89768] font-mono mb-1">
              04 / Отзывы
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase text-[#F5F5F4]">
              Отзывы постоянных гостей
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#2A2A2A] rounded-md divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A] bg-[#121212]">
            {BARBER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#B89768]">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <StarIcon key={idx} className="w-3.5 h-3.5" />
                      ))}
                    </div>
                    <span className="text-xs text-[#A1A1AA] font-mono">{rev.date}</span>
                  </div>
                  <p className="text-sm text-[#F5F5F4] leading-relaxed">
                    «{rev.text}»
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-800 shrink-0"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[#F5F5F4]">{rev.author}</div>
                    <div className="text-[11px] text-[#A1A1AA] font-mono">
                      Мастер: {rev.master}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Контакты */}
      <footer id="contacts" className="py-10 border-t border-[#2A2A2A] bg-[#121212] text-xs text-[#A1A1AA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display text-base font-semibold uppercase text-[#F5F5F4]">
            BLADE & CRAFT • АСТАНА
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 text-[#B89768]" />
              пр. Мангилик Ел, 41/1
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-[#B89768]" />
              10:00 – 22:00
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-[#B89768]" />
              +7 (7172) 64-88-20
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
