# 🎁 sharbox.uz — Qo'l mehnati sovg'a bokslari va sharlar e-commerce platformasi

Instagram va Telegram orqali savdo qiluvchi brendlar uchun maxsus yaratilgan zamonaviy, yengil va tezkor internet-do'kon.

---

## 🌟 Asosiy imkoniyatlar

1. **Wireframe asosidagi dizayn**:
   - **Header**: Brend logotipi (`sharbox.uz`), mahsulot qidiruvi, Sevimlilar (❤️), Savat (🛒), Admin sahifaga o'tish.
   - **REKLAMA Banner**: Aksiya va mavsumiy chegirmalar, sovg'a bokslari afzalliklari.
   - **Kategoriyalar filtri**: Barcha, Romantika, Tug'ilgan kun, Shirinliklar, Erkaklar uchun, VIP to'plamlar.
   - **Mahsulot kartochkasi**:
     - Bir nechta rasm va nuqtalar (`o o o`) orqali rasmlarni almashtirish;
     - Quti ichida nimalar borligi (Tarkibi) ko'rsatilgan teglari;
     - Eski narx (ustidan chizilgan) va Hozirgi narx, chegirma foizi;
     - Sevimlilarga qo'shish (❤️);
     - Savatga qo'shish tugmasi (`add_basket`).

2. **Batafsil ko'rish (Mahsulot modali)**:
   - Katta formatdagi fotogalereya;
   - Qutining to'liq tarkibi (Checklist formatida);
   - Soni (dona) tanlash;
   - Bir bosishda Telegram orqali xodimdan so'rash yoki savatga qo'shish.

3. **Savat va Qo'shimchalar (Extras)**:
   - Mahsulotlar sonini o'zgartirish (+ / -);
   - **Qo'shimcha narsalar qo'shish**:
     - 📝 Tabriknomaga tabrik so'zini yozish (erkin matn kiritish);
     - 🎈 Geliy sharlar to'plami (+35,000 so'm);
     - 💖 Katta foliyali yurakcha shari (+25,000 so'm);
     - 🍫 Qo'shimcha shirinliklar jamlanmasi (+40,000 so'm);
     - 🤫 Anonim syurpriz yetkazib berish (bepul).
   - Mijoz ma'lumotlari: Telefon raqami, Ismi, Yetkazib berish manzili va vaqti.

4. **🚀 Telegram orqali xodimga buyurtma yuborish**:
   - Buyurtma rasmiylashtirilganda barcha tanlangan bokslar, soni, tarkibi, qo'shimcha sovg'alar va manzil chiroyli formatlangan Telegram xabariga aylanadi.
   - Avtomatik `https://t.me/sharbox_manager?text=...` havolasi ochiladi va mijoz bitta "Send" tugmasini bosishi kifoya qiladi!
   - Xodim zaklad to'lovi rekvizitlarini tashlab, buyurtmani tasdiqlaydi.
   - Buyurtma darhol tizim ma'lumotlar bazasida va Admin panelda saqlanadi.

5. **🔐 Alohida Admin sahifa (`/admin` yoki `#admin`)**:
   - PIN kod bilan himoyalangan (standart: `admin123`, sozlamalarda o'zgartirish mumkin);
   - **Mahsulotlar**: Yangi boks qo'shish, rasmlarni yuklash (fayl yoki URL), narxlarni belgilash, ichidagi narsalarni kiritish, tahrirlash, o'chirish;
   - **Kategoriyalar**: Yangi toifalar yaratish va boshqarish;
   - **Reklama banneri**: Asosiy sahifadagi reklama matni va chegirmalarni o'zgartirish;
   - **Buyurtmalar**: Barcha mijoz buyurtmalari ro'yxati, mijoz raqamlari, buyurtma holatlari (Yangi, Zaklad kutilmoqda, Yetkazilmoqda, Yakunlandi);
   - **Sozlamalar**: Xodim Telegram foydalanuvchi nomi (`@username`), telefon, Instagram username va admin parolini o'zgartirish.

---

## 🚀 Loyihani ishga tushirish

Loyihani kompyuterda ishga tushirish uchun:

```powershell
# 1. Loyiha papkasiga o'ting
cd C:\Users\user\.gemini\antigravity\scratch\sharbox-uz

# 2. Serverni ishga tushirish
npm start
```

Brauzerda oching:
- **Asosiy sayt**: `http://localhost:5000`
- **Admin panel**: `http://localhost:5000/#admin` (PIN: `admin123`)

---

## 🌐 Saytni 24/7 internetda bepul chiqarish va `sharbox.uz` domenini ulash

Instagram bio havolasiga qo'yish uchun quyidagi qadamlar:

### Variant 1: Render.com (Eng qulay va bepul)
1. GitHub da yangi bepul repozitoriy ochib, ushbu papkadagi kodlarni yuklang.
2. [Render.com](https://render.com) ga kiring va **"New Web Service"** tugmasini bosing.
3. GitHub repozitoriyangizni tanlang:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Render sizga bepul `https://sharbox.onrender.com` havolasini beradi. Buni darhol Instagram bio ga qo'ysangiz bo'ladi!
5. Keyinroq `sharbox.uz` domenini sotib olganingizda, Render sozlamalaridagi **"Custom Domains"** bo'limiga `sharbox.uz` deb yozib, DNS yozuvlarini yo'naltirasiz.

### Variant 2: Railway.app yoki VPS (Ubuntu + PM2)
Kichik VPS server (masalan, Uzinfocom yoki chet el hosting) olib:
```bash
git clone <repo_url>
cd sharbox-uz
npm install
npm run build
pm2 start server/index.js --name "sharbox"
```
Nginx orqali `sharbox.uz` domeniga SSL sertifikat (HTTPS) ulanadi.
