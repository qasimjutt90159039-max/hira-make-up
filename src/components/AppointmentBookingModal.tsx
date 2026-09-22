import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Sparkles, UserCheck, Phone, Mail, CheckCircle2, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Product } from '../types';

export const AppointmentBookingModal: React.FC = () => {
  const { isAppointmentModalOpen, closeAppointmentModal, activeBookingService, showToast } = useCart();
  const { user } = useAuth();

  const [services, setServices] = useState<Product[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStylist, setSelectedStylist] = useState<string>(BUSINESS_INFO.stylists[0].name);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>(BUSINESS_INFO.timeSlots[2]); // 12:30 PM
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  // Load services
  useEffect(() => {
    api.getServices().then((res) => {
      setServices(res);
      if (activeBookingService) {
        setSelectedServiceId(activeBookingService.id);
      } else if (res.length > 0 && !selectedServiceId) {
        setSelectedServiceId(res[0].id);
      }
    });
  }, [activeBookingService]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setClientName(user.name);
      setClientEmail(user.email);
      setClientPhone(user.phone);
    }
  }, [user]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isoDate = tomorrow.toISOString().split('T')[0];
    setSelectedDate(isoDate);
  }, []);

  if (!isAppointmentModalOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || activeBookingService || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedDate || !selectedTime || !currentService) {
      alert('Please fill in all required appointment details');
      return;
    }

    setSubmitting(true);
    try {
      const aptData = {
        userId: user?.id,
        clientName,
        clientPhone,
        clientEmail,
        serviceId: currentService.id,
        serviceName: currentService.name,
        serviceCategory: currentService.category,
        price: currentService.price,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        stylistName: selectedStylist,
        notes,
      };

      const result = await api.createAppointment(aptData);
      setBookingConfirmed(result);
      showToast('Appointment request confirmed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit appointment request. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingConfirmed(null);
    closeAppointmentModal();
  };

  const whatsappConfirmationUrl = bookingConfirmed
    ? `https://wa.me/923477844143?text=${encodeURIComponent(
        `Hi Hira Farooq Studio! I just booked an appointment:\nAppointment ID: ${bookingConfirmed.appointmentNumber}\nService: ${bookingConfirmed.serviceName}\nDate: ${bookingConfirmed.appointmentDate} at ${bookingConfirmed.appointmentTime}\nStylist: ${bookingConfirmed.stylistName}\nClient: ${bookingConfirmed.clientName} (${bookingConfirmed.clientPhone})\nTotal: Rs. ${bookingConfirmed.price.toLocaleString()}`
      )}`
    : BUSINESS_INFO.whatsappUrl;

  return (
    <div id="appointment-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        id="appointment-modal-card" 
        className="relative w-full max-w-2xl bg-[#FFFDFB] rounded-2xl shadow-2xl border border-[#F2D8DC] overflow-hidden my-8 animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3A121A] via-[#4F1A24] to-[#3A121A] text-white p-6 relative">
          <button
            id="close-appointment-modal-btn"
            onClick={closeAppointmentModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#E8CCD1] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#F3C5CD]" />
            Hira Farooq Makeup Studio & Salon
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#FFFDFB]">
            {bookingConfirmed ? 'Appointment Reserved' : 'Book a Salon Appointment'}
          </h3>
          <p className="text-white/80 text-sm mt-1">
            House No. B-28, Block 15, Gulshan-e-Iqbal, Karachi • Mon–Sun 10 AM – 9 PM
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {bookingConfirmed ? (
            <div id="appointment-success-state" className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-[#FCE7EC] text-[#B76E79] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-[#3A121A]" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-[#F3E2E5] text-[#3A121A] text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                  Booking Confirmed: {bookingConfirmed.appointmentNumber}
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#3A121A]">
                  We Look Forward to Welcoming You!
                </h4>
                <p className="text-gray-600 text-sm max-w-md mx-auto mt-2">
                  Your appointment slot for <strong className="text-[#3A121A]">{bookingConfirmed.serviceName}</strong> has been secured for{' '}
                  <span className="font-medium text-[#3A121A]">{bookingConfirmed.appointmentDate}</span> at{' '}
                  <span className="font-medium text-[#3A121A]">{bookingConfirmed.appointmentTime}</span>.
                </p>
              </div>

              <div className="bg-[#FAF4F5] p-5 rounded-xl border border-[#F2D8DC] text-left text-sm space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-[#E8CCD1]/60 pb-2">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-semibold text-[#3A121A]">{bookingConfirmed.serviceName}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8CCD1]/60 pb-2">
                  <span className="text-gray-500">Artist / Stylist:</span>
                  <span className="font-medium text-gray-800">{bookingConfirmed.stylistName}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8CCD1]/60 pb-2">
                  <span className="text-gray-500">Scheduled Date & Time:</span>
                  <span className="font-medium text-gray-800">{bookingConfirmed.appointmentDate} ({bookingConfirmed.appointmentTime})</span>
                </div>
                <div className="flex justify-between border-b border-[#E8CCD1]/60 pb-2">
                  <span className="text-gray-500">Client Name:</span>
                  <span className="font-medium text-gray-800">{bookingConfirmed.clientName} ({bookingConfirmed.clientPhone})</span>
                </div>
                <div className="flex justify-between pt-1 text-base font-bold text-[#3A121A]">
                  <span>Estimated Total:</span>
                  <span className="text-[#962A3E]">Rs. {Number(bookingConfirmed.price).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  id="whatsapp-confirm-appointment-btn"
                  href={whatsappConfirmationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Confirm via WhatsApp (0347-7844143)
                </a>
                <button
                  id="appointment-done-btn"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-medium transition-all"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <form id="appointment-booking-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Select Service */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A121A] mb-2">
                  Select Salon Service *
                </label>
                <select
                  id="appointment-service-select"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8CCD1] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm font-medium"
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Rs. {s.price.toLocaleString()} ({s.category})
                    </option>
                  ))}
                </select>
                {currentService && (
                  <div className="mt-2 p-3 bg-[#FCF6F7] rounded-lg border border-[#F2D8DC] text-xs text-gray-600 flex items-center justify-between">
                    <span>{currentService.shortDescription || currentService.description}</span>
                    <span className="font-bold text-[#3A121A] ml-2 whitespace-nowrap">Rs. {currentService.price.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Stylist & Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A121A] mb-2">
                    Preferred Artist / Stylist
                  </label>
                  <select
                    id="appointment-stylist-select"
                    value={selectedStylist}
                    onChange={(e) => setSelectedStylist(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8CCD1] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
                  >
                    {BUSINESS_INFO.stylists.map((stylist) => (
                      <option key={stylist.id} value={stylist.name}>
                        {stylist.name} ({stylist.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A121A] mb-2">
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <input
                      id="appointment-date-input"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8CCD1] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A121A] mb-2">
                  Select Time Slot (Studio Hours 10:00 AM – 9:00 PM) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {BUSINESS_INFO.timeSlots.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#3A121A] text-white border-[#3A121A] shadow-sm'
                            : 'bg-white text-gray-700 border-[#E8CCD1] hover:bg-[#FAF0F2]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Contact Info */}
              <div className="border-t border-[#F2D8DC] pt-5">
                <h4 className="font-serif text-lg font-bold text-[#3A121A] mb-3">Your Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      id="appointment-name-input"
                      type="text"
                      placeholder="e.g. Maham Siddiqui"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8CCD1] focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number (Calling / WhatsApp) *</label>
                    <input
                      id="appointment-phone-input"
                      type="tel"
                      placeholder="e.g. 0347-7844143"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8CCD1] focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="appointment-email-input"
                      type="email"
                      placeholder="e.g. client@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8CCD1] focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Special Requests or Event Details</label>
                    <textarea
                      id="appointment-notes-input"
                      rows={2}
                      placeholder="e.g. Barat bride, dress color maroon velvet, sensitive skin, bringing dupatta for setting"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8CCD1] focus:outline-none focus:ring-2 focus:ring-[#B76E79] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Price & Submit Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F2D8DC]">
                <div>
                  <span className="text-xs text-gray-500">Service Fee:</span>
                  <div className="text-2xl font-bold font-serif text-[#3A121A]">
                    Rs. {currentService ? currentService.price.toLocaleString() : '0'}
                  </div>
                  <span className="text-[11px] text-gray-500">Pay at studio via Cash or Card</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={closeAppointmentModal}
                    className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-appointment-btn"
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#3A121A] to-[#601D2C] hover:from-[#260B11] hover:to-[#4A1521] text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                  >
                    {submitting ? 'Reserving...' : 'Confirm Appointment'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
