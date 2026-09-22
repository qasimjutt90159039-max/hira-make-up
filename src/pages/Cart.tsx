import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ChevronLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';

export const Cart: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    shippingFee, 
    total, 
    promoCode, 
    promoError, 
    applyPromoCode, 
    removePromoCode 
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode.trim());
      setInputCode('');
    }
  };

  const freeShippingThreshold = BUSINESS_INFO.freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#FCE7EC] text-[#8C2B3E] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-[#3A121A]">Your Shopping Bag is Empty</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            You have not added any cosmetics, skincare items, or studio gift vouchers to your bag yet.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <span>Explore Studio Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-[#F2D8DC] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3A121A]">Shopping Bag</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review your items and proceed to secure checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors font-medium"
        >
          Clear Bag
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 bg-[#FCF6F7] rounded-2xl border border-[#F2D8DC]">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#8C2B3E]" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-[#2F6B38] font-bold">You qualify for FREE delivery across Karachi!</span>
            ) : (
              <span>Add <strong>Rs. {remainingForFreeShipping.toLocaleString()}</strong> more to unlock Free Karachi Delivery</span>
            )}
          </span>
          <span className="text-[#3A121A]">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B76E79] to-[#3A121A] transition-all duration-300 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table / List (col-span-8) */}
        <div className="lg:col-span-8 bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden shadow-xs">
          <div className="divide-y divide-[#F2D8DC]">
            {cart.map((item) => {
              const itemPrice = item.product.price + (item.selectedVariant && item.product.variants ? (item.product.variants.find(v => v.name === item.selectedVariant)?.priceModifier || 0) : 0);
              const lineTotal = itemPrice * item.quantity;

              return (
                <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl border border-[#F2D8DC] shrink-0"
                  />

                  <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C2B3E]">
                      {item.product.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#3A121A]">
                      <Link to={`/product/${item.product.slug}`} className="hover:text-[#8C2B3E]">
                        {item.product.name}
                      </Link>
                    </h3>
                    {item.selectedVariant && (
                      <p className="text-xs text-gray-500 font-medium">
                        Option: <span className="text-[#3A121A]">{item.selectedVariant}</span>
                      </p>
                    )}
                    <span className="text-xs text-gray-600 block">
                      Unit Price: Rs. {itemPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#E8CCD1] rounded-xl bg-white p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#FAF3F4] rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#3A121A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#FAF3F4] rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="font-serif font-bold text-base text-[#3A121A] block">
                        Rs. {lineTotal.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-[#FAF0F2]/50 border-t border-[#F2D8DC] flex items-center justify-between text-xs">
            <Link to="/shop" className="inline-flex items-center gap-1 text-[#8C2B3E] font-bold hover:underline">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <span className="text-gray-500">
              Prices displayed in Pakistani Rupee (PKR)
            </span>
          </div>
        </div>

        {/* Order Summary Card (col-span-4) */}
        <div className="lg:col-span-4 bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-6 shadow-xs space-y-6">
          <h2 className="font-serif font-bold text-xl text-[#3A121A]">Order Summary</h2>

          {/* Promo Code Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Have a Studio Promo Code?
            </label>
            {promoCode ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EAFBF0] border border-[#20ba59]/30 text-xs">
                <div className="flex items-center gap-2 text-[#1E7E34] font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{promoCode} Applied</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GLAM10, HIRA20"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#8C2B3E]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3A121A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#260B11]"
                >
                  Apply
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
            <p className="text-[10px] text-gray-400">
              Try test promo codes: <code className="bg-gray-100 px-1 py-0.5 rounded">GLAM10</code> or <code className="bg-gray-100 px-1 py-0.5 rounded">HIRA20</code>
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-gray-700 border-t border-[#F2D8DC] pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[#1E7E34] font-semibold">
                <span>Promotional Discount</span>
                <span>-Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Karachi Shipping</span>
              <span className="font-semibold">
                {shippingFee === 0 ? (
                  <span className="text-[#2F6B38]">FREE</span>
                ) : (
                  `Rs. ${shippingFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#3A121A] pt-3 border-t border-[#F2D8DC]">
              <span>Estimated Total</span>
              <span className="font-serif text-xl text-[#3A121A]">
                Rs. {total.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 text-right">Includes applicable provincial taxes</p>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-3 pt-2">
            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3A121A] to-[#601D2C] hover:from-[#260B11] hover:to-[#4A1521] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Payment Badges */}
          <div className="pt-2 border-t border-[#F2D8DC] text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C2B3E]" />
              <span>Cash on Delivery & Bank Transfer Accepted</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Dispatched from House No. B-28, Block 15, Gulshan-e-Iqbal, Karachi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
