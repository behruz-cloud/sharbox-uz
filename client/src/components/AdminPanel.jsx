import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Package, ShoppingBag, Layers, Megaphone, Settings,
  Plus, Trash2, Edit3, X, Check, ArrowLeft, Upload, BarChart3,
  Phone, Send, User, Calendar, DollarSign, AlertCircle, Clock,
  TrendingUp, CheckCircle2, ChevronRight, Award, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel({ isOpen, onClose, onRefreshData }) {
  if (!isOpen) return null;

  const [pin, setPin] = useState(() => {
    return sessionStorage.getItem('sharbox_admin_pin') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('sharbox_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');

  // Default to Dashboard tab
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | orders | products | categories | banners | settings

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  // Product Form modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    oldPrice: '',
    badge: '',
    inStock: true,
    description: '',
    contents: [''],
    images: ['']
  });

  // Category Form
  const [newCategoryName, setNewCategoryName] = useState('');

  // Settings Form
  const [settingsForm, setSettingsForm] = useState({
    shopName: '',
    telegramManager: '',
    phone: '',
    instagram: '',
    announcement: '',
    deliveryNotice: '',
    newPin: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // File upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch admin data & analytics
  const loadAdminData = async () => {
    setLoading(true);
    const activePin = pin || sessionStorage.getItem('sharbox_admin_pin');
    try {
      const [prods, ords, cats, bans, sets, anData] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getCategories(),
        api.getBanners(),
        api.getSettings(),
        api.getAnalytics(activePin)
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
      setCategories(cats || []);
      setBanners(bans || []);
      setSettings(sets || {});
      setAnalytics(anData || null);

      setSettingsForm({
        shopName: sets?.shopName || 'sharbox.uz',
        telegramManager: (sets?.telegramManager || 'sharbox_manager').replace(/^@+/, ''),
        phone: sets?.phone || '+998 90 123 45 67',
        instagram: (sets?.instagram || 'sharbox.uz').replace(/^@+/, ''),
        announcement: sets?.announcement || '',
        deliveryNotice: sets?.deliveryNotice || '',
        newPin: ''
      });
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.login(pin);
      if (res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('sharbox_admin_auth', 'true');
        sessionStorage.setItem('sharbox_admin_pin', pin);
        loadAdminData();
      } else {
        setAuthError(res.error || "Parol noto'g'ri! Qaytadan urinib ko'ring.");
      }
    } catch (err) {
      setAuthError("Serverga ulanishda xatolik yuz berdi");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sharbox_admin_auth');
    sessionStorage.removeItem('sharbox_admin_pin');
    setPin('');
  };

  // Open modal for adding/editing product
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice || '',
        badge: product.badge || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        description: product.description || '',
        contents: product.contents && product.contents.length ? [...product.contents] : [''],
        images: product.images && product.images.length ? [...product.images] : ['']
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: categories[1]?.id || 'romantika',
        price: '',
        oldPrice: '',
        badge: '',
        inStock: true,
        description: '',
        contents: [''],
        images: ['']
      });
    }
    setIsProductModalOpen(true);
  };

  // Handle saving product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
        contents: productForm.contents.filter(c => c.trim()),
        images: productForm.images.filter(img => img.trim())
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }

      setIsProductModalOpen(false);
      loadAdminData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert("Mahsulotni saqlashda xatolik yuz berdi");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
      await api.deleteProduct(id);
      loadAdminData();
      if (onRefreshData) onRefreshData();
    }
  };

  // Image file upload
  const handleFileUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.url) {
        const updatedImages = [...productForm.images];
        updatedImages[index] = res.url;
        setProductForm({ ...productForm, images: updatedImages });
      } else {
        alert("Rasm yuklashda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Fayl yuklashda xatolik yuz berdi");
    } finally {
      setUploadingImage(false);
    }
  };

  // Categories
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await api.createCategory({ name: newCategoryName });
    setNewCategoryName('');
    loadAdminData();
    if (onRefreshData) onRefreshData();
  };

  const handleDeleteCategory = async (id) => {
    if (id === 'all') {
      alert("Barcha kategoriyasini o'chirib bo'lmaydi");
      return;
    }
    if (window.confirm("Kategoriyani o'chirmoqchimisiz?")) {
      await api.deleteCategory(id);
      loadAdminData();
      if (onRefreshData) onRefreshData();
    }
  };

  // Orders Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    loadAdminData();
  };

  // Save Settings (Guaranteed to save properly)
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaved(false);
    setSettingsError('');

    try {
      const activePin = pin || sessionStorage.getItem('sharbox_admin_pin') || 'admin123';
      const cleanTelegram = (settingsForm.telegramManager || '').replace(/^@+/, '').trim();
      const cleanInstagram = (settingsForm.instagram || '').replace(/^@+/, '').trim();

      const payload = {
        shopName: settingsForm.shopName,
        telegramManager: cleanTelegram,
        phone: settingsForm.phone,
        instagram: cleanInstagram,
        announcement: settingsForm.announcement,
        deliveryNotice: settingsForm.deliveryNotice
      };

      if (settingsForm.newPin && settingsForm.newPin.trim()) {
        payload.newPin = settingsForm.newPin.trim();
      }

      const res = await api.updateSettings(payload, activePin);

      if (res.success) {
        if (res.currentPin) {
          setPin(res.currentPin);
          sessionStorage.setItem('sharbox_admin_pin', res.currentPin);
        }
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
        setSettingsForm(prev => ({ ...prev, newPin: '' }));
        loadAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        setSettingsError(res.error || "Sozlamalarni saqlashda xatolik yuz berdi");
      }
    } catch (err) {
      setSettingsError("Server bilan aloqa uzildi. Iltimos qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full h-full max-w-6xl mx-auto bg-slate-50 dark:bg-slate-900 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Top bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl">sharbox.uz Admin</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Boshqaruv
                </span>
              </div>
              <p className="text-xs text-slate-400">Dashboard, buyurtmalar, tushum va mahsulotlar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={loadAdminData}
                title="Ma'lumotlarni yangilash"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Saytga qaytish</span>
            </button>
          </div>
        </div>

        {/* AUTH SCREEN IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">Admin Kirish</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Boshqaruv paneliga kirish uchun PIN kodni kiriting
                </p>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="PIN kod kiriting"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition cursor-pointer"
              >
                Tizimga kirish
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
              
              {/* TAB 1: DASHBOARD */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>📊 Dashboard</span>
              </button>

              {/* TAB 2: ORDERS */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buyurtmalar</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                }`}>
                  {orders.length}
                </span>
              </button>

              {/* TAB 3: PRODUCTS */}
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Mahsulotlar</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {products.length}
                </span>
              </button>

              {/* TAB 4: CATEGORIES */}
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Kategoriyalar</span>
              </button>

              {/* TAB 5: BANNERS */}
              <button
                onClick={() => setActiveTab('banners')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Reklama</span>
              </button>

              {/* TAB 6: SETTINGS */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 dark:shadow-rose-950/50'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Sozlamalar</span>
              </button>

              <div className="mt-auto hidden md:block pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-xs text-slate-400 hover:text-rose-600 transition"
                >
                  Chiqish (Logout)
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950">
              
              {/* TAB 1: 📊 DASHBOARD & REPORTS (Requested in Item 4) */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>📊 Tushum va Buyurtmalar Hisoboti</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kunlik, haftalik va oylik zakaslar bo'yicha tahlillar
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        ● Tizim faol (24/7)
                      </span>
                    </div>
                  </div>

                  {/* 4 Big Metrics Cards (Bugun, Hafta, Oy, Jami) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Bugun (Kunlik) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bugun (Kunlik)</span>
                        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {analytics?.summary?.today?.orders || 0} <span className="text-xs text-slate-400 font-bold">ta zakas</span>
                      </div>
                      <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                        {(analytics?.summary?.today?.revenue || 0).toLocaleString('uz-UZ')} so'm
                      </div>
                      <p className="text-[11px] text-slate-400">Bugungi tushgan summa</p>
                    </div>

                    {/* Shu hafta (Haftalik) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Haftalik (7 kun)</span>
                        <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {analytics?.summary?.week?.orders || 0} <span className="text-xs text-slate-400 font-bold">ta zakas</span>
                      </div>
                      <div className="text-sm font-black text-sky-600 dark:text-sky-400">
                        {(analytics?.summary?.week?.revenue || 0).toLocaleString('uz-UZ')} so'm
                      </div>
                      <p className="text-[11px] text-slate-400">So'nggi 7 kunlik tushum</p>
                    </div>

                    {/* Shu oy (Oylik) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Oylik (Joriy oy)</span>
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {analytics?.summary?.month?.orders || 0} <span className="text-xs text-slate-400 font-bold">ta zakas</span>
                      </div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {(analytics?.summary?.month?.revenue || 0).toLocaleString('uz-UZ')} so'm
                      </div>
                      <p className="text-[11px] text-slate-400">Shu oy hisobidagi tushum</p>
                    </div>

                    {/* Jami barcha vaqt */}
                    <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 text-white rounded-3xl p-5 shadow-lg shadow-rose-200 dark:shadow-rose-950/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-100 uppercase tracking-wider">Jami (Umumiy)</span>
                        <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-black">
                        {analytics?.summary?.allTime?.orders || orders.length} <span className="text-xs text-rose-200 font-bold">ta zakas</span>
                      </div>
                      <div className="text-sm font-black text-white">
                        {(analytics?.summary?.allTime?.revenue || 0).toLocaleString('uz-UZ')} so'm
                      </div>
                      <p className="text-[11px] text-rose-100">
                        O'rtacha chek: {(analytics?.summary?.allTime?.averageOrderValue || 0).toLocaleString('uz-UZ')} so'm
                      </p>
                    </div>

                  </div>

                  {/* Status Breakdown Section */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      Buyurtmalar holatlari bo'yicha tushum
                    </h5>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {/* Yangi */}
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300">🟡 Yangi</span>
                        <div className="text-lg font-black text-amber-900 dark:text-amber-200 mt-1">
                          {analytics?.statusBreakdown?.['Yangi']?.count || 0} ta
                        </div>
                        <div className="text-xs font-bold text-amber-700 dark:text-amber-400">
                          {(analytics?.statusBreakdown?.['Yangi']?.revenue || 0).toLocaleString('uz-UZ')} so'm
                        </div>
                      </div>

                      {/* Zaklad kutilmoqda */}
                      <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
                        <span className="text-xs font-bold text-orange-800 dark:text-orange-300">🟠 Zaklad kutilmoqda</span>
                        <div className="text-lg font-black text-orange-900 dark:text-orange-200 mt-1">
                          {analytics?.statusBreakdown?.['Zaklad kutilmoqda']?.count || 0} ta
                        </div>
                        <div className="text-xs font-bold text-orange-700 dark:text-orange-400">
                          {(analytics?.statusBreakdown?.['Zaklad kutilmoqda']?.revenue || 0).toLocaleString('uz-UZ')} so'm
                        </div>
                      </div>

                      {/* Yetkazilmoqda */}
                      <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
                        <span className="text-xs font-bold text-sky-800 dark:text-sky-300">🔵 Yetkazilmoqda</span>
                        <div className="text-lg font-black text-sky-900 dark:text-sky-200 mt-1">
                          {analytics?.statusBreakdown?.['Yetkazilmoqda']?.count || 0} ta
                        </div>
                        <div className="text-xs font-bold text-sky-700 dark:text-sky-400">
                          {(analytics?.statusBreakdown?.['Yetkazilmoqda']?.revenue || 0).toLocaleString('uz-UZ')} so'm
                        </div>
                      </div>

                      {/* Yakunlandi */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">🟢 Yakunlandi</span>
                        <div className="text-lg font-black text-emerald-900 dark:text-emerald-200 mt-1">
                          {analytics?.statusBreakdown?.['Yakunlandi']?.count || 0} ta
                        </div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {(analytics?.statusBreakdown?.['Yakunlandi']?.revenue || 0).toLocaleString('uz-UZ')} so'm
                        </div>
                      </div>

                      {/* Bekor qilindi */}
                      <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                        <span className="text-xs font-bold text-rose-800 dark:text-rose-300">🔴 Bekor qilindi</span>
                        <div className="text-lg font-black text-rose-900 dark:text-rose-200 mt-1">
                          {analytics?.statusBreakdown?.['Bekor qilindi']?.count || 0} ta
                        </div>
                        <div className="text-xs font-bold text-rose-700 dark:text-rose-400">
                          {(analytics?.statusBreakdown?.['Bekor qilindi']?.revenue || 0).toLocaleString('uz-UZ')} so'm
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Products & Quick Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    {/* Top Products */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                        <span>🏆 Eng Ko'p Sotilgan To'plamlar</span>
                        <span className="text-xs font-normal text-slate-400">Savdo soni bo'yicha</span>
                      </h5>

                      {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {analytics.topProducts.map((p, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-slate-900 dark:text-white">{p.quantity} dona</span>
                                <div className="text-[11px] text-rose-600 dark:text-rose-400">{p.revenue.toLocaleString('uz-UZ')} so'm</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 py-6 text-center">Hozircha buyurtmalar statistikasi yo'q</p>
                      )}
                    </div>

                    {/* Quick Orders List */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          🕒 So'nggi Buyurtmalar
                        </h5>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline"
                        >
                          Barchasi ({orders.length}) →
                        </button>
                      </div>

                      {orders.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {orders.slice(0, 4).map((ord) => (
                            <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                              <div>
                                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                  <span>{ord.customer?.name || "Mijoz"}</span>
                                  <span className="text-[10px] text-slate-400">({ord.id})</span>
                                </div>
                                <div className="text-[11px] text-slate-500">{ord.customer?.phone}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-rose-600 dark:text-rose-400">
                                  {Number(ord.totalAmount).toLocaleString('uz-UZ')} so'm
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {ord.status || 'Yangi'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 py-6 text-center">Buyurtmalar mavjud emas</p>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white">Mahsulotlar katalogi</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Jami {products.length} ta sovg'a boksi mavjud</p>
                    </div>
                    <button
                      onClick={() => handleOpenProductModal()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi mahsulot</span>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                            {prod.badge && (
                              <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                                {prod.badge}
                              </span>
                            )}
                            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                              {prod.images?.length || 1} ta rasm
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                                {categories.find(c => c.id === prod.category)?.name || prod.category}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.inStock ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'}`}>
                                {prod.inStock ? 'Mavjud' : 'Qolmagan'}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{prod.name}</h5>
                            <div className="text-xs text-rose-600 dark:text-rose-400 font-black mt-1">
                              {prod.price.toLocaleString('uz-UZ')} so'm
                              {prod.oldPrice && (
                                <span className="ml-2 text-slate-400 dark:text-slate-500 line-through font-normal text-[11px]">
                                  {prod.oldPrice.toLocaleString('uz-UZ')} so'm
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contents preview */}
                          {prod.contents && prod.contents.length > 0 && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                              <span className="font-bold text-slate-700 dark:text-slate-200">Tarkibi: </span>
                              {prod.contents.join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => handleOpenProductModal(prod)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Kelib tushgan buyurtmalar</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mijozlar tomonidan rasmiylashtirilgan zakaslar</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-500 space-y-2">
                      <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                      <p className="font-bold">Hozircha buyurtmalar yo'q</p>
                      <p className="text-xs">Mijozlar buyurtma berishi bilan bu yerda saqlanadi.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 dark:text-white text-base">{ord.id}</span>
                              <span className="text-xs text-slate-400">
                                {new Date(ord.createdAt).toLocaleString('uz-UZ')}
                              </span>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Holat:</span>
                              <select
                                value={ord.status || 'Yangi'}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                              >
                                <option value="Yangi">🟡 Yangi</option>
                                <option value="Zaklad kutilmoqda">🟠 Zaklad kutilmoqda</option>
                                <option value="Yetkazilmoqda">🔵 Yetkazilmoqda</option>
                                <option value="Yakunlandi">🟢 Yakunlandi</option>
                                <option value="Bekor qilindi">🔴 Bekor qilindi</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-xs">
                            {/* Customer info */}
                            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
                              <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                <span>{ord.customer?.name || "Noma'lum mijoz"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${ord.customer?.phone}`} className="hover:underline font-semibold text-rose-600 dark:text-rose-400">
                                  {ord.customer?.phone}
                                </a>
                              </div>
                              {ord.customer?.address && (
                                <div className="text-slate-600 dark:text-slate-300">
                                  <span className="font-semibold">Manzil:</span> {ord.customer.address}
                                </div>
                              )}
                              {ord.customer?.deliveryDate && (
                                <div className="text-slate-600 dark:text-slate-300">
                                  <span className="font-semibold">Yetkazish vaqti:</span> {ord.customer.deliveryDate}
                                </div>
                              )}
                              {ord.note && (
                                <div className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
                                  <span className="font-bold text-slate-800 dark:text-slate-100">Mijoz izohi:</span> {ord.note}
                                </div>
                              )}
                            </div>

                            {/* Items breakdown */}
                            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">Buyurtma qilingan to'plamlar:</div>
                                <ul className="space-y-1">
                                  {ord.items?.map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                                      <span>{item.name} ({item.quantity} dona)</span>
                                      <span className="font-bold">{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-black text-sm text-slate-900 dark:text-white">
                                <span>Jami summa:</span>
                                <span className="text-rose-600 dark:text-rose-400 text-base">
                                  {Number(ord.totalAmount).toLocaleString('uz-UZ')} so'm
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Kategoriyalar</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mahsulotlarni guruhlash uchun kategoriyalar</p>
                  </div>

                  {/* Add category form */}
                  <form onSubmit={handleAddCategory} className="flex gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Yangi kategoriya nomi"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Qo'shish
                    </button>
                  </form>

                  {/* List of categories */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map((cat) => (
                      <div key={cat.id} className="py-3 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{cat.name}</span>
                        {cat.id !== 'all' && (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BANNERS */}
              {activeTab === 'banners' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Reklama Banneri</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Saytning yuqori qismidagi aksiya va reklama</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Banner Sarlavhasi</label>
                      <input
                        type="text"
                        value={banners[0]?.title || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[0] = { ...updated[0], title: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Banner Matni (Tavsif)</label>
                      <textarea
                        rows={2}
                        value={banners[0]?.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[0] = { ...updated[0], subtitle: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Badge (Teg)</label>
                      <input
                        type="text"
                        value={banners[0]?.badge || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[0] = { ...updated[0], badge: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        await api.updateBanners(banners);
                        alert("Banner muvaffaqiyatli saqlandi!");
                        if (onRefreshData) onRefreshData();
                      }}
                      className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md cursor-pointer"
                    >
                      Bannerni saqlash
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: ⚙️ SETTINGS (Requested in Item 3 - Guaranteed saving) */}
              {activeTab === 'settings' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">Do'kon sozlamalari</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Telegram xodim, telefon va bio havolalari</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                    
                    {/* Telegram Manager Username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Xodim Telegram Username <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                        <input
                          type="text"
                          required
                          value={settingsForm.telegramManager || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, telegramManager: e.target.value.replace(/^@+/, '').trim() })}
                          placeholder="masalan: sharbox_manager"
                          className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Mijozlar buyurtma berganda aynan mana shu profilga kelib tushadi: <strong className="text-rose-600 dark:text-rose-400">t.me/{settingsForm.telegramManager || 'sharbox_manager'}</strong>
                      </p>
                    </div>

                    {/* Telefon raqam */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Telefon raqam</label>
                      <input
                        type="text"
                        value={settingsForm.phone || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    {/* Instagram username */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Instagram username</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                        <input
                          type="text"
                          value={settingsForm.instagram || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value.replace(/^@+/, '').trim() })}
                          className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                        />
                      </div>
                    </div>

                    {/* Announcement */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sayt yuqorisidagi e'lon</label>
                      <input
                        type="text"
                        value={settingsForm.announcement || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    {/* Yangi PIN */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Yangi Admin PIN (agar o'zgartirmoqchi bo'lsangiz)
                      </label>
                      <input
                        type="password"
                        placeholder="Yangi PIN kod kiriting (bo'sh qoldirilsa o'zgarmaydi)"
                        value={settingsForm.newPin || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newPin: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>

                    {/* Success Notice */}
                    {settingsSaved && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                        <Check className="w-4 h-4" />
                        <span>Sozlamalar va Telegram username muvaffaqiyatli saqlandi!</span>
                      </div>
                    )}

                    {/* Error Notice */}
                    {settingsError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-200 dark:border-rose-800">
                        <AlertCircle className="w-4 h-4" />
                        <span>{settingsError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md cursor-pointer transition"
                    >
                      Sozlamalarni saqlash
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* PRODUCT FORM MODAL (Add / Edit) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-5 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-xl font-black">
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </h4>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mahsulot nomi <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Masalan: Romantic Rose Box"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Hozirgi narxi (so'm) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="250000"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Eski narxi (ustidan chiziladi)
                  </label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="320000"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teg / Badge
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="🔥 Xit savdo / Yangi"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Multiple Images with File Upload Support */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Rasmlar (Bir nechta rasm kiritish mumkin, yonga surib ko'riladi)
                </label>
                {productForm.images.map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="https://... yoki rasm yuklang"
                      value={img}
                      onChange={(e) => {
                        const updated = [...productForm.images];
                        updated[idx] = e.target.value;
                        setProductForm({ ...productForm, images: updated });
                      }}
                      className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fayl</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, idx)}
                      />
                    </label>
                    {productForm.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = productForm.images.filter((_, i) => i !== idx);
                          setProductForm({ ...productForm, images: updated });
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Yana rasm qo'shish
                </button>
              </div>

              {/* Ichida nimalar borligi (Box Contents list) */}
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Quti ichida nimalar bor? (Tarkibi)
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Mijoz quti tarkibini aniq ko'rishi uchun qadamma-qadam qo'shing
                </p>
                {productForm.contents.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`Masalan: 11 ta qizil atirgul yoki Ferrero Rocher 8 dona`}
                      value={item}
                      onChange={(e) => {
                        const updated = [...productForm.contents];
                        updated[idx] = e.target.value;
                        setProductForm({ ...productForm, contents: updated });
                      }}
                      className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    {productForm.contents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = productForm.contents.filter((_, i) => i !== idx);
                          setProductForm({ ...productForm, contents: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, contents: [...productForm.contents, ''] })}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tarkib elementi qo'shish
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mahsulot haqida tavsif
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Sevimli insoningiz uchun maxsus qo'lda tayyorlangan romantik sovg'a..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* In stock checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mahsulot hozirda sotuvda mavjud</span>
              </label>

              {/* Save & Cancel */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
                >
                  {uploadingImage ? "Rasm yuklanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
