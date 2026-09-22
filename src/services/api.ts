import { 
  Product, 
  Order, 
  Appointment, 
  Review, 
  User, 
  AdminStats 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_APPOINTMENTS 
} from '../data/initialData';

const API_BASE = '/api';

function getAuthToken(): string | null {
  return localStorage.getItem('hf_auth_token');
}

async function fetchJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  // PRODUCTS & SERVICES
  async getProducts(params: {
    category?: string;
    itemType?: string;
    search?: string;
    sort?: string;
    maxPrice?: number;
    inStockOnly?: boolean;
    featured?: boolean;
  } = {}): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set('category', params.category);
      if (params.itemType) searchParams.set('itemType', params.itemType);
      if (params.search) searchParams.set('search', params.search);
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
      if (params.inStockOnly) searchParams.set('inStockOnly', 'true');
      if (params.featured) searchParams.set('featured', 'true');

      const queryString = searchParams.toString();
      return await fetchJSON<Product[]>(`${API_BASE}/products${queryString ? `?${queryString}` : ''}`);
    } catch (err) {
      console.warn('API fetch failed, falling back to local dataset', err);
      let list = [...INITIAL_PRODUCTS];
      if (params.category && params.category !== 'All') {
        list = list.filter((p) => p.category === params.category);
      }
      if (params.itemType && params.itemType !== 'all') {
        list = list.filter((p) => p.itemType === params.itemType);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      return await fetchJSON<Product>(`${API_BASE}/products/${id}`);
    } catch {
      const found = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
      if (!found) throw new Error('Product not found');
      return found;
    }
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return fetchJSON<Product>(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return fetchJSON<Product>(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getServices(): Promise<Product[]> {
    try {
      return await fetchJSON<Product[]>(`${API_BASE}/services`);
    } catch {
      return INITIAL_PRODUCTS.filter((p) => p.itemType === 'service');
    }
  },

  // APPOINTMENTS
  async getAppointments(params: { userId?: string; status?: string } = {}): Promise<Appointment[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.userId) searchParams.set('userId', params.userId);
      if (params.status) searchParams.set('status', params.status);
      const q = searchParams.toString();
      return await fetchJSON<Appointment[]>(`${API_BASE}/appointments${q ? `?${q}` : ''}`);
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    return fetchJSON<Appointment>(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async deleteAppointment(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // ORDERS
  async getOrders(params: { userId?: string; status?: string } = {}): Promise<Order[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params.userId) searchParams.set('userId', params.userId);
      if (params.status) searchParams.set('status', params.status);
      const q = searchParams.toString();
      return await fetchJSON<Order[]>(`${API_BASE}/orders${q ? `?${q}` : ''}`);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      return await fetchJSON<Order>(`${API_BASE}/orders/${id}`);
    } catch {
      const found = INITIAL_ORDERS.find((o) => o.id === id || o.orderNumber === id);
      if (!found) throw new Error('Order not found');
      return found;
    }
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrderStatus(id: string, orderStatus: string): Promise<Order> {
    return fetchJSON<Order>(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus }),
    });
  },

  // REVIEWS
  async getReviews(targetId?: string): Promise<Review[]> {
    try {
      const q = targetId ? `?targetId=${targetId}` : '';
      return await fetchJSON<Review[]>(`${API_BASE}/reviews${q}`);
    } catch {
      return targetId ? INITIAL_REVIEWS.filter((r) => r.targetId === targetId) : INITIAL_REVIEWS;
    }
  },

  async createReview(data: Partial<Review>): Promise<Review> {
    return fetchJSON<Review>(`${API_BASE}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteReview(id: string): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // AUTH
  async login(credentials: { email: string; password?: string }): Promise<{ token: string; user: User }> {
    return fetchJSON<{ token: string; user: User }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData: Partial<User>): Promise<{ token: string; user: User }> {
    return fetchJSON<{ token: string; user: User }>(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetchJSON<{ user: User }>(`${API_BASE}/auth/me`);
      return res.user;
    } catch {
      return null;
    }
  },

  // USERS (ADMIN)
  async getUsers(): Promise<User[]> {
    try {
      return await fetchJSON<User[]>(`${API_BASE}/users`);
    } catch {
      return INITIAL_USERS;
    }
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return fetchJSON<User>(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // STATS
  async getAdminStats(): Promise<AdminStats> {
    return fetchJSON<AdminStats>(`${API_BASE}/stats`);
  },

  // SEED
  async seedDatabase(): Promise<{ message: string }> {
    return fetchJSON<{ message: string }>(`${API_BASE}/seed`, {
      method: 'POST',
    });
  },
};
