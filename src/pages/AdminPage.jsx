import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { getLocalLeads, saveLocalLeads } from '../home/lib/submitLead';

const STATUS_META = {
  new: { label: 'Новая', cls: 'border-acid/40 bg-acid/15 text-acid' },
  in_progress: { label: 'В работе', cls: 'border-blue-400/40 bg-blue-500/15 text-blue-300' },
  done: { label: 'Завершена', cls: 'border-white/20 bg-white/10 text-white/60' },
};

const SESSION_KEY = 'creators_admin_pass';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [inputPass, setInputPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authed, setAuthed] = useState(false);

  const [leads, setLeads] = useState([]);
  const [mode, setMode] = useState('local'); // cloud | local
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState('');

  useEffect(() => {
    document.title = 'Админ-панель заявок — Creators Digital';
    document.documentElement.classList.add('theme-creators');
    return () => document.documentElement.classList.remove('theme-creators');
  }, []);

  const loadLeads = useCallback(async (pass) => {
    setLoading(true);
    setAuthError('');
    try {
      if (import.meta.env.PROD) {
        const res = await fetch('/api/leads', {
          headers: { Authorization: `Bearer ${pass}` },
        });
        if (res.status === 401) {
          setAuthed(false);
          setAuthError('Неверный пароль');
          sessionStorage.removeItem(SESSION_KEY);
          setLoading(false);
          return false;
        }
        const data = await res.json();
        setMode(data.mode || 'local');
        setLeads(data.mode === 'cloud' ? data.leads || [] : getLocalLeads());
      } else {
        if (pass !== 'creators2026') {
          setAuthed(false);
          setAuthError('Неверный пароль (локально: creators2026)');
          setLoading(false);
          return false;
        }
        setMode('local');
        setLeads(getLocalLeads());
      }
      sessionStorage.setItem(SESSION_KEY, pass);
      setPassword(pass);
      setAuthed(true);
      setLoading(false);
      return true;
    } catch {
      setMode('local');
      setLeads(getLocalLeads());
      setAuthed(true);
      setLoading(false);
      return true;
    }
  }, []);

  useEffect(() => {
    if (password) loadLeads(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputPass.trim()) return;
    loadLeads(inputPass.trim());
  };

  const updateStatus = async (id, status) => {
    setLeads((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, status } : l));
      if (mode === 'local') saveLocalLeads(next);
      return next;
    });
    if (mode === 'cloud') {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ id, status }),
      }).catch(() => {});
    }
  };

  const deleteLead = async (id) => {
    setLeads((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (mode === 'local') saveLocalLeads(next);
      return next;
    });
    if (mode === 'cloud') {
      await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
        body: JSON.stringify({ id }),
      }).catch(() => {});
    }
  };

  const copyContact = (lead) => {
    navigator.clipboard?.writeText(lead.contact);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(''), 1800);
  };

  const exportCsv = () => {
    const header = ['Дата', 'Имя', 'Контакт', 'Услуги', 'Бюджет', 'Статус', 'Комментарий'];
    const rows = leads.map((l) => [
      l.createdAt || '',
      l.name || '',
      l.contact || '',
      (l.services || []).join('; '),
      l.budget || '',
      STATUS_META[l.status]?.label || l.status,
      (l.message || '').replace(/\n/g, ' '),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creators-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      in_progress: leads.filter((l) => l.status === 'in_progress').length,
      done: leads.filter((l) => l.status === 'done').length,
    }),
    [leads]
  );

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter !== 'all' && l.status !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          (l.name || '').toLowerCase().includes(q) ||
          (l.contact || '').toLowerCase().includes(q) ||
          (l.message || '').toLowerCase().includes(q) ||
          (l.services || []).join(' ').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, filter, query]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0C] px-4 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#101014] p-8 shadow-2xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-acid text-[#0A0A0C]">
              <LockClosedIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">Creators Digital</p>
              <h1 className="font-grotesk text-xl font-semibold">Админ-панель</h1>
            </div>
          </div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
            Пароль доступа
          </label>
          <input
            type="password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            placeholder="Введите пароль"
            autoFocus
            className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-acid"
          />
          {authError && <p className="mt-2 text-xs text-red-400">{authError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 h-12 w-full rounded-full bg-acid text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0C] transition hover:bg-white disabled:opacity-60"
          >
            {loading ? 'Проверяем…' : 'Войти'}
          </button>
          <Link to="/" className="mt-4 block text-center text-xs text-white/45 hover:text-white">
            ← Вернуться на сайт
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] pb-20 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0C]/85 backdrop-blur-xl">
        <div className="container-x flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-grotesk text-lg font-semibold tracking-tight hover:text-acid">
              Creators<span className="text-acid">.</span>
            </Link>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70">
              Admin · Заявки
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadLeads(password)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-4 text-xs text-white/80 hover:border-acid hover:text-acid"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Обновить</span>
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={!leads.length}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-acid px-4 text-xs font-semibold text-[#0A0A0C] transition hover:bg-white disabled:opacity-40"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Экспорт CSV</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container-x pt-10">
        {mode === 'local' && (
          <div className="mb-8 rounded-2xl border border-acid/30 bg-acid/10 p-5 text-xs leading-relaxed text-white/85">
            <p className="font-semibold text-acid">Сейчас включён локальный режим (заявки видны только в этом браузере)</p>
            <p className="mt-1 text-white/70">
              Чтобы сюда приходили заявки со всех устройств клиентов: в панели Vercel открой вкладку{' '}
              <span className="font-mono text-white">Storage → Create Database → Upstash Redis</span> (бесплатно) и
              подключи к проекту <span className="font-mono text-white">creators-agency</span>, затем нажми{' '}
              <span className="font-mono text-white">Redeploy</span>.
            </p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Всего заявок', value: counts.all, accent: false },
            { label: 'Новые', value: counts.new, accent: true },
            { label: 'В работе', value: counts.in_progress, accent: false },
            { label: 'Завершены', value: counts.done, accent: false },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border border-white/10 bg-[#101014] p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{k.label}</div>
              <div className={`mt-2 font-grotesk text-3xl font-semibold tabular-nums ${k.accent ? 'text-acid' : ''}`}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `Все (${counts.all})` },
              { id: 'new', label: `Новые (${counts.new})` },
              { id: 'in_progress', label: `В работе (${counts.in_progress})` },
              { id: 'done', label: `Завершены (${counts.done})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  filter === t.id
                    ? 'border-acid bg-acid text-[#0A0A0C]'
                    : 'border-white/15 text-white/65 hover:border-white/35 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-xs">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени, контакту, задаче…"
              className="w-full rounded-full border border-white/15 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/40 outline-none focus:border-acid"
            />
          </div>
        </div>

        {/* Leads List */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center text-sm text-white/45">
              Заявок пока нет.
            </div>
          ) : (
            filtered.map((lead) => {
              const st = STATUS_META[lead.status] || STATUS_META.new;
              return (
                <article
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-[#101014] p-5 transition hover:border-white/20 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="font-grotesk text-xl font-semibold">{lead.name}</h2>
                        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase ${st.cls}`}>
                          {st.label}
                        </span>
                        <span className="font-mono text-[11px] text-white/40">{formatDate(lead.createdAt)}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-mono text-acid">{lead.contact}</span>
                        <button
                          type="button"
                          onClick={() => copyContact(lead)}
                          className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/60 hover:text-white"
                        >
                          {copiedId === lead.id ? (
                            <>
                              <CheckIcon className="h-3.5 w-3.5 text-acid" /> Скопировано
                            </>
                          ) : (
                            <>
                              <ClipboardDocumentIcon className="h-3.5 w-3.5" /> Копировать
                            </>
                          )}
                        </button>
                        {lead.budget && (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-white/75">
                            Бюджет: {lead.budget}
                          </span>
                        )}
                      </div>

                      {lead.services?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {lead.services.map((s) => (
                            <span
                              key={s}
                              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {lead.message && <p className="mt-3 text-sm leading-relaxed text-white/65">{lead.message}</p>}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="rounded-xl border border-white/15 bg-[#16161b] px-3 py-2 text-xs text-white outline-none focus:border-acid"
                      >
                        <option value="new">Новая</option>
                        <option value="in_progress">В работе</option>
                        <option value="done">Завершена</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteLead(lead.id)}
                        aria-label="Удалить заявку"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/45 transition hover:border-red-400/50 hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
