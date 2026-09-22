export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export type ProductCategory = 
  | 'Bridal Makeup Packages'
  | 'Party/Event Makeup'
  | 'Hair Styling & Treatments'
  | 'Facial & Skincare Services'
  | 'Makeup Products'
  | 'Hair Care Products'
  | 'Nail Art & Care'
  | 'Gift Vouchers / Combo Deals';

export type ItemType = 'product' | 'service';

export interface ProductVariant {
  name: string; // e.g. "Shade 02 Natural", "100ml", "Full Day", "Standard"
  priceModifier?: number; // e.g. 0 or +500
}

export interface Review {
  id: string;
  targetId: string; // productId or serviceId
  targetName: string;
  userName: string;
  userCity?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  itemType: ItemType; // 'product' (tangible cosmetic/skincare) or 'service' (in-salon service)
  price: number; // in PKR
  originalPrice?: number; // for discount badges
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  stock?: number;
  featured: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  reviews?: number;
  tags?: string[];
  image: string;
  galleryImages: string[];
  description: string;
  shortDescription: string;
  details: string[];
  howToUseOrPrep?: string;
  ingredientsOrServiceDuration?: string; // e.g., "Duration: 2.5 hours" or "Key Ingredients: Hyaluronic Acid, Rosehip Oil"
  variants?: ProductVariant[];
  badge?: string; // e.g. "Most Popular", "Bridal Exclusive", "Limited Offer"
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'card' | 'bank_transfer' | 'easypaisa_jazzcash' | 'jazzcash_easypaisa';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  area?: string; // e.g., "Gulshan-e-Iqbal", "DHA", "Clifton", "PECHS"
  city: string; // default "Karachi"
  postalCode: string; // "75400"
  instructions?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: ShippingAddress;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  status?: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  userId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  price: number;
  estimatedPrice?: number;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "11:30 AM"
  date?: string;
  timeSlot?: string;
  stylistName: string; // e.g. "Hira Farooq (Master Artist)", "Sana (Senior Hair Specialist)"
  artistPreference?: string;
  numberOfPersons?: number;
  notes?: string;
  specialRequests?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalAppointments: number;
  totalProducts: number;
  pendingOrders: number;
  pendingAppointments: number;
  recentOrders: Order[];
  recentAppointments: Appointment[];
}
