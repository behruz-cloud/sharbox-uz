const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

const defaultData = {
  settings: {
    shopName: "sharbox.uz",
    telegramManager: "sharbox_manager", // t.me username without @
    phone: "+998 90 123 45 67",
    instagram: "sharbox.uz",
    announcement: "🎉 Barcha bayramona bokslarimizga 20% gacha maxsus chegirmalar!",
    deliveryNotice: "Toshkent shahri va barcha viloyatlarga yetkazib beramiz. Buyurtma berilgach xodimimiz siz bilan bog'lanib zaklad to'lovini qabul qiladi va yetkazib berish vaqtini kelishadi.",
    adminPin: "admin123",
    telegramBotToken: "",
    telegramChatId: ""
  },
  categories: [
    { id: "all", name: "Barchasi" },
    { id: "romantika", name: "❤️ Romantika" },
    { id: "birthday", name: "🎂 Tug'ilgan kun" },
    { id: "sweets", name: "🍫 Shirinliklar" },
    { id: "men", name: "🎩 Erkaklar uchun" },
    { id: "vip", name: "👑 VIP to'plamlar" }
  ],
  banners: [
    {
      id: "b-1",
      title: "sharbox.uz — Har Bir Qutida Quvonch Va Mehr!",
      subtitle: "Qo'l mehnati bilan tayyorlangan eksklyuziv sovg'a bokslari va estetik sharlar to'plami. Yaqinlaringizni lol qoldiring!",
      badge: "🎁 YANGI TO'PLAM",
      gradient: "from-rose-500 via-pink-600 to-amber-500",
      ctaText: "Mahsulotlarni ko'rish",
      active: true
    }
  ],
  extras: [
    { id: "ex-card", name: "Tabriknomaga samimiy yozuv yozish", price: 0, requiredText: true, placeholder: "Tabriknomaga yoziladigan matn..." },
    { id: "ex-heliumballoons", name: "5 dona rang-barang geliy sharlar", price: 35000 },
    { id: "ex-heartballoon", name: "Katta foliyali yurakcha shari", price: 25000 },
    { id: "ex-sweets", name: "Qo'shimcha Kinder / Raffaello shirinliklari", price: 40000 },
    { id: "ex-anon", name: "Anonim syurpriz (yetkazuvchi sizning ismingizni sir tutadi)", price: 0 }
  ],
  products: [
    {
      id: "sb-1",
      name: "Romantic Red Lux Box",
      category: "romantika",
      price: 290000,
      oldPrice: 360000,
      badge: "🔥 Xit savdo",
      inStock: true,
      description: "Sevimli insoningiz uchun maxsus qo'lda tayyorlangan romantik sovg'a qutisi. Ichida premium gullar va shirinliklar mavjud.",
      contents: [
        "11 dona qizil tabiiy hidli atirgullar",
        "Ferrero Rocher premium shokoladlari (8 dona)",
        "Oq rangli mayin yumshoq ayiqcha (20 sm)",
        "Eksklyuziv qo'lda yozilgan tabriknoma",
        "Qizil atlas lentalik premium sovg'a qutisi"
      ],
      images: [
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "sb-2",
      name: "Kinder Surprise Mega Box",
      category: "sweets",
      price: 220000,
      oldPrice: 280000,
      badge: "⭐ Bolalar va Kattalarga",
      inStock: true,
      description: "Bolalar va shirinlik sevuvchilar uchun eng mashhur va sevimli Kinder shokoladlarining to'plami.",
      contents: [
        "5 dona Kinder Joy tuxumchalari",
        "3 dona Kinder Bueno batonchasi",
        "Kinder Maxi shokoladlari (6 dona)",
        "Nutella mini shisha bankacha",
        "Yorqin bayramona bezatilgan quti"
      ],
      images: [
        "https://images.unsplash.com/photo-1575384043001-f37f49574167?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "sb-3",
      name: "Tug'ilgan Kun Sharlar & Boks",
      category: "birthday",
      price: 340000,
      oldPrice: 420000,
      badge: "🎉 Bayramona",
      inStock: true,
      description: "Tug'ilgan kun quvonchini ikki karra oshiruvchi jilvakor sharlar va syurprizli sovg'a boksi.",
      contents: [
        "Xromli va yaltiroq geliy sharlar (5 dona)",
        "Raffaello qutisi (150g)",
        "Estetik mini atirgul guldastasi",
        "Yorug'likli LED simchalar bilan bezak",
        "Maxsus 'Happy Birthday' tabriknomasi"
      ],
      images: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "sb-4",
      name: "Gentleman Black Edition",
      category: "men",
      price: 310000,
      oldPrice: 390000,
      badge: "💼 Erkaklar uchun",
      inStock: true,
      description: "Haqiqiy erkaklar uchun uslubiy va jiddiy sovg'a to'plami. Qora mat rangli nafis dizayn.",
      contents: [
        "Charm hamyon / kartxolder",
        "Klassik qora ruchka va bloknot",
        "Ritter Sport qora shokoladlari (2 dona)",
        "Qora matli premium quti va atlas tasma"
      ],
      images: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "sb-5",
      name: "Pink Pastel Dream Box",
      category: "romantika",
      price: 260000,
      oldPrice: 320000,
      badge: "-18% Chegirma",
      inStock: true,
      description: "Pushti va oq ohanglardagi nozik va estetik sovg'a qutisi. Qizlar va opalar uchun ajoyib tanlov.",
      contents: [
        "Hushbo'y sovunli pushti gullar to'plami",
        "Strawberry marshmallow va shirinliklar",
        "Yurakcha shaklidagi mini yostiqcha",
        "Chiroyli atlas lenta va tabriknoma"
      ],
      images: [
        "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: "sb-6",
      name: "VIP Golden Celebration",
      category: "vip",
      price: 490000,
      oldPrice: 590000,
      badge: "👑 VIP Eksklyuziv",
      inStock: true,
      description: "Eng nufuzli va yuksak did egalari uchun tilla va qora ohanglardagi hashamatli sovg'a.",
      contents: [
        "Katta o'lchamli qora-oltin premium quti",
        "Ferrero Rocher oltin piramidasi",
        "Tilla rangli geliy sharlar to'plami",
        "Eksklyuziv xushbo'y tana suti va atir",
        "Lazer bilan o'yilgan shaxsiy tabriknoma"
      ],
      images: [
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80"
      ],
      createdAt: new Date().toISOString()
    }
  ],
  orders: []
};

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return { ...defaultData, ...data };
  } catch (err) {
    console.error('Error reading db, using defaults:', err);
    return defaultData;
  }
}

function writeDb(data) {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

module.exports = {
  readDb,
  writeDb
};
