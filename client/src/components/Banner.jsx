import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck, Gift } from 'lucide-react';

export default function Banner({ banners = [], onScrollToProducts }) {
  const activeBanner = banners && banners.length > 0 ? banners[0] : null;

  return (
    <section className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
      {/* Banner / Reklama Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white shadow-xl shadow-rose-200/50 p-6 sm:p-8 md:p-10">
        
        {/* Background decorative patterns */}
        <div className="absolute -top-12 -right-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-rose-400/20 blur-xl pointer-events-none" />
        
        {/* REKLAMA indicator tag (as requested in wireframe) */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-black tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{activeBanner?.badge || "🔥 REKLAMA & MAXSUS TAKLIF"}</span>
        </div>

        <div className="relative z-10 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-xs">
              {activeBanner?.title || "sharbox.uz — Har Bir Qutida Quvonch Va Mehr!"}
            </h1>
            <p className="text-sm sm:text-base text-rose-50 max-w-xl leading-relaxed">
              {activeBanner?.subtitle || "Qo'l mehnati bilan tayyorlangan eksklyuziv sovg'alar, romantik bokslar va geliy sharlar to'plami. Yaqinlaringizga unutilmas syurpriz qiling!"}
            </p>

            {/* Feature Pills */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs">
                <HeartHandshake className="w-3.5 h-3.5 text-pink-200" /> 100% Qo'l mehnati
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs">
                <Truck className="w-3.5 h-3.5 text-amber-200" /> Tezkor yetkazish
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs">
                <Gift className="w-3.5 h-3.5 text-rose-200" /> Maxsus tabriknoma
              </span>
            </div>

            {/* Action button */}
            <div className="pt-2 sm:pt-4">
              <button
                onClick={onScrollToProducts}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-rose-700 font-extrabold text-sm sm:text-base shadow-lg hover:bg-rose-50 hover:shadow-xl transition transform active:scale-95 cursor-pointer"
              >
                <span>{activeBanner?.ctaText || "Sovg'alarni tanlash"}</span>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          </div>

          {/* Side decorative badge/visual */}
          <div className="hidden md:flex md:col-span-4 justify-center">
            <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center transform rotate-2 hover:rotate-0 transition duration-300">
              <div className="text-5xl mb-2 animate-bounce">🎁</div>
              <div className="text-xl font-black">20% gacha</div>
              <p className="text-xs text-rose-100 font-medium">Hozirgi mavsumiy chegirmalarimizdan foydalaning</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
