import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Squares2X2Icon,
  ChevronUpIcon,
  PaperAirplaneIcon,
  CodeBracketIcon,
  XMarkIcon,
  CheckIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { DEVELOPER_INFO, SHOWCASE_PROJECTS } from '../data/projectsData';

// 1. Глобальная панель шоурума команды CREATORS BY EARTH: плоский фон #111111, тонкая рамка #262626
export default function ShowcaseBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 2. Состояния для мобильного списка ниш, модального окна заказа и копирования контакта
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  // 3. Автоматический скролл наверх при смене маршрута
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDropdownOpen(false);
  }, [location.pathname]);

  // 4. Скрываем панель на Главном Хабе ('/')
  if (location.pathname === '/') {
    return null;
  }

  const currentProject =
    SHOWCASE_PROJECTS.find((p) => p.path === location.pathname) || SHOWCASE_PROJECTS[0];

  const handleCopyTelegram = () => {
    navigator.clipboard?.writeText(DEVELOPER_INFO.telegramHandle);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2200);
  };

  return (
    <>
      {/* 5. Нижняя фиксированная панель шоурума (#111111 / рамка #262626) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <div className="bg-[#111111] border border-[#262626] text-white rounded-md px-3 py-2 sm:px-4 flex items-center justify-between gap-3">
          {/* Кнопка возврата в шоурум CREATORS BY EARTH с фирменным логотипом */}
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#1A1A1A] hover:bg-[#262626] text-white text-xs font-medium transition border border-[#262626] shrink-0"
          >
            <img
              src={DEVELOPER_INFO.logo}
              alt="CREATORS BY EARTH"
              className="w-5 h-5 rounded-sm object-cover border border-neutral-700"
            />
            <span>CREATORS • Все проекты</span>
          </Link>

          {/* Переключатель между 5 нишами на десктопе */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar">
            {SHOWCASE_PROJECTS.map((proj) => {
              const isActive = proj.path === location.pathname;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => navigate(proj.path)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap border ${
                    isActive
                      ? 'bg-white text-[#111111] border-white'
                      : 'bg-transparent text-neutral-300 border-transparent hover:bg-[#1F1F1F] hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-1 opacity-60">{proj.code}</span>
                  <span>{proj.niche}</span>
                </button>
              );
            })}
          </div>

          {/* Мобильный переключатель ниш */}
          <div className="relative md:hidden flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-md bg-[#1A1A1A] border border-[#262626] text-xs font-medium text-white truncate"
            >
              <span className="truncate">{currentProject.brandName}</span>
              <ChevronUpIcon
                className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#111111] border border-[#262626] rounded-md overflow-hidden py-1 z-50">
                {SHOWCASE_PROJECTS.map((proj) => {
                  const isActive = proj.path === location.pathname;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => navigate(proj.path)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                        isActive
                          ? 'bg-[#262626] text-white font-semibold'
                          : 'text-neutral-300 hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <span>{proj.niche}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">{proj.brandName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Кнопка вызова модального окна «Заказать проект» */}
          <button
            type="button"
            onClick={() => setOrderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-white hover:bg-neutral-200 text-[#111111] font-medium text-xs transition shrink-0"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            <span>Заказать проект</span>
          </button>
        </div>
      </div>

      {/* 6. Модальное окно с логотипом и контактами команды CREATORS BY EARTH */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
          <div className="relative w-full max-w-lg rounded-lg bg-[#111111] border border-[#262626] text-white p-6">
            <button
              type="button"
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-[#1F1F1F] transition"
              aria-label="Закрыть окно"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-[#262626]">
              <img
                src={DEVELOPER_INFO.logo}
                alt="CREATORS BY EARTH"
                className="w-14 h-14 rounded-md object-cover border border-neutral-800 shrink-0"
              />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {DEVELOPER_INFO.name} • Digital Agency
                </div>
                <h3 className="text-lg font-semibold text-white mt-0.5">
                  {DEVELOPER_INFO.tagline}
                </h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 mb-2">
              <Squares2X2Icon className="w-4 h-4" />
              <span>Демо-проект: {currentProject.niche} ({currentProject.brandName})</span>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Команда {DEVELOPER_INFO.name} проектирует и запускает коммерческие сайты, интернет-магазины и веб-сервисы под ключ в Астане и по всему Казахстану.
            </p>

            {/* Карточка команды с реальными портретами участников */}
            <div className="mt-5 p-4 rounded-md bg-[#181818] border border-[#262626] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {DEVELOPER_INFO.teamMembers.map((m) => (
                      <img
                        key={m.name}
                        src={m.avatar}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-800"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{DEVELOPER_INFO.name}</div>
                    <div className="text-xs text-neutral-400">{DEVELOPER_INFO.role}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#222222] border border-[#333333] text-neutral-200 text-[11px] font-mono">
                  Астана
                </span>
              </div>

              <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{DEVELOPER_INFO.city}</span>
                </span>
                <span className="font-mono text-neutral-400">UI/UX • Frontend • Backend</span>
              </div>
            </div>

            {/* Список того, что входит в разработку */}
            <div className="mt-4 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-white shrink-0" />
                <span>Анализ ниши, проектирование архитектуры и индивидуальный UI/UX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-white shrink-0" />
                <span>Калькуляторы, конструкторы, корзина и интеграция с Telegram / CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-white shrink-0" />
                <span>Адаптивная вёрстка, запуск на вашем домене и техподдержка</span>
              </div>
            </div>

            {/* Контакты и быстрые кнопки */}
            <div className="mt-6 space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={DEVELOPER_INFO.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-[#111111] font-medium text-xs transition"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Связаться в Telegram ({DEVELOPER_INFO.telegramHandle})</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyTelegram}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-[#262626] text-neutral-200 text-xs font-medium border border-[#262626] transition"
                >
                  {copiedTelegram ? (
                    <>
                      <CheckIcon className="w-4 h-4 text-white" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4 text-neutral-400" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={DEVELOPER_INFO.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#181818] hover:bg-[#222222] text-neutral-200 font-medium text-xs border border-[#262626] transition"
              >
                <CodeBracketIcon className="w-4 h-4 text-neutral-400" />
                <span>GitHub команды: {DEVELOPER_INFO.githubHandle}</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-neutral-500" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
