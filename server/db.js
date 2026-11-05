const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');
const BACKUP_FILE = path.join(__dirname, 'database.backup.json');
const ARCHIVE_FILE = path.join(__dirname, 'orders_archive.jsonl');

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

// Reconcile orders from immutable archive if any are missing
function reconcileOrdersFromArchive(orders) {
  if (!fs.existsSync(ARCHIVE_FILE)) return orders;
  try {
    const raw = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
    const lines = raw.split('\n').filter(Boolean);
    const existingIds = new Set((orders || []).map(o => o.id));
    const merged = [...(orders || [])];

    lines.forEach(line => {
      try {
        const order = JSON.parse(line);
        if (order && order.id && !existingIds.has(order.id)) {
          merged.push(order);
          existingIds.add(order.id);
        }
      } catch (e) {}
    });

    // Sort newest first
    merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return merged;
  } catch (err) {
    console.error('Error reconciling archive orders:', err);
    return orders;
  }
}

function readDb() {
  let data = null;

  // Try reading primary DB
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      data = JSON.parse(raw);
    } catch (err) {
      console.error('Warning: primary DB corrupt or unreadable, trying backup...', err.message);
    }
  }

  // Fallback to backup if primary failed or does not exist
  if (!data && fs.existsSync(BACKUP_FILE)) {
    try {
      const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
      data = JSON.parse(raw);
      console.log('Restored database from backup file.');
    } catch (err) {
      console.error('Error reading backup file:', err.message);
    }
  }

  // Fallback to default
  if (!data) {
    data = defaultData;
    writeDb(data);
    return data;
  }

  // Deep-merge settings
  const mergedSettings = { ...defaultData.settings, ...(data.settings || {}) };
  const merged = {
    ...defaultData,
    ...data,
    settings: mergedSettings,
    categories: Array.isArray(data.categories) && data.categories.length ? data.categories : defaultData.categories,
    products: Array.isArray(data.products) && data.products.length ? data.products : defaultData.products,
    banners: Array.isArray(data.banners) && data.banners.length ? data.banners : defaultData.banners,
    orders: reconcileOrdersFromArchive(data.orders || [])
  };

  return merged;
}

function writeDb(data) {
  try {
    const content = JSON.stringify(data, null, 2);
    const tmpFile = `${DB_FILE}.${Date.now()}-${Math.random().toString(36).substring(7)}.tmp`;

    // 1. Write to temp file and sync to disk
    const fd = fs.openSync(tmpFile, 'w');
    fs.writeSync(fd, content, 0, 'utf-8');
    fs.fsyncSync(fd);
    fs.closeSync(fd);

    // 2. Atomic rename to primary DB
    fs.renameSync(tmpFile, DB_FILE);

    // 3. Keep backup copy updated
    try {
      fs.writeFileSync(BACKUP_FILE, content, 'utf-8');
    } catch (bErr) {
      // Non-fatal
    }
  } catch (err) {
    console.error('CRITICAL: writeDb failed:', err);
    throw err;
  }
}

// Immutable append-only log for every single order placed
function archiveOrder(order) {
  try {
    const line = JSON.stringify(order) + '\n';
    fs.appendFileSync(ARCHIVE_FILE, line, 'utf-8');
  } catch (err) {
    console.error('Error writing to order archive:', err);
  }
}

module.exports = {
  readDb,
  writeDb,
  archiveOrder
};
