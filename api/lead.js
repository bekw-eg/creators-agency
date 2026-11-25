// Serverless-функция Vercel: сохраняет заявку в облачную БД (Upstash Redis) и дублирует в Telegram.
import { hasCloudStore, saveLead } from './_store.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const name = (data.name || '').trim();
  const contact = (data.contact || '').trim();
  const services = Array.isArray(data.services) ? data.services : [];
  const budget = (data.budget || '').trim();
  const message = (data.message || '').trim();

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const lead = {
    id: `ld_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    contact,
    services,
    budget,
    message,
    status: 'new',
    source: data.source || 'creators-digital.work',
    createdAt: new Date().toISOString(),
  };

  let storedInCloud = false;
  if (hasCloudStore()) {
    try {
      storedInCloud = await saveLead(lead);
    } catch (err) {
      console.error('Cloud store save failed:', err);
    }
  }

  // Пробуем продублировать в Telegram (если переменные заданы и валидны)
  let telegramSent = false;
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim().replace(/^bot/i, '');
  const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

  if (token && chatId) {
    const lines = [
      '<b>🔥 Новая заявка — Creators Digital</b>',
      '',
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Контакт:</b> ${escapeHtml(contact)}`,
      services.length ? `<b>Услуги:</b> ${escapeHtml(services.join(', '))}` : null,
      budget ? `<b>Бюджет:</b> ${escapeHtml(budget)}` : null,
      message ? `<b>Задача:</b>\n${escapeHtml(message)}` : null,
    ].filter(Boolean);

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join('\n'),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      telegramSent = tgRes.ok;
    } catch {
      telegramSent = false;
    }
  }

  return res.status(200).json({
    ok: true,
    lead,
    stored: storedInCloud ? 'cloud' : 'local',
    telegramSent,
  });
}
