import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div 
      id="global-toast" 
      className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#3A121A] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#F2D8DC]/30 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-[#F3C5CD]" />
      </div>
      <p className="text-xs font-medium leading-tight text-[#FFFDFB]">
        {toastMessage}
      </p>
    </div>
  );
};
