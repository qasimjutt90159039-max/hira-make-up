import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Package, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Search, 
  X, 
  Save, 
  AlertCircle,
  Sparkles,
  Phone,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product, Order, Appointment, Review, ProductCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, switchDemoUser } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'appointments' | 'reviews'>('kpi');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Filter & Search
  const [searchFilter, setSearchFilter] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [p, o, a, r] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getAppointments(),
        api.getReviews(),
      ]);
      setProducts(p);
      setOrders(o);
      setAppointments(a);
      setReviews(r);
    } catch (err) {
      console.error('Failed loading admin portal data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Compute KPIs
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const upcomingAppointments = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed').length;

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order #${updated.orderNumber} marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Appointment status update
  const handleUpdateApptStatus = async (apptId: string, newStatus: any) => {
    try {
      const updated = await api.updateAppointmentStatus(apptId, newStatus);
      setAppointments((prev) => prev.map((a) => (a.id === apptId ? updated : a)));
      showToast(`Booking for ${updated.serviceName} marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the studio catalog?`)) {
      try {
        await api.deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Item "${name}" removed.`);
      } catch (err) {
        alert('Failed to delete item.');
      }
    }
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Delete this client review?')) {
      try {
        await api.deleteReview(id);
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showToast('Review removed from public view.');
      } catch (err) {
        alert('Failed to delete review.');
      }
    }
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      alert('Please provide at least a product name and price.');
      return;
    }

    try {
      if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast(`Updated "${updated.name}"`);
      } else {
        const created = await api.createProduct(editingProduct as any);
        setProducts((prev) => [created, ...prev]);
        showToast(`Added new item "${created.name}"`);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const openNewProductModal = () => {
    setEditingProduct({
      name: '',
      category: 'Makeup Products',
      itemType: 'product',
      price: 2500,
      description: '',
      shortDescription: '',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
      stock: 50,
      badge: 'New Arrival',
      details: ['Premium Studio Formulation', 'Suitable for Pakistani Skin'],
    });
    setIsProductModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="bg-[#1F0A0E] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3A121A]">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="p-1.5 rounded-lg bg-white/10 text-[#F3C5CD]">
              <Shield className="w-5 h-5" />
            </span>
            <span className="font-serif font-bold text-xl sm:text-2xl text-white">
              Studio Management Portal
            </span>
          </div>
          <p className="text-xs text-white/70">
            Hira Farooq Makeup Studio & Salon • Block 15, Gulshan-e-Iqbal, Karachi • Administrative Operations
          </p>
        </div>

        {/* Demo Switcher Quick Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => switchDemoUser('customer')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Switch to Customer View
          </button>
          <button
            onClick={openNewProductModal}
            className="px-4 py-2 rounded-xl bg-[#8C2B3E] hover:bg-[#A33449] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product/Service</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-[#F2D8DC] overflow-x-auto gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
        {[
          { id: 'kpi', label: 'Analytics & KPIs', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'products', label: `Catalog (${products.length})`, icon: Package },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-2 sm:px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#3A121A] text-[#3A121A]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Analytics & KPI Overview */}
      {activeTab === 'kpi' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales Revenue</span>
              <p className="font-serif text-3xl font-bold text-[#3A121A]">
                Rs. {totalRevenue.toLocaleString()}
              </p>
              <span className="text-[11px] text-[#2F6B38] font-semibold block">
                +18.4% from last month in Karachi
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Orders</span>
              <p className="font-serif text-3xl font-bold text-[#3A121A]">
                {orders.length}
              </p>
              <span className="text-[11px] text-amber-700 font-semibold block">
                {pendingOrders} awaiting fulfillment/dispatch
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Bookings</span>
              <p className="font-serif text-3xl font-bold text-[#3A121A]">
                {appointments.length}
              </p>
              <span className="text-[11px] text-[#8C2B3E] font-semibold block">
                {upcomingAppointments} upcoming bridal/glam slots
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Catalog Items</span>
              <p className="font-serif text-3xl font-bold text-[#3A121A]">
                {products.length}
              </p>
              <span className="text-[11px] text-gray-500 font-semibold block">
                Active in Gulshan studio inventory
              </span>
            </div>
          </div>

          {/* Quick Recent Activity Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders Box */}
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2D8DC] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#3A121A]">Recent Studio Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#8C2B3E] hover:underline font-bold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-[#F2D8DC]">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">#{ord.orderNumber} - {ord.customerName || ord.customer?.fullName}</span>
                      <span className="text-[11px] text-gray-400">{ord.shippingAddress?.city || ord.customer?.city || 'Karachi'} • {ord.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-[#3A121A] block">Rs. {ord.total.toLocaleString()}</span>
                      <span className="text-[10px] font-bold uppercase text-[#8C2B3E]">{ord.status || ord.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments Box */}
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2D8DC] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#3A121A]">Upcoming Studio Appointments</h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs text-[#8C2B3E] hover:underline font-bold"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="divide-y divide-[#F2D8DC]">
                {appointments.slice(0, 5).map((appt) => (
                  <div key={appt.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{appt.clientName} ({appt.serviceName})</span>
                      <span className="text-[11px] text-gray-400">{appt.date || appt.appointmentDate} at {appt.timeSlot || appt.appointmentTime} • Artist: {appt.artistPreference || appt.stylistName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-[#3A121A] block">Rs. {(appt.estimatedPrice ?? appt.price).toLocaleString()}</span>
                      <span className="text-[10px] font-bold uppercase text-[#2F6B38]">{appt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Orders Management Tab */}
      {activeTab === 'orders' && (
        <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#3A121A]">
              Customer Orders Management ({orders.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F2D8DC] text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Items / Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8DC]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF0F2]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#3A121A]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{ord.customerName || ord.customer?.fullName}</span>
                      <span className="text-[10px] text-gray-400 truncate max-w-xs block">
                        {ord.shippingAddress?.address || ord.customer?.address || 'Karachi'}, {ord.shippingAddress?.city || ord.customer?.city || 'Karachi'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <a href={`tel:${ord.customerPhone || ord.customer?.phone}`} className="font-medium text-[#3A121A] hover:underline block">
                        {ord.customerPhone || ord.customer?.phone}
                      </a>
                      <a
                        href={`https://wa.me/${(ord.customerPhone || ord.customer?.phone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#1E7E34] hover:underline font-semibold"
                      >
                        WhatsApp Client →
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-sm text-[#3A121A] block">
                        Rs. {ord.total.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {ord.items.length} item(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E8CCD1] bg-white text-xs font-semibold text-gray-800"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Appointments Management Tab */}
      {activeTab === 'appointments' && (
        <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-[#3A121A]">
              Salon Appointments & Bridal Schedule ({appointments.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F2D8DC] text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Service & Rate</th>
                  <th className="py-3 px-4">Scheduled Slot</th>
                  <th className="py-3 px-4">Artist Assigned</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8DC]">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[#FAF0F2]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{appt.clientName}</span>
                      {appt.specialRequests && (
                        <span className="text-[10px] text-gray-400 italic block line-clamp-1">
                          "{appt.specialRequests}"
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <a href={`tel:${appt.clientPhone}`} className="font-medium text-[#3A121A] hover:underline block">
                        {appt.clientPhone}
                      </a>
                      <a
                        href={`https://wa.me/${appt.clientPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#1E7E34] hover:underline font-semibold"
                      >
                        WhatsApp Client →
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#8C2B3E] block">{appt.serviceName}</span>
                      <span className="font-serif font-bold text-xs text-[#3A121A]">
                        Rs. {(appt.estimatedPrice ?? appt.price).toLocaleString()} ({appt.numberOfPersons || 1} person)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800 block">{appt.date || appt.appointmentDate}</span>
                      <span className="text-[11px] text-gray-500">{appt.timeSlot || appt.appointmentTime}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      {appt.artistPreference || appt.stylistName}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={appt.status}
                        onChange={(e) => handleUpdateApptStatus(appt.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E8CCD1] bg-white text-xs font-semibold text-gray-800"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Products & Catalog Management Tab */}
      {activeTab === 'products' && (
        <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-serif font-bold text-xl text-[#3A121A]">
              Catalog Inventory ({products.length})
            </h2>
            <button
              onClick={openNewProductModal}
              className="px-4 py-2 bg-[#3A121A] hover:bg-[#260B11] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F2D8DC] text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2D8DC]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF0F2]/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-[#F2D8DC]" />
                      <div>
                        <span className="font-bold text-gray-900 block">{p.name}</span>
                        <span className="text-[10px] text-gray-400 truncate max-w-xs block">{p.shortDescription}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100">
                        {p.itemType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{p.category}</td>
                    <td className="py-3 px-4 font-serif font-bold text-sm text-[#3A121A]">
                      Rs. {p.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-600">
                      {p.stock !== undefined ? p.stock : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#E8CCD1] hover:bg-white text-gray-600"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Reviews Management Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#3A121A]">
            Client Feedback & Reviews ({reviews.length})
          </h2>

          <div className="divide-y divide-[#F2D8DC]">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{rev.userName}</span>
                    <span className="text-[11px] text-gray-400">({rev.userCity || 'Karachi'})</span>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8C2B3E] font-semibold block">Target: {rev.targetName}</span>
                  <p className="text-xs text-gray-700 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                </div>

                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-[#F2D8DC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F2D8DC] pb-3">
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">
                {editingProduct.id ? 'Edit Catalog Item' : 'Add New Item / Service'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Item / Service Name *</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Item Classification</label>
                  <select
                    value={editingProduct.itemType || 'product'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, itemType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                  >
                    <option value="product">Cosmetic Product</option>
                    <option value="service">Salon Service / Package</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Makeup Products'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                  >
                    <option value="Bridal Makeup Packages">Bridal Makeup Packages</option>
                    <option value="Party/Event Makeup">Party/Event Makeup</option>
                    <option value="Hair Styling & Treatments">Hair Styling & Treatments</option>
                    <option value="Facial & Skincare Services">Facial & Skincare Services</option>
                    <option value="Makeup Products">Makeup Products</option>
                    <option value="Hair Care Products">Hair Care Products</option>
                    <option value="Nail Art & Care">Nail Art & Care</option>
                    <option value="Gift Vouchers / Combo Deals">Gift Vouchers / Combo Deals</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Promo Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, 24H Wear"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Short Summary (1-2 sentences)</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-[#F2D8DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold uppercase tracking-wider"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
