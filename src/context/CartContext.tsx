import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { BUSINESS_INFO } from '../data/business';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  updateQuantity: (cartItemId: string, deltaOrQuantity: number, isAbsolute?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  promoCode: string;
  promoError: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // UI Drawers & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAppointmentModalOpen: boolean;
  activeBookingService: Product | null;
  openAppointmentModal: (service?: Product) => void;
  closeAppointmentModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hf_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hf_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return ['prod-bridal-signature', 'prod-hf-flawless-foundation'];
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [flatDiscount, setFlatDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [activeBookingService, setActiveBookingService] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('hf_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hf_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const addToCart = (product: Product, quantity = 1, selectedVariant?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        product,
        quantity,
        selectedVariant,
      };
      return [...prev, newItem];
    });

    showToast(`Added "${product.name}" to your shopping bag`);
  };

  const updateQuantity = (cartItemId: string, deltaOrQuantity: number, isAbsolute = false) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = isAbsolute ? deltaOrQuantity : item.quantity + deltaOrQuantity;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from shopping bag');
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscountPercent(0);
    setFlatDiscount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyPromoCode = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    setPromoError('');

    if (trimmed === 'GLAM10') {
      setPromoCode(trimmed);
      setDiscountPercent(10);
      setFlatDiscount(0);
      showToast('Promo code GLAM10 applied! 10% discount added.');
      return true;
    } else if (trimmed === 'HIRA20') {
      setPromoCode(trimmed);
      setDiscountPercent(20);
      setFlatDiscount(0);
      showToast('Promo code HIRA20 applied! 20% discount added.');
      return true;
    } else if (trimmed === 'STUDIO500') {
      setPromoCode(trimmed);
      setDiscountPercent(0);
      setFlatDiscount(500);
      showToast('Promo code STUDIO500 applied! Rs. 500 discount added.');
      return true;
    } else {
      setPromoError('Invalid coupon code. Try GLAM10 or HIRA20.');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    setFlatDiscount(0);
    setPromoError('');
  };

  const openAppointmentModal = (service?: Product) => {
    setActiveBookingService(service || null);
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
    setActiveBookingService(null);
  };

  // Calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.selectedVariant && item.product.variants) {
      const v = item.product.variants.find((variant) => variant.name === item.selectedVariant);
      if (v?.priceModifier) {
        itemPrice += v.priceModifier;
      }
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (discountPercent > 0) {
    discount = Math.round((subtotal * discountPercent) / 100);
  } else if (flatDiscount > 0) {
    discount = Math.min(subtotal, flatDiscount);
  }

  const shippingFee = cart.length === 0 ? 0 : subtotal >= BUSINESS_INFO.freeShippingThreshold ? 0 : BUSINESS_INFO.shippingFee;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        discount,
        shippingFee,
        total,
        promoCode,
        promoError,
        applyPromoCode,
        removePromoCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isAppointmentModalOpen,
        activeBookingService,
        openAppointmentModal,
        closeAppointmentModal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
