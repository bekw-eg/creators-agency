// Отправка заявки. Если задан VITE_LEAD_ENDPOINT (например, serverless-функция,
// пересылающая заявку в Telegram/CRM) — делаем POST. Иначе работает демо-режим с имитацией сети.
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT;

export async function submitLead(payload) {
  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 1600));
    return { ok: true, demo: true };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, source: 'creators-digital.work', createdAt: new Date().toISOString() }),
  });

  if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`);
  return { ok: true };
}
