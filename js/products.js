/* ============================================================
   products.js — Product Data & Rendering
   ============================================================ */

// ── DEFAULT PRODUCT CATALOG ──
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
  { id: 12, name: 'Yoga Mat — Premium 6mm', cat: 'Fitness', price: 999, old: null, emoji: '🧘', desc: 'Non-slip surface with alignment lines and carrying strap.', stock: 70, status: 'active' }
];

// ── LOAD PRODUCTS FROM LOCALSTORAGE (syncs with Admin panel) ──
const PRODUCTS_STORAGE_KEY = 'shopease_products';
let PRODUCTS = (function () {
  const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (raw) {
    // Only show active products on the storefront
    return JSON.parse(raw).filter(p => p.status !== 'archived' && p.status !== 'draft');
  }
  // First visit — save defaults & return
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
})();

// ── ACTIVE CATEGORY FILTER ──
let activeCat = '';

// ── RENDER CATEGORY PILLS ──
function renderCats() {
  const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
  document.getElementById('catBar').innerHTML = cats.map(c =>
    `<button class="cat-pill${(c === 'All' && !activeCat) || (c === activeCat) ? ' active' : ''}" 
      onclick="filterCat('${c === 'All' ? '' : c}')">${c}</button>`
  ).join('');
}

// ── FILTER BY CATEGORY ──
function filterCat(c) {
  activeCat = c;
  renderCats();
  renderProducts();
}

// ── RENDER PRODUCT GRID ──
function renderProducts() {
  const list = activeCat ? PRODUCTS.filter(p => p.cat === activeCat) : PRODUCTS;
  document.getElementById('resultCount').textContent = list.length + ' product' + (list.length !== 1 ? 's' : '');

  document.getElementById('productsGrid').innerHTML = list.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    return `<div class="product">
      <div class="product-img">
        ${p.tag ? `<div class="tag">${p.tag}</div>` : ''}
        <span>${p.emoji}</span>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-bottom">
          <div class="product-price">
            ₹${p.price.toLocaleString()}${p.old ? `<span class="old">₹${p.old.toLocaleString()}</span>` : ''}
          </div>
          <button class="add-btn${inCart ? ' added' : ''}" onclick="event.stopPropagation();addToCart(${p.id})">
            ${inCart ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}
