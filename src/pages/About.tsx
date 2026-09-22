import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Heart, 
  Users, 
  Check, 
  Calendar, 
  MapPin, 
  Phone,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';
import { useCart } from '../context/CartContext';

export const About: React.FC = () => {
  const { openAppointmentModal } = useCart();

  const team = [
    {
      name: 'Hira Farooq',
      role: 'Founder & Lead Bridal Artist',
      experience: '10+ Years Artistry',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
      bio: 'Trained under international master artists in Dubai and London, Hira specializes in skin-first bridal glam that enhances innate Pakistani beauty.',
    },
    {
      name: 'Saba Tariq',
      role: 'Creative Director - Hair Architecture',
      experience: '8 Years Experience',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
      bio: 'Master of intricate South Asian bridal updos, textured Hollywood waves, and formaldehyde-free organic Nano-Keratin transformations.',
    },
    {
      name: 'Dr. Mahnoor Shaikh',
      role: 'Clinical Aesthetics & Skin Specialist',
      experience: '6 Years Practice',
      image: 'https://images.unsplash.com/photo-1594824813590-488667b36f73?q=80&w=600&auto=format&fit=crop',
      bio: 'Certified aesthetician heading our HydraFacial and clinical dermaplaning protocols for flawless bridal skin texture before wedding events.',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* 1. Hero / Studio Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FAF0F2] via-[#FFFDFB] to-[#FAF0F2] rounded-3xl p-8 sm:p-16 border border-[#F2D8DC] relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#8C2B3E] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" /> The Story Behind The Studio
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A121A] leading-tight">
              Artistry Crafted For The Modern Pakistani Bride.
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Located at House No. B-28, Ground Floor, Block 15, Gulshan-e-Iqbal, Karachi, 
              <strong> Hira Farooq Makeup Studio & Salon</strong> was built on a singular conviction: 
              makeup should celebrate individuality, not conceal it behind layers of heavy paint.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Brand Story & Visual Mosaic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block">
              Our Journey Since 2016
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A] leading-tight">
              From a Passion Project to Karachi’s Most Coveted Bridal Haven
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p>
                When Hira Farooq began her makeup journey, she observed that brides across Karachi 
                were frequently subjected to ashy, cakey bases that looked detached from their real skin tone 
                under daylight. Recognizing the harsh coastal humidity and intense warm lighting of Pakistani banquet halls, 
                she set out to craft high-definition formulations that stay lightweight, dewy, and transfer-proof for over 18 hours.
              </p>
              <p>
                In 2018, our flagship studio opened its doors in Gulshan-e-Iqbal Block 15. Today, the studio encompasses 
                luxurious private bridal suites, a sterile medical aesthetics room for Diamond HydraFacials, a dedicated 
                organic hair restoration lounge, and our bespoke boutique cosmetics line.
              </p>
            </div>

            {/* Milestones grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F2D8DC]">
              <div>
                <span className="font-serif font-bold text-3xl text-[#8C2B3E]">2,500+</span>
                <span className="text-xs text-gray-500 block mt-1">Brides Styled</span>
              </div>
              <div className="border-l border-[#F2D8DC] pl-4">
                <span className="font-serif font-bold text-3xl text-[#8C2B3E]">100%</span>
                <span className="text-xs text-gray-500 block mt-1">Cruelty-Free Products</span>
              </div>
              <div className="border-l border-[#F2D8DC] pl-4">
                <span className="font-serif font-bold text-3xl text-[#8C2B3E]">9+ Yrs</span>
                <span className="text-xs text-gray-500 block mt-1">Studio Excellence</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop"
                alt="Studio Makeup Artistry"
                className="w-full h-64 object-cover rounded-2xl shadow-md border border-[#F2D8DC]"
              />
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop"
                alt="Studio Interior Lounge"
                className="w-full h-44 object-cover rounded-2xl shadow-md border border-[#F2D8DC]"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=600&auto=format&fit=crop"
                alt="Bridal Dressing"
                className="w-full h-44 object-cover rounded-2xl shadow-md border border-[#F2D8DC]"
              />
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop"
                alt="HydraFacial Skincare"
                className="w-full h-64 object-cover rounded-2xl shadow-md border border-[#F2D8DC]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars & Principles */}
      <section className="bg-[#FAF3F4]/50 py-16 border-y border-[#F2D8DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
              Studio Values
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#3A121A]">
              Our Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFDFB] p-8 rounded-3xl border border-[#F2D8DC] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">Empowering Natural Radiance</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We reject cakey uniform looks. Every jawline, cheekbone, and eye shape is treated like unique architectural canvas.
              </p>
            </div>

            <div className="bg-[#FFFDFB] p-8 rounded-3xl border border-[#F2D8DC] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">Hospital-Grade Hygiene</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                UV sanitization, fresh disposables for every bride, and pure air filtration throughout the Gulshan studio facility.
              </p>
            </div>

            <div className="bg-[#FFFDFB] p-8 rounded-3xl border border-[#F2D8DC] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#3A121A]">Uncompromising Product Integrity</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Only authentic luxury cosmetics directly imported and tested. No replicas, counterfeit copies, or expired formulas ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Meet The Lead Artists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block mb-1">
            Artistic Leadership
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#3A121A]">
            Meet the Masters Behind the Looks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
                  {member.experience}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-xl text-[#3A121A]">{member.name}</h3>
                  <span className="text-xs font-bold text-[#8C2B3E] block uppercase tracking-wider">
                    {member.role}
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Visit Us Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3A121A] text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Experience the Studio in Person</h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg">
              House No. B-28, Ground Floor, Block 15, Gulshan-e-Iqbal, Karachi. Open Monday to Sunday, 10 AM to 9 PM.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => openAppointmentModal()}
              className="px-6 py-3 rounded-xl bg-white text-[#3A121A] font-bold text-xs uppercase tracking-wider hover:bg-[#FAF0F2] transition-colors shadow-md text-center"
            >
              Book Appointment
            </button>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-white/40 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors text-center"
            >
              View Studio Map & Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
