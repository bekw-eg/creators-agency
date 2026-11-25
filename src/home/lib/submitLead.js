const LOCAL_KEY = 'creators_leads_v1';
const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || (import.meta.env.PROD ? '/api/lead' : '');

export function getLocalLeads() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalLeads(leads) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(leads));
  } catch {
    // ignore storage quota errors
  }
}

function appendLocalLead(lead) {
  const current = getLocalLeads();
  saveLocalLeads([lead, ...current.filter((l) => l.id !== lead.id)].slice(0, 200));
}

export async function submitLead(payload) {
  const fallbackLead = {
    id: `ld_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...payload,
    status: 'new',
    source: 'creators-digital.work',
    createdAt: new Date().toISOString(),
  };

  if (!ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    appendLocalLead(fallbackLead);
    return { ok: true, lead: fallbackLead, stored: 'local' };
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      source: 'creators-digital.work',
      createdAt: fallbackLead.createdAt,
    }),
  });

  if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`);
  const result = await res.json().catch(() => ({ ok: true }));
  appendLocalLead(result.lead || fallbackLead);
  return result;
}
