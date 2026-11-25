// В production на Netlify заявки летят на serverless-функцию /api/lead → Telegram.
// Локально в `npm run dev` (если не задан VITE_LEAD_ENDPOINT) работает демо-режим.
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || (import.meta.env.PROD ? '/api/lead' : '');

export async function submitLead(payload) {
  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { ok: true, demo: true };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      source: 'creators-digital.work',
      createdAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`);
  return { ok: true };
}
