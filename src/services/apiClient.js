import {
  mockCustomers,
  mockInvoices,
  mockPayments,
  mockPlans,
  mockProducts,
  mockStaff,
  mockSubscriptions,
} from '../data/mockData.js';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const TOKEN_KEY = 'subsync_token';
const DATA_KEY = 'subsync_data';

const seedData = {
  customers: mockCustomers,
  invoices: mockInvoices,
  payments: mockPayments,
  plans: mockPlans,
  products: mockProducts,
  staff: mockStaff,
  subscriptions: mockSubscriptions,
};
const singularNames = { customers: 'customer', invoices: 'invoice', payments: 'payment', plans: 'plan', products: 'product', staff: 'staff', subscriptions: 'subscription' };

function readLocalData() {
  try {
    const stored = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
    return Object.fromEntries(
      Object.entries(seedData).map(([key, initial]) => [key, stored[key] || initial])
    );
  } catch {
    return seedData;
  }
}

function writeLocalData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export const apiClient = {
  get configured() {
    return Boolean(API_URL);
  },

  async request(path, { method = 'GET', body } = {}) {
    if (!API_URL) throw new Error('API is not configured.');
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.message || `Request failed (${response.status}).`);
    }
    return payload;
  },

  async list(collection) {
    if (API_URL) {
      const payload = await this.request(`/${collection}`);
      return Array.isArray(payload) ? payload : payload?.data || [];
    }
    return readLocalData()[collection] || [];
  },

  async create(collection, item) {
    if (API_URL) return this.request(`/${collection}`, { method: 'POST', body: item });
    const data = readLocalData();
    const created = { id: item.id || `${singularNames[collection] || collection}-${Date.now()}`, ...item };
    data[collection] = [...(data[collection] || []), created];
    writeLocalData(data);
    return created;
  },

  async update(collection, id, updates) {
    if (API_URL) return this.request(`/${collection}/${encodeURIComponent(id)}`, { method: 'PATCH', body: updates });
    const data = readLocalData();
    let updated;
    data[collection] = (data[collection] || []).map((item) => {
      if (String(item.id) !== String(id)) return item;
      updated = { ...item, ...updates };
      return updated;
    });
    if (!updated) throw new Error(`${collection} record not found.`);
    writeLocalData(data);
    return updated;
  },

  async remove(collection, id) {
    if (API_URL) return this.request(`/${collection}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = readLocalData();
    data[collection] = (data[collection] || []).filter((item) => String(item.id) !== String(id));
    writeLocalData(data);
  },

  async login(credentials) {
    const payload = await this.request('/auth/login', { method: 'POST', body: credentials });
    if (payload?.token) localStorage.setItem(TOKEN_KEY, payload.token);
    return payload?.user || payload;
  },

  async register(data) {
    const payload = await this.request('/auth/register', { method: 'POST', body: data });
    if (payload?.token) localStorage.setItem(TOKEN_KEY, payload.token);
    return payload?.user || payload;
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};