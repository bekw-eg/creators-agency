import React, { useState, useMemo, useRef } from 'react';
import {
  CalculatorIcon,
  ClockIcon,
  PhoneIcon,
  ArrowsRightLeftIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  RENOVATION_TYPES,
  RENOVATION_ADDONS,
  BEFORE_AFTER_SCENES,
  RENOVATION_PORTFOLIO,
  RENOVATION_STEPS,
} from '../data/renovationData';

// 1. Страница ремонта квартир «STROY LINE ASTANA»: строгая архитектурно-инженерная сетка (#FFFFFF фон, #F4F5F7 блоки, #E2E8F0 линии, #1D4ED8 синий)
export default function RenovationPage() {
  // 2. Состояния калькулятора стоимости ремонта
  const [areaSqm, setAreaSqm] = useState(76);
  const [selectedTypeId, setSelectedTypeId] = useState('capital');
  const [propertyKind, setPropertyKind] = useState('newbuild');
  const [selectedAddons, setSelectedAddons] = useState(['rough-materials', 'post-cleaning']);

  // 3. Состояния интерактивного слайдера «До / После»
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [sliderPercent, setSliderPercent] = useState(52);
  const compareContainerRef = useRef(null);

  // 4. Состояния формы вызова инженера-замерщика
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadComplex, setLeadComplex] = useState('');
  const [leadDate, setLeadDate] = useState('Завтра до обеда (10:00 – 13:00)');
  const [leadError, setLeadError] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(null);

  const currentType = useMemo(
    () => RENOVATION_TYPES.find((t) => t.id === selectedTypeId) || RENOVATION_TYPES[1],
    [selectedTypeId]
  );

  // 5. Мгновенный расчёт стоимости ремонта в ₸ и сроков в днях
  const calculationResult = useMemo(() => {
    const baseWorkCost = areaSqm * currentType.ratePerSqm;
    const secondaryMultiplier = propertyKind === 'secondary' ? 1.12 : 1.0;
    const adjustedWorkCost = Math.round(baseWorkCost * secondaryMultiplier);

    let addonsCost = 0;
    let addonsExtraDays = 0;

    RENOVATION_ADDONS.forEach((addon) => {
      if (selectedAddons.includes(addon.id)) {
        addonsCost += addon.pricePerSqm * areaSqm + addon.fixedPrice;
        addonsExtraDays += addon.extraDays;
      }
    });

    const totalCost = adjustedWorkCost + addonsCost;
    const baseDays = Math.round(areaSqm * currentType.daysPerSqm);
    const secondaryDays = propertyKind === 'secondary' ? 8 : 0;
    const totalDays = Math.max(18, baseDays + secondaryDays + addonsExtraDays);

    return {
      workCost: adjustedWorkCost,
      addonsCost,
      totalCost,
      totalDays,
      pricePerSqmTotal: Math.round(totalCost / areaSqm),
    };
  }, [areaSqm, currentType, propertyKind, selectedAddons]);

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // 6. Управление слайдером «До / После»
  const updateSliderFromClientX = (clientX) => {
    if (!compareContainerRef.current) return;
    const rect = compareContainerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const rawPercent = (offsetX / rect.width) * 100;
    setSliderPercent(Math.min(96, Math.max(4, Math.round(rawPercent))));
  };

  const handlePointerMove = (e) => {
    if (e.buttons === 1) {
      updateSliderFromClientX(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateSliderFromClientX(e.touches[0].clientX);
    }
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadName.trim() || leadPhone.trim().length < 6) {
      setLeadError('Пожалуйста, введите ваше имя и номер телефона для связи с инженером.');
      return;
    }
    setLeadError('');
    setLeadSubmitted({
      ticket: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: leadName.trim(),
      phone: leadPhone.trim(),
      complex: leadComplex.trim() || 'г. Астана (уточнить адрес)',
      visitSlot: leadDate,
      area: areaSqm,
      tariff: currentType.name,
      estimatedCost: calculationResult.totalCost,
      estimatedDays: calculationResult.totalDays,
    });
  };

  const currentScene = BEFORE_AFTER_SCENES[activeSceneIndex];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans pb-24 selection:bg-[#1D4ED8] selection:text-white">
      {/* 7. Инженерная шапка STROY LINE ASTANA */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-base font-bold tracking-tight text-[#0F172A] font-mono">
              STROY LINE ASTANA
            </span>
            <span className="hidden sm:inline-block text-xs text-[#475569] border-l border-[#E2E8F0] pl-4">
              Лицензия СМР II категории • Договор
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#475569]">
            <a href="#calculator" className="hover:text-[#0F172A] transition">
              01 / Сметный калькулятор
            </a>
            <a href="#before-after" className="hover:text-[#0F172A] transition">
              02 / До и После
            </a>
            <a href="#portfolio" className="hover:text-[#0F172A] transition">
              03 / Реестр объектов
            </a>
            <a href="#steps" className="hover:text-[#0F172A] transition">
              04 / Регламент
            </a>
          </nav>

          <a
            href="#measurer-form"
            className="px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white font-medium text-xs uppercase tracking-wider transition"
          >
            Вызов инженера
          </a>
        </div>
      </header>

      {/* 8. Строгий архитектурный Hero-блок */}
      <section className="bg-[#F4F5F7] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="text-xs font-mono uppercase tracking-widest text-[#1D4ED8] mb-4">
                ИНЖЕНЕРНЫЙ РЕМОНТ КВАРТИР • АСТАНА • ФИКСИРОВАННАЯ СМЕТА
              </div>

              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#0F172A] leading-[1.12]">
                Ремонт квартир по техническому регламенту от 45 000 ₸/м²
              </h1>

              <p className="mt-5 text-base text-[#475569] leading-relaxed max-w-xl">
                Выполняем полный цикл ремонтно-отделочных работ в новостройках Астаны. Поэтапная приёмка по чек-листу технадзора, снабжение черновыми материалами со склада и официальная гарантия 36 месяцев.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white font-medium text-xs uppercase tracking-wider transition"
                >
                  <CalculatorIcon className="w-4 h-4" />
                  <span>Рассчитать ведомость работ</span>
                </a>
                <a
                  href="#before-after"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#FFFFFF] hover:bg-slate-100 text-[#0F172A] font-medium text-xs uppercase tracking-wider border border-[#E2E8F0] transition"
                >
                  <span>Сравнение До / После</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-md overflow-hidden border border-[#E2E8F0] bg-[#FFFFFF]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Готовый ремонт квартиры в Астане"
                  className="w-full h-72 object-cover"
                />
                <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0F172A]">ОБЪЕКТ: ЖК SEZIM QALA • 84 М²</span>
                  <span className="text-[#1D4ED8]">СРОК: 65 ДНЕЙ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border border-[#E2E8F0] rounded-md bg-[#FFFFFF] divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
            <div className="p-4 sm:p-5">
              <div className="text-xs font-mono uppercase text-[#475569]">Сдано объектов</div>
              <div className="text-xl font-semibold text-[#0F172A] mt-1">140+ квартир</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-xs font-mono uppercase text-[#475569]">Смета в договоре</div>
              <div className="text-xl font-semibold text-[#1D4ED8] mt-1">Фиксированная</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-xs font-mono uppercase text-[#475569]">Гарантийный срок</div>
              <div className="text-xl font-semibold text-[#0F172A] mt-1">36 месяцев</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-xs font-mono uppercase text-[#475569]">Оплата этапов</div>
              <div className="text-xl font-semibold text-[#0F172A] mt-1">По акту приёмки</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Интерактивный сметный калькулятор */}
      <section id="calculator" className="py-16 sm:py-20 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-[#E2E8F0] mb-8">
            <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] mb-1">
              01 / Сметный калькулятор
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A]">
              Параметрический расчёт бюджета и сроков
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Панель ввода параметров */}
            <div className="lg:col-span-7 bg-[#F4F5F7] rounded-md border border-[#E2E8F0] p-6 sm:p-8 space-y-7">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono uppercase text-[#0F172A]">
                    01. Площадь объекта по техпаспорту
                  </label>
                  <span className="px-3 py-1 rounded-md bg-[#1D4ED8] text-white font-mono text-sm font-semibold">
                    {areaSqm} м²
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={200}
                  step={1}
                  value={areaSqm}
                  onChange={(e) => setAreaSqm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-300 rounded-md appearance-none cursor-pointer accent-[#1D4ED8]"
                />
                <div className="flex justify-between text-xs text-[#475569] font-mono mt-1.5">
                  <span>30 м²</span>
                  <span>80 м²</span>
                  <span>140 м²</span>
                  <span>200 м²</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#0F172A] mb-3">
                  02. Тарифный регламент работ
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {RENOVATION_TYPES.map((t) => {
                    const active = selectedTypeId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTypeId(t.id)}
                        className={`text-left p-4 rounded-md border transition bg-[#FFFFFF] ${
                          active
                            ? 'border-[#1D4ED8]'
                            : 'border-[#E2E8F0] hover:border-slate-400'
                        }`}
                      >
                        <div className="text-xs font-mono font-semibold text-[#1D4ED8]">
                          {t.ratePerSqm.toLocaleString('ru-RU')} ₸/м²
                        </div>
                        <div className="text-sm font-semibold text-[#0F172A] mt-0.5">
                          {t.name}
                        </div>
                        <p className="text-[11px] text-[#475569] mt-1.5 leading-snug">
                          {t.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#0F172A] mb-3">
                  03. Состояние жилого фонда
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPropertyKind('newbuild')}
                    className={`py-3 px-4 rounded-md border text-left transition bg-[#FFFFFF] ${
                      propertyKind === 'newbuild'
                        ? 'border-[#1D4ED8]'
                        : 'border-[#E2E8F0]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Новостройка (Черновая / Предчистовая)
                    </div>
                    <div className="text-[11px] text-[#475569] mt-0.5">
                      Базовый коэффициент 1.0
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropertyKind('secondary')}
                    className={`py-3 px-4 rounded-md border text-left transition bg-[#FFFFFF] ${
                      propertyKind === 'secondary'
                        ? 'border-[#1D4ED8]'
                        : 'border-[#E2E8F0]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Вторичный фонд (+12% демонтаж)
                    </div>
                    <div className="text-[11px] text-[#475569] mt-0.5">
                      Демонтаж старых покрытий и вывоз
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#0F172A] mb-3">
                  04. Ведомость дополнительных опций
                </label>
                <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-md bg-[#FFFFFF]">
                  {RENOVATION_ADDONS.map((addon) => {
                    const checked = selectedAddons.includes(addon.id);
                    const addonTotal = addon.pricePerSqm * areaSqm + addon.fixedPrice;
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full text-left px-4 py-3 transition flex items-center justify-between gap-3 ${
                          checked ? 'bg-slate-50' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 ${
                              checked
                                ? 'bg-[#1D4ED8] text-white'
                                : 'bg-[#F4F5F7] border border-[#E2E8F0]'
                            }`}
                          >
                            {checked && <CheckIcon className="w-3 h-3" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                            {addon.label}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-[#1D4ED8] shrink-0">
                          +{addonTotal.toLocaleString('ru-RU')} ₸
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Правая сводная ведомость сметы */}
            <div className="lg:col-span-5 bg-[#F4F5F7] text-[#0F172A] rounded-md border border-[#E2E8F0] p-6 sm:p-8 sticky top-24">
              <div className="text-xs uppercase tracking-widest text-[#1D4ED8] font-mono">
                Сводная ведомость расчёта
              </div>
              <h3 className="text-lg font-semibold mt-1">
                {currentType.name} • {areaSqm} м²
              </h3>

              <div className="mt-5 p-5 rounded-md bg-[#FFFFFF] border border-[#E2E8F0]">
                <div className="text-xs font-mono uppercase text-[#475569]">Итоговая оценка бюджета:</div>
                <div className="text-3xl font-mono font-semibold text-[#1D4ED8] mt-1">
                  {calculationResult.totalCost.toLocaleString('ru-RU')} ₸
                </div>
                <div className="text-xs text-[#475569] mt-1 font-mono">
                  Удельная ставка: {calculationResult.pricePerSqmTotal.toLocaleString('ru-RU')} ₸/м²
                </div>
              </div>

              <div className="mt-5 space-y-2.5 text-xs font-mono border-b border-[#E2E8F0] pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#475569]">СТРОИТЕЛЬНО-МОНТАЖНЫЕ РАБОТЫ:</span>
                  <span className="font-semibold">
                    {calculationResult.workCost.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#475569]">МАТЕРИАЛЫ И ДОП. ОПЦИИ:</span>
                  <span className="font-semibold">
                    {calculationResult.addonsCost.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#475569]">НОРМАТИВНЫЙ СРОК:</span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#1D4ED8] text-white font-semibold">
                    {calculationResult.totalDays} ДНЕЙ
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="text-xs font-mono uppercase text-[#475569]">
                  Базовый состав работ:
                </div>
                {currentType.includes.map((inc) => (
                  <div key={inc} className="flex items-center gap-2 text-xs text-[#0F172A]">
                    <CheckIcon className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>

              <a
                href="#measurer-form"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white font-medium text-xs uppercase tracking-wider transition"
              >
                <span>Заказать выезд инженера-сметчика</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Интерактивный слайдер сравнения «До / После» */}
      <section id="before-after" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2E8F0] mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] mb-1">
              02 / Визуальная инспекция
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A]">
              Сравнение состояния «До / После»
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {BEFORE_AFTER_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setActiveSceneIndex(idx);
                  setSliderPercent(50);
                }}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition border ${
                  activeSceneIndex === idx
                    ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                    : 'bg-[#F4F5F7] text-[#475569] border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                Объект 0{idx + 1}: {scene.title.split('—')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-[#F4F5F7] border border-[#E2E8F0] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 font-mono text-xs">
            <h3 className="text-sm font-semibold text-[#0F172A]">{currentScene.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-sm bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569]">
                {currentScene.duration}
              </span>
              <span className="px-2.5 py-1 rounded-sm bg-[#1D4ED8] text-white">
                {currentScene.budget}
              </span>
            </div>
          </div>

          <div
            ref={compareContainerRef}
            onMouseMove={handlePointerMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => updateSliderFromClientX(e.clientX)}
            className="relative w-full h-72 sm:h-[440px] rounded-md overflow-hidden select-none cursor-ew-resize border border-[#E2E8F0]"
          >
            <img
              src={currentScene.afterImage}
              alt="После ремонта"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            <div
              className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPercent}%` }}
            >
              <img
                src={currentScene.beforeImage}
                alt="До ремонта"
                className="w-full h-full object-cover max-w-none"
                style={{
                  width: compareContainerRef.current
                    ? `${compareContainerRef.current.clientWidth}px`
                    : '1200px',
                }}
              />
            </div>

            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#0F172A] text-white text-xs font-mono">
              {currentScene.beforeLabel}
            </span>
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-sm bg-[#1D4ED8] text-white text-xs font-mono">
              {currentScene.afterLabel}
            </span>

            <div
              className="absolute inset-y-0 w-0.5 bg-white pointer-events-none"
              style={{ left: `${sliderPercent}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#1D4ED8] border-2 border-white text-white flex items-center justify-center">
                <ArrowsRightLeftIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 font-mono">
            <span className="text-xs text-[#475569] shrink-0">ЧЕРНОВАЯ (ДО)</span>
            <input
              type="range"
              min={4}
              max={96}
              value={sliderPercent}
              onChange={(e) => setSliderPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-300 rounded-md appearance-none cursor-pointer accent-[#1D4ED8]"
            />
            <span className="text-xs text-[#0F172A] shrink-0">ЧИСТОВАЯ (ПОСЛЕ)</span>
          </div>
        </div>
      </section>

      {/* 11. Реестр сданных объектов в ЖК Астаны */}
      <section id="portfolio" className="py-16 bg-[#F4F5F7] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-6 border-b border-[#E2E8F0] mb-8">
            <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] mb-1">
              03 / Реестр сданных объектов
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A]">
              Примеры выполненных проектов в Астане
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E2E8F0] rounded-md divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] bg-[#FFFFFF]">
            {RENOVATION_PORTFOLIO.map((obj) => (
              <div
                key={obj.id}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 border-b border-[#E2E8F0] overflow-hidden">
                    <img
                      src={obj.image}
                      alt={obj.complex}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-mono uppercase text-[#1D4ED8]">
                      {obj.complex}
                    </div>
                    <h3 className="text-base font-semibold text-[#0F172A] mt-1">{obj.type}</h3>

                    <div className="mt-4 grid grid-cols-3 border border-[#E2E8F0] rounded-sm divide-x divide-[#E2E8F0] bg-[#F4F5F7] text-xs font-mono">
                      <div className="p-2.5">
                        <span className="text-[#475569] block text-[10px]">ПЛОЩАДЬ</span>
                        <span className="font-semibold text-[#0F172A]">{obj.area}</span>
                      </div>
                      <div className="p-2.5">
                        <span className="text-[#475569] block text-[10px]">СРОК</span>
                        <span className="font-semibold text-[#0F172A]">{obj.days}</span>
                      </div>
                      <div className="p-2.5">
                        <span className="text-[#475569] block text-[10px]">БЮДЖЕТ</span>
                        <span className="font-semibold text-[#1D4ED8]">{obj.cost}</span>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-1.5">
                      {obj.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-center gap-2 text-xs text-[#475569]"
                        >
                          <CheckIcon className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Регламент работы */}
      <section id="steps" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-[#E2E8F0] mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] mb-1">
            04 / Производственный цикл
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A]">
            Регламент выполнения работ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 border border-[#E2E8F0] rounded-md divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] bg-[#F4F5F7]">
          {RENOVATION_STEPS.map((st) => (
            <div
              key={st.step}
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono font-semibold text-[#1D4ED8]">
                  ЭТАП {st.step}
                </div>
                <h3 className="text-sm font-semibold text-[#0F172A] mt-2">
                  {st.title}
                </h3>
                <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. Форма вызова инженера-замерщика */}
      <section id="measurer-form" className="py-16 bg-[#F4F5F7] border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-[#FFFFFF] border border-[#E2E8F0] p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0] mb-6">
              <div>
                <div className="text-xs font-mono uppercase text-[#1D4ED8] mb-1">
                  05 / Выездной замер по Астане — 0 ₸
                </div>
                <h2 className="text-2xl font-semibold text-[#0F172A]">
                  Заявка на лазерный обмер и составление сметы
                </h2>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md bg-[#F4F5F7] border border-[#E2E8F0] text-xs shrink-0">
                <img
                  src="https://randomuser.me/api/portraits/men/41.jpg"
                  alt="Главный инженер Серик Жумабаев"
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                />
                <div>
                  <div className="font-semibold text-[#0F172A]">Серик Жумабаев</div>
                  <div className="text-[#475569]">Главный инженер-сметчик</div>
                </div>
              </div>
            </div>

            {leadSubmitted ? (
              <div className="p-6 rounded-md bg-[#F4F5F7] border border-[#1D4ED8] text-[#0F172A]">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircleIcon className="w-6 h-6 text-[#1D4ED8] shrink-0" />
                  <div>
                    <div className="text-xs font-mono uppercase text-[#1D4ED8]">
                      Заявка #{leadSubmitted.ticket} зарегистрирована
                    </div>
                    <h3 className="text-lg font-semibold text-[#0F172A]">
                      Выезд инженера назначен, {leadSubmitted.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-[#475569]">
                  Объект: <strong className="text-[#0F172A]">{leadSubmitted.complex}</strong> ({leadSubmitted.area} м², пакет «{leadSubmitted.tariff}»). Слот выезда: <strong className="text-[#0F172A]">{leadSubmitted.visitSlot}</strong>.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#475569]">
                    Смета привязана к номеру {leadSubmitted.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLeadSubmitted(null)}
                    className="px-4 py-2 rounded-md bg-[#1D4ED8] text-white text-xs font-medium"
                  >
                    Новая заявка
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                {leadError && (
                  <div className="p-3 rounded-md bg-[#F4F5F7] border border-[#1D4ED8] text-[#0F172A] text-xs flex items-center gap-2 font-medium">
                    <ExclamationCircleIcon className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                    <span>{leadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Например, Марат"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#F4F5F7] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Контактный телефон *
                    </label>
                    <input
                      type="tel"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+7 (701) 000-00-00"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#F4F5F7] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Жилой комплекс / адрес в Астане
                    </label>
                    <input
                      type="text"
                      value={leadComplex}
                      onChange={(e) => setLeadComplex(e.target.value)}
                      placeholder="Например: ЖК Sezim Qala, блок 4"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#F4F5F7] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Удобное время для замера
                    </label>
                    <select
                      value={leadDate}
                      onChange={(e) => setLeadDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#F4F5F7] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#1D4ED8]"
                    >
                      <option>Завтра до обеда (10:00 – 13:00)</option>
                      <option>Завтра после обеда (14:00 – 18:00)</option>
                      <option>В эту субботу (выходной день)</option>
                      <option>Согласовать по телефону</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#475569] font-mono">
                    Параметры калькулятора: {areaSqm} м² • {calculationResult.totalCost.toLocaleString('ru-RU')} ₸
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white font-medium text-xs uppercase tracking-wider transition"
                  >
                    Назначить выезд инженера
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 14. Футер */}
      <footer className="py-10 bg-[#FFFFFF] border-t border-[#E2E8F0] text-[#475569] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-[#0F172A]">ТОО «STROY LINE ASTANA»</strong> • г. Астана, пр. Туран, 30А, БЦ Turan Plaza, офис 408
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-[#1D4ED8]" />
              +7 (7172) 91-04-55
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-[#1D4ED8]" />
              Пн–Сб 09:00 – 20:00
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
