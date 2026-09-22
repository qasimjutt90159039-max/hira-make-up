import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total, 
    shippingFee 
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, BUSINESS_INFO.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / BUSINESS_INFO.freeShippingThreshold) * 100);

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FFFDFB] shadow-2xl flex flex-col border-l border-[#F2D8DC] animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#F2D8DC] flex items-center justify-between bg-[#FAF3F4]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#3A121A] text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3A121A]">Shopping Bag</h3>
                <p className="text-xs text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-[#FCF6F7] border-b border-[#F2D8DC] text-xs">
            <div className="flex items-center justify-between mb-1.5 text-gray-700">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                {freeShippingNeeded === 0 ? (
                  <span className="text-[#2F6B38] font-bold">You unlocked FREE Karachi delivery!</span>
                ) : (
                  <span>Add <strong>Rs. {freeShippingNeeded.toLocaleString()}</strong> for Free Delivery</span>
                )}
              </span>
              <span className="text-[11px] font-bold text-[#3A121A]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#B76E79] to-[#3A121A] rounded-full transition-all duration-300" 
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F2D8DC]">
            {cart.length === 0 ? (
              <div id="empty-cart-drawer-view" className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#FCE7EC] rounded-full flex items-center justify-center mx-auto text-[#B76E79]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#3A121A]">Your Bag is Empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our luxury cosmetics, bridal packages, and studio treatments.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block px-6 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-semibold hover:bg-[#260B11] transition-colors"
                >
                  Explore Studio Shop
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.price + (item.selectedVariant && item.product.variants ? (item.product.variants.find(v => v.name === item.selectedVariant)?.priceModifier || 0) : 0);
                return (
                  <div key={item.id} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-18 h-18 object-cover rounded-xl border border-[#F2D8DC] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif font-bold text-sm text-[#3A121A] hover:text-[#B76E79] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#8C4A57] mt-0.5 font-medium">
                          {item.selectedVariant}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E8CCD1] rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:bg-[#FAF3F4] text-gray-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#3A121A] min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:bg-[#FAF3F4] text-gray-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-serif font-bold text-sm text-[#3A121A]">
                            Rs. {(itemPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#F2D8DC] bg-[#FAF3F4] space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Karachi)</span>
                  <span className="font-semibold text-gray-800">
                    {shippingFee === 0 ? <span className="text-[#2F6B38]">FREE</span> : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#3A121A] pt-1.5 border-t border-[#E8CCD1]">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base text-[#3A121A]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl border border-[#3A121A] text-[#3A121A] hover:bg-[#3A121A] hover:text-white text-center text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  View Bag
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white text-center text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-md"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>Cash on Delivery & Secure Studio Bank Transfer</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
