import React from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, Send, Gift, X, Moon, Sun } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Header({
  cartCount,
  favoritesCount,
  searchTerm,
  setSearchTerm,
  onOpenCart,
  onOpenFavorites,
  onOpenAdmin,
  settings,
  darkMode,
  onToggleDarkMode,
  searchInputRef
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-rose-100 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="truncate flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span>✨</span>
            <span className="truncate">{settings?.announcement || "sharbox.uz — Eksklyuziv sovg'alar va romantik bokslar!"}</span>
          </p>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold shrink-0">
            {settings?.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 transition opacity-90 hover:opacity-100"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@{settings.instagram.replace('@', '')}</span>
              </a>
            )}
            {settings?.telegramManager && (
              <a
                href={`https://t.me/${settings.telegramManager.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 transition opacity-90 hover:opacity-100"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span>sharbox</span>
                <span className="text-rose-600 font-extrabold">.uz</span>
              </div>
              <p className="text-[10px] sm:text-xs text-rose-500 dark:text-rose-400 font-semibold tracking-wide uppercase">
                Qo'l mehnati sovg'alari
              </p>
            </div>
          </div>

          {/* Search bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Sovg'a nomi, tarkibi yoki bayram turi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-900 text-sm rounded-full border border-transparent dark:border-slate-700 focus:border-rose-300 dark:focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Desktop Dark/Light Mode toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? "Kunduzgi rejimga o'tish" : "Tun rejimiga o'tish"}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              title={darkMode ? "Kunduzgi rejim" : "Tun rejimi"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 transition transform hover:rotate-90 duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 hover:text-indigo-600 transition transform hover:-rotate-12 duration-300" />
              )}
            </button>

            {/* Favorites Icon */}
            <button
              onClick={onOpenFavorites}
              aria-label="Sevimlilar"
              className="relative p-2.5 rounded-full hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition"
              title="Sevimlilar"
            >
              <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${favoritesCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              aria-label="Savat"
              className="relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-semibold transition"
              title="Savat"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                Savat
              </span>
            </button>

            {/* Admin entry button */}
            <button
              onClick={onOpenAdmin}
              aria-label="Admin panel"
              className="p-2 sm:p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              title="Admin sahifa"
            >
              <ShieldCheck className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Sovg'a nomi yoki tarkibini qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-full border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-rose-400 dark:focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
