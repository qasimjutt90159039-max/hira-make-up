import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Order, PaymentMethod } from '../types';

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, shippingFee, total, promoCode, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '0347-',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Karachi',
    postalCode: '75400',
    deliveryNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery calculation adjustment
  const activeShippingFee = deliverySpeed === 'express' ? shippingFee + 200 : shippingFee;
  const activeGrandTotal = subtotal - discount + activeShippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.');
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage('Please provide a valid Pakistani contact phone number (e.g. 0347-7844143)');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Please specify your street or house delivery address');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || 'guest',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        items: cart,
        subtotal,
        discount,
        shippingFee: activeShippingFee,
        total: activeGrandTotal,
        paymentMethod,
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          area: formData.city,
          city: formData.city,
          postalCode: formData.postalCode,
          deliveryNotes: formData.deliveryNotes,
        },
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          area: formData.city,
          city: formData.city,
          postalCode: formData.postalCode,
          deliveryNotes: formData.deliveryNotes,
        },
      };

      const result = await api.createOrder(orderPayload);
      setCompletedOrder(result);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ORDER SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    const addressStr = completedOrder.shippingAddress?.address || completedOrder.customer?.address || 'Karachi';
    const cityStr = completedOrder.shippingAddress?.city || completedOrder.customer?.city || 'Karachi';
    const whatsappOrderText = `Hi Hira Farooq Studio! I have placed Order #${completedOrder.orderNumber} for Rs. ${completedOrder.total.toLocaleString()} (${completedOrder.paymentMethod.toUpperCase()}). Please confirm delivery to ${addressStr}, ${cityStr}.`;
    const whatsappOrderUrl = `https://wa.me/923477844143?text=${encodeURIComponent(whatsappOrderText)}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
        <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 bg-[#EAFBF0] text-[#1E7E34] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E]">
              Order Successfully Received
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#3A121A]">
              Thank You for Shopping With Us!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Your order <strong className="text-[#3A121A]">#{completedOrder.orderNumber}</strong> has been logged into our studio dispatch queue.
            </p>
          </div>

          {/* Key Summary Box */}
          <div className="p-5 bg-[#FAF0F2]/60 rounded-2xl border border-[#F2D8DC] text-left text-xs space-y-3">
            <div className="flex justify-between items-center border-b border-[#F2D8DC] pb-2 font-bold">
              <span className="text-gray-600">Order Number:</span>
              <span className="text-[#3A121A] font-mono">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-800 uppercase">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Address:</span>
              <span className="text-gray-800 text-right">{addressStr}, {cityStr}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#F2D8DC] pt-2 font-bold text-sm text-[#3A121A]">
              <span>Total Payable Amount:</span>
              <span className="font-serif text-base">Rs. {completedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment instructions if bank transfer */}
          {completedOrder.paymentMethod === 'bank_transfer' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs space-y-2 text-amber-900">
              <span className="font-bold block flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                Studio Bank Account Details (Meezan Bank):
              </span>
              <p className="text-[11px] leading-relaxed">
                Bank: <strong>Meezan Bank Limited (Gulshan Block 13-C Branch)</strong><br />
                Account Title: <strong>Hira Farooq Makeup Studio</strong><br />
                Account Number: <strong>0102-0105829101</strong><br />
                IBAN: <strong>PK58MEZN0001020105829101</strong>
              </p>
              <p className="text-[11px] text-amber-800">
                Kindly share your payment receipt screenshot on WhatsApp to <strong>0347-7844143</strong> for instant order dispatch.
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              id="confirm-order-whatsapp-btn"
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm on WhatsApp (0347-7844143)</span>
            </a>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Track Order in Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CART CHECKOUT FORM VIEW
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#3A121A]">Your Bag is Empty</h2>
        <p className="text-gray-500 text-sm">Please add cosmetics or treatments to proceed to checkout.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#F2D8DC] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#3A121A]">Secure Checkout</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Enter your delivery details and choose your preferred payment option
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Delivery Details & Payment Choice (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Customer Contact & Shipping Address */}
          <div className="bg-[#FFFDFB] p-6 sm:p-8 rounded-2xl border border-[#F2D8DC] shadow-xs space-y-5">
            <h2 className="font-serif font-bold text-lg text-[#3A121A] flex items-center gap-2 border-b border-[#F2D8DC] pb-3">
              <MapPin className="w-4 h-4 text-[#8C2B3E]" />
              1. Delivery & Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Fatima Tariq"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact Mobile Number * (e.g. 0347-7844143)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0347-xxxxxxx"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address (for order receipts)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="fatima@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                >
                  <option value="Karachi">Karachi (Same/Next-Day Studio Dispatch)</option>
                  <option value="Lahore">Lahore (TCS Express 2-3 Days)</option>
                  <option value="Islamabad">Islamabad (TCS Express 2-3 Days)</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Other City in Pakistan">Other City in Pakistan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Complete Street & House Address *
              </label>
              <textarea
                rows={2}
                name="address"
                placeholder="House / Apartment number, Street name, Block / Sector, Landmark"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-[#E8CCD1] rounded-xl text-xs focus:ring-2 focus:ring-[#8C2B3E] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                name="deliveryNotes"
                placeholder="e.g. Please ring the bell or leave package with gate security"
                value={formData.deliveryNotes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Delivery Speed Option */}
          <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F2D8DC] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#3A121A] flex items-center gap-2 border-b border-[#F2D8DC] pb-3">
              <Truck className="w-4 h-4 text-[#8C2B3E]" />
              2. Shipping Speed
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliverySpeed === 'standard'
                    ? 'border-[#3A121A] bg-[#FAF0F2]'
                    : 'border-[#E8CCD1] hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliverySpeed"
                  checked={deliverySpeed === 'standard'}
                  onChange={() => setDeliverySpeed('standard')}
                  className="mt-1 accent-[#3A121A]"
                />
                <div>
                  <span className="font-bold text-xs text-[#3A121A] block">Standard Studio Dispatch</span>
                  <span className="text-[11px] text-gray-500">24 to 48 hours within Karachi</span>
                  <span className="text-xs font-bold text-[#8C2B3E] block mt-1">
                    {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                  </span>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliverySpeed === 'express'
                    ? 'border-[#3A121A] bg-[#FAF0F2]'
                    : 'border-[#E8CCD1] hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="deliverySpeed"
                  checked={deliverySpeed === 'express'}
                  onChange={() => setDeliverySpeed('express')}
                  className="mt-1 accent-[#3A121A]"
                />
                <div>
                  <span className="font-bold text-xs text-[#3A121A] block">Karachi Express Same-Day Rider</span>
                  <span className="text-[11px] text-gray-500">Dispatched via studio express rider</span>
                  <span className="text-xs font-bold text-[#8C2B3E] block mt-1">
                    Rs. {shippingFee + 200}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="bg-[#FFFDFB] p-6 rounded-2xl border border-[#F2D8DC] shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#3A121A] flex items-center gap-2 border-b border-[#F2D8DC] pb-3">
              <CreditCard className="w-4 h-4 text-[#8C2B3E]" />
              3. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-[#3A121A] bg-[#FAF0F2]'
                    : 'border-[#E8CCD1] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#3A121A]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#8C2B3E]" />
                      <span className="font-bold text-xs text-[#3A121A]">Cash on Delivery (COD)</span>
                      <span className="px-2 py-0.5 bg-[#EAFBF0] text-[#1E7E34] text-[9px] font-bold rounded-full uppercase">
                        Most Popular in Karachi
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay safely in cash when our rider delivers the studio package to your doorstep.
                    </p>
                  </div>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#3A121A] bg-[#FAF0F2]'
                    : 'border-[#E8CCD1] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-1 accent-[#3A121A]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#8C2B3E]" />
                      <span className="font-bold text-xs text-[#3A121A]">Direct Studio Bank Transfer</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Transfer via Meezan Bank or HBL Internet Banking / Mobile App. Share screenshot on WhatsApp.
                    </p>
                  </div>
                </div>
              </label>

              {/* JazzCash / EasyPaisa */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  paymentMethod === 'easypaisa_jazzcash'
                    ? 'border-[#3A121A] bg-[#FAF0F2]'
                    : 'border-[#E8CCD1] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa_jazzcash"
                    checked={paymentMethod === 'easypaisa_jazzcash'}
                    onChange={() => setPaymentMethod('easypaisa_jazzcash')}
                    className="mt-1 accent-[#3A121A]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#8C2B3E]" />
                      <span className="font-bold text-xs text-[#3A121A]">JazzCash / EasyPaisa Wallet</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Send to official Studio mobile account 0347-7844143.
                    </p>
                  </div>
                </div>
              </label>

              {/* Credit / Debit Card */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                  paymentMethod === 'card'
                    ? 'border-[#3A121A] bg-[#FAF0F2]'
                    : 'border-[#E8CCD1] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-[#3A121A]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#8C2B3E]" />
                      <span className="font-bold text-xs text-[#3A121A]">Visa / Mastercard Online</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Secured by 256-bit bank encryption.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary & Place Order Button (col-span-4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#3A121A] border-b border-[#F2D8DC] pb-3">
              Items in Order ({cart.length})
            </h2>

            {/* Compact Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#F2D8DC] pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border border-[#F2D8DC]" />
                    <div className="max-w-[140px]">
                      <span className="font-semibold text-gray-800 line-clamp-1">{item.product.name}</span>
                      <span className="text-[10px] text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-gray-800">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-[#F2D8DC] pt-3 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#1E7E34] font-semibold">
                  <span>Promo Discount ({promoCode})</span>
                  <span>-Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold">
                  {activeShippingFee === 0 ? <span className="text-[#2F6B38]">FREE</span> : `Rs. ${activeShippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#3A121A] border-t border-[#F2D8DC] pt-2">
                <span>Grand Total (PKR)</span>
                <span className="font-serif text-xl text-[#3A121A]">
                  Rs. {activeGrandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3A121A] to-[#601D2C] hover:from-[#260B11] hover:to-[#4A1521] text-white font-bold text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#F3C5CD]" />
                  <span>Place Order (Rs. {activeGrandTotal.toLocaleString()})</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              By clicking Place Order, you confirm your delivery details. You will receive an SMS and WhatsApp confirmation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF0F2] border border-[#F2D8DC] text-xs text-gray-600 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#8C2B3E] shrink-0" />
            <span>Guaranteed dispatch from <strong>Hira Farooq Makeup Studio & Salon</strong>, Block 15, Gulshan-e-Iqbal, Karachi.</span>
          </div>
        </div>
      </form>
    </div>
  );
};
