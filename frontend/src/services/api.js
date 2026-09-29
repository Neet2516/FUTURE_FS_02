// PaperCRM API Client Service
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('papercrm_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// 1. Dashboard
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

// 2. Contacts
export const contactsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.tag) query.append('tag', params.tag);
    const qs = query.toString();
    return api.get(`/contacts${qs ? `?${qs}` : ''}`);
  },
  get: (id) => api.get(`/contacts/${id}`),
  create: (contact) => api.post('/contacts', contact),
  update: (id, contact) => api.put(`/contacts/${id}`, contact),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// 3. Deals & Pipeline
export const dealsApi = {
  list: () => api.get('/deals'),
  get: (id) => api.get(`/deals/${id}`),
  create: (deal) => api.post('/deals', deal),
  update: (id, deal) => api.put(`/deals/${id}`, deal),
  updateStage: (id, stage) => api.put(`/deals/${id}/stage`, { stage }),
  delete: (id) => api.delete(`/deals/${id}`),
};

// 4. Tasks (Sticky Notes)
export const tasksApi = {
  list: () => api.get('/tasks'),
  create: (task) => api.post('/tasks', task),
  update: (id, task) => api.put(`/tasks/${id}`, task),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// 5. Activities
export const activitiesApi = {
  list: () => api.get('/activities'),
  create: (activity) => api.post('/activities', activity),
};

// 6. Auth
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};
