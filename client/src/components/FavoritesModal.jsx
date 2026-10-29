import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onAddToCart,
  onOpenDetails
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="font-black text-slate-900 dark:text-white text-lg">
              Sevimlilar ({favorites.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {favorites.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Hozircha sevimlilar ro'yxati bo'sh
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                Katalogdagi mahsulotlarning yurakcha tugmasini bosib, bu yerga saqlab qo'yishingiz mumkin.
              </p>
            </div>
          ) : (
            favorites.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-700 transition bg-white dark:bg-slate-800/60 shadow-xs"
              >
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onOpenDetails(product);
                  }}
                />
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onOpenDetails(product);
                  }}
                >
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate hover:text-rose-600 dark:hover:text-rose-400 transition">
                    {product.name}
                  </h4>
                  <div className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
                    {product.price.toLocaleString('uz-UZ')} so'm
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition shadow-xs"
                    title="Savatga qo'shish"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(product.id)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
