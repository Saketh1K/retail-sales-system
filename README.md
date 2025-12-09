# Retail Sales Management System

A high-performance retail analytics dashboard processing **1 Million+ records** with real-time search, filtering, and aggregation.

---

## 1. Overview
This project is a full-stack web application designed to handle large datasets efficiently using a lightweight stack. It demonstrates comprehensive CRUD capabilities (Read-heavy), complex SQL filtering, and server-side aggregation without relying on heavy external database services.

## 2. Tech Stack
- **Frontend:** React (Vite), Vanilla CSS, Axios, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite (Native `sqlite3`).
- **Deployment:** 
  - Frontend: **Vercel**
  - Backend: **Render** (Node.js Environment)

---

## 3. Key Features

### Optimized Search
- Full-text search on `Customer Name` and `Phone Number`.
- SQL `LIKE` queries optimized with database indexes (`idx_customer_name`, `idx_phone`).
- Debounced API calls to minimize server load.

###  Advanced Filtering & Aggregation
- **Multi-select:** Region, Category, Payment Method.
- **Range Filters:** Price range, Date range.
- **Smart Totals:** Calculating `Sum(Total Sales)` and `Count(Transactions)` dynamically based on active filters in < 50ms.

###  Engineering Highlights (Database Strategy)
Processing 1 Million records (300MB+) on free-tier hosting presented unique challenges. We implemented a dual-strategy:

1.  **Local Development:** Uses the raw `sales.db` (300MB).
2.  **Production (Render):**
    *   GitHub strictly limits files to 100MB.
    *   We compressed the database into `backend/sales_full.zip` (~88MB).
    *   **Auto-Unzip:** A custom startup script (`unzip_db.js`) detects the zip file, extracts the full 1M record database on server boot, and connects to it.
    *   **Read-Only Mode:** The production database opens in `OPEN_READONLY` mode to prevent file-locking issues common in serverless/containerized SQLite environments.

---

## 4. Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    
    # Optional: Seed the full database from CSV (takes ~2-3 mins)
    # npm run seed
    
    # Start Server (Auto-unzips if zip is present)
    npm start
    ```
    *Server runs on `http://localhost:5000`*

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    
    # Create .env file for local dev
    echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
    
    # Start Client
    npm run dev
    ```
    *Client runs on `http://localhost:5173`*

---

## 5. API Endpoints

### `GET /api/sales`
Main endpoint for fetching transaction data.

**Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` (customer name or phone)
- `region`, `category`, `paymentMethod` (comma-separated list)
- `startDate`, `endDate` (YYYY-MM-DD)
- `minAge`, `maxAge`
- `sortBy` (date, quantity, etc.)
- `sortOrder` (asc/desc)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "total": 1000000,
    "totalSales": 54200392.50,
    "statusStats": { "Completed": 800, "Pending": 200 ... },
    "page": 1,
    "limit": 10
  }
}
```

### `GET /api/sales/meta`
Returns distinct values for filters (Regions, Categories, Payment Methods) to populate the UI dropdowns dynamically.
