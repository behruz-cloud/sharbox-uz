# 🎁 sharbox.uz — Qo'l mehnati sovg'a bokslari va sharlar e-commerce platformasi

Instagram va Telegram orqali savdo qiluvchi brendlar uchun maxsus yaratilgan zamonaviy, yengil, tezkor va 24/7 ishlovchi internet-do'kon.

---

## 🌟 Asosiy imkoniyatlar

1. **Wireframe asosidagi dizayn**:
   - **Header**: Brend logotipi (`sharbox.uz`), mahsulot qidiruvi, Sevimlilar (❤️), Savat (🛒), Admin sahifaga o'tish, **Tun/Kun rejimi (🌙/☀️)** tugmasi.
   - **REKLAMA Banner**: Aksiya va mavsumiy chegirmalar, sovg'a bokslari afzalliklari.
   - **Kategoriyalar filtri**: Barcha, Romantika, Tug'ilgan kun, Shirinliklar, Erkaklar uchun, VIP to'plamlar.
   - **Mahsulot kartochkasi**:
     - Bir nechta rasm va nuqtalar (`o o o`) orqali rasmlarni almashtirish;
     - Quti ichida nimalar borligi (Tarkibi) ko'rsatilgan teglari;
     - Eski narx (ustidan chizilgan) va Hozirgi narx, chegirma foizi;
     - Sevimlilarga qo'shish (❤️);
     - Savatga qo'shish tugmasi (`add_basket`).

2. **Mobil (iPhone & Android) uchun maxsus qulayliklar**:
   - Pastki **Bottom Navigation Bar** (Katalog, Qidiruv, Sevimlilar, Savat, Tun/Kun rejimi);
   - iPhone pastki sensor chizig'i (Safe Area) moslashuvi;
   - Instagram In-App brauzeriga to'liq moslik.

3. **Batafsil ko'rish (Mahsulot modali)**:
   - Katta formatdagi fotogalereya;
   - Qutining to'liq tarkibi (Checklist formatida);
   - Soni (dona) tanlash;
   - Bir bosishda Telegram orqali xodimdan so'rash yoki savatga qo'shish.

4. **Savat va Qo'shimchalar (Extras)**:
   - Mahsulotlar sonini o'zgartirish (+ / -);
   - **Qo'shimcha narsalar qo'shish**:
     - 💌 Tabriknomaga samimiy so'zlar yozish (erkin matn kiritish);
     - 🎈 Geliy sharlar to'plami (+35,000 so'm);
     - 💖 Katta foliyali yurakcha shari (+25,000 so'm);
     - 🍫 Qo'shimcha shirinliklar jamlanmasi (+40,000 so'm);
     - 🤫 Anonim syurpriz yetkazib berish (bepul).
   - Mijoz ma'lumotlari: Telefon raqami, Ismi, Yetkazib berish manzili va vaqti.

5. **🚀 Telegram orqali xodimga buyurtma yuborish**:
   - Buyurtma rasmiylashtirilganda barcha tanlangan bokslar, soni, tarkibi, qo'shimcha sovg'alar va manzil chiroyli formatlangan Telegram xabariga aylanadi.
   - Avtomatik `https://t.me/sharbox_manager?text=...` havolasi ochiladi va mijoz bitta "Send" tugmasini bosishi kifoya qiladi!
   - Xodim zaklad to'lovi rekvizitlarini tashlab, buyurtmani tasdiqlaydi.
   - Buyurtma darhol tizim ma'lumotlar bazasida va Admin panelda saqlanadi.

6. **🔐 Alohida Admin sahifa (`/admin` yoki `#admin`)**:
   - PIN kod bilan himoyalangan (standart: `admin123`, sozlamalarda o'zgartirish mumkin);
   - **Mahsulotlar**: Yangi boks qo'shish, rasmlarni yuklash (fayl yoki URL), narxlarni belgilash, ichidagi narsalarni kiritish, tahrirlash, o'chirish;
   - **Kategoriyalar**: Yangi toifalar yaratish va boshqarish;
   - **Reklama banneri**: Asosiy sahifadagi reklama matni va chegirmalarni o'zgartirish;
   - **Buyurtmalar**: Barcha mijoz buyurtmalari ro'yxati, mijoz raqamlari, buyurtma holatlari (Yangi, Zaklad kutilmoqda, Yetkazilmoqda, Yakunlandi);
   - **Sozlamalar**: Xodim Telegram foydalanuvchi nomi (`@username`), telefon, Instagram username va admin parolini o'zgartirish.

---

## 🚀 Loyihani kompyuterda ishga tushirish

Papkadagi [`start_sharbox.bat`](start_sharbox.bat) faylini ikki marta bosing, yoki terminalda:
```powershell
cd C:\Users\user\.gemini\antigravity\scratch\sharbox-uz
npm start
```

Brauzerda:
- **Asosiy sayt**: `http://localhost:5000`
- **Admin panel**: `http://localhost:5000/#admin` (PIN: `admin123`)

---

## 🌐 Saytni 24/7 internetda bepul chiqarish va `sharbox.uz` domenini ulash

Loyiha GitHub repozitoriyangizga ulandi:
`https://github.com/behruz-cloud/sharbox-uz.git`

### 1. GitHub ga kodlarni push qilish
Loyihangiz papkasidagi [`push_to_github.bat`](push_to_github.bat) faylini bosing. U kodlarni GitHub repozitoriyangizga yuboradi.

### 2. Render.com da 24/7 bepul server yoqish
1. [Render.com](https://render.com) ga kiring va GitHub orqali ro'yxatdan o'ting.
2. **"New" -> "Web Service"** tugmasini bosing.
3. `behruz-cloud/sharbox-uz` repozitoriyasini tanlang:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. **"Deploy Web Service"** tugmasini bosing. 1 daqiqada saytingiz 24/7 ishlaydigan bo'ladi!

### 3. `sharbox.uz` domenini ulash
1. Eskiz.uz yoki Regos.uz dan `sharbox.uz` domenini olasiz.
2. Render sozlamalaridagi **Custom Domains** bo'limiga `sharbox.uz` ni yozib, DNS ni yo'naltirasiz.
3. Render bepul SSL sertifikat (HTTPS) beradi va sayt `https://sharbox.uz` bo'lib ishlaydi!
