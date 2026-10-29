import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenDetails,
  inCartCount = 0
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'];

  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setActiveImageIndex(index);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 900);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl dark:hover:shadow-rose-950/20 hover:border-rose-200 dark:hover:border-rose-800/80 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Image area with pagination dots (o o o) */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 select-none">
        <img
          src={images[activeImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay on bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Badges: e.g. -20% or Xit savdo */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-black tracking-wide uppercase shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-xs w-max">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          aria-label="Sevimlilar"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-800/85 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 shadow-md transition-transform active:scale-90 z-10"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
              isFavorite ? 'text-rose-600 fill-rose-600' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Image Arrows if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Oldingi rasm"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition shadow-xs z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Keyingi rasm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition shadow-xs z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Pagination Dots (o o o) matching wireframe */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                aria-label={`Rasm ${idx + 1}`}
                className={`transition-all rounded-full ${
                  activeImageIndex === idx
                    ? 'w-4 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body: product_name, info, price, add_basket */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Product Name */}
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition line-clamp-1">
            {product.name}
          </h3>

          {/* Info / Box Contents preview */}
          {product.contents && product.contents.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {product.contents.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md truncate max-w-full"
                >
                  <PackageCheck className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">{item}</span>
                </span>
              ))}
              {product.contents.length > 2 && (
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold self-center">
                  +{product.contents.length - 2} ta yana
                </span>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {product.description || "Qo'l mehnati sovg'a boksi"}
            </p>
          )}
        </div>

        {/* Bottom row: Prices and add_basket button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                {product.oldPrice.toLocaleString('uz-UZ')} so'm
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {product.price.toLocaleString('uz-UZ')} <span className="text-xs font-bold text-slate-600 dark:text-slate-400">so'm</span>
            </span>
          </div>

          {/* Add to basket button (add_basket) */}
          <button
            onClick={handleAddToCart}
            className={`relative inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isAddedAnim
                ? 'bg-emerald-600 text-white'
                : inCartCount > 0
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/60'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-rose-950/50 shadow-md'
            }`}
          >
            {isAddedAnim ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                <span>Qo'shildi!</span>
              </>
            ) : inCartCount > 0 ? (
              <>
                <ShoppingBag className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Savatda ({inCartCount})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Savatga</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
