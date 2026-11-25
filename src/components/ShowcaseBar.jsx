import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { DEVELOPER_INFO, SHOWCASE_PROJECTS } from '../data/projectsData';

export default function ShowcaseBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setDropdownOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/' || location.pathname === '/admin') return null;

  const current = SHOWCASE_PROJECTS.find((p) => p.path === location.pathname) || SHOWCASE_PROJECTS[0];

  const copyTg = () => {
    navigator.clipboard?.writeText(DEVELOPER_INFO.telegramHandle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-40 w-[94%] max-w-4xl -translate-x-1/2">
        <div className="flex items-center justify-between gap-2 rounded-full border border-white/15 bg-[#0E0E11]/85 px-2.5 py-2 text-white shadow-2xl shadow-black/70 backdrop-blur-2xl sm:px-3.5">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold tracking-tight transition hover:border-acid hover:text-acid"
          >
            <span className="h-2 w-2 rounded-full bg-acid" />
            <span>Creators</span>
          </Link>

          {/* Desktop pills */}
          <div className="hidden items-center gap-1 md:flex">
            {SHOWCASE_PROJECTS.map((p) => {
              const active = p.path === location.pathname;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(p.path)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    active ? 'bg-acid font-semibold text-[#0A0A0C]' : 'text-white/65 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {p.niche}
                </button>
              );
            })}
          </div>

          {/* Mobile switcher */}
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium"
            >
              <span className="max-w-[120px] truncate">{current.niche}</span>
              <ChevronUpIcon className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-12 left-1/2 w-52 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#101014]/95 p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  {SHOWCASE_PROJECTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => navigate(p.path)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                        p.path === location.pathname ? 'bg-acid font-semibold text-[#0A0A0C]' : 'text-white/75 hover:bg-white/5'
                      }`}
                    >
                      <span>{p.niche}</span>
                      <span className="font-mono text-[10px] opacity-60">{p.code}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0C] transition hover:bg-acid"
          >
            <PaperAirplaneIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Заказать такой</span>
            <span className="sm:hidden">Заказать</span>
          </button>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {orderOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onClick={() => setOrderOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[28px] border border-white/15 bg-[#101014] p-6 text-white sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-acid">Creators Digital</p>
                  <h3 className="mt-1 font-grotesk text-2xl font-semibold">Заказать проект</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-white/60">
                Понравился формат «{current.brandName}»? Адаптируем под ваш бизнес, бренд и задачи за 10–14 дней.
              </p>

              <div className="mt-6 space-y-2.5">
                <a
                  href={DEVELOPER_INFO.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between rounded-2xl bg-acid px-5 py-3.5 text-sm font-semibold text-[#0A0A0C] transition hover:bg-white"
                >
                  <span>Написать в Telegram</span>
                  <span className="font-mono text-xs">{DEVELOPER_INFO.telegramHandle}</span>
                </a>
                <a
                  href={DEVELOPER_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-medium transition hover:border-acid"
                >
                  <span>WhatsApp</span>
                  <span className="font-mono text-xs text-white/60">{DEVELOPER_INFO.whatsappHandle}</span>
                </a>
                <button
                  type="button"
                  onClick={copyTg}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 text-xs text-white/65 transition hover:border-white/30 hover:text-white"
                >
                  {copied ? <CheckIcon className="h-4 w-4 text-acid" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
                  <span>{copied ? 'Скопировано!' : `Скопировать ${DEVELOPER_INFO.telegramHandle}`}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
