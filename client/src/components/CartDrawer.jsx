import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings
}) {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customNote, setCustomNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState('');

  // Clean calculations (products only)
  const grandTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customerPhone.trim()) {
      setFormError('Iltimos, telefon raqamingizni kiriting!');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          name: customerName.trim() || "Hurmatli mijoz",
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          deliveryDate: deliveryDate.trim()
        },
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          contents: item.contents || []
        })),
        note: customNote.trim(),
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
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 pb-20 sm:pb-6">
          
          {/* Success Screen after placing order */}
          {orderSuccess ? (
            <div className="py-8 text-center space-y-4">
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
                  Telegram ilovangiz ochildi. Xodimimizga xabarni yuboring — u zaklad to'lovini qabul qilib, yetkazib berishni tasdiqlaydi!
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
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer"
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
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
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
                Katalogimizdan sevimli sovg'a bokslaringizni tanlang va bu yerda tezkor buyurtma bering.
              </p>
              <button
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Katalogga qaytish
              </button>
            </div>
          ) : (
            /* Active Cart Items & Clean Direct Checkout Form */
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
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-slate-800 dark:text-slate-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold cursor-pointer"
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
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
                      placeholder="Qo'shimcha istak yoki tabrik so'zi bo'lsa yozib qoldirishingiz mumkin..."
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
                  <span className="font-bold">Eslatma:</span> Qo'l mehnati mahsuloti bo'lgani sababli, xodimimiz Telegram orqali siz bilan bog'lanib, ma'lum foiz zaklad to'lovini qabul qiladi va yetkazib berish vaqtini kelishadi.
                </div>
              </div>

              {/* Form Error if any */}
              {formError && (
                <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Order Summary & Submit Button */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 dark:text-white">Jami to'lov:</span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {grandTotal.toLocaleString('uz-UZ')} <span className="text-xs font-bold text-slate-600 dark:text-slate-400">so'm</span>
                </span>
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
                Tugmani bosganingizda to'liq ma'lumotlar bilan Telegram chat ochiladi
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
