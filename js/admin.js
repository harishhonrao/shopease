/* ============================================================
   admin.js — Admin Dashboard Logic
   ============================================================ */

// ── STORAGE KEYS ──
const PRODUCTS_KEY = 'shopease_products';
const ORDERS_KEY = 'shopease_orders';
const SETTINGS_KEY = 'shopease_settings';
const CREDS_KEY = 'shopease_creds';
const AUTH_KEY = 'shopease_auth';

// ── DEFAULT PRODUCTS ──
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Wireless Bluetooth Earbuds', cat: 'Electronics', price: 1499, old: 2499, emoji: '🎧', desc: 'Crystal-clear sound with 24hr battery life and noise cancellation.', tag: 'Sale', stock: 45, status: 'active' },
  { id: 2, name: 'Organic Cotton T-Shirt', cat: 'Clothing', price: 799, old: null, emoji: '👕', desc: '100% organic cotton, breathable and comfortable for daily wear.', stock: 120, status: 'active' },
  { id: 3, name: 'Stainless Steel Water Bottle', cat: 'Home', price: 599, old: 899, emoji: '🍶', desc: 'Double-walled insulation keeps drinks cold 24hrs or hot 12hrs.', tag: 'Popular', stock: 80, status: 'active' },
  { id: 4, name: 'Leather Notebook Journal', cat: 'Stationery', price: 349, old: null, emoji: '📓', desc: 'Handcrafted leather cover with 200 acid-free lined pages.', stock: 60, status: 'active' },
  { id: 5, name: 'USB-C Fast Charger 65W', cat: 'Electronics', price: 1299, old: 1899, emoji: '🔌', desc: 'GaN technology charges laptop and phone simultaneously.', tag: 'Sale', stock: 35, status: 'active' },
  { id: 6, name: 'Running Shoes — Ultralight', cat: 'Footwear', price: 2999, old: 4499, emoji: '👟', desc: 'Featherweight mesh upper with responsive foam cushioning.', tag: 'Trending', stock: 25, status: 'active' },
  { id: 7, name: 'Cast Iron Skillet 10"', cat: 'Home', price: 1199, old: null, emoji: '🍳', desc: 'Pre-seasoned and ready to use. Perfect heat distribution.', stock: 40, status: 'active' },
  { id: 8, name: 'Backpack — Daily Commuter', cat: 'Accessories', price: 1799, old: 2299, emoji: '🎒', desc: 'Water-resistant with padded laptop compartment and USB port.', stock: 30, status: 'active' },
  { id: 9, name: 'Desk LED Lamp — Dimmable', cat: 'Home', price: 899, old: null, emoji: '💡', desc: 'Touch-controlled with 5 brightness levels and warm/cool modes.', stock: 55, status: 'active' },
  { id: 10, name: 'Sunscreen SPF 50+', cat: 'Beauty', price: 449, old: 599, emoji: '🧴', desc: 'Lightweight, non-greasy formula with PA++++ protection.', stock: 90, status: 'active' },
  { id: 11, name: 'Mechanical Keyboard', cat: 'Electronics', price: 3499, old: 4999, emoji: '⌨️', desc: 'Hot-swappable switches, RGB backlit, premium build quality.', tag: 'Sale', stock: 20, status: 'active' },
  { id: 12, name: 'Yoga Mat — Premium 6mm', cat: 'Fitness', price: 999, old: null, emoji: '🧘', desc: 'Non-slip surface with alignment lines and carrying strap.', stock: 70, status: 'active' },
];

// ── SAMPLE ORDERS ──
const DEFAULT_ORDERS = [
  { id: 'SE-ORD001', customer: 'Rahul Sharma', email: 'rahul@email.com', items: [{ name: 'Wireless Bluetooth Earbuds', qty: 1, price: 1499 }, { name: 'USB-C Fast Charger 65W', qty: 1, price: 1299 }], total: 2798, date: '2026-04-28', status: 'Delivered', address: '45 MG Road, Pune' },
  { id: 'SE-ORD002', customer: 'Priya Patel', email: 'priya@email.com', items: [{ name: 'Running Shoes — Ultralight', qty: 1, price: 2999 }], total: 2999, date: '2026-04-29', status: 'Shipped', address: '12 FC Road, Pune' },
  { id: 'SE-ORD003', customer: 'Amit Singh', email: 'amit@email.com', items: [{ name: 'Mechanical Keyboard', qty: 1, price: 3499 }, { name: 'Desk LED Lamp — Dimmable', qty: 2, price: 899 }], total: 5297, date: '2026-04-30', status: 'Pending', address: '78 Kothrud, Pune' },
  { id: 'SE-ORD004', customer: 'Sneha Joshi', email: 'sneha@email.com', items: [{ name: 'Yoga Mat — Premium 6mm', qty: 1, price: 999 }, { name: 'Stainless Steel Water Bottle', qty: 2, price: 599 }], total: 2197, date: '2026-04-27', status: 'Delivered', address: '23 Baner Road, Pune' },
  { id: 'SE-ORD005', customer: 'Karan Mehta', email: 'karan@email.com', items: [{ name: 'Backpack — Daily Commuter', qty: 1, price: 1799 }], total: 1799, date: '2026-04-30', status: 'Pending', address: '56 Hinjewadi, Pune' },
];

// ── STATE ──
let products = [];
let orders = [];
let editProductId = null;

// ── HELPERS ──
function loadData(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2500);
}
function nextId() { return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1; }


/* =============================================================
   LOGIN / AUTH
   ============================================================= */
function getCredentials() {
  return loadData(CREDS_KEY, { username: 'admin', password: 'admin123' });
}

function handleLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const creds = getCredentials();

  if (user === creds.username && pass === creds.password) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    initAdmin();
  } else {
    document.getElementById('loginError').textContent = 'Invalid username or password.';
  }
}

function handleLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
}

function checkAuth() {
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    initAdmin();
  }
}

// Enter key on login
document.getElementById('loginPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});
document.getElementById('loginUser').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('loginPass').focus();
});


/* =============================================================
   PAGE NAVIGATION
   ============================================================= */
function switchPage(page, btn) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.sb-link').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('pageTitle').textContent =
    page.charAt(0).toUpperCase() + page.slice(1);

  if (page === 'dashboard') renderDashboard();
  if (page === 'products') renderAdminProducts();
  if (page === 'orders') renderOrders();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}


/* =============================================================
   DASHBOARD
   ============================================================= */
function renderDashboard() {
  document.getElementById('dTotal').textContent = products.length;
  document.getElementById('dOrders').textContent = orders.length;
  const rev = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  document.getElementById('dRevenue').textContent = '₹' + rev.toLocaleString();
  document.getElementById('dCategories').textContent = new Set(products.map(p => p.cat)).size;

  // Recent orders
  const recent = [...orders].reverse().slice(0, 5);
  document.getElementById('recentOrders').innerHTML = recent.length ?
    recent.map(o => `<div class="mini-row">
      <span><strong>${o.id}</strong> — ${o.customer}</span>
      <span class="status-badge status-${o.status}">${o.status}</span>
    </div>`).join('') : '<p style="color:var(--text3);font-size:.82rem">No orders yet.</p>';

  // Low stock
  const low = products.filter(p => (p.stock || 0) < 30).sort((a, b) => (a.stock || 0) - (b.stock || 0));
  document.getElementById('lowStock').innerHTML = low.length ?
    low.map(p => `<div class="mini-row">
      <span>${p.emoji} ${p.name}</span>
      <span style="color:#c74a4a;font-weight:500">${p.stock || 0} left</span>
    </div>`).join('') : '<p style="color:var(--text3);font-size:.82rem">All stocked up!</p>';
}


/* =============================================================
   PRODUCTS MANAGEMENT
   ============================================================= */
function renderAdminProducts() {
  const q = (document.getElementById('prodSearch').value || '').toLowerCase();
  const catF = document.getElementById('prodCatFilter').value;

  // Update category filter options
  const cats = [...new Set(products.map(p => p.cat))].sort();
  const curCat = document.getElementById('prodCatFilter').value;
  document.getElementById('prodCatFilter').innerHTML =
    '<option value="">All Categories</option>' +
    cats.map(c => `<option${c === curCat ? ' selected' : ''}>${c}</option>`).join('');

  let filtered = products;
  if (q) filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  if (catF) filtered = filtered.filter(p => p.cat === catF);

  document.getElementById('prodTbody').innerHTML = filtered.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td>
        <div class="product-cell">
          <div class="prod-emoji">${p.emoji || '📦'}</div>
          <div>
            <div class="prod-name">${p.name}</div>
            <div style="font-size:.72rem;color:var(--text3)">${p.desc ? p.desc.slice(0, 50) + '...' : ''}</div>
          </div>
        </div>
      </td>
      <td>${p.cat}</td>
      <td>₹${p.price.toLocaleString()}</td>
      <td>${p.old ? '₹' + p.old.toLocaleString() : '—'}</td>
      <td>${p.stock !== undefined ? p.stock : '—'}</td>
      <td><span class="status-badge status-${p.status || 'active'}">${p.status || 'active'}</span></td>
      <td>
        <div class="action-btns">
          <button class="act-btn" onclick="editProduct(${p.id})">✏️ Edit</button>
          <button class="act-btn" onclick="duplicateProduct(${p.id})">📋 Copy</button>
          <button class="act-btn del" onclick="deleteProduct(${p.id})">🗑️</button>
        </div>
      </td>
    </tr>`).join('');

  document.getElementById('prodFooter').textContent =
    `Showing ${filtered.length} of ${products.length} products`;
}

function openProductModal(clear = true) {
  if (clear) {
    editProductId = null;
    document.getElementById('prodModalTitle').textContent = 'Add New Product';
    ['mName', 'mPrice', 'mOldPrice', 'mDesc', 'mEmoji'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('mCat').value = '';
    document.getElementById('mStock').value = '50';
    document.getElementById('mTag').value = '';
    document.getElementById('mStatus').value = 'active';
  }
  document.getElementById('prodModal').classList.add('open');
}

function closeProductModal() {
  document.getElementById('prodModal').classList.remove('open');
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editProductId = id;
  document.getElementById('prodModalTitle').textContent = 'Edit Product #' + id;
  document.getElementById('mName').value = p.name;
  document.getElementById('mCat').value = p.cat || '';
  document.getElementById('mEmoji').value = p.emoji || '';
  document.getElementById('mPrice').value = p.price;
  document.getElementById('mOldPrice').value = p.old || '';
  document.getElementById('mStock').value = p.stock !== undefined ? p.stock : 50;
  document.getElementById('mTag').value = p.tag || '';
  document.getElementById('mDesc').value = p.desc || '';
  document.getElementById('mStatus').value = p.status || 'active';
  openProductModal(false);
}

function saveProduct() {
  const name = document.getElementById('mName').value.trim();
  const cat = document.getElementById('mCat').value;
  const emoji = document.getElementById('mEmoji').value.trim();
  const price = parseInt(document.getElementById('mPrice').value);

  if (!name || !cat || !emoji || !price || price < 1) {
    toast('Please fill Name, Category, Emoji, and valid Price.');
    return;
  }

  const oldPrice = parseInt(document.getElementById('mOldPrice').value) || null;
  const stock = parseInt(document.getElementById('mStock').value) || 0;
  const tag = document.getElementById('mTag').value || undefined;
  const desc = document.getElementById('mDesc').value.trim();
  const status = document.getElementById('mStatus').value;

  if (editProductId) {
    const idx = products.findIndex(p => p.id === editProductId);
    products[idx] = { ...products[idx], name, cat, emoji, price, old: oldPrice, stock, tag, desc, status };
    toast('Product updated!');
  } else {
    products.push({ id: nextId(), name, cat, emoji, price, old: oldPrice, stock, tag, desc, status });
    toast('Product added!');
  }

  saveData(PRODUCTS_KEY, products);
  renderAdminProducts();
  closeProductModal();
}

function deleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
  products = products.filter(x => x.id !== id);
  saveData(PRODUCTS_KEY, products);
  renderAdminProducts();
  renderDashboard();
  toast('Product deleted.');
}

function duplicateProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const copy = { ...p, id: nextId(), name: p.name + ' (Copy)', status: 'draft' };
  products.push(copy);
  saveData(PRODUCTS_KEY, products);
  renderAdminProducts();
  toast('Product duplicated as draft.');
}


/* =============================================================
   ORDERS MANAGEMENT
   ============================================================= */
function renderOrders() {
  const q = (document.getElementById('orderSearch').value || '').toLowerCase();
  const sf = document.getElementById('orderStatusFilter').value;

  let filtered = orders;
  if (q) filtered = filtered.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
  if (sf) filtered = filtered.filter(o => o.status === sf);

  document.getElementById('orderTbody').innerHTML = filtered.length ?
    filtered.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${o.items.length} item${o.items.length > 1 ? 's' : ''}</td>
        <td>₹${o.total.toLocaleString()}</td>
        <td>${o.date}</td>
        <td><span class="status-badge status-${o.status}">${o.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="act-btn" onclick="viewOrder('${o.id}')">👁️ View</button>
            <button class="act-btn" onclick="cycleOrderStatus('${o.id}')">🔄 Status</button>
            <button class="act-btn del" onclick="deleteOrder('${o.id}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('') :
    `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text3)">No orders found.</td></tr>`;
}

function viewOrder(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  document.getElementById('orderModalTitle').textContent = 'Order ' + o.id;
  document.getElementById('orderModalBody').innerHTML = `
    <div style="margin-bottom:1rem">
      <div style="font-size:.75rem;text-transform:uppercase;color:var(--text3);letter-spacing:.08em;margin-bottom:.25rem">Customer</div>
      <div style="font-weight:500">${o.customer}</div>
      <div style="font-size:.82rem;color:var(--text2)">${o.email}</div>
      <div style="font-size:.82rem;color:var(--text2)">${o.address || '—'}</div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="font-size:.75rem;text-transform:uppercase;color:var(--text3);letter-spacing:.08em;margin-bottom:.25rem">Items</div>
      ${o.items.map(i => `<div style="display:flex;justify-content:space-between;padding:.3rem 0;font-size:.85rem;border-bottom:1px solid var(--surface)">
        <span>${i.name} × ${i.qty}</span><span>₹${(i.price * i.qty).toLocaleString()}</span>
      </div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;font-weight:600;font-size:1rem;padding-top:.5rem;border-top:1px solid var(--border)">
      <span>Total</span><span>₹${o.total.toLocaleString()}</span>
    </div>
    <div style="margin-top:1rem;display:flex;gap:.5rem;align-items:center">
      <span style="font-size:.82rem;color:var(--text3)">Status:</span>
      <span class="status-badge status-${o.status}">${o.status}</span>
      <span style="font-size:.82rem;color:var(--text3);margin-left:auto">Date: ${o.date}</span>
    </div>`;
  document.getElementById('orderModal').classList.add('open');
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('open');
}

function cycleOrderStatus(id) {
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const flow = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const cur = flow.indexOf(o.status);
  o.status = flow[(cur + 1) % flow.length];
  saveData(ORDERS_KEY, orders);
  renderOrders();
  renderDashboard();
  toast(`Order ${id} → ${o.status}`);
}

function deleteOrder(id) {
  if (!confirm(`Delete order ${id}?`)) return;
  orders = orders.filter(o => o.id !== id);
  saveData(ORDERS_KEY, orders);
  renderOrders();
  renderDashboard();
  toast('Order deleted.');
}

function clearAllOrders() {
  if (!confirm('Clear ALL orders? This cannot be undone.')) return;
  orders = [];
  saveData(ORDERS_KEY, orders);
  renderOrders();
  renderDashboard();
  toast('All orders cleared.');
}


/* =============================================================
   SETTINGS
   ============================================================= */
function loadSettings() {
  const s = loadData(SETTINGS_KEY, { storeName: 'ShopEase', currency: '₹', freeShip: 999, shipFee: 99 });
  document.getElementById('setStoreName').value = s.storeName;
  document.getElementById('setCurrency').value = s.currency;
  document.getElementById('setFreeShip').value = s.freeShip;
  document.getElementById('setShipFee').value = s.shipFee;
  const c = getCredentials();
  document.getElementById('setUser').value = c.username;
}

function saveSettings() {
  const settings = {
    storeName: document.getElementById('setStoreName').value.trim() || 'ShopEase',
    currency: document.getElementById('setCurrency').value,
    freeShip: parseInt(document.getElementById('setFreeShip').value) || 999,
    shipFee: parseInt(document.getElementById('setShipFee').value) || 99,
  };
  saveData(SETTINGS_KEY, settings);
  toast('Settings saved!');
}

function updateCredentials() {
  const user = document.getElementById('setUser').value.trim();
  const pass = document.getElementById('setPass').value;
  const confirm = document.getElementById('setPassConfirm').value;

  if (!user) { toast('Username cannot be empty.'); return; }
  if (pass && pass !== confirm) { toast('Passwords do not match.'); return; }

  const creds = { username: user, password: pass || getCredentials().password };
  saveData(CREDS_KEY, creds);
  document.getElementById('setPass').value = '';
  document.getElementById('setPassConfirm').value = '';
  toast('Credentials updated!');
}

function exportData() {
  const data = {
    products,
    orders,
    settings: loadData(SETTINGS_KEY, {}),
    exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'shopease-export-' + Date.now() + '.json';
  a.click();
  toast('Data exported!');
}

function resetAllData() {
  if (!confirm('⚠️ This will delete ALL data and reset to defaults. Continue?')) return;
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(CREDS_KEY);
  location.reload();
}


/* =============================================================
   MODAL CLOSE HANDLERS
   ============================================================= */
document.getElementById('prodModal').addEventListener('click', function (e) {
  if (e.target === this) closeProductModal();
});
document.getElementById('orderModal').addEventListener('click', function (e) {
  if (e.target === this) closeOrderModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeProductModal(); closeOrderModal(); }
});


/* =============================================================
   INIT
   ============================================================= */
function initAdmin() {
  products = loadData(PRODUCTS_KEY, DEFAULT_PRODUCTS);
  orders = loadData(ORDERS_KEY, DEFAULT_ORDERS);

  // Save defaults if first time
  if (!localStorage.getItem(PRODUCTS_KEY)) saveData(PRODUCTS_KEY, products);
  if (!localStorage.getItem(ORDERS_KEY)) saveData(ORDERS_KEY, orders);

  loadSettings();
  renderDashboard();
  renderAdminProducts();
  renderOrders();
}

// Check if already logged in
checkAuth();
