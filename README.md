# ShopEase — Simple E-Commerce Web Application

A fully functional e-commerce webpage built with **HTML, CSS, and JavaScript** for a Software Testing assignment.

---

## 📁 Project Structure

```
shopease-project/
├── index.html          → Main storefront page
├── admin.html          → Admin dashboard (login required)
├── css/
│   ├── style.css       → Storefront styles
│   └── admin.css       → Admin dashboard styles
├── js/
│   ├── products.js     → Product data & rendering (syncs with admin)
│   ├── cart.js         → Cart logic (add, remove, qty, totals)
│   ├── checkout.js     → Checkout validation & order placement
│   ├── app.js          → Store initialization & toast utility
│   └── admin.js        → Admin dashboard logic (CRUD, auth, settings)
└── README.md           → This file
```

---

## 🚀 How to Run

1. Open the project folder in **VS Code**
2. Right-click on `index.html` → **Open with Live Server**
   (or just double-click `index.html` to open in browser)
3. For Admin Panel → open `admin.html` or click the ⚙️ Admin link in the navbar
4. **Admin Login**: Username = `admin`, Password = `admin123`
5. That's it — no build tools, no npm, no server needed!

---

## ✅ Features

### Storefront (index.html)
| Feature              | Description                                      |
|----------------------|--------------------------------------------------|
| Product Catalog      | 12 products across 8 categories with emoji icons |
| Category Filter      | Filter by Electronics, Clothing, Home, etc.      |
| Add to Cart          | Add items with visual confirmation                |
| Cart Sidebar         | Slide-out panel with qty controls & totals        |
| Free Shipping Logic  | Free shipping on orders above ₹999               |
| Checkout Form        | Name, Email, Address, Phone, Zip, Payment method |
| Form Validation      | Required field checks + email format validation  |
| Order Confirmation   | Success page with unique order ID                |
| Toast Notifications  | Feedback messages for all user actions            |
| Responsive Design    | Works on desktop, tablet, and mobile              |

### Admin Dashboard (admin.html)
| Feature               | Description                                       |
|-----------------------|---------------------------------------------------|
| Login Authentication  | Username/password login (default: admin/admin123) |
| Dashboard Overview    | Stats cards, recent orders, low stock alerts       |
| Product Management    | Add, Edit, Delete, Duplicate products              |
| Product Search/Filter | Search by name + filter by category               |
| Product Status        | Active, Draft, Archived states                     |
| Stock Tracking        | Stock quantity per product + low stock alerts       |
| Order Management      | View, change status, delete orders                 |
| Order Details Modal   | Full order breakdown with customer info             |
| Store Settings        | Store name, currency, shipping thresholds           |
| Admin Credentials     | Update username and password                        |
| Data Export           | Export all data as JSON file                        |
| Reset to Defaults     | Clear all data and start fresh                      |
| Data Sync             | Admin changes reflect on storefront via localStorage|

---

## 🛠 Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Flexbox, Grid, Transitions
- **Vanilla JavaScript** — No frameworks/libraries
- **Google Fonts** — Outfit + Lora

---

## 🧪 Testing Scope

This application is ideal for **Option 1** of the Software Testing assignment:

### Black-box Testing
- Boundary value analysis on form fields
- Equivalence partitioning for input validation
- Cart total calculation verification
- Navigation flow testing

### White-box Testing
- Unit testing individual functions (`addToCart`, `getTotal`, `getShipping`, etc.)
- Branch coverage for validation logic in `placeOrder()`
- Path testing through checkout flow

### Integration Testing
- Products → Cart → Checkout → Order pipeline
- Category filter + product rendering interaction
- Cart state + UI synchronization

---

## 📌 System Environment

| Component       | Details            |
|----------------|--------------------|
| Platform       | Web Browser (Chrome/Firefox/Edge) |
| Languages      | HTML, CSS, JavaScript |
| Framework      | None (Vanilla JS)  |
| Server         | Not required (static files) |
| Testing Tools  | Jest / Mocha (recommended) |

---

## 👨‍💻 Author

Built for Software Testing Lab Assignment — 2026
