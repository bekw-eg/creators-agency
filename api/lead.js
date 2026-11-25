// Serverless-функция Vercel: принимает заявку с сайта и пересылает её в Telegram.
// Переменные TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID задаются в Vercel → Environment Variables.

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'Telegram env vars are not configured' });
  }

  const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const name = (data.name || '').trim();
  const contact = (data.contact || '').trim();
  const services = Array.isArray(data.services) ? data.services.join(', ') : '';
  const budget = (data.budget || '').trim();
  const message = (data.message || '').trim();

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const lines = [
    '<b>🔥 Новая заявка — Creators Digital</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    services ? `<b>Услуги:</b> ${escapeHtml(services)}` : null,
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

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      return res.status(502).json({ ok: false, error: 'Telegram API error', details: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
