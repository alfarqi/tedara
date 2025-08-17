# 📘 Frontend Pages Reference – Tedara Admin

This document lists all the route-level pages in the app, including:

- ✅ Purpose of each page
- 📂 File path inside `/src/pages`
- 🎨 Reference location inside the admin theme (`/reference`)
- 🔧 Feature folder (if needed)

---

## ✅ Pages List (Phase 1 – Core MVP)

---

### 1. 🏠 Dashboard

- **Path:** `src/pages/Dashboard.tsx`
- **Purpose:** Overview of KPIs, recent orders, revenue, etc.
- **Theme Reference:** `/reference/pages/index.jsx` or `dashboard.jsx`
- **Features:** `features/analytics`

---

### 2. 🛍️ Products

- **Path:** `src/pages/Products.tsx`
- **Purpose:** Product catalog – list, edit, archive
- **Theme Reference:** `/reference/pages/ecommerce/products.jsx`
- **Features:** `features/products`

---

### 3. 📂 Categories

- **Path:** `src/pages/Categories.tsx`
- **Purpose:** Manage product categories & filters
- **Theme Reference:** May reuse sidebar/category-related pages or build custom
- **Features:** `features/categories`

---

### 4. 📦 Orders

- **Path:** `src/pages/Orders.tsx`
- **Purpose:** View and manage all store orders
- **Theme Reference:** `/reference/pages/ecommerce/orders.jsx`
- **Features:** `features/orders`

---

### 5. 📄 Order Details

- **Path:** `src/pages/OrderDetails.tsx`
- **Purpose:** Detailed order view with tracking, status, payment
- **Theme Reference:** `/reference/pages/ecommerce/order-details.jsx`
- **Features:** `features/orders`

---

### 6. 🎟️ Coupons

- **Path:** `src/pages/Coupons.tsx`
- **Purpose:** Discount code generator and list
- **Theme Reference:** Any CRUD table/list in the reference (or marketing promo page)
- **Features:** `features/marketing`

---

### 7. 🏪 Store Settings

- **Path:** `src/pages/StoreSettings.tsx`
- **Purpose:** Store branding, name, logo, business info
- **Theme Reference:** Profile or settings forms from reference
- **Features:** `features/store`

---

### 8. 🎨 Store Design

- **Path:** `src/pages/StoreDesign.tsx`
- **Purpose:** Visual builder for homepage layout (manual config)
- **Theme Reference:** `/reference/pages/ui-components/` or `/layouts/`
- **Features:** `features/store`

---

### 9. 🌐 Store Domain

- **Path:** `src/pages/StoreDomain.tsx`
- **Purpose:** Add or manage custom domain
- **Theme Reference:** Settings or account-related pages
- **Features:** `features/store`

---

### 10. 👥 Customers

- **Path:** `src/pages/Customers.tsx`
- **Purpose:** List and manage customer accounts
- **Theme Reference:** `/reference/pages/users/customers.jsx`
- **Features:** `features/customers`

---

### 11. 👨‍💼 Staff

- **Path:** `src/pages/Staff.tsx`
- **Purpose:** Manage staff users
- **Theme Reference:** `/reference/pages/users/staff.jsx` or similar
- **Features:** `features/staff`

---

### 12. 🔐 Roles & Permissions

- **Path:** `src/pages/Roles.tsx`
- **Purpose:** Define access permissions for staff
- **Theme Reference:** May require custom role-permission UI
- **Features:** `features/roles`

---

### 13. 💳 Payments

- **Path:** `src/pages/Payments.tsx`
- **Purpose:** Setup payment gateways (Stripe, PayPal, etc.)
- **Theme Reference:** Form or integration pages
- **Features:** `features/payments`

---

### 14. 🚚 Shipping

- **Path:** `src/pages/Shipping.tsx`
- **Purpose:** Define shipping zones, carriers, and rules
- **Theme Reference:** Logistics/integration form UIs
- **Features:** `features/shipping`

---

### 15. 📊 Analytics Dashboard

- **Path:** `src/pages/AnalyticsDashboard.tsx`
- **Purpose:** Store KPIs and charts
- **Theme Reference:** `/reference/pages/charts/`, `/reference/pages/index.jsx`
- **Features:** `features/analytics`

---

### 16. 📈 Reports

- **Path:** `src/pages/Reports.tsx`
- **Purpose:** Sales, inventory, and performance reports
- **Theme Reference:** `/reference/pages/reports.jsx` or tables
- **Features:** `features/analytics`

---

## 🛠 How to Build Each Page

When creating or implementing any page:

1. Refer to the matching JSX file inside `/frontend/reference/`
2. Copy any reusable JSX and styling
3. Place logic (API calls, state) inside `features/<module>`
4. Keep all UI 100% visually consistent with the reference
5. Wrap in `<AppLayout />`

---

## 📁 Related Structure

- All route pages → `src/pages/`
- All logic per domain → `src/features/<module>/`
- All shared layout components → `src/components/layout/`
- API helpers → `src/lib/apiClient.ts`

---

## 🧭 Navigation Setup

Route configuration is in:  
```ts
/src/app/routes.tsx
```

All protected pages are wrapped in `AppLayout.tsx`.

---

## 📌 Notes

- Theme reference lives in: `/frontend/reference/`
- Assets from theme (CSS/JS) are copied to: `/frontend/public/theme/`
- Do not modify anything directly inside `reference/`

---