import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CodeBracketIcon,
  PaperAirplaneIcon,
  ArrowUpRightIcon,
  CheckIcon,
  MapPinIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { DEVELOPER_INFO, SHOWCASE_PROJECTS } from '../data/projectsData';

// 1. Главная страница шоурума студии CREATORS BY EARTH: швейцарский редакционный стиль (#FAFAFA фон, #FFFFFF блоки, #E5E5E5 линии, #111111 акцент)
export default function HubPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [quickBriefName, setQuickBriefName] = useState('');
  const [quickBriefNiche, setQuickBriefNiche] = useState('Барбершоп / Салон услуг');
  const [quickBriefPhone, setQuickBriefPhone] = useState('');
  const [briefSubmitted, setBriefSubmitted] = useState(false);
  const [briefError, setBriefError] = useState('');

  // 2. Фильтрация проектов шоурума по сегментам бизнеса
  const filterTabs = [
    { id: 'all', label: 'Все 05 проектов' },
    { id: 'service', label: 'Услуги и запись' },
    { id: 'horeca', label: 'Рестораны и Кофейни' },
    { id: 'ecommerce', label: 'E-Commerce каталог' },
  ];

  const filteredProjects = SHOWCASE_PROJECTS.filter((project) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'service')
      return project.id === 'barbershop' || project.id === 'renovation';
    if (selectedFilter === 'horeca')
      return project.id === 'restaurant' || project.id === 'coffee';
    if (selectedFilter === 'ecommerce') return project.id === 'lighting';
    return true;
  });

  // 3. Обработчик формы заявки в студию CREATORS BY EARTH
  const handleBriefSubmit = (e) => {
    e.preventDefault();
    if (!quickBriefName.trim() || !quickBriefPhone.trim()) {
      setBriefError('Пожалуйста, укажите ваше имя и телефон или Telegram для связи.');
      return;
    }
    setBriefError('');
    setBriefSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      {/* 4. Строгая верхняя навигация студии CREATORS BY EARTH с фирменным логотипом */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img
              src={DEVELOPER_INFO.logo}
              alt="CREATORS BY EARTH"
              className="w-10 h-10 rounded-md object-cover border border-[#111111] bg-black shrink-0"
            />
            <div>
              <div className="text-sm font-bold tracking-tight text-[#111111] font-mono">
                {DEVELOPER_INFO.name}
              </div>
              <div className="text-[11px] text-[#666666]">
                Digital Agency • {DEVELOPER_INFO.tagline}
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#666666]">
            <a href="#showroom" className="hover:text-[#111111] transition">
              01 / Интерактивный шоурум
            </a>
            <a href="#capabilities" className="hover:text-[#111111] transition">
              02 / Компетенции команды
            </a>
            <a href="#brief" className="hover:text-[#111111] transition">
              03 / Бриф проекта
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={DEVELOPER_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F5F5F5] text-[#111111] text-xs font-medium border border-[#E5E5E5] transition"
            >
              <CodeBracketIcon className="w-4 h-4 text-[#666666]" />
              <span>GitHub</span>
            </a>
            <a
              href={DEVELOPER_INFO.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#111111] hover:bg-[#262626] text-white text-xs font-medium transition"
            >
              <PaperAirplaneIcon className="w-3.5 h-3.5" />
              <span>Связаться</span>
            </a>
          </div>
        </div>
      </header>

      {/* 5. Редакционный Hero-блок команды CREATORS BY EARTH с фирменным бренд-блоком */}
      <section className="bg-[#FFFFFF] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8">
              <div className="text-xs font-mono uppercase tracking-widest text-[#666666] mb-4">
                {DEVELOPER_INFO.badge} • {DEVELOPER_INFO.tagline.toUpperCase()}
              </div>

              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111] leading-[1.12]">
                {DEVELOPER_INFO.name}. От идеи до цифрового результата — создаём коммерческие сайты и веб-сервисы.
              </h1>

              <p className="mt-6 text-base text-[#666666] leading-relaxed max-w-2xl">
                Вместо статичных визиток мы разрабатываем отраслевые веб-инструменты: онлайн-запись со слотами времени, параметрические калькуляторы сметы, конструкторы заказов и e-commerce каталоги. Ниже представлены 5 полнофункциональных демо-сайтов для реальных сегментов бизнеса Астаны.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#showroom"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#111111] hover:bg-[#262626] text-white font-medium text-xs uppercase tracking-wider transition"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                  <span>Индекс демо-проектов (05)</span>
                </a>
                <a
                  href="#brief"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#F5F5F5] text-[#111111] font-medium text-xs uppercase tracking-wider border border-[#E5E5E5] transition"
                >
                  <span>Оставить заявку на проект</span>
                </a>
              </div>
            </div>

            {/* Правая колонка: официальный логотип CREATORS BY EARTH, состав команды и стек */}
            <div className="lg:col-span-4 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] divide-y divide-[#E5E5E5] overflow-hidden">
              {/* Фирменный блок с логотипом на чёрном фоне */}
              <div className="bg-[#050505] p-6 flex flex-col items-center justify-center text-center">
                <img
                  src={DEVELOPER_INFO.logo}
                  alt="CREATORS BY EARTH — Digital Agency"
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div className="p-5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-3">
                  Профильные направления команды
                </div>
                <div className="space-y-3">
                  {DEVELOPER_INFO.teamMembers.map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#111111]">{member.name}</div>
                        <div className="text-xs text-[#666666]">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-2.5">
                  Технологический стек агентства
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DEVELOPER_INFO.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 rounded-md bg-[#FFFFFF] border border-[#E5E5E5] text-[11px] font-mono text-[#111111]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-5 py-3.5 flex items-center justify-between text-xs text-[#666666]">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-[#111111]" />
                  <span>{DEVELOPER_INFO.city}</span>
                </span>
                <span className="font-mono text-[#111111]">Telegram: {DEVELOPER_INFO.telegramHandle}</span>
              </div>
            </div>
          </div>

          {/* Строгая табличная полоса параметров */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 border border-[#E5E5E5] rounded-lg bg-[#FAFAFA] divide-y lg:divide-y-0 lg:divide-x divide-[#E5E5E5]">
            {DEVELOPER_INFO.metrics.map((m) => (
              <div key={m.label} className="p-4 sm:p-5">
                <div className="text-xs font-mono uppercase text-[#666666]">{m.label}</div>
                <div className="text-xl font-semibold text-[#111111] mt-1">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Редакционный индекс 5 проектов */}
      <section id="showroom" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E5E5] mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
              01 / Интерактивный шоурум
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight">
              Отраслевые демо-сайты {DEVELOPER_INFO.name}
            </h2>
          </div>

          {/* Фильтр по сегментам */}
          <div className="flex flex-wrap gap-1 bg-[#FFFFFF] p-1 rounded-md border border-[#E5E5E5]">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  selectedFilter === tab.id
                    ? 'bg-[#111111] text-white'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Строгий студийный список кейсов (Split-Row Layout) */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] hover:border-[#111111] transition overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Левая колонка: индекс, ниша, бренд и описание */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E5E5E5]">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-[#111111]">
                        {project.code}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#666666]">
                        {project.badgeText}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#666666]">
                      {project.styleName}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="text-xs text-[#666666] font-medium">{project.niche}</div>
                    <h3 className="text-2xl font-semibold text-[#111111] mt-0.5">
                      {project.brandName}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed mt-2.5 max-w-xl">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Инженерные модули внутри демо */}
                  <div className="mt-6 pt-5 border-t border-[#E5E5E5]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#666666] mb-3">
                      Интерактивные модули на странице:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.features.map((feat) => (
                        <div
                          key={feat}
                          className="flex items-center gap-2 text-xs text-[#111111]"
                        >
                          <CheckIcon className="w-3.5 h-3.5 text-[#111111] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-[#666666]">{project.averagePrice}</span>
                  <Link
                    to={project.path}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#111111] hover:bg-[#262626] text-white font-medium text-xs uppercase tracking-wider transition"
                  >
                    <span>Открыть демо-сайт</span>
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Правая колонка: чистое превью без бейджей поверх фото */}
              <div className="lg:col-span-5 bg-[#FAFAFA] border-t lg:border-t-0 lg:border-l border-[#E5E5E5] flex flex-col justify-between">
                <Link to={project.path} className="block h-64 lg:h-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.brandName}
                    className="w-full h-full object-cover hover:opacity-95 transition"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Что делает команда CREATORS BY EARTH (табличная матрица услуг студии) */}
      <section id="capabilities" className="py-16 border-t border-[#E5E5E5] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
              02 / Компетенции команды
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#111111]">
              Что разрабатывает агентство {DEVELOPER_INFO.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[#E5E5E5] rounded-lg divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5] bg-[#FAFAFA]">
            <div className="p-6 sm:p-8">
              <div className="text-xs font-mono text-[#666666] mb-2">Направление 01</div>
              <h3 className="text-base font-semibold text-[#111111] mb-2">
                Коммерческие сайты и отраслевые лендинги
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Сайты для сферы услуг, клиник, барбершопов, строительных и сервисных компаний со встроенными калькуляторами стоимости и формами записи.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="text-xs font-mono text-[#666666] mb-2">Направление 02</div>
              <h3 className="text-base font-semibold text-[#111111] mb-2">
                HoReCa-платформы и E-Commerce каталоги
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Интерактивные меню ресторанов, конструкторы напитков и блюд для предзаказа, интернет-магазины с фильтрацией, корзиной и расчётом доставки.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="text-xs font-mono text-[#666666] mb-2">Направление 03</div>
              <h3 className="text-base font-semibold text-[#111111] mb-2">
                Интеграция с Telegram-ботами и CRM
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Мгновенная отправка заявок, броней столов и заказов из корзины напрямую менеджерам в Telegram, WhatsApp или корпоративную базу данных.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Форма экспресс-брифа для заказа проекта у команды CREATORS BY EARTH */}
      <section id="brief" className="py-16 sm:py-20 border-t border-[#E5E5E5] bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-[#FFFFFF] border border-[#E5E5E5] p-6 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E5E5] mb-8">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                  03 / Бриф проекта
                </div>
                <h2 className="text-2xl font-semibold text-[#111111]">
                  Заказать разработку сайта в {DEVELOPER_INFO.name}
                </h2>
                <p className="text-sm text-[#666666] mt-1">
                  Оставьте контакты для оценки сроков и сметы или напишите в Telegram{' '}
                  <a
                    href={DEVELOPER_INFO.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#111111] underline font-medium"
                  >
                    {DEVELOPER_INFO.telegramHandle}
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#FAFAFA] px-4 py-3 rounded-md border border-[#E5E5E5] shrink-0">
                <img
                  src={DEVELOPER_INFO.logo}
                  alt="CREATORS BY EARTH"
                  className="w-10 h-10 rounded-md object-cover border border-[#111111] bg-black"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#111111]">{DEVELOPER_INFO.name}</div>
                  <div className="text-[#666666]">{DEVELOPER_INFO.tagline}</div>
                </div>
              </div>
            </div>

            {briefSubmitted ? (
              <div className="p-6 rounded-md bg-[#FAFAFA] border border-[#111111]">
                <div className="flex items-center gap-2.5 mb-2">
                  <CheckIcon className="w-5 h-5 text-[#111111] shrink-0" />
                  <h3 className="text-base font-semibold text-[#111111]">
                    Заявка принята в работу, {quickBriefName}
                  </h3>
                </div>
                <p className="text-sm text-[#666666]">
                  Направление: <span className="font-semibold text-[#111111]">{quickBriefNiche}</span>. Контакт:{' '}
                  <span className="font-semibold text-[#111111]">{quickBriefPhone}</span>. Менеджер проекта {DEVELOPER_INFO.name} свяжется с вами для согласования технического задания.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={DEVELOPER_INFO.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#111111] text-white font-medium text-xs"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Написать в Telegram {DEVELOPER_INFO.telegramHandle}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setBriefSubmitted(false);
                      setQuickBriefName('');
                      setQuickBriefPhone('');
                    }}
                    className="px-4 py-2 rounded-md bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] text-xs font-medium"
                  >
                    Отправить ещё один запрос
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBriefSubmit} className="space-y-4">
                {briefError && (
                  <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#111111] text-[#111111] text-xs font-medium">
                    {briefError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#666666] mb-1.5 font-medium">
                      Ваше имя или компания
                    </label>
                    <input
                      type="text"
                      value={quickBriefName}
                      onChange={(e) => setQuickBriefName(e.target.value)}
                      placeholder="Например, Асхат"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666666] mb-1.5 font-medium">
                      Тип проекта
                    </label>
                    <select
                      value={quickBriefNiche}
                      onChange={(e) => setQuickBriefNiche(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                    >
                      <option>Барбершоп / Салон услуг</option>
                      <option>Ресторан / Кафе с меню и бронью</option>
                      <option>Кофейня с конструктором и предзаказом</option>
                      <option>Строительство и ремонт с калькулятором</option>
                      <option>Интернет-магазин с каталогом и корзиной</option>
                      <option>Индивидуальный веб-сервис под ключ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#666666] mb-1.5 font-medium">
                      Телефон или @Telegram
                    </label>
                    <input
                      type="text"
                      value={quickBriefPhone}
                      onChange={(e) => setQuickBriefPhone(e.target.value)}
                      placeholder="+7 (701) 000-00-00"
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-[#666666] flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4 text-[#111111]" />
                    <span>Работаем по договору в Астане и по всему Казахстану</span>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-[#111111] hover:bg-[#262626] text-white font-medium text-xs uppercase tracking-wider transition"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Отправить бриф команде</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Футер Главного Хаба с логотипом */}
      <footer className="py-8 border-t border-[#E5E5E5] bg-[#FFFFFF] text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={DEVELOPER_INFO.logo}
              alt="CREATORS BY EARTH"
              className="w-7 h-7 rounded-sm object-cover border border-[#111111] bg-black"
            />
            <span>
              © {new Date().getFullYear()} {DEVELOPER_INFO.name} • Digital Agency • {DEVELOPER_INFO.tagline}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={DEVELOPER_INFO.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#111111] transition"
            >
              Telegram: {DEVELOPER_INFO.telegramHandle}
            </a>
            <a
              href={DEVELOPER_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#111111] transition"
            >
              GitHub: {DEVELOPER_INFO.githubHandle}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
