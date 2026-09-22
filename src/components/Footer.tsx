import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Heart
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

export const Footer: React.FC = () => {
  return (
    <footer id="salon-footer" className="bg-[#1F0A0E] text-[#F3E2E5] border-t border-[#3A121A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Salon Identity */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                HIRA FAROOQ
              </span>
              <span className="text-[10px] tracking-[0.25em] font-semibold uppercase text-[#F3C5CD]">
                MAKEUP STUDIO & SALON
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Karachi’s premier destination for couture bridal makeovers, signature party glam, 
              organic keratin hair restorations, and medical-grade clinical HydraFacials.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#4EFE97] hover:text-white flex items-center justify-center transition-colors border border-[#25D366]/30"
                title="Chat with Hira Farooq Studio on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#E1306C] text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.phoneTel}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#3A121A] text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                title="Call 0347-7844143"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Studio Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F3C5CD]" />
              Gulshan Studio Location
            </h4>
            <div className="text-xs text-white/80 space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="text-white/50">Address:</span>
                <span className="leading-snug">
                  {BUSINESS_INFO.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50">Calling:</span>
                <a href={BUSINESS_INFO.phoneTel} className="hover:text-white underline decoration-white/30">
                  {BUSINESS_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/50">WhatsApp:</span>
                <a 
                  href={BUSINESS_INFO.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4EFE97] hover:underline font-semibold"
                >
                  {BUSINESS_INFO.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#F3C5CD]" />
                <span>{BUSINESS_INFO.hours}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Services & Shop Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Services & Collections
            </h4>
            <ul className="text-xs text-white/70 space-y-2">
              <li>
                <Link to="/services" className="hover:text-[#F3C5CD] transition-colors">
                  Bridal Makeup Packages (Barat & Walima)
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F3C5CD] transition-colors">
                  Signature Party & Nikkah Glam
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Makeup+Products" className="hover:text-[#F3C5CD] transition-colors">
                  Hira Farooq Studio 24H Foundation
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F3C5CD] transition-colors">
                  9-Step Diamond HydraFacial
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Hair+Care+Products" className="hover:text-[#F3C5CD] transition-colors">
                  Brazilian Nano-Keratin & Hair Serums
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Gift+Vouchers+/+Combo+Deals" className="hover:text-[#F3C5CD] transition-colors">
                  Luxury Pampering Gift Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Salon Trust & Guarantees */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Our Promise
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#F3C5CD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Karachi & Nationwide Delivery</span>
                  <span>Free delivery in Karachi on orders over Rs. 3,500. Cash on delivery available.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#F3C5CD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">100% Authentic Products</span>
                  <span>Directly curated by Hira Farooq for Pakistani climate and skin tones.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-[#F3C5CD] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Flexible Payment Options</span>
                  <span>Cash on Delivery, Direct Bank Transfer (Meezan/HBL), and Credit/Debit Card.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All Rights Reserved. Gulshan-e-Iqbal, Karachi.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Studio Directions</Link>
            <Link to="/services" className="hover:text-white transition-colors">Appointment Rates</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">My Account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
