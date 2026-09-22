import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Home, ShoppingBag, Calendar } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 bg-[#FCE7EC] text-[#8C2B3E] rounded-full flex items-center justify-center mx-auto shadow-inner">
        <Sparkles className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E]">
          Error 404 • Page Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A121A]">
          Lost in the Glam?
        </h1>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          The page you are looking for has been moved, renamed, or is currently undergoing a beauty transformation.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#3A121A] text-[#3A121A] hover:bg-[#FAF0F2] font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Shop</span>
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FAF0F2] text-[#8C2B3E] hover:bg-[#FCE7EC] font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>Salon Services</span>
        </Link>
      </div>
    </div>
  );
};
