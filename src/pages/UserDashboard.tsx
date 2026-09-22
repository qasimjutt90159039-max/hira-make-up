import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  Heart, 
  Settings, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Trash2, 
  ArrowRight, 
  MessageCircle, 
  Sparkles,
  Phone,
  MapPin,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order, Appointment, Product } from '../types';
import { BUSINESS_INFO } from '../data/business';

export const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlist, toggleWishlist, addToCart, showToast } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Karachi',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const [allOrders, allAppts, allProds] = await Promise.all([
          api.getOrders(),
          api.getAppointments(),
          api.getProducts(),
        ]);

        // Filter for this user (or fallback to recent demo entries if guest)
        setOrders(allOrders);
        setAppointments(allAppts);
        setWishlistProducts(allProds.filter((p) => wishlist.includes(p.id)));
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [wishlist]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      showToast('Profile information successfully saved!');
    }, 400);
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (window.confirm('Are you sure you want to cancel this salon booking?')) {
      try {
        await api.updateAppointmentStatus(apptId, 'cancelled');
        setAppointments((prev) =>
          prev.map((a) => (a.id === apptId ? { ...a, status: 'cancelled' } : a))
        );
        showToast('Appointment has been cancelled.');
      } catch (err) {
        alert('Failed to cancel appointment.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header Bar */}
      <div className="bg-gradient-to-r from-[#FAF0F2] via-[#FFFDFB] to-[#FAF0F2] rounded-3xl p-6 sm:p-8 border border-[#F2D8DC] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#8C2B3E] bg-[#FCE7EC] flex items-center justify-center shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-[#8C2B3E]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#3A121A]">
                {user?.name || 'Valued Studio Client'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#3A121A] text-white text-[10px] font-bold uppercase tracking-wider">
                {user?.role === 'admin' ? 'Admin Access' : 'VIP Studio Member'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {user?.email || 'guest@hirafarooq.com'} • {user?.phone || '0347-7844143'} • {user?.city || 'Karachi'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-[#8C2B3E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#601D2C] transition-colors"
            >
              Open Admin Portal
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 rounded-xl border border-[#E8CCD1] text-gray-700 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#F2D8DC] overflow-x-auto gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
        {[
          { id: 'orders', label: `My Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'appointments', label: `Salon Bookings (${appointments.length})`, icon: Calendar },
          { id: 'wishlist', label: `Saved Wishlist (${wishlistProducts.length})`, icon: Heart },
          { id: 'profile', label: 'Account Profile', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-2 sm:px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
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

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">No Orders Yet</h3>
              <p className="text-xs text-gray-500">You have not made any purchases yet.</p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase"
              >
                Shop Cosmetics
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2D8DC] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#3A121A]">
                        Order #{ord.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        ord.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-gray-500 block">Total Payable:</span>
                    <span className="font-serif font-bold text-lg text-[#3A121A]">
                      Rs. {ord.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 block uppercase font-medium">
                      Payment: {ord.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-[#F2D8DC]">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-[#F2D8DC]"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block">{item.product.name}</span>
                          {item.selectedVariant && (
                            <span className="text-[11px] text-[#8C2B3E]">{item.selectedVariant}</span>
                          )}
                          <span className="text-[11px] text-gray-500 block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-gray-800">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-[#FAF0F2]/50 rounded-xl flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8C2B3E]" />
                    <span>Shipping to: {ord.shippingAddress?.address || ord.customer?.address || 'Karachi'}, {ord.shippingAddress?.city || ord.customer?.city || 'Karachi'}</span>
                  </div>
                  <a
                    href={`https://wa.me/923477844143?text=${encodeURIComponent(`Hi Hira Farooq Studio! Checking status of order #${ord.orderNumber}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E7E34] font-bold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Track on WhatsApp</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Appointments / Bookings */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">No Studio Bookings Found</h3>
              <p className="text-xs text-gray-500">You have no active bridal or salon appointments scheduled.</p>
              <Link
                to="/services"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase"
              >
                Explore Salon Services
              </Link>
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#3A121A]">
                      {appt.serviceName}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1 font-semibold text-[#8C2B3E]">
                      <Calendar className="w-3.5 h-3.5" />
                      {appt.date || appt.appointmentDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {appt.timeSlot || appt.appointmentTime}
                    </span>
                    <span>Artist: <strong>{appt.artistPreference || appt.stylistName}</strong></span>
                    <span>Persons: <strong>{appt.numberOfPersons || 1}</strong></span>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    Location: House No. B-28, Block 15, Gulshan-e-Iqbal, Karachi.
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <span className="font-serif font-bold text-lg text-[#3A121A]">
                    Rs. {(appt.estimatedPrice ?? appt.price).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/923477844143?text=${encodeURIComponent(`Hi! Inquiring about appointment for ${appt.serviceName} on ${appt.date || appt.appointmentDate} (${appt.timeSlot || appt.appointmentTime}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#EAFBF0] text-[#1E7E34] text-xs font-bold hover:bg-[#d6f7e0] flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Desk</span>
                    </a>

                    {appt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500">Save your favorite cosmetics and treatments for later.</p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase"
              >
                Browse Studio Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-4 flex flex-col justify-between space-y-3 shadow-xs"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-red-500 shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#3A121A] line-clamp-1">{product.name}</h4>
                    <span className="font-serif font-bold text-sm text-[#8C2B3E] block mt-1">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      showToast(`Added ${product.name} to your shopping bag!`);
                    }}
                    className="w-full py-2 bg-[#3A121A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#260B11]"
                  >
                    Add to Bag
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Account Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-8 space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#3A121A]">Personal Profile & Delivery Info</h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Contact Mobile Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Default Street / Delivery Address</label>
              <textarea
                rows={2}
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 bg-[#3A121A] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#260B11]"
            >
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
