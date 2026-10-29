import React from 'react';
import { Gift, Send, Phone, Clock, MapPin, ShieldCheck } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer({ settings, onOpenAdmin, categories, onSelectCategory }) {
  return (
    <footer className="mt-16 sm:mt-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 pb-20 sm:pb-0 transition-colors">
      {/* Top Banner Feature Bar */}
      <div className="bg-rose-50/60 dark:bg-slate-850/60 border-b border-rose-100 dark:border-slate-800 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl mb-1">🎁</div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">100% Qo'l Mehnati</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Har bir boks mehr bilan teriladi</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">⚡</div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">Tezkor Yetkazish</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Toshkent va viloyatlar bo'ylab</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">💌</div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">Maxsus Tabriknoma</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Iliq so'zlaringizni qo'lda yozamiz</p>
          </div>
          <div className="p-3">
            <div className="text-2xl mb-1">💬</div>
            <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">24/7 Telegram Aloqa</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Xodimimiz doimiy aloqada</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 dark:shadow-rose-950/40">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                sharbox<span className="text-rose-600">.uz</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              Sevikli insoningiz, do'stlaringiz va yaqinlaringiz uchun eksklyuziv qo'l mehnati sovg'a bokslari, geliy sharlar to'plami hamda kutilmagan syurprizlar.
            </p>
            <div className="pt-2 flex items-center gap-3">
              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center text-slate-700 dark:text-slate-200 transition"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {settings?.telegramManager && (
                <a
                  href={`https://t.me/${settings.telegramManager.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center text-slate-700 dark:text-slate-200 transition"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center text-slate-700 dark:text-slate-200 transition"
                  title="Telefon"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Kategoriyalar
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="md:col-span-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Bog'lanish
            </h4>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{settings?.phone || "+998 90 123 45 67"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-500 shrink-0" />
              <span>@{settings?.telegramManager?.replace('@', '') || "sharbox_manager"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>24/7 Buyurtmalar qabul qilinadi</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Toshkent shahri va butun O'zbekiston</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and admin link */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} sharbox.uz — Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin sahifa</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
