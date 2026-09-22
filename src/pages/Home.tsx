import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  Heart, 
  Check, 
  MessageCircle, 
  ChevronRight,
  Phone,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Product, Review } from '../types';

export const Home: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, openAppointmentModal } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const prods = await api.getProducts({ featured: true });
        setFeaturedProducts(prods.filter((p) => p.itemType === 'product').slice(0, 4));
        setFeaturedServices(prods.filter((p) => p.itemType === 'service').slice(0, 4));
        const revs = await api.getReviews();
        setReviews(revs.slice(0, 3));
      } catch (e) {
        console.error('Failed to load home data', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=600&auto=format&fit=crop',
      title: 'Traditional Barat Bride',
      tag: '@hirafarooqstudio',
    },
    {
      url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop',
      title: 'Dewy Walima Reception',
      tag: '#KarachiBrides',
    },
    {
      url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop',
      title: 'Nano-Keratin Transformation',
      tag: '#HairBotoxKarachi',
    },
    {
      url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop',
      title: 'Diamond HydraFacial Clinical',
      tag: '#GulshanStudio',
    },
    {
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop',
      title: 'Radiant Mayun & Mehndi',
      tag: '#BridalGlam',
    },
    {
      url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=600&auto=format&fit=crop',
      title: 'Sculpted Gel Extensions',
      tag: '#NailArtKarachi',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO BANNER */}
      <section id="home-hero-section" className="relative overflow-hidden bg-gradient-to-b from-[#FAF0F2] via-[#FFFDFB] to-[#FFFDFB] pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCE7EC] border border-[#F2D8DC] text-[#8C2B3E] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                Gulshan-e-Iqbal, Karachi Luxury Beauty Destination
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3A121A] leading-[1.15]">
                Timeless Bridal Artistry, <span className="italic font-normal text-[#8C2B3E]">Ethereal Glam</span> & Clinical Skincare.
              </h1>

              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Step into <strong>Hira Farooq Makeup Studio & Salon</strong> in Block 15, Gulshan-e-Iqbal. 
                From bespoke Barat and Walima bridal makeovers to 24H transfer-proof cosmetics formulated 
                specifically for Pakistani weather.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  id="hero-book-appointment-btn"
                  onClick={() => openAppointmentModal()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#3A121A] to-[#601D2C] hover:from-[#260B11] hover:to-[#4A1521] text-white font-bold text-sm tracking-wide uppercase shadow-lg hover:shadow-xl transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#F3C5CD]" />
                  <span>Book Salon Appointment</span>
                </button>

                <Link
                  id="hero-shop-collection-btn"
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#3A121A] text-[#3A121A] hover:bg-[#3A121A] hover:text-white font-bold text-sm tracking-wide uppercase transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Cosmetics & Kits</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#F2D8DC] max-w-lg mx-auto lg:mx-0">
                <div className="text-left">
                  <span className="font-serif font-bold text-2xl text-[#3A121A] block">2,500+</span>
                  <span className="text-xs text-gray-500">Karachi Brides Styled</span>
                </div>
                <div className="text-left border-l border-[#F2D8DC] pl-4">
                  <span className="font-serif font-bold text-2xl text-[#3A121A] block">4.9★</span>
                  <span className="text-xs text-gray-500">Verified Client Rating</span>
                </div>
                <div className="text-left border-l border-[#F2D8DC] pl-4">
                  <span className="font-serif font-bold text-2xl text-[#3A121A] block">100%</span>
                  <span className="text-xs text-gray-500">Original Formulations</span>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=1000&auto=format&fit=crop"
                    alt="Hira Farooq Signature Barat Bride Makeup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F0A0E]/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FCE7EC] text-[#3A121A] text-xs font-bold uppercase tracking-wider mb-2">
                      Master Bridal Artistry
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      Hira Farooq Signature Barat Look
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      18-Hour Transfer-proof HD Glow tailored for Pakistani lighting.
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#F2D8DC] hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center font-serif font-bold text-lg">
                    HF
                  </div>
                  <div>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(5)}
                    </div>
                    <p className="text-xs font-bold text-[#3A121A]">Top Rated Studio in Gulshan</p>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#F2D8DC] hidden sm:block">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Studio Location</p>
                  <p className="text-xs font-bold text-[#3A121A]">Block 15, Gulshan-e-Iqbal</p>
                  <p className="text-[11px] text-[#25D366] font-semibold mt-0.5">Open Today: 10 AM – 9 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#3A121A]">Couture Bridal Expertise</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Personally designed makeup looks calibrated for Barat, Walima, and Nikkah with high-end luxury cosmetics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#3A121A]">Clinical HydraFacial Care</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              9-step medical grade vortex extraction and diamond microdermabrasion for immediate skin glass-glow.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#3A121A]">Karachi Weather Resistant</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our 24H Velvet Foundation & Setting Sprays are proven to withstand coastal humidity and high flashlights.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#3A121A]">Cash on Delivery Available</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Order your favorite makeup products online with free Karachi delivery on orders above Rs. 3,500.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE BRIDAL & SALON PACKAGES */}
      <section id="home-featured-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
              Studio Services
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A]">
              Signature Bridal & Salon Treatments
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8C2B3E] hover:text-[#3A121A] transition-colors"
          >
            <span>View All Salon Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {service.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#3A121A] text-white text-[10px] font-bold uppercase tracking-wider">
                    {service.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
                  {service.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-gray-800">{service.rating}</span>
                    <span className="text-gray-400">({service.reviewsCount})</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#3A121A] group-hover:text-[#8C2B3E] transition-colors line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2D8DC] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Service Fee</span>
                    <span className="font-serif text-lg font-bold text-[#3A121A]">
                      Rs. {service.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => openAppointmentModal(service)}
                    className="px-4 py-2 rounded-xl bg-[#FAF0F2] hover:bg-[#3A121A] text-[#8C2B3E] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLING COSMETICS & HAIRCARE */}
      <section id="home-featured-products" className="bg-[#FAF3F4]/50 py-16 border-y border-[#F2D8DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
                E-Commerce Store
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A]">
                Bestselling Makeup & Care Essentials
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8C2B3E] hover:text-[#3A121A] transition-colors"
            >
              <span>Explore Entire Catalog ({featuredProducts.length * 5}+ Items)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      inWish
                        ? 'bg-[#3A121A] text-white shadow-sm'
                        : 'bg-white/80 hover:bg-white text-gray-500 hover:text-[#8C2B3E]'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                  </button>

                  <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#8C2B3E] text-white text-[10px] font-bold uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#8C2B3E] uppercase tracking-wider">
                        {product.category}
                      </span>
                      <Link
                        to={`/product/${product.slug}`}
                        className="font-serif font-bold text-base text-[#3A121A] hover:text-[#8C2B3E] transition-colors block mt-1 line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F2D8DC] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif text-lg font-bold text-[#3A121A]">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#2F6B38] font-semibold">In Stock</span>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-2.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white transition-colors"
                        title="Add to shopping bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ABOUT THE FOUNDER & STUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] overflow-hidden shadow-sm p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-4/5 border-2 border-[#F2D8DC]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                  alt="Hira Farooq - Founder & Lead Makeup Artist"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#3A121A] text-white p-4 rounded-2xl shadow-xl">
                <span className="font-serif text-xl font-bold block">Hira Farooq</span>
                <span className="text-[11px] text-[#F3C5CD]">Founder & Lead Celebrity Artist</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block">
                The Hira Farooq Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A] leading-tight">
                "Every Pakistani bride deserves to look like the most radiant version of herself, without feeling masked."
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Founded in Gulshan-e-Iqbal, Karachi, our studio was born out of a desire to redefine Pakistani bridal glamour. 
                We combine international luxury formulations with advanced skincare prep so that your makeup looks 
                as luminous in real daylight as it does under 4K video lenses and evening wedding chandeliers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Hygiene-first certified studio protocols</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>VIP private bridal dressing lounges</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Custom jewelry and dupatta draping</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Formaldehyde-free organic hair therapies</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/about"
                  className="px-6 py-3 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Read Our Studio Story
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-xl border border-[#3A121A] text-[#3A121A] hover:bg-[#FAF0F2] text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Visit Studio Location
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
            Real Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A]">
            Loved by Karachi’s Most Discerning Brides
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F2D8DC] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2D8DC]">
                <p className="font-serif font-bold text-sm text-[#3A121A]">{rev.userName}</p>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-0.5">
                  <span>{rev.userCity}</span>
                  <span className="text-[#8C2B3E] font-medium truncate max-w-[160px]">{rev.targetName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. INSTAGRAM-STYLE STUDIO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
              Studio Visuals
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#3A121A]">
              Follow Our Transformations on Instagram
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#8C2B3E] hover:underline flex items-center gap-1"
          >
            <span>@hirafarooqmakeupstudio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden aspect-square shadow-xs">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3C5CD]">{img.tag}</span>
                <p className="text-xs font-semibold leading-tight">{img.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CALL TO ACTION & STUDIO CONTACT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-[#3A121A] via-[#4D1722] to-[#3A121A] rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#F3C5CD] uppercase tracking-wider">
                Karachi Bridal Bookings Open For The Season
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Reserve Your Bridal Glam Slot or Inquire Today
              </h2>
              <p className="text-white/80 text-sm max-w-xl leading-relaxed">
                Dates for upcoming wedding seasons fill up rapidly. Reach out directly on WhatsApp or book your slot online.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-[#FCE7EC]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F3C5CD]" />
                  <span>Block 15, Gulshan-e-Iqbal, Karachi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#F3C5CD]" />
                  <span>0347-7844143</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => openAppointmentModal()}
                className="w-full py-3.5 px-6 rounded-xl bg-white text-[#3A121A] font-bold text-xs uppercase tracking-wider hover:bg-[#FAF0F2] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
              </button>
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 0347-7844143</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
