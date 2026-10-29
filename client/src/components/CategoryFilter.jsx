import React from 'react';

export default function CategoryFilter({ categories, activeCategory, onSelectCategory, counts = {} }) {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8" id="products">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Kategoriyalar</span>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/40">
            {categories.length} xil
          </span>
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
          O'zingizga yoqqan kategoriyani tanlang
        </span>
      </div>

      {/* Categories Buttons Row (BARCHA, CAT 1, CAT 2, ...) */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border cursor-pointer select-none ${
                isActive
                  ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50 scale-102'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-slate-850'
              }`}
            >
              <span>{cat.name}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
