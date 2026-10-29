import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import FavoritesModal from './components/FavoritesModal';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import BottomNav from './components/BottomNav';
import { api } from './services/api';
import { SearchX } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(null);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('sharbox_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sharbox_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sharbox_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Cart & Favorites (persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sharbox_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('sharbox_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return window.location.hash === '#admin';
  });

  // Save Cart & Favs to localStorage
  useEffect(() => {
    localStorage.setItem('sharbox_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sharbox_favs', JSON.stringify(favorites));
  }, [favorites]);

  // Listen to hash changes for #admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats, bans, sets, ext] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getBanners(),
        api.getSettings(),
        api.getExtras()
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setBanners(bans || []);
      setSettings(sets || null);
      setExtras(ext || []);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.contents && p.contents.some(c => c.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Favorites operations
  const handleToggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleFocusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Header (Logo, search, favorites, cart, admin, dark mode toggle) */}
      <Header
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        settings={settings}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        searchInputRef={searchInputRef}
      />

      <main className="flex-1 pb-16 sm:pb-6">
        {/* 2. REKLAMA (Banner area matching user wireframe) */}
        <Banner
          banners={banners}
          onScrollToProducts={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Category selector pills (BARCHA, CAT 1, CAT 2, CAT 3, CAT 4) */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(catId) => {
            setActiveCategory(catId);
            setSearchTerm('');
          }}
          counts={categoryCounts}
        />

        {/* 4. Products Grid matching wireframe layout */}
        <section className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
          
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Mahsulotlar yuklanmoqda...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-md mx-auto my-8 space-y-3">
              <SearchX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Hech qanday mahsulot topilmadi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Qidiruv so'zini o'zgartiring yoki boshqa kategoriyani tanlang.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
              >
                Barchasini ko'rsatish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const isFav = favorites.some((f) => f.id === product.id);
                const inCart = cart.find((c) => c.id === product.id)?.quantity || 0;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={isFav}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToCart={handleAddToCart}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                    inCartCount={inCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 5. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        categories={categories}
        onSelectCategory={(catId) => setActiveCategory(catId)}
      />

      {/* 6. Mobile Bottom Navigation Bar (iPhone & Android optimal) */}
      <BottomNav
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onFocusSearch={handleFocusSearch}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* MODALS */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.some((f) => f.id === selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        settings={settings}
      />

      {/* Cart Drawer & Telegram Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        settings={settings}
        extrasList={extras}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={(id) => setFavorites((prev) => prev.filter((p) => p.id !== id))}
        onAddToCart={handleAddToCart}
        onOpenDetails={(p) => setSelectedProduct(p)}
      />

      {/* Separate Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.pushState(null, '', ' ');
          }
        }}
        onRefreshData={fetchData}
      />

    </div>
  );
}
