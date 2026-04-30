/* ============================================================
   cart.js — Shopping Cart Logic
   ============================================================ */

let cart = [];

// ── ADD ITEM TO CART ──
function addToCart(id) {
  const exist = cart.find(c => c.id === id);
  if (exist) {
    exist.qty++;
  } else {
    const p = PRODUCTS.find(x => x.id === id);
    cart.push({ ...p, qty: 1 });
  }
  updateCart();
  renderProducts();
  toast('Added to cart!');
}

// ── REMOVE ITEM FROM CART ──
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
  renderProducts();
}

// ── CHANGE ITEM QUANTITY ──
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) return removeFromCart(id);
  updateCart();
}

// ── CALCULATE CART TOTAL ──
function getTotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

// ── CALCULATE TOTAL ITEM COUNT ──
function getCount() {
  return cart.reduce((sum, c) => sum + c.qty, 0);
}

// ── CALCULATE SHIPPING ──
function getShipping(total) {
  return total > 999 ? 0 : 99;
}

// ── UPDATE CART UI ──
function updateCart() {
  document.getElementById('cartCount').textContent = getCount();

  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="bag">🛒</div>
        <div>Your cart is empty</div>
        <div style="font-size:.8rem">Browse products and add items!</div>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="ci-img">${c.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${c.name}</div>
        <div class="ci-price">₹${c.price.toLocaleString()} each</div>
        <div class="ci-controls">
          <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
          <span class="ci-qty">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
          <button class="ci-remove" onclick="removeFromCart(${c.id})">Remove</button>
        </div>
      </div>
    </div>`).join('');

  const total = getTotal();
  const shipping = getShipping(total);

  footer.innerHTML = `
    <div class="cart-row"><span>Subtotal</span><span>₹${total.toLocaleString()}</span></div>
    <div class="cart-row"><span>Shipping</span><span>${shipping ? '₹' + shipping : 'Free'}</span></div>
    <div class="cart-row total"><span>Total</span><span>₹${(total + shipping).toLocaleString()}</span></div>
    <button class="checkout-btn" onclick="goCheckout()"${!cart.length ? ' disabled' : ''}>Proceed to Checkout</button>`;
}

// ── OPEN / CLOSE CART SIDEBAR ──
function openCart() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('cartPanel').classList.add('open');
}

function closeCart() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('cartPanel').classList.remove('open');
}
