# Retail Sales Management - Backend API

A robust REST API built with Node.js and Express that serves retail transaction data with high efficiency. It is engineered to handle **1 million records** using SQLite, offering server-side filtering, searching, and aggregation.

## ⚙️ Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite3 (Native `node-sqlite3`)
- **Utilities**: `csv-parser` (for data seeding), `cors` (middleware), `adm-zip` (legacy compression management).
- **Production Tooling**: Custom start scripts for auto-extraction of large datasets.

## 🚀 Key Features

### 1. High-Performance Data Retrieval
- **Indexed Queries**: Uses database indices on `customer_name`, `phone`, `region`, and `date` for sub-100ms response times.
- **Dynamic SQL Generation**: `WHERE` clauses are built dynamically based on request parameters to optimize query plans.

### 2. Large Dataset Strategy (Production)
Since the raw database (~300MB) exceeds GitHub/Render free tier limits:
- **Compression**: The DB is stored as `sales_full.zip` (~88MB) in the repo.
- **Auto-Extraction**: On server boot (`npm start`), a custom script (`src/scripts/unzip_db.js`) detects the production environment, unzips the full database using efficient system commands, and connects to it.
- **Read-Only Mode**: In production, the DB opens in `OPEN_READONLY` mode to prevent file-locking issues typical in serverless environments.

### 3. API Endpoints

#### `GET /api/sales`
Fetches a paginated list of transactions.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `page` | `int` | Page number (default: 1) |
| `limit` | `int` | Items per page (default: 10) |
| `search` | `string` | Search Customer Name or Phone |
| `region` | `string` | Filter by Region(s) (comma-separated) |
| `category` | `string` | Filter by Category(s) (comma-separated) |
| `minAge` / `maxAge` | `int` | Filter by Customer Age range |
| `startDate` / `endDate` | `string` | Filter by Transaction Date (YYYY-MM-DD) |
| `sortBy` | `string` | `date`, `quantity`, `customer_name` |
| `sortOrder` | `string` | `asc` or `desc` |

**Response Example:**
```json
{
  "data": [ ... ],
  "pagination": {
    "total": 5000,
    "totalSales": 125000.00,
    "statusStats": { "Completed": 4500, "Pending": 500 }
  }
}
```

#### `GET /api/sales/meta`
Retrieves distinct metadata for frontend filter dropdowns.
- **Returns**: Lists of unique `regions`, `categories`, and `paymentMethods`.

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js & npm installed.

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Seed Database (Optional)
If you have the raw CSV file (`truestate_assignment_dataset.csv`) in the root directory:
```bash
npm run seed
```
*This will parse the CSV and create `sales.db`. Warning: Takes 2-3 minutes for 1M records.*

### 4. Run Server
```bash
npm start
```
- **Local Dev**: Connects to `sales.db` (Read/Write).
- **Production**: Checks for `sales_full.zip`, extracts it, and connects in Read-Only mode.

## 📂 Project Structure
```text
src/
├── controllers/
│   └── salesController.js  # Main logic for query construction & data fetching
├── routes/
│   └── salesRoutes.js      # API Route definitions
├── scripts/
│   ├── seed.js             # CSV to SQLite import script
│   └── unzip_db.js         # Production startup script for large files
├── utils/
│   └── db.js               # Database connection singleton
└── index.js                # Server entry point
```

## 🔒 Security & Performance
- **SQL Injection Protection**: All queries use parameterized statements (`?` placeholders).
- **CORS**: Configured to allow requests from authorized frontend domains.
- **WAL Mode**: Write-Ahead Logging is enabled in local/write-mode for better concurrency.
