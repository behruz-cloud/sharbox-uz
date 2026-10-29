import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Package, ShoppingBag, Layers, Megaphone, Settings,
  Plus, Trash2, Edit3, X, Check, ArrowLeft, Upload, Image as ImageIcon,
  ExternalLink, Phone, Send, User, Calendar, DollarSign, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel({ isOpen, onClose, onRefreshData }) {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('products'); // products | orders | categories | banners | settings

  // Data states
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

  // File upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch admin data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [prods, ords, cats, bans, sets] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getCategories(),
        api.getBanners(),
        api.getSettings()
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
      setCategories(cats || []);
      setBanners(bans || []);
      setSettings(sets || {});
      setSettingsForm({
        shopName: sets?.shopName || 'sharbox.uz',
        telegramManager: sets?.telegramManager || 'sharbox_manager',
        phone: sets?.phone || '+998 90 123 45 67',
        instagram: sets?.instagram || 'sharbox.uz',
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.login(pin);
      if (res.success) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setAuthError(res.error || "Parol noto'g'ri");
      }
    } catch (err) {
      setAuthError("Serverga ulanishda xatolik");
    }
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
        alert("Rasm yuklashda xatolik");
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

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        shopName: settingsForm.shopName,
        telegramManager: settingsForm.telegramManager,
        phone: settingsForm.phone,
        instagram: settingsForm.instagram,
        announcement: settingsForm.announcement,
        deliveryNotice: settingsForm.deliveryNotice
      };
      if (settingsForm.newPin) {
        payload.adminPin = settingsForm.newPin;
      }

      await api.updateSettings(payload, pin);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
      loadAdminData();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert("Sozlamalarni saqlashda xatolik");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div className="w-full h-full max-w-6xl mx-auto bg-slate-50 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
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
              <p className="text-xs text-slate-400">Mahsulotlar, buyurtmalar va sozlamalar</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Saytga qaytish</span>
            </button>
          </div>
        </div>

        {/* AUTH SCREEN IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-100">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Admin Kirish</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Boshqaruv paneliga kirish uchun PIN kodni kiriting
                </p>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="PIN kod (standart: admin123)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-bold p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition"
              >
                Tizimga kirish
              </button>

              <p className="text-[11px] text-slate-400">
                Standart PIN kod: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">admin123</code>
              </p>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Package className="w-4 h-4 text-rose-600" />
                <span>Mahsulotlar</span>
                <span className="ml-auto text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full font-black text-slate-700">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-rose-600" />
                <span>Buyurtmalar</span>
                <span className="ml-auto text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-rose-600" />
                <span>Kategoriyalar</span>
                <span className="ml-auto text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full font-black text-slate-700">
                  {categories.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('banners')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Megaphone className="w-4 h-4 text-rose-600" />
                <span>Reklama / Banner</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 md:flex-none flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-rose-50 text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-rose-600" />
                <span>Sozlamalar</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              
              {/* TAB: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-black text-slate-900">Mahsulotlar katalogi</h4>
                      <p className="text-xs text-slate-500">Jami {products.length} ta sovg'a boksi mavjud</p>
                    </div>
                    <button
                      onClick={() => handleOpenProductModal()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi mahsulot</span>
                    </button>
                  </div>

                  {/* Products Grid / Table */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
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
                              <span className="text-[11px] font-bold text-rose-600 uppercase">
                                {categories.find(c => c.id === prod.category)?.name || prod.category}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {prod.inStock ? 'Mavjud' : 'Qolmagan'}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h5>
                            <div className="text-xs text-rose-600 font-black mt-1">
                              {prod.price.toLocaleString('uz-UZ')} so'm
                              {prod.oldPrice && (
                                <span className="ml-2 text-slate-400 line-through font-normal text-[11px]">
                                  {prod.oldPrice.toLocaleString('uz-UZ')} so'm
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contents preview */}
                          {prod.contents && prod.contents.length > 0 && (
                            <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                              <span className="font-bold text-slate-700">Tarkibi: </span>
                              {prod.contents.join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleOpenProductModal(prod)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
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

              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Kelib tushgan buyurtmalar</h4>
                    <p className="text-xs text-slate-500">Mijozlar tomonidan rasmiylashtirilgan zakaslar</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-slate-500 space-y-2">
                      <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
                      <p className="font-bold">Hozircha buyurtmalar yo'q</p>
                      <p className="text-xs">Mijozlar buyurtma berishi bilan bu yerda aks etadi.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-base">{ord.id}</span>
                              <span className="text-xs text-slate-400">
                                {new Date(ord.createdAt).toLocaleString('uz-UZ')}
                              </span>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500">Holat:</span>
                              <select
                                value={ord.status || 'Yangi'}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none ${
                                  ord.status === 'Yakunlandi'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : ord.status === 'Zaklad kutilmoqda'
                                    ? 'bg-amber-50 text-amber-700'
                                    : ord.status === 'Bekor qilindi'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-sky-50 text-sky-700'
                                }`}
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
                            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl">
                              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-rose-600" />
                                <span>{ord.customer?.name || "Noma'lum mijoz"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${ord.customer?.phone}`} className="hover:underline font-semibold text-rose-600">
                                  {ord.customer?.phone}
                                </a>
                              </div>
                              {ord.customer?.address && (
                                <div className="text-slate-600">
                                  <span className="font-semibold">Manzil:</span> {ord.customer.address}
                                </div>
                              )}
                              {ord.customer?.deliveryDate && (
                                <div className="text-slate-600">
                                  <span className="font-semibold">Yetkazish vaqti:</span> {ord.customer.deliveryDate}
                                </div>
                              )}
                              {ord.note && (
                                <div className="text-slate-600 bg-white p-2 rounded-xl border border-slate-200 mt-2">
                                  <span className="font-bold text-slate-800">Mijoz izohi:</span> {ord.note}
                                </div>
                              )}
                            </div>

                            {/* Items breakdown */}
                            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl flex flex-col justify-between">
                              <div>
                                <div className="font-bold text-slate-700 mb-1">Buyurtma qilingan to'plamlar:</div>
                                <ul className="space-y-1">
                                  {ord.items?.map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-slate-700">
                                      <span>{item.name} ({item.quantity} dona)</span>
                                      <span className="font-bold">{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
                                    </li>
                                  ))}
                                </ul>

                                {ord.extras && ord.extras.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <span className="font-bold text-rose-700">Qo'shimchalar:</span>
                                    <ul className="space-y-0.5 mt-0.5 text-slate-600">
                                      {ord.extras.map((ex, idx) => (
                                        <li key={idx}>
                                          • {ex.name} {ex.price ? `(+${ex.price.toLocaleString('uz-UZ')} so'm)` : ''}
                                          {ex.userText && <div className="text-[10px] text-slate-500 italic">"{ex.userText}"</div>}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-sm text-slate-900">
                                <span>Jami summa:</span>
                                <span className="text-rose-600 text-base">
                                  {ord.totalAmount?.toLocaleString('uz-UZ')} so'm
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

              {/* TAB: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Kategoriyalar</h4>
                    <p className="text-xs text-slate-500">Mahsulotlarni guruhlash uchun kategoriyalar</p>
                  </div>

                  {/* Add category form */}
                  <form onSubmit={handleAddCategory} className="flex gap-2 bg-white p-3 rounded-2xl border border-slate-200">
                    <input
                      type="text"
                      placeholder="Yangi kategoriya nomi (masalan: Yangi yil bokslari)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                    >
                      Qo'shish
                    </button>
                  </form>

                  {/* List of categories */}
                  <div className="bg-white rounded-3xl p-4 border border-slate-200 divide-y divide-slate-100">
                    {categories.map((cat) => (
                      <div key={cat.id} className="py-3 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800">{cat.name}</span>
                        {cat.id !== 'all' && (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
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

              {/* TAB: BANNERS */}
              {activeTab === 'banners' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Reklama Banneri</h4>
                    <p className="text-xs text-slate-500">Saytning yuqori qismidagi aksiya va reklama</p>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Banner Sarlavhasi</label>
                      <input
                        type="text"
                        value={banners[0]?.title || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[0] = { ...updated[0], title: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Banner Matni (Tavsif)</label>
                      <textarea
                        rows={2}
                        value={banners[0]?.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[0] = { ...updated[0], subtitle: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Badge (Teg)</label>
                      <input
                        type="text"
                        value={banners[0]?.badge || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[0] = { ...updated[0], badge: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        await api.updateBanners(banners);
                        alert("Banner muvaffaqiyatli saqlandi!");
                        if (onRefreshData) onRefreshData();
                      }}
                      className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md"
                    >
                      Bannerni saqlash
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Do'kon sozlamalari</h4>
                    <p className="text-xs text-slate-500">Telegram xodim, telefon va bio havolalari</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Xodim Telegram Username <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">@</span>
                        <input
                          type="text"
                          required
                          value={settingsForm.telegramManager.replace('@', '')}
                          onChange={(e) => setSettingsForm({ ...settingsForm, telegramManager: e.target.value })}
                          placeholder="masalan: sharbox_manager"
                          className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-slate-200"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Mijozlar buyurtmani Telegram orqali yuborganda aynan mana shu profilga kelib tushadi!
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Telefon raqam</label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Instagram username</label>
                      <input
                        type="text"
                        value={settingsForm.instagram.replace('@', '')}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sayt yuqorisidagi e'lon</label>
                      <input
                        type="text"
                        value={settingsForm.announcement}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Yangi Admin PIN (agar o'zgartirmoqchi bo'lsangiz)</label>
                      <input
                        type="password"
                        placeholder="Yangi PIN kod kiriting"
                        value={settingsForm.newPin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newPin: e.target.value })}
                        className="w-full p-2.5 text-sm rounded-xl border border-slate-200"
                      />
                    </div>

                    {settingsSaved && (
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md"
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xl font-black text-slate-900">
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </h4>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mahsulot nomi <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Masalan: Romantic Rose Box"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-3 text-sm rounded-xl border border-slate-200"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hozirgi narxi (so'm) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="250000"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Eski narxi (ustidan chiziladi)
                  </label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="320000"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teg / Badge
                  </label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="🔥 Xit savdo / Yangi"
                    className="w-full p-3 text-sm rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Multiple Images with File Upload Support */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Rasmlar (Bir nechta rasm kiritish mumkin, nuqtalar (o o o) orqali almashadi)
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
                      className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1">
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
                        className="p-2 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                  className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Yana rasm qo'shish
                </button>
              </div>

              {/* Ichida nimalar borligi (Box Contents list) */}
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                  Quti ichida nimalar bor? (Tarkibi)
                </label>
                <p className="text-[11px] text-slate-500">
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
                      className="flex-1 p-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                    {productForm.contents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = productForm.contents.filter((_, i) => i !== idx);
                          setProductForm({ ...productForm, contents: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProductForm({ ...productForm, contents: [...productForm.contents, ''] })}
                  className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tarkib elementi qo'shish
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mahsulot haqida tavsif
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Sevimli insoningiz uchun maxsus qo'lda tayyorlangan romantik sovg'a..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200"
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
                <span className="text-xs font-bold text-slate-700">Mahsulot hozirda sotuvda mavjud</span>
              </label>

              {/* Save & Cancel */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer"
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
