import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  Check, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Product } from '../types';

export const Services: React.FC = () => {
  const { openAppointmentModal } = useCart();
  const [services, setServices] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const prods = await api.getProducts();
        setServices(prods.filter((p) => p.itemType === 'service'));
      } catch (e) {
        console.error('Failed to load services', e);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const categories = [
    'All',
    'Bridal Makeup Packages',
    'Party/Event Makeup',
    'Hair Styling & Treatments',
    'Facial & Skincare Services',
    'Nail Art & Care',
  ];

  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="space-y-16 py-8">
      {/* 1. Header & Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FAF0F2] via-[#FFFDFB] to-[#FAF0F2] rounded-3xl p-8 sm:p-14 border border-[#F2D8DC] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#8C2B3E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" /> Gulshan-e-Iqbal Studio Service Menu
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A121A] leading-tight">
              Bridal Artistry, Couture Glam & Medical Skincare
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Explore our master salon offerings at House No. B-28, Block 15, Gulshan-e-Iqbal, Karachi. 
              Every service is performed using international luxury brands (Charlotte Tilbury, NARS, MAC, Kérastase) 
              calibrated for Karachi’s unique coastal humidity and studio lighting.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openAppointmentModal()}
                className="px-8 py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#F3C5CD]" />
                <span>Book Custom Appointment</span>
              </button>
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Consultation: 0347-7844143</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bridal Packages Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
            Bridal Collection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A]">
            Hira Farooq Signature Bridal Experiences
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Includes skin prep, high-end mink lashes, bridal hair sculpting, dupatta & heavy jewelry setting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Barat Bride */}
          <div className="bg-[#FFFDFB] rounded-3xl border-2 border-[#8C2B3E] p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#8C2B3E] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-bl-xl">
              Most Popular
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E]">Full Day Glam</span>
              <h3 className="font-serif text-2xl font-bold text-[#3A121A]">Barat Royal Bridal Look</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#3A121A]">Rs. 45,000</span>
                <span className="text-xs text-gray-400">/ by Hira Farooq</span>
              </div>
              <p className="text-xs text-gray-600">
                18-Hour humidity-proof traditional or contemporary royal Barat bridal glam with 3D mink lashes and dupatta draping.
              </p>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Full HD Airbrush / Velvet 24H Base</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Intricate Bridal Updo or Sculpted Curls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Matha Patti & Double Dupatta Pinning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Hydrating 24K Gold Pre-Makeup Sheet Mask</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#F2D8DC] mt-6">
              <button
                onClick={() => {
                  const s = services.find((p) => p.name.includes('Barat'));
                  openAppointmentModal(s);
                }}
                className="w-full py-3.5 rounded-xl bg-[#8C2B3E] hover:bg-[#601D2C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Reserve Barat Date
              </button>
            </div>
          </div>

          {/* Card 2: Walima Reception */}
          <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E]">Reception Glam</span>
              <h3 className="font-serif text-2xl font-bold text-[#3A121A]">Walima Ethereal Glow</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#3A121A]">Rs. 40,000</span>
                <span className="text-xs text-gray-400">/ by Hira Farooq</span>
              </div>
              <p className="text-xs text-gray-600">
                Soft-focus champagne/rosy dewy glow, subtle feline eye contour, and romantic textured Hollywood waves.
              </p>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Dewy Glass Skin Finish & Liquid Blush</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Hollywood Waves or Messy French Twist</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Complete Gown & Dupatta Styling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Nude Lip Shading with 12H Plumping Balm</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#F2D8DC] mt-6">
              <button
                onClick={() => {
                  const s = services.find((p) => p.name.includes('Walima'));
                  openAppointmentModal(s);
                }}
                className="w-full py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Reserve Walima Date
              </button>
            </div>
          </div>

          {/* Card 3: Nikkah / Engagement */}
          <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E]">Intimate Ceremony</span>
              <h3 className="font-serif text-2xl font-bold text-[#3A121A]">Nikkah & Engagement</h3>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#3A121A]">Rs. 30,000</span>
                <span className="text-xs text-gray-400">/ by Hira Farooq</span>
              </div>
              <p className="text-xs text-gray-600">
                Angelic, fresh skin with pastel eyes, natural flutter lashes, and floral-adorned braided hair.
              </p>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Weightless Breathable Foundation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Fresh Baby’s Breath & Gajara Hair Pinning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Delicate Veil & Dupatta Setting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />
                  <span>Private Bridal Lounge Access</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#F2D8DC] mt-6">
              <button
                onClick={() => {
                  const s = services.find((p) => p.name.includes('Nikkah') || p.name.includes('Barat'));
                  openAppointmentModal(s);
                }}
                className="w-full py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Reserve Nikkah Date
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Filter Tabs & All Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#F2D8DC] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A121A]">
              Complete Studio Service Catalog
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Select category to view rates, duration, and artist details
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === c
                    ? 'bg-[#3A121A] text-white font-bold shadow-sm'
                    : 'bg-[#FAF0F2] text-gray-700 hover:bg-[#FCE7EC]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-3 border-[#3A121A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500">Loading salon service menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#3A121A] text-white text-[10px] font-bold uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{service.rating} ({service.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">
                        {service.ingredientsOrServiceDuration || 'Studio Appointment'}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#3A121A] group-hover:text-[#8C2B3E] transition-colors">
                      {service.name}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-[11px] text-gray-700">
                      {service.details.slice(0, 3).map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#8C2B3E] shrink-0" />
                          <span className="truncate">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#FAF0F2]/50 border-t border-[#F2D8DC] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Service Fee</span>
                    <span className="font-serif text-lg font-bold text-[#3A121A]">
                      Rs. {service.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => openAppointmentModal(service)}
                    className="px-5 py-2.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Studio Amenities & Hygiene Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1F0A0E] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F3C5CD]">
              Gulshan Studio Standards
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Why Karachi Brides Trust Hira Farooq
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/80">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-serif font-bold text-base text-white">100% Autoclave Sterilization</h4>
              <p className="leading-relaxed">
                All brushes, sponges, and hair styling tools are sterilized between clients. Disposable applicators used for lipsticks and mascara.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-serif font-bold text-base text-white">VIP Private Bridal Suite</h4>
              <p className="leading-relaxed">
                Enjoy your preparation in an exclusive air-conditioned lounge with private dressing mirrors, full-length lighting, and refreshment service.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-serif font-bold text-base text-white">On-Time Bridal Guarantee</h4>
              <p className="leading-relaxed">
                We strictly limit the number of brides per day to ensure calm, unhurried, punctual departure for your photo session.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
