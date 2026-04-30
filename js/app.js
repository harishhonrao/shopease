/* ============================================================
   app.js — App Initialization & Utility Functions
   ============================================================ */

// ── TOAST NOTIFICATION ──
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── INITIALIZE APP ──
function init() {
  renderCats();
  renderProducts();
  updateCart();
  console.log('ShopEase initialized with ' + PRODUCTS.length + ' products.');
}

// Run on page load
init();
