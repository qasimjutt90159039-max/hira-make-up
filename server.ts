import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_APPOINTMENTS 
} from './src/data/initialData';
import { Product, Review, User, Order, Appointment } from './src/types';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-Memory & File-backed Database Store for reliable persistence
interface SalonDatabase {
  products: Product[];
  reviews: Review[];
  users: User[];
  orders: Order[];
  appointments: Appointment[];
}

const DB_FILE = path.join(process.cwd(), 'salon-database.json');

function loadDatabase(): SalonDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed reading salon-database.json, falling back to initial data', err);
  }
  return {
    products: [...INITIAL_PRODUCTS],
    reviews: [...INITIAL_REVIEWS],
    users: [...INITIAL_USERS],
    orders: [...INITIAL_ORDERS],
    appointments: [...INITIAL_APPOINTMENTS],
  };
}

let db: SalonDatabase = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing salon-database.json', err);
  }
}

// Ensure database is initialized
saveDatabase();

/* -------------------------------------------------------------
   AUTH API ROUTES (/api/auth)
------------------------------------------------------------- */
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Simple token simulation for demo/production testing
  const token = `hf_token_${user.id}_${Date.now()}`;
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
      city: user.city,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password, address, city } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone number are required' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    role: 'customer',
    address: address || '',
    city: city || 'Karachi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase();

  const token = `hf_token_${newUser.id}_${Date.now()}`;
  return res.status(201).json({
    token,
    user: newUser,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('_');
  const userId = parts[2];

  const user = db.users.find((u) => u.id === userId) || db.users[1]; // fallback to customer
  return res.json({ user });
});

/* -------------------------------------------------------------
   PRODUCTS & SERVICES API ROUTES (/api/products & /api/services)
------------------------------------------------------------- */
app.get('/api/products', (req: Request, res: Response) => {
  let list = [...db.products];
  const { category, itemType, search, sort, maxPrice, inStockOnly, featured } = req.query;

  if (category && category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (itemType && itemType !== 'all') {
    list = list.filter((p) => p.itemType === itemType);
  }

  if (featured === 'true') {
    list = list.filter((p) => p.featured || p.isBestSeller);
  }

  if (inStockOnly === 'true') {
    list = list.filter((p) => p.inStock);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max) && max > 0) {
      list = list.filter((p) => p.price <= max);
    }
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    list.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else {
    // Default featured/newest
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return res.json(list);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const prod = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!prod) {
    return res.status(404).json({ error: 'Product or service not found' });
  }
  return res.json(prod);
});

app.post('/api/products', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.price || !body.category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: body.name,
    slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: body.category,
    itemType: body.itemType || 'product',
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    rating: 5.0,
    reviewsCount: 1,
    inStock: body.inStock !== false,
    stockCount: body.stockCount ? Number(body.stockCount) : 25,
    featured: Boolean(body.featured),
    image: body.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    galleryImages: body.galleryImages || [body.image],
    description: body.description || '',
    shortDescription: body.shortDescription || body.description?.slice(0, 90) || '',
    details: Array.isArray(body.details) ? body.details : ['Authentic Hira Farooq Studio certified quality'],
    ingredientsOrServiceDuration: body.ingredientsOrServiceDuration || '',
    variants: body.variants || [],
    badge: body.badge || '',
  };

  db.products.unshift(newProduct);
  saveDatabase();
  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price,
  };
  saveDatabase();
  return res.json(db.products[index]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const removed = db.products.splice(index, 1)[0];
  saveDatabase();
  return res.json({ message: 'Deleted successfully', removed });
});

// Services specific endpoint for convenience
app.get('/api/services', (req: Request, res: Response) => {
  const services = db.products.filter((p) => p.itemType === 'service');
  return res.json(services);
});

/* -------------------------------------------------------------
   APPOINTMENTS API ROUTES (/api/appointments)
------------------------------------------------------------- */
app.get('/api/appointments', (req: Request, res: Response) => {
  const { userId, status } = req.query;
  let list = [...db.appointments];

  if (userId) {
    list = list.filter((a) => a.userId === userId);
  }
  if (status) {
    list = list.filter((a) => a.status === status);
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(list);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.clientName || !body.clientPhone || !body.serviceName || !body.appointmentDate || !body.appointmentTime) {
    return res.status(400).json({ error: 'Client name, phone, service, date, and time are required' });
  }

  const newApt: Appointment = {
    id: `apt-${Date.now()}`,
    appointmentNumber: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: body.userId,
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    clientEmail: body.clientEmail || '',
    serviceId: body.serviceId || 'prod-service-custom',
    serviceName: body.serviceName,
    serviceCategory: body.serviceCategory || 'Salon Service',
    price: Number(body.price) || 0,
    appointmentDate: body.appointmentDate,
    appointmentTime: body.appointmentTime,
    stylistName: body.stylistName || 'Hira Farooq Studio Senior Specialist',
    notes: body.notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.appointments.unshift(newApt);
  saveDatabase();
  return res.status(201).json(newApt);
});

app.put('/api/appointments/:id', (req: Request, res: Response) => {
  const index = db.appointments.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  db.appointments[index] = {
    ...db.appointments[index],
    ...req.body,
  };
  saveDatabase();
  return res.json(db.appointments[index]);
});

app.delete('/api/appointments/:id', (req: Request, res: Response) => {
  const index = db.appointments.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const removed = db.appointments.splice(index, 1)[0];
  saveDatabase();
  return res.json({ message: 'Appointment cancelled/deleted', removed });
});

/* -------------------------------------------------------------
   ORDERS API ROUTES (/api/orders)
------------------------------------------------------------- */
app.get('/api/orders', (req: Request, res: Response) => {
  const { userId, status } = req.query;
  let list = [...db.orders];

  if (userId) {
    list = list.filter((o) => o.userId === userId);
  }
  if (status) {
    list = list.filter((o) => o.orderStatus === status);
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(list);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.customer || !body.items || body.items.length === 0) {
    return res.status(400).json({ error: 'Customer details and items are required' });
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `HF-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: body.userId,
    customer: body.customer,
    items: body.items,
    subtotal: Number(body.subtotal) || 0,
    discount: Number(body.discount) || 0,
    shippingFee: Number(body.shippingFee) || 0,
    total: Number(body.total) || 0,
    paymentMethod: body.paymentMethod || 'cod',
    paymentStatus: body.paymentMethod === 'card' ? 'paid' : 'pending',
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveDatabase();
  return res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req: Request, res: Response) => {
  const index = db.orders.findIndex((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  db.orders[index] = {
    ...db.orders[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  return res.json(db.orders[index]);
});

/* -------------------------------------------------------------
   REVIEWS API ROUTES (/api/reviews)
------------------------------------------------------------- */
app.get('/api/reviews', (req: Request, res: Response) => {
  const { targetId } = req.query;
  let list = [...db.reviews];
  if (targetId) {
    list = list.filter((r) => r.targetId === targetId);
  }
  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return res.json(list);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { targetId, targetName, userName, userCity, rating, comment } = req.body;
  if (!targetId || !userName || !comment) {
    return res.status(400).json({ error: 'Target ID, user name, and comment are required' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    targetId,
    targetName: targetName || 'Hira Farooq Studio Service/Product',
    userName,
    userCity: userCity || 'Karachi',
    rating: Number(rating) || 5,
    comment,
    date: new Date().toISOString().split('T')[0],
    verified: true,
  };

  db.reviews.unshift(newReview);

  // Recalculate target rating if product exists
  const prod = db.products.find((p) => p.id === targetId);
  if (prod) {
    const prodReviews = db.reviews.filter((r) => r.targetId === targetId);
    const avg = prodReviews.reduce((acc, curr) => acc + curr.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  saveDatabase();
  return res.status(201).json(newReview);
});

/* -------------------------------------------------------------
   USERS & STATS API ROUTES (/api/users & /api/stats)
------------------------------------------------------------- */
app.get('/api/users', (req: Request, res: Response) => {
  const safeUsers = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    address: u.address,
    city: u.city,
    createdAt: u.createdAt,
  }));
  return res.json(safeUsers);
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.users[index] = {
    ...db.users[index],
    ...req.body,
  };
  saveDatabase();
  return res.json(db.users[index]);
});

app.get('/api/stats', (req: Request, res: Response) => {
  const totalRevenue = db.orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrders = db.orders.filter((o) => o.orderStatus === 'pending').length;
  const pendingAppointments = db.appointments.filter((a) => a.status === 'pending').length;

  return res.json({
    totalRevenue,
    totalOrders: db.orders.length,
    totalAppointments: db.appointments.length,
    totalProducts: db.products.length,
    pendingOrders,
    pendingAppointments,
    recentOrders: db.orders.slice(0, 5),
    recentAppointments: db.appointments.slice(0, 5),
  });
});

app.post('/api/seed', (req: Request, res: Response) => {
  db = {
    products: [...INITIAL_PRODUCTS],
    reviews: [...INITIAL_REVIEWS],
    users: [...INITIAL_USERS],
    orders: [...INITIAL_ORDERS],
    appointments: [...INITIAL_APPOINTMENTS],
  };
  saveDatabase();
  return res.json({ message: 'Database successfully re-seeded with luxury salon catalog', db });
});

/* -------------------------------------------------------------
   SERVER INITIALIZATION & VITE MIDDLEWARE
------------------------------------------------------------- */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ HIRA FAROOQ MAKEUP STUDIO & SALON Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
