import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, CheckCircle, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  extrasList = []
}) {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedExtras, setSelectedExtras] = useState({});
  const [extraTexts, setExtraTexts] = useState({});
  const [customNote, setCustomNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculations
  const itemsTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const extrasTotal = Object.entries(selectedExtras).reduce((acc, [extraId, isSelected]) => {
    if (!isSelected) return acc;
    const extra = extrasList.find(e => e.id === extraId);
    return acc + (extra?.price || 0);
  }, 0);

  const grandTotal = itemsTotal + extrasTotal;

  const handleToggleExtra = (extraId) => {
    setSelectedExtras(prev => ({
      ...prev,
      [extraId]: !prev[extraId]
    }));
  };

  const handleExtraTextChange = (extraId, text) => {
    setExtraTexts(prev => ({
      ...prev,
      [extraId]: text
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customerPhone.trim()) {
      setFormError('Iltimos, telefon raqamingizni kiriting!');
      return;
    }

    setLoading(true);

    try {
      // Build selected extras array
      const chosenExtras = [];
      Object.entries(selectedExtras).forEach(([extraId, isSelected]) => {
        if (isSelected) {
          const extra = extrasList.find(e => e.id === extraId);
          if (extra) {
            chosenExtras.push({
              id: extra.id,
              name: extra.name,
              price: extra.price || 0,
              userText: extraTexts[extra.id] || ''
            });
          }
        }
      });

      const orderPayload = {
        customer: {
          name: customerName || "Hurmatli mijoz",
          phone: customerPhone,
          address: customerAddress,
          deliveryDate
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          contents: item.contents || []
        })),
        extras: chosenExtras,
        note: customNote,
        totalAmount: grandTotal
      };

      const result = await api.createOrder(orderPayload);

      if (result && result.success) {
        setOrderSuccess(result);
        onClearCart();
        // Open Telegram immediately in new tab
        if (result.telegramUrl) {
          window.open(result.telegramUrl, '_blank');
        }
      } else {
        setFormError("Buyurtmani yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Server bilan aloqa uzildi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (orderSuccess?.telegramMessage) {
      navigator.clipboard.writeText(orderSuccess.telegramMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in flex justify-end">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Savat va Buyurtma</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cartItems.length > 0 ? `${cartItems.length} xil mahsulot tanlandi` : "Savat bo'sh"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 pb-20 sm:pb-6">
          
          {/* Success Screen after placing order */}
          {orderSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Buyurtmangiz qabul qilindi!
                </h4>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
                  Buyurtma raqami: {orderSuccess.orderId}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Telegram ilovangiz ochildi. Xodimimizga xabarni yuboring — u zaklad to'lovini qabul qilib, buyurtmani tasdiqlaydi!
                </p>
              </div>

              {/* Direct Open Telegram Button */}
              {orderSuccess.telegramUrl && (
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={orderSuccess.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm shadow-lg shadow-sky-200 dark:shadow-sky-950/50 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegramda xodimga yozish</span>
                  </a>

                  <button
                    onClick={handleCopyMessage}
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Xabar nusxalandi!" : "Xabar matnini nusxalash"}</span>
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setOrderSuccess(null);
                    onClose();
                  }}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline"
                >
                  Xarid qilishda davom etish
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart View */
            <div className="py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-800 dark:text-slate-200">Savat hozircha bo'sh</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Katalogimizdan sevimli sovg'a bokslaringizni tanlang va bu yerda buyurtma bering.
              </p>
              <button
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
              >
                Katalogga qaytish
              </button>
            </div>
          ) : (
            /* Active Cart Items & Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Product Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Tanlangan mahsulotlar
                </h4>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700"
                  >
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {item.name}
                      </h5>
                      <div className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5">
                        {item.price.toLocaleString('uz-UZ')} so'm
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-slate-800 dark:text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          = {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Qo'shimcha narsalar qo'shish (Add-ons / Extras) */}
              <div className="space-y-3 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <h4 className="text-xs font-black text-rose-950 dark:text-rose-300 uppercase tracking-wider">
                    Qo'shimcha narsalar qo'shish
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Boksingizga qo'shimcha tabriknoma yoki sovg'alar qo'shmoqchimisiz?
                </p>

                <div className="space-y-2.5 pt-1">
                  {extrasList.map((extra) => {
                    const isChecked = Boolean(selectedExtras[extra.id]);

                    return (
                      <div key={extra.id} className="space-y-1.5">
                        <label className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/30 cursor-pointer hover:border-rose-300 dark:hover:border-rose-700 transition select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleExtra(extra.id)}
                            className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-600"
                          />
                          <div className="flex-1 flex items-baseline justify-between gap-2 text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{extra.name}</span>
                            <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0">
                              {extra.price > 0 ? `+${extra.price.toLocaleString('uz-UZ')} so'm` : 'Bepul'}
                            </span>
                          </div>
                        </label>

                        {/* Extra input field if tabriknoma or custom text */}
                        {isChecked && extra.requiredText && (
                          <div className="pl-6 animate-fade-in">
                            <input
                              type="text"
                              placeholder={extra.placeholder || "Tabriknomaga yoziladigan so'zlaringiz..."}
                              value={extraTexts[extra.id] || ''}
                              onChange={(e) => handleExtraTextChange(extra.id, e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mijoz ma'lumotlari (Customer details) */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Yetkazib berish ma'lumotlari
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Telefon raqamingiz <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998 90 123 45 67"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ismingiz
                    </label>
                    <input
                      type="text"
                      placeholder="Ismingizni kiriting"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Yetkazib berish manzili
                    </label>
                    <input
                      type="text"
                      placeholder="Toshkent sh., Chilonzor tumani..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Yetkazish vaqti / sana (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      placeholder="Masalan: Bugun soat 18:00 gacha"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Qo'shimcha istaklaringiz / Izoh
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Boks rangini o'zgartirish, boshqa shokolad qo'shish va h.k."
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* Zaklad info notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Eslatma:</span> Qo'l mehnati mahsuloti bo'lgani sababli, xodimimiz Telegram orqali siz bilan bog'lanib, ma'lum foiz zaklad to'lovini qabul qiladi va buyurtmani tayyorlashga topshiradi.
                </div>
              </div>

              {/* Form Error if any */}
              {formError && (
                <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Order Summary & Submit Button */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Mahsulotlar summasi:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{itemsTotal.toLocaleString('uz-UZ')} so'm</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between text-xs text-rose-600 dark:text-rose-400">
                    <span>Qo'shimchalar:</span>
                    <span className="font-semibold">+{extrasTotal.toLocaleString('uz-UZ')} so'm</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900 dark:text-white">Jami to'lov:</span>
                  <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                    {grandTotal.toLocaleString('uz-UZ')} <span className="text-xs font-bold text-slate-600 dark:text-slate-400">so'm</span>
                  </span>
                </div>
              </div>

              {/* BIG TELEGRAM ORDER SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-black text-base shadow-xl shadow-rose-200 dark:shadow-rose-950/50 flex items-center justify-center gap-2.5 transition transform active:scale-98 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Telegram orqali xodimga buyurtma berish</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                Tugmani bosganingizda barcha ma'lumotlar bilan Telegram chat ochiladi
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
