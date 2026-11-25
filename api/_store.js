// Хелпер для работы с Upstash Redis / Vercel KV по REST API без лишних зависимостей.
const REDIS_URL = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').trim();
const REDIS_TOKEN = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '').trim();
const LEADS_KEY = 'creators:leads';

export const hasCloudStore = () => Boolean(REDIS_URL && REDIS_TOKEN);

async function redisCmd(command) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status}`);
  return res.json();
}

export async function getAllLeads() {
  if (!hasCloudStore()) return [];
  const data = await redisCmd(['LRANGE', LEADS_KEY, '0', '199']);
  const raw = Array.isArray(data.result) ? data.result : [];
  return raw
    .map((item) => {
      try {
        return typeof item === 'string' ? JSON.parse(item) : item;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export async function saveLead(lead) {
  if (!hasCloudStore()) return false;
  await redisCmd(['LPUSH', LEADS_KEY, JSON.stringify(lead)]);
  await redisCmd(['LTRIM', LEADS_KEY, '0', '199']);
  return true;
}

export async function replaceAllLeads(leads) {
  if (!hasCloudStore()) return false;
  await redisCmd(['DEL', LEADS_KEY]);
  if (leads.length > 0) {
    await redisCmd(['RPUSH', LEADS_KEY, ...leads.map((l) => JSON.stringify(l))]);
  }
  return true;
}
