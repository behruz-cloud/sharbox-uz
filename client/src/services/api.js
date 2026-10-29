// API service for sharbox.uz

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async createProduct(data) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProduct(id, data) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Banners
  async getBanners() {
    const res = await fetch(`${API_BASE}/banners`);
    return res.json();
  },

  async updateBanners(banners) {
    const res = await fetch(`${API_BASE}/banners`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banners })
    });
    return res.json();
  },

  // Extras
  async getExtras() {
    const res = await fetch(`${API_BASE}/extras`);
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(settings, adminPin) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings, adminPin })
    });
    return res.json();
  },

  // Auth
  async login(pin) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    return res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Upload image file
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
};
