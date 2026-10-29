import React from 'react';
import { Gift, Search, Heart, ShoppingBag, Moon, Sun } from 'lucide-react';

export default function BottomNav({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  onFocusSearch,
  darkMode,
  onToggleDarkMode
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] transition-colors">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Asosiy / Home */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 transition"
        >
          <Gift className="w-5 h-5" />
          <span className="text-[10px] font-bold">Katalog</span>
        </button>

        {/* Qidiruv */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center gap-1 py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 transition"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">Qidirish</span>
        </button>

        {/* Sevimlilar */}
        <button
          onClick={onOpenFavorites}
          className="relative flex flex-col items-center gap-1 py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 transition"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'text-rose-600 fill-rose-600' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Sevimlilar</span>
        </button>

        {/* Savat */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 transition"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${cartCount > 0 ? 'text-rose-600' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Savat</span>
        </button>

        {/* Tun/Kun rejimi toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex flex-col items-center gap-1 py-1 px-3 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-300 active:scale-95 transition"
          title={darkMode ? "Kunduzgi rejim" : "Tun rejimi"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-500" />
          )}
          <span className="text-[10px] font-bold">{darkMode ? "Kunduz" : "Tun"}</span>
        </button>
      </div>
    </div>
  );
}
