import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Send, CheckCircle2, PackageCheck, ChevronLeft, ChevronRight, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  settings
}) {
  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'];

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountAmount = product.oldPrice && product.oldPrice > product.price
    ? product.oldPrice - product.price
    : null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 800);
  };

  const handleDirectTelegram = () => {
    const manager = settings?.telegramManager ? settings.telegramManager.replace('@', '') : 'sharbox_manager';
    const text = `Assalomu alaykum! "sharbox.uz" saytidan ko'rdim:\n📦 Mahsulot: ${product.name}\n💰 Narxi: ${product.price.toLocaleString('uz-UZ')} so'm\n\nUshbu boks haqida to'liqroq ma'lumot olmoqchi edim va buyurtma berishni istayman.`;
    window.open(`https://t.me/${manager}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Close button */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(product)}
            aria-label="Sevimlilar"
            className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 shadow-md transition"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-600 fill-rose-600' : ''}`} />
          </button>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white shadow-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 select-none shadow-inner">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Oldingi rasm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    aria-label="Keyingi rasm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImage === i
                        ? 'border-rose-600 scale-102 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Title and Price */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {product.name}
              </h2>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                {product.price.toLocaleString('uz-UZ')} <span className="text-sm font-bold text-slate-600 dark:text-slate-400">so'm</span>
              </div>
              {product.oldPrice && product.oldPrice > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base text-slate-400 dark:text-slate-500 line-through font-semibold">
                    {product.oldPrice.toLocaleString('uz-UZ')} so'm
                  </span>
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                    Tejovingiz: {discountAmount.toLocaleString('uz-UZ')} so'm
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ichida nimalar borligi (Box contents checklist) */}
          {product.contents && product.contents.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Quti ichida nimalar bor? (Tarkibi)</span>
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {product.contents.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Batafsil ma'lumot
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <Truck className="w-4 h-4 text-rose-500" />
              <span>Tezkor yetkazish mavjud</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>100% qo'l mehnati va sifat</span>
            </div>
          </div>
        </div>

        {/* Footer Actions: Quantity, Savatga qo'shish, Telegram buyurtma */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          
          {/* Quantity Controls */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 sm:hidden">Soni:</span>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center transition"
              >
                -
              </button>
              <span className="w-10 text-center font-black text-sm text-slate-800 dark:text-slate-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full sm:flex-1">
            <button
              onClick={handleAddToCart}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-sm shadow-lg shadow-rose-200 dark:shadow-rose-950/50 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedAnimation ? "Savatga qo'shildi!" : `Savatga qo'shish (${(product.price * quantity).toLocaleString('uz-UZ')} so'm)`}</span>
            </button>

            <button
              onClick={handleDirectTelegram}
              title="Telegram orqali to'g'ridan-to'g'ri so'rash"
              className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-sky-100 dark:shadow-sky-950/40 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Telegramda so'rash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
