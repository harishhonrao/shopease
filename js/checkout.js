/* ============================================================
   checkout.js — Checkout & Order Logic
   ============================================================ */

// ── PAGE NAVIGATION ──
function showPage(page) {
  document.getElementById('shopPage').className = page === 'shop' ? 'shop-page' : 'shop-page hidden';
  document.getElementById('heroSection').style.display = page === 'shop' ? '' : 'none';
  document.getElementById('checkoutPage').className = page === 'checkout' ? 'checkout-page active' : 'checkout-page';
  document.getElementById('successPage').className = page === 'success' ? 'success-page active' : 'success-page';
}

function goShop() {
  showPage('shop');
  closeCart();
}

// ── GO TO CHECKOUT ──
function goCheckout() {
  if (!cart.length) {
    toast('Cart is empty!');
    return;
  }
  closeCart();
  showPage('checkout');

  const total = getTotal();
  const shipping = getShipping(total);

  document.getElementById('orderSummary').innerHTML =
    cart.map(c =>
      `<div class="os-item">
        <span>${c.name} &times; ${c.qty}</span>
        <span>₹${(c.price * c.qty).toLocaleString()}</span>
      </div>`
    ).join('') +
    `<div class="os-item">
      <span>Shipping</span>
      <span>${shipping ? '₹' + shipping : 'Free'}</span>
    </div>` +
    `<div class="os-item os-total">
      <span>Total</span>
      <span>₹${(total + shipping).toLocaleString()}</span>
    </div>`;

  window.scrollTo(0, 0);
}

// ── VALIDATE & PLACE ORDER ──
function placeOrder() {
  const fields = [
    { id: 'cFname', name: 'First Name' },
    { id: 'cLname', name: 'Last Name' },
    { id: 'cEmail', name: 'Email' },
    { id: 'cAddress', name: 'Address' },
    { id: 'cZip', name: 'Zip Code' }
  ];

  let valid = true;

  // Validate required fields
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el.value.trim()) {
      el.classList.add('invalid');
      valid = false;
    } else {
      el.classList.remove('invalid');
    }
  });

  // Validate email format
  const email = document.getElementById('cEmail');
  if (email.value && !email.value.includes('@')) {
    email.classList.add('invalid');
    valid = false;
  }

  if (!valid) {
    toast('Please fill all required fields.');
    return;
  }

  // Generate order ID
  const orderId = 'SE-' + Date.now().toString(36).toUpperCase();

  // Save order to localStorage (syncs with Admin panel)
  const ORDERS_KEY = 'shopease_orders';
  const existingOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  existingOrders.push({
    id: orderId,
    customer: document.getElementById('cFname').value.trim() + ' ' + document.getElementById('cLname').value.trim(),
    email: document.getElementById('cEmail').value.trim(),
    address: document.getElementById('cAddress').value.trim(),
    items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
    total: getTotal() + getShipping(getTotal()),
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });
  localStorage.setItem(ORDERS_KEY, JSON.stringify(existingOrders));

  // Clear cart
  cart = [];
  updateCart();
  renderProducts();

  // Show success
  showPage('success');
  document.getElementById('orderIdDisplay').textContent = 'Order ID: ' + orderId;
  window.scrollTo(0, 0);
}

// ── CONTINUE SHOPPING AFTER ORDER ──
function continueShopping() {
  // Clear form fields
  ['cFname', 'cLname', 'cEmail', 'cAddress', 'cPhone', 'cZip'].forEach(id => {
    document.getElementById(id).value = '';
  });
  showPage('shop');
}
