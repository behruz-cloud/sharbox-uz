const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { readDb, writeDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup Multer for image uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Faqat rasm fayllari qabul qilinadi'));
    }
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// --- API ROUTES ---

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Rasm fayli topilmadi' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});

// Settings
app.get('/api/settings', (req, res) => {
  const db = readDb();
  // Don't leak admin pin to public
  const { adminPin, ...publicSettings } = db.settings;
  res.json(publicSettings);
});

app.put('/api/settings', (req, res) => {
  const { adminPin, settings } = req.body;
  const db = readDb();
  if (adminPin !== db.settings.adminPin) {
    return res.status(403).json({ error: "Noto'g'ri admin paroli" });
  }
  db.settings = { ...db.settings, ...settings };
  writeDb(db);
  const { adminPin: _, ...safeSettings } = db.settings;
  res.json({ success: true, settings: safeSettings });
});

// Admin Auth
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body;
  const db = readDb();
  if (pin && pin === db.settings.adminPin) {
    res.json({ success: true, message: 'Kirish muvaffaqiyatli' });
  } else {
    res.status(401).json({ success: false, error: "Parol noto'g'ri! Qaytadan urinib ko'ring." });
  }
});

// Categories
app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json(db.categories || []);
});

app.post('/api/categories', (req, res) => {
  const { name, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom kiritilishi shart' });
  const db = readDb();
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  const newCat = { id, name, icon: icon || '🎁' };
  db.categories.push(newCat);
  writeDb(db);
  res.json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.categories = db.categories.filter(c => c.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Banners
app.get('/api/banners', (req, res) => {
  const db = readDb();
  res.json(db.banners || []);
});

app.put('/api/banners', (req, res) => {
  const { banners } = req.body;
  const db = readDb();
  db.banners = banners;
  writeDb(db);
  res.json({ success: true, banners });
});

// Extras
app.get('/api/extras', (req, res) => {
  const db = readDb();
  res.json(db.extras || []);
});

// Products
app.get('/api/products', (req, res) => {
  const db = readDb();
  let list = db.products || [];
  const { category, search } = req.query;

  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.contents && p.contents.some(c => c.toLowerCase().includes(q)))
    );
  }

  res.json(list);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Mahsulot topilmadi' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const db = readDb();
  const { name, category, price, oldPrice, images, description, contents, badge, inStock } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Nom va narx kiritilishi shart' });
  }

  const newProduct = {
    id: 'sb-' + Date.now(),
    name,
    category: category || 'all',
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'],
    description: description || '',
    contents: Array.isArray(contents) ? contents.filter(Boolean) : [],
    badge: badge || '',
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const db = readDb();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Mahsulot topilmadi' });

  const current = db.products[index];
  const { name, category, price, oldPrice, images, description, contents, badge, inStock } = req.body;

  db.products[index] = {
    ...current,
    name: name !== undefined ? name : current.name,
    category: category !== undefined ? category : current.category,
    price: price !== undefined ? Number(price) : current.price,
    oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : current.oldPrice,
    images: Array.isArray(images) ? images : current.images,
    description: description !== undefined ? description : current.description,
    contents: Array.isArray(contents) ? contents.filter(Boolean) : current.contents,
    badge: badge !== undefined ? badge : current.badge,
    inStock: inStock !== undefined ? Boolean(inStock) : current.inStock,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDb();
  db.products = db.products.filter(p => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// Orders
app.get('/api/orders', (req, res) => {
  const db = readDb();
  res.json(db.orders || []);
});

app.post('/api/orders', async (req, res) => {
  const db = readDb();
  const { customer, items, extras, note, totalAmount } = req.body;

  if (!customer || !customer.phone || !items || !items.length) {
    return res.status(400).json({ error: 'Mijoz ma\'lumotlari va mahsulotlar to\'liq emas' });
  }

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId,
    customer,
    items,
    extras: extras || [],
    note: note || '',
    totalAmount: Number(totalAmount) || 0,
    status: 'Yangi', // Yangi | Zaklad kutilmoqda | Yetkazilmoqda | Yakunlandi | Bekor qilindi
    createdAt: new Date().toISOString()
  };

  if (!db.orders) db.orders = [];
  db.orders.unshift(newOrder);
  writeDb(db);

  // Construct structured Telegram message
  let tgMessage = `📦 YANGI BUYURTMA #${orderId} | sharbox.uz\n`;
  tgMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
  tgMessage += `👤 Mijoz: ${customer.name || "Noma'lum"}\n`;
  tgMessage += `📞 Telefon: ${customer.phone}\n`;
  if (customer.address) {
    tgMessage += `📍 Manzil: ${customer.address}\n`;
  }
  if (customer.deliveryDate) {
    tgMessage += `📅 Yetkazish vaqti: ${customer.deliveryDate}\n`;
  }
  tgMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
  tgMessage += `🛍️ MAHSULOTLAR:\n`;

  items.forEach((item, idx) => {
    tgMessage += `${idx + 1}. ${item.name} (${item.quantity} dona) - ${(item.price * item.quantity).toLocaleString('uz-UZ')} so'm\n`;
    if (item.contents && item.contents.length) {
      tgMessage += `   • Tarkibi: ${item.contents.slice(0, 3).join(', ')}...\n`;
    }
  });

  if (extras && extras.length) {
    tgMessage += `\n🎁 QO'SHIMCHA ISTAKLAR:\n`;
    extras.forEach(ex => {
      tgMessage += `➕ ${ex.name}${ex.price ? ` (+${Number(ex.price).toLocaleString('uz-UZ')} so'm)` : ''}\n`;
      if (ex.userText) {
        tgMessage += `   💬 Matn: "${ex.userText}"\n`;
      }
    });
  }

  if (note) {
    tgMessage += `\n📝 Izoh / Istak: ${note}\n`;
  }

  tgMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
  tgMessage += `💰 JAMI SUMMA: ${Number(totalAmount).toLocaleString('uz-UZ')} so'm\n`;
  tgMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
  tgMessage += `Assalomu alaykum! Ushbu buyurtmani rasmiylashtirmoqchiman. Zaklad to'lovi va yetkazib berish bo'yicha ma'lumot bersangiz!`;

  const manager = db.settings.telegramManager ? db.settings.telegramManager.replace('@', '') : 'sharbox_manager';
  const telegramUrl = `https://t.me/${manager}?text=${encodeURIComponent(tgMessage)}`;

  // Optional Telegram Bot notification push if bot token & chat id exist
  if (db.settings.telegramBotToken && db.settings.telegramChatId) {
    try {
      fetch(`https://api.telegram.org/bot${db.settings.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: db.settings.telegramChatId,
          text: tgMessage
        })
      }).catch(e => console.error('Bot notify error:', e.message));
    } catch (e) {
      // ignore bot push fail
    }
  }

  res.status(201).json({
    success: true,
    orderId,
    telegramUrl,
    telegramMessage: tgMessage
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const db = readDb();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Buyurtma topilmadi' });
  order.status = status;
  writeDb(db);
  res.json({ success: true, order });
});

// Serve frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 sharbox.uz server is running on http://localhost:${PORT}`);
});
