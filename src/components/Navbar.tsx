import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Search, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Shield, 
  LogOut, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/business';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { totalItems, subtotal, wishlist, setIsCartOpen, openAppointmentModal } = useCart();
  const { user, isAuthenticated, isAdmin, logout, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Products', path: '/shop', badge: 'Cosmetics' },
    { name: 'Salon Services', path: '/services', badge: 'Bridal' },
    { name: 'About Studio', path: '/about' },
    { name: 'Contact & Map', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDFB] border-b border-[#F2D8DC] shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#3A121A] via-[#4D1722] to-[#3A121A] text-white py-2 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#FCE7EC] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F3C5CD]" /> Gulshan-e-Iqbal, Karachi
            </span>
            <span className="hidden md:inline text-white/90">
              House No. B-28, Ground Floor, Block 15 • Mon–Sun 10 AM – 9 PM
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-white/90">
            <a 
              href={BUSINESS_INFO.phoneTel} 
              className="flex items-center gap-1 hover:text-[#F3C5CD] transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <span className="text-white/40">|</span>
            <a 
              href={BUSINESS_INFO.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-[#4EFE97] hover:text-white transition-colors font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-[#FCE7EC]">
              Free Karachi Delivery Over Rs. 3,500
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#3A121A] hover:bg-[#FAF3F4] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo / Brand */}
          <Link to="/" className="flex flex-col items-center sm:items-start text-center sm:text-left group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3A121A] group-hover:text-[#8C2B3E] transition-colors">
              HIRA FAROOQ
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold uppercase text-[#962A3E] -mt-1">
              MAKEUP STUDIO & SALON
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all relative flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-[#3A121A] font-bold bg-[#FBF0F2]' 
                      : 'text-gray-700 hover:text-[#3A121A] hover:bg-[#FAF3F4]'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#FCE7EC] text-[#8C2B3E]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-xl text-sm font-bold text-[#8C2B3E] bg-[#FCE7EC] hover:bg-[#F8D4DC] transition-all flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-[#8C2B3E]" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* Action Icons & CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Toggle */}
            <button
              id="search-toggle-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl text-gray-700 hover:text-[#3A121A] hover:bg-[#FAF3F4] transition-colors"
              title="Search products and services"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              id="wishlist-nav-link"
              to="/dashboard"
              className="p-2.5 rounded-xl text-gray-700 hover:text-[#3A121A] hover:bg-[#FAF3F4] transition-colors relative"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B76E79] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Drawer Button */}
            <button
              id="cart-drawer-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-[#FAF3F4] hover:bg-[#F5E6E9] text-[#3A121A] transition-colors border border-[#F2D8DC]"
              title="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#3A121A]" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#3A121A] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold font-serif text-[#3A121A]">
                Rs. {subtotal.toLocaleString()}
              </span>
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-2 rounded-xl text-gray-700 hover:text-[#3A121A] hover:bg-[#FAF3F4] transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8CCD1] bg-[#FCE7EC] flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-[#3A121A]" />
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  id="user-dropdown-panel"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#F2D8DC] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2 border-b border-[#F2D8DC]">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-serif font-bold text-[#3A121A] text-sm truncate">{user?.name || 'Guest Customer'}</p>
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                      isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-pink-100 text-pink-900'
                    }`}>
                      {isAdmin ? 'Studio Admin' : 'Customer Account'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF3F4] font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-[#B76E79]" />
                      My Orders & Appointments
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#8C2B3E] font-bold hover:bg-[#FCE7EC]"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Dashboard (CRUD)
                      </Link>
                    )}
                  </div>

                  {/* Quick Demo Switcher for fast evaluation */}
                  <div className="p-2 mx-2 my-1 bg-[#FAF3F4] rounded-xl border border-[#F2D8DC] text-[11px]">
                    <div className="font-semibold text-gray-600 mb-1 flex items-center justify-between">
                      <span>Quick Switch Mode:</span>
                      <SlidersHorizontal className="w-3 h-3 text-[#B76E79]" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          switchDemoUser('customer');
                          setIsUserMenuOpen(false);
                        }}
                        className={`py-1 px-2 rounded-lg text-center font-medium transition-all ${
                          !isAdmin ? 'bg-[#3A121A] text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          switchDemoUser('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className={`py-1 px-2 rounded-lg text-center font-medium transition-all ${
                          isAdmin ? 'bg-[#3A121A] text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#F2D8DC] pt-1">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#3A121A] hover:bg-[#FAF3F4] font-semibold"
                      >
                        <User className="w-3.5 h-3.5" />
                        Sign In / Register
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Book Appointment CTA Button */}
            <button
              id="nav-book-appointment-btn"
              onClick={() => openAppointmentModal()}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3A121A] to-[#601D2C] hover:from-[#260B11] hover:to-[#4A1521] text-white text-xs font-bold tracking-wide uppercase shadow-sm hover:shadow-md transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-[#F3C5CD]" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t border-[#F2D8DC] animate-in fade-in slide-in-from-top-1 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <input
                id="search-input"
                type="text"
                placeholder="Search bridal packages, foundations, lipsticks, facials, hair treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 bg-white border border-[#E8CCD1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-gray-800"
                autoFocus
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-4 py-1.5 rounded-lg bg-[#3A121A] text-white text-xs font-bold hover:bg-[#260B11] transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-[#F2D8DC] bg-[#FFFDFB] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-gray-800 hover:bg-[#FAF3F4]"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCE7EC] text-[#8C2B3E]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold text-[#8C2B3E] bg-[#FCE7EC]"
              >
                <span>Admin Dashboard</span>
                <Shield className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-gray-800 hover:bg-[#FAF3F4]"
            >
              <span>My Orders & Appointments</span>
              <User className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          <div className="pt-2 border-t border-[#F2D8DC] space-y-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAppointmentModal();
              }}
              className="w-full py-3 rounded-xl bg-[#3A121A] text-white text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-[#F3C5CD]" />
              <span>Book Salon Appointment</span>
            </button>

            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-[#25D366] text-white text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 0347-7844143</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
