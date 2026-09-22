import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  Heart, 
  Star, 
  X, 
  Check, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Product, ProductCategory } from '../types';

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Bridal Makeup Packages',
  'Party/Event Makeup',
  'Hair Styling & Treatments',
  'Facial & Skincare Services',
  'Makeup Products',
  'Hair Care Products',
  'Nail Art & Care',
  'Gift Vouchers / Combo Deals',
];

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, toggleWishlist, isInWishlist, openAppointmentModal } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'product' | 'service'>('all');
  const [searchTerm, setSearchTerm] = useState<string>(searchParam);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed loading products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Update query params
  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') nextParams.set('category', selectedCategory);
    if (searchTerm) nextParams.set('search', searchTerm);
    setSearchParams(nextParams, { replace: true });
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Filtered & Sorted items
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
        if (itemTypeFilter !== 'all' && item.itemType !== itemTypeFilter) return false;
        if (item.price > maxPrice) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCat = item.category.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, itemTypeFilter, maxPrice, searchTerm, sortBy]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setItemTypeFilter('all');
    setSearchTerm('');
    setMaxPrice(100000);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#FAF0F2] via-[#FFFDFB] to-[#FAF0F2] p-6 sm:p-10 rounded-3xl border border-[#F2D8DC] relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C2B3E] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" /> Studio Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A121A]">
            Luxury Cosmetics & Salon Offerings
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Browse authentic 24H foundations, velvet lip contours, organic keratin treatments, 
            and bridal packages curated by Hira Farooq.
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-[#FFFDFB] p-6 rounded-2xl border border-[#F2D8DC]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2D8DC]">
            <h3 className="font-serif font-bold text-base text-[#3A121A] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8C2B3E]" /> Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#8C2B3E] hover:underline font-medium"
            >
              Reset All
            </button>
          </div>

          {/* Item Type: All vs Products vs In-Studio Services */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Item Classification
            </label>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'All Items', value: 'all' },
                { label: 'Cosmetics & Products', value: 'product' },
                { label: 'Salon Services & Packages', value: 'service' },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setItemTypeFilter(t.value as any)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl text-left transition-all ${
                    itemTypeFilter === t.value
                      ? 'bg-[#3A121A] text-white'
                      : 'text-gray-600 hover:bg-[#FAF3F4]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories List */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
              Categories
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[#FCE7EC] text-[#8C2B3E] font-bold'
                        : 'text-gray-600 hover:bg-[#FAF3F4]'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#8C2B3E]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-[#F2D8DC]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Max Price
              </label>
              <span className="text-xs font-bold text-[#3A121A]">
                Rs. {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#3A121A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Rs. 1,000</span>
              <span>Rs. 100,000</span>
            </div>
          </div>
        </aside>

        {/* PRODUCTS CONTENT (col-span-9) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar: Search, Sort, View Toggle, Mobile Filter Trigger */}
          <div className="bg-[#FFFDFB] p-4 rounded-2xl border border-[#F2D8DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF3F4] border border-[#E8CCD1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8C2B3E] text-gray-800"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FAF3F4] border border-[#E8CCD1] rounded-xl text-xs font-semibold text-gray-700"
              >
                <Filter className="w-3.5 h-3.5 text-[#8C2B3E]" />
                Filters
              </button>

              {/* Sorting Select */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="hidden md:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-[#FAF3F4] border border-[#E8CCD1] rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8C2B3E]"
                >
                  <option value="featured">Featured First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-[#E8CCD1] rounded-xl overflow-hidden bg-[#FAF3F4]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-[#3A121A] text-white' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-[#3A121A] text-white' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'All' || itemTypeFilter !== 'all' || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#8C2B3E] font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {itemTypeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#8C2B3E] font-medium">
                  {itemTypeFilter === 'product' ? 'Cosmetics Only' : 'Services Only'}
                  <button onClick={() => setItemTypeFilter('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#8C2B3E] font-medium">
                  Keyword: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-red-600 underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Results */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-3 border-[#3A121A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-serif">Loading salon collection...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#FCE7EC] text-[#8C2B3E] rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#3A121A]">No Matches Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your filters, changing price range, or searching for broader terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => {
                const inWish = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        inWish
                          ? 'bg-[#3A121A] text-white shadow-sm'
                          : 'bg-white/80 hover:bg-white text-gray-500 hover:text-[#8C2B3E]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                    </button>

                    <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#8C2B3E] text-white text-[9px] font-bold uppercase tracking-wider">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium uppercase">
                        {product.itemType === 'service' ? 'Salon Service' : 'Product'}
                      </span>
                    </Link>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                          <span className="text-[#8C2B3E] font-bold uppercase tracking-wider truncate max-w-[120px]">
                            {product.category}
                          </span>
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-current inline mr-0.5" />
                            {product.rating}
                          </span>
                        </div>

                        <Link
                          to={`/product/${product.slug}`}
                          className="font-serif font-bold text-sm text-[#3A121A] hover:text-[#8C2B3E] transition-colors block line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                          {product.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#F2D8DC] flex items-center justify-between">
                        <div>
                          <span className="font-serif text-base font-bold text-[#3A121A]">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {product.itemType === 'service' ? (
                          <button
                            onClick={() => openAppointmentModal(product)}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF0F2] hover:bg-[#3A121A] text-[#8C2B3E] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                          >
                            Book
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="p-2 rounded-xl bg-[#3A121A] hover:bg-[#260B11] text-white transition-colors"
                            title="Add to shopping bag"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-4">
              {paginatedProducts.map((product) => {
                const inWish = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-[#FFFDFB] rounded-2xl border border-[#F2D8DC] overflow-hidden p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-xs hover:shadow-md transition-all"
                  >
                    <Link to={`/product/${product.slug}`} className="w-full sm:w-44 h-44 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#8C2B3E] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating} ({product.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${product.slug}`}
                        className="font-serif font-bold text-lg text-[#3A121A] hover:text-[#8C2B3E] transition-colors block"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="pt-3 border-t border-[#F2D8DC] flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-xl font-bold text-[#3A121A]">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              Rs. {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="p-2.5 rounded-xl border border-[#E8CCD1] text-gray-500 hover:text-[#8C2B3E]"
                            title="Wishlist"
                          >
                            <Heart className={`w-4 h-4 ${inWish ? 'fill-current text-[#8C2B3E]' : ''}`} />
                          </button>

                          {product.itemType === 'service' ? (
                            <button
                              onClick={() => openAppointmentModal(product)}
                              className="px-5 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#260B11]"
                            >
                              Book Appointment
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="px-5 py-2.5 rounded-xl bg-[#3A121A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#260B11] flex items-center gap-1.5"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Bag</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-[#E8CCD1] bg-white text-gray-600 hover:bg-[#FAF3F4] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-[#3A121A] text-white shadow-sm'
                      : 'border border-[#E8CCD1] bg-white text-gray-700 hover:bg-[#FAF3F4]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-[#E8CCD1] bg-white text-gray-600 hover:bg-[#FAF3F4] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2D8DC]">
              <h3 className="font-serif font-bold text-lg text-[#3A121A]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedCategory(c);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 text-xs rounded-lg ${
                      selectedCategory === c ? 'bg-[#3A121A] text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2D8DC]">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-[#3A121A] text-xs font-bold uppercase text-[#3A121A]"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
