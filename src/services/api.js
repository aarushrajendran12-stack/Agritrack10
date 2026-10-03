const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kisan_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.code = data.error?.code;
    error.details = data.error?.details;
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Crops
  getCrops: () => request('/crops'),
  createCrop: (cropData) =>
    request('/crops', { method: 'POST', body: JSON.stringify(cropData) }),
  getCropById: (id) => request(`/crops/${id}`),
  getCropMetadata: () => request('/crops/metadata'),
  updateCrop: (id, cropData) =>
    request(`/crops/${id}`, { method: 'PUT', body: JSON.stringify(cropData) }),

  // Weather & Recommendations
  getWeather: (location, lat, lon) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (lat) params.append('lat', lat);
    if (lon) params.append('lon', lon);
    return request(`/weather?${params.toString()}`);
  },
  getCropRecommendations: (cropId) => request(`/recommendations/crop/${cropId}`),

  // Marketplace & Cart
  getProducts: (filters = {}) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== '') params.append(k, v);
    }
    return request(`/marketplace/products?${params.toString()}`);
  },
  getContextualInputs: (cropType, stage) => {
    const params = new URLSearchParams();
    if (cropType) params.append('cropType', cropType);
    if (stage) params.append('stage', stage);
    return request(`/marketplace/contextual?${params.toString()}`);
  },
  getCart: () => request('/marketplace/cart'),
  addToCart: (productId, quantity = 1) =>
    request('/marketplace/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (id, quantity) =>
    request(`/marketplace/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeFromCart: (id) =>
    request(`/marketplace/cart/${id}`, { method: 'DELETE' }),
  checkout: (orderData) =>
    request('/marketplace/checkout', { method: 'POST', body: JSON.stringify(orderData) }),
  getUserOrders: () => request('/marketplace/orders'),

  // Finance
  getFinancialSummary: (cropId) => {
    const query = cropId ? `?cropId=${cropId}` : '';
    return request(`/finance/summary${query}`);
  },
  addExpense: (expenseData) =>
    request('/finance/expenses', { method: 'POST', body: JSON.stringify(expenseData) }),
  deleteExpense: (id) =>
    request(`/finance/expenses/${id}`, { method: 'DELETE' }),
  addIncome: (incomeData) =>
    request('/finance/income', { method: 'POST', body: JSON.stringify(incomeData) }),
  deleteIncome: (id) =>
    request(`/finance/income/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => request('/notifications/mark-all-read', { method: 'POST' }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  listAdminUsers: (role) => request(`/admin/users${role ? `?role=${role}` : ''}`),
  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  listAdminRecommendations: () => request('/admin/recommendations'),
  createAdminRecommendation: (data) =>
    request('/admin/recommendations', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminRecommendation: (id, data) =>
    request(`/admin/recommendations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createAdminProduct: (data) =>
    request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminProduct: (id, data) =>
    request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  listAdminOrders: () => request('/admin/orders'),
  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAuditLogs: () => request('/admin/audit-logs'),
};
