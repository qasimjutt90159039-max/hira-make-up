import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  Truck, 
  Calendar, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft,
  ChevronRight,
  User,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO } from '../data/business';
import { api } from '../services/api';
import { Product, Review } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, openAppointmentModal, showToast } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // New Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewCity, setReviewCity] = useState('Karachi');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await api.getProductById(id);
        setProduct(prod);
        setSelectedImage(prod.image);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0].name);
        }
        
        // Fetch reviews
        const revs = await api.getReviews(prod.id);
        setReviews(revs);

        // Fetch related products
        const allProds = await api.getProducts({ category: prod.category });
        setRelatedProducts(allProds.filter((p) => p.id !== prod.id).slice(0, 4));
      } catch (err) {
        console.error('Failed loading product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-[#3A121A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-sm text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#3A121A]">Item Not Found</h2>
        <p className="text-gray-500 text-sm">The product or salon package you are looking for does not exist.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Studio Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  // Price adjustment for variant
  let currentPrice = product.price;
  if (selectedVariant && product.variants) {
    const v = product.variants.find((variant) => variant.name === selectedVariant);
    if (v?.priceModifier) {
      currentPrice += v.priceModifier;
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) {
      alert('Please fill in your name and comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const newRev = await api.createReview({
        targetId: product.id,
        targetName: product.name,
        userName: reviewAuthor,
        userCity: reviewCity,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews((prev) => [newRev, ...prev]);
      setReviewComment('');
      setReviewAuthor('');
      showToast('Thank you! Your verified review has been published.');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/923477844143?text=${encodeURIComponent(
    `Hi Hira Farooq Studio! I have an inquiry regarding: ${product.name} (Rs. ${currentPrice.toLocaleString()}). Could you please share more details?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#3A121A]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-[#3A121A]">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#8C2B3E] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Images Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Big Hero Image */}
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden border border-[#F2D8DC] bg-gray-50 shadow-sm">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider shadow-md">
                {product.badge}
              </span>
            )}
            <span className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-medium uppercase">
              {product.itemType === 'service' ? 'Salon Service / Package' : 'Authentic Studio Product'}
            </span>
          </div>

          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#3A121A] shadow-md scale-95'
                      : 'border-[#F2D8DC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase / Booking (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E]">
                {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border transition-colors ${
                  inWishlist
                    ? 'bg-[#3A121A] text-white border-[#3A121A]'
                    : 'border-[#E8CCD1] text-gray-500 hover:text-[#8C2B3E]'
                }`}
                title="Save to wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3A121A]">
              {product.name}
            </h1>

            {/* Rating & Reviews counter */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {'★'.repeat(Math.round(product.rating))}
              </div>
              <span className="text-xs font-bold text-gray-800">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 rounded-2xl bg-[#FAF0F2] border border-[#F2D8DC] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Price in PKR</span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#3A121A]">
                  Rs. {currentPrice.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[#2F6B38] font-bold block">✓ Available at Karachi Studio</span>
              <span className="text-gray-500 text-[11px]">Free delivery over Rs. 3,500</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selector (Shade / Length / Package Level) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-800">
                Select Option / Shade / Length
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant === v.name;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-[#3A121A] bg-[#3A121A] text-white shadow-sm font-bold'
                          : 'border-[#E8CCD1] bg-white text-gray-700 hover:bg-[#FAF3F4]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{v.name}</span>
                        {v.priceModifier !== undefined && v.priceModifier !== 0 && (
                          <span className={isSelected ? 'text-[#F3C5CD]' : 'text-gray-500'}>
                            {v.priceModifier > 0 ? `+Rs. ${v.priceModifier}` : `-Rs. ${Math.abs(v.priceModifier)}`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchase / Booking Action Buttons */}
          <div className="pt-4 border-t border-[#F2D8DC] space-y-4">
            {product.itemType === 'service' ? (
              <div className="space-y-3">
                <button
                  id="book-service-now-btn"
                  onClick={() => openAppointmentModal(product)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3A121A] to-[#601D2C] hover:from-[#260B11] hover:to-[#4A1521] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#F3C5CD]" />
                  <span>Book Appointment For This Service</span>
                </button>
                <p className="text-center text-[11px] text-gray-500">
                  Select your preferred date, time slot, and artist at our Gulshan-e-Iqbal studio.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#E8CCD1] rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-[#FAF3F4] rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-[#3A121A]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-[#FAF3F4] rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    id="add-to-cart-detail-btn"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Shopping Bag (Rs. {(currentPrice * quantity).toLocaleString()})</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <Link
                    to="/cart"
                    className="py-2.5 px-4 rounded-xl border border-[#3A121A] text-[#3A121A] text-center font-semibold hover:bg-[#FAF0F2]"
                  >
                    View Shopping Bag
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={handleAddToCart}
                    className="py-2.5 px-4 rounded-xl bg-[#8C2B3E] text-white text-center font-semibold hover:bg-[#601D2C]"
                  >
                    Quick Buy Now
                  </Link>
                </div>
              </div>
            )}

            {/* Direct WhatsApp Consultation */}
            <a
              id="whatsapp-product-inquiry-btn"
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl border border-[#25D366] text-[#1E7E34] hover:bg-[#EAFBF0] text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Ask On WhatsApp (0347-7844143)</span>
            </a>
          </div>

          {/* Highlights & Guarantees */}
          <div className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#F2D8DC] space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C2B3E]" />
              <span><strong>100% Guaranteed Authentic</strong> by Hira Farooq Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8C2B3E]" />
              <span>Cash on Delivery across Karachi & all cities in Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8C2B3E]" />
              <span>Gulshan-e-Iqbal studio pickup available during business hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Specifications: Details, Prep, Ingredients */}
      <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-10 space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#3A121A] border-b border-[#F2D8DC] pb-4">
          Detailed Specifications & Studio Notes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Inclusions / Features */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#8C2B3E]">Key Features & Highlights</h4>
            <ul className="space-y-2 text-xs text-gray-700">
              {product.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#FCE7EC] text-[#8C2B3E] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prep or Application Tips */}
          <div className="space-y-4">
            {product.ingredientsOrServiceDuration && (
              <div>
                <h4 className="font-serif font-bold text-base text-[#8C2B3E] mb-1">
                  {product.itemType === 'service' ? 'Duration & Artist' : 'Formulation / Volume'}
                </h4>
                <p className="text-xs text-gray-700">{product.ingredientsOrServiceDuration}</p>
              </div>
            )}

            {product.howToUseOrPrep && (
              <div>
                <h4 className="font-serif font-bold text-base text-[#8C2B3E] mb-1">
                  {product.itemType === 'service' ? 'Client Preparation Instructions' : 'How to Apply / Use'}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">{product.howToUseOrPrep}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews & Submit Section */}
      <div className="bg-[#FFFDFB] rounded-3xl border border-[#F2D8DC] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F2D8DC] pb-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#3A121A]">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-gray-500">Verified feedback from clients and brides in Karachi</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {'★'.repeat(Math.round(product.rating))}
            </div>
            <span className="font-serif font-bold text-lg text-[#3A121A]">{product.rating} / 5.0</span>
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-[#FAF0F2]/50 border border-[#F2D8DC] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#3A121A]">{rev.userName}</span>
                    {rev.userCity && <span className="text-[11px] text-gray-400">({rev.userCity})</span>}
                    {rev.verified && (
                      <span className="px-2 py-0.5 bg-[#EAFBF0] text-[#1E7E34] text-[9px] font-bold rounded-full uppercase tracking-wider">
                        Verified Client
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
                <p className="text-xs text-gray-700 italic">"{rev.comment}"</p>
              </div>
            ))
          )}
        </div>

        {/* Write a Review Form */}
        <div className="pt-6 border-t border-[#F2D8DC]">
          <h4 className="font-serif text-lg font-bold text-[#3A121A] mb-3">Leave a Verified Review</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Areeba Khan"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your City / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Karachi (Gulshan)"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Star Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs font-semibold"
                >
                  <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Feedback & Experience *</label>
              <textarea
                rows={3}
                placeholder="Share how the makeup looked, how long it lasted, or how your studio appointment went..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8CCD1] rounded-xl text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#260B11] disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#3A121A]">
              You May Also Like
            </h3>
            <Link to="/shop" className="text-xs font-bold text-[#8C2B3E] hover:underline">
              View Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <Link to={`/product/${p.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <Link to={`/product/${p.slug}`} className="font-serif font-bold text-sm text-[#3A121A] hover:text-[#8C2B3E] line-clamp-1">
                    {p.name}
                  </Link>
                  <div className="flex items-center justify-between pt-2 border-t border-[#F2D8DC]">
                    <span className="font-serif font-bold text-sm text-[#3A121A]">
                      Rs. {p.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="p-1.5 rounded-lg bg-[#3A121A] text-white"
                      title="Add to bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
