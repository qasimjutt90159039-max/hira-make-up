# HIRA FAROOQ MAKEUP STUDIO & SALON - FULL-STACK E-COMMERCE PLATFORM

A production-grade, full-stack e-commerce and salon appointment booking web application built for **Hira Farooq Makeup Studio & Salon**, a premier bridal artistry studio located in Gulshan-e-Iqbal, Karachi, Pakistan.

---

## 🌸 Business Information

- **Business Name:** HIRA FAROOQ MAKEUP STUDIO & SALON
- **Category:** Luxury Beauty Salon & Boutique Cosmetics
- **Contact Number:** `0347-7844143` (Calling & WhatsApp)
- **Studio Address:** House No. B-28, Ground Floor, Block 15, Gulshan-e-Iqbal, Karachi, 75400, Pakistan
- **City / Region:** Karachi, Sindh, Pakistan
- **Business Hours:** Monday – Sunday, 10:00 AM – 9:00 PM
- **Currency:** PKR (Pakistani Rupee)

---

## 🚀 Key Features

### 🛒 E-Commerce & Cosmetics Store
- **Catalog Browsing & Grid/List Toggle:** Filter by 8+ categories (Bridal packages, party glam, haircare, skincare, nail art, combo deals).
- **Multi-criteria Filtering:** Filter by item classification (Physical cosmetic products vs. In-studio salon services), price slider in PKR (Rs. 1,000 to Rs. 100,000), search queries, and sorting (Featured, Most Popular, Highest Rated, Price Low/High).
- **Product Details & Gallery:** High-resolution image gallery with thumbnails, shade/variant selection with dynamic pricing, stock availability, detailed prep and application instructions.
- **Persistent Shopping Bag:** Powered by React Context API and `localStorage`. Includes free delivery progress bar (Free Karachi delivery over Rs. 3,500).
- **Promo Code Engine:** Working coupon discounts (e.g., `GLAM10` for 10% off, `HIRA20` for 20% off, `STUDIO500` for Rs. 500 flat discount).
- **Pakistani-Tailored Checkout:**
  - Cash on Delivery (COD)
  - Direct Studio Bank Transfer (Meezan Bank & HBL)
  - JazzCash & EasyPaisa Mobile Wallets
  - Visa / Mastercard Credit/Debit Cards
  - Express Same-Day Karachi rider option vs Standard 24–48H dispatch

### 💄 Salon Appointment Booking Engine
- **Dedicated Interactive Booking Modal:** Select service, preferred date, time slot (10 AM to 8 PM), lead artist (Hira Farooq vs Senior Studio Artist), and number of persons.
- **WhatsApp Integration:** Instant click-to-chat with pre-filled inquiries on `0347-7844143` for direct bridal consultations.

### 👤 Customer & Admin Portals
- **Customer Dashboard:**
  - Track order histories, live status (`pending`, `confirmed`, `shipped`, `delivered`), invoices, and shipping details.
  - View and manage salon appointments with cancellation and WhatsApp desk assistance.
  - Saved Wishlist with quick "Add to Bag".
- **Admin Management Portal:**
  - Revenue analytics and KPI overview.
  - Complete Product CRUD (Add new cosmetics/services, edit prices, descriptions, update stock, delete items).
  - Order Management (Update status from pending to shipped or delivered).
  - Salon Appointment Ledger (Confirm or cancel bookings).
  - Review moderation.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React icons, React Router v7.
- **Backend:** Node.js, Express.js unified server with file-backed JSON database persistence (`salon-database.json`).
- **Build Tool:** Vite 8 with ESBuild bundle compilation for production.

---

## 🔑 Demo Access & Credentials

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Studio Admin** | `admin@hirafarooq.com` | `admin123` | Full access to Admin Portal (`/admin`), order fulfillment, and catalog CRUD |
| **Customer** | `fatima@example.com` | `password123` | Order tracking, salon appointments, and wishlist (`/dashboard`) |

*Tip: A quick 1-click role switcher is provided directly inside the header user dropdown for rapid evaluation.*

---

## 📡 RESTful API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve catalog with optional query filters (`category`, `itemType`, `featured`, `search`) |
| `GET` | `/api/products/:id` | Get single product/service by ID or slug |
| `POST` | `/api/products` | Add new product or service (Admin) |
| `PUT` | `/api/products/:id` | Update product details or price (Admin) |
| `DELETE` | `/api/products/:id` | Delete product from catalog (Admin) |
| `GET` | `/api/orders` | Retrieve orders list |
| `POST` | `/api/orders` | Place a new customer order |
| `PATCH` | `/api/orders/:id/status` | Update order delivery status |
| `GET` | `/api/appointments` | Retrieve salon bookings |
| `POST` | `/api/appointments` | Book salon appointment |
| `PATCH` | `/api/appointments/:id/status`| Update appointment status |
| `GET` | `/api/reviews` | Retrieve customer reviews |
| `POST` | `/api/reviews` | Submit new verified review |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/register` | Register new customer account |
| `GET` | `/api/health` | Server healthcheck |
