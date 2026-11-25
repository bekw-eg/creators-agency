// Защищённый API для админ-панели /admin: просмотр, смена статуса и удаление заявок.
import { getAllLeads, hasCloudStore, replaceAllLeads } from './_store.js';

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'creators2026').trim();

function isAuthorized(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  return Boolean(token && token === ADMIN_PASSWORD);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!isAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'Неверный пароль' });
  }

  const cloud = hasCloudStore();

  if (req.method === 'GET') {
    const leads = cloud ? await getAllLeads() : [];
    return res.status(200).json({ ok: true, mode: cloud ? 'cloud' : 'local', leads });
  }

  if (req.method === 'PATCH') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { id, status } = body;
    if (!id || !['new', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }
    if (cloud) {
      const leads = await getAllLeads();
      const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
      await replaceAllLeads(updated);
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { id } = body;
    if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });
    if (cloud) {
      const leads = await getAllLeads();
      await replaceAllLeads(leads.filter((l) => l.id !== id));
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
