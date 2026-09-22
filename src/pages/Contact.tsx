import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Car, 
  ShieldCheck 
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/business';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '0347-',
    email: '',
    subject: 'Bridal Booking Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const faqs = [
    {
      q: 'Where exactly is the studio located in Gulshan-e-Iqbal?',
      a: 'We are situated at House No. B-28, Ground Floor, Block 15, Gulshan-e-Iqbal, Karachi (near Disco Bakery / Continental Bakery road). The studio has dedicated ground-floor entrance with private valet and security.',
    },
    {
      q: 'Do you require an advance deposit for bridal bookings?',
      a: 'Yes, because we limit our bridal bookings per day to ensure dedicated attention, a 30% advance deposit confirms your wedding date on our master ledger. The remaining balance is payable on the event day.',
    },
    {
      q: 'Can I book an in-person bridal consultation or makeup trial?',
      a: 'Absolutely! You are welcome to visit our Gulshan studio during salon hours (10:00 AM – 9:00 PM) for skin analysis, outfit color matching, and package consultation with Hira Farooq or our senior artist.',
    },
    {
      q: 'How long does physical cosmetics delivery take within Karachi?',
      a: 'Cosmetics orders placed on our website are dispatched from our Gulshan studio within 24 to 48 hours. Orders above Rs. 3,500 qualify for free delivery with Cash on Delivery.',
    },
    {
      q: 'Is there convenient parking available outside the studio?',
      a: 'Yes, we have dedicated secured parking directly in front of House No. B-28 with studio security guards to assist brides and guests.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* 1. Page Header */}
      <div className="bg-gradient-to-r from-[#FAF0F2] via-[#FFFDFB] to-[#FAF0F2] rounded-3xl p-8 sm:p-12 border border-[#F2D8DC] relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#8C2B3E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" /> Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A]">
            Contact Our Studio & Book A Visit
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Have questions regarding bridal dates, party makeover availability, hair treatments, or cosmetic orders? 
            Reach out via WhatsApp, phone, or send us a direct message below.
          </p>
        </div>
      </div>

      {/* 2. Contact Details Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Studio Location */}
        <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3A121A]">Studio Address</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {BUSINESS_INFO.address}
          </p>
          <a
            href={BUSINESS_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-bold text-[#8C2B3E] hover:underline"
          >
            Get Google Map Directions →
          </a>
        </div>

        {/* Card 2: Phone Calling */}
        <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3A121A]">Direct Calling</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Speak directly with our studio front desk and booking coordinators.
          </p>
          <a
            href={BUSINESS_INFO.phoneTel}
            className="inline-block font-serif font-bold text-sm text-[#3A121A] hover:text-[#8C2B3E]"
          >
            {BUSINESS_INFO.phone}
          </a>
        </div>

        {/* Card 3: WhatsApp Chat */}
        <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAFBF0] text-[#1E7E34] flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3A121A]">WhatsApp Studio Desk</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Instant assistance, photo inquiries, and bridal consultation on WhatsApp.
          </p>
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-bold text-[#1E7E34] hover:underline"
          >
            Chat Now (0347-7844143) →
          </a>
        </div>

        {/* Card 4: Operating Hours */}
        <div className="p-6 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#3A121A]">Studio Timings</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {BUSINESS_INFO.hours}
          </p>
          <span className="text-[11px] font-semibold text-[#2F6B38] block">
            Open 7 Days a Week (including Sundays)
          </span>
        </div>
      </div>

      {/* 3. Form & Map Dual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (col-span-6) */}
        <div className="lg:col-span-6 bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-2xl text-[#3A121A]">Send a Direct Message</h2>
            <p className="text-xs text-gray-500">
              We respond to all online inquiries within 2 hours during studio business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-[#EAFBF0] border border-[#20ba59]/30 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#1E7E34] mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#1E7E34]">Message Received!</h3>
              <p className="text-xs text-gray-700 max-w-sm mx-auto">
                Thank you, <strong>{formData.name}</strong>. Our booking coordinator will reach out to <strong>{formData.phone}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '0347-', email: '', subject: 'Bridal Booking Inquiry', message: '' });
                }}
                className="px-5 py-2 bg-[#3A121A] text-white text-xs font-bold uppercase rounded-xl mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Zainab Siddiqui"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="0347-xxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject / Service Interest</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none font-medium"
                  >
                    <option value="Bridal Booking Inquiry">Bridal Booking Inquiry (Barat/Walima)</option>
                    <option value="Party / Nikkah Glam">Party / Nikkah Glam Inquiry</option>
                    <option value="Hair Keratin & Styling">Hair Keratin & Styling</option>
                    <option value="Diamond HydraFacial Care">Diamond HydraFacial Care</option>
                    <option value="Cosmetics Order Tracking">Cosmetics Order Tracking</option>
                    <option value="General Studio Question">General Studio Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Message or Event Date *</label>
                <textarea
                  rows={4}
                  placeholder="Please specify your wedding or event date, number of persons, or specific questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Map & Studio Info (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] overflow-hidden shadow-xs p-6 sm:p-8 space-y-4">
            <h3 className="font-serif font-bold text-xl text-[#3A121A] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8C2B3E]" />
              Gulshan-e-Iqbal Studio Location
            </h3>
            <p className="text-xs text-gray-600">
              House No. B-28, Ground Floor, Block 15, Gulshan-e-Iqbal, Karachi, 75400, Pakistan.
            </p>

            {/* Embedded Responsive Google Maps iframe */}
            <div className="rounded-2xl overflow-hidden border border-[#F2D8DC] aspect-16/10 bg-gray-100 relative">
              <iframe
                title="Hira Farooq Makeup Studio Gulshan Location"
                src="https://maps.google.com/maps?q=Block%2015%20Gulshan-e-Iqbal%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <Car className="w-4 h-4 text-[#8C2B3E]" />
                <span>Dedicated client parking available</span>
              </div>
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#FAF0F2] text-[#8C2B3E] font-bold text-xs uppercase hover:bg-[#FCE7EC] transition-colors"
              >
                Open in Google Maps App
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions Accordion */}
      <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] block">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#3A121A]">
            Frequently Asked Studio Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-[#F2D8DC]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-[#3A121A] hover:text-[#8C2B3E] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#8C2B3E] shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
