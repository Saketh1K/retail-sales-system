# Retail Sales Management System

## 1. Overview
A high-performance retail analytics dashboard built with Node.js and React. It processes a large dataset of sales transactions, providing real-time search, multi-faceted filtering, and dynamic aggregation (Total Sales, Status Breakdown). The application features a clean, responsive light-themed UI with server-side processing for optimal performance.

## 2. Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Light Mode), Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, SQLite (sqlite3).
- **Architecture**: Client-Server with REST API.

## 3. Search Implementation Summary
Full-text search logic is implemented using SQL `LIKE` operators with wildcards (`%query%`). It targets `customer_name` and `phone` columns. The database is indexed on these fields to ensure sub-100ms response times. The frontend uses a custom hook with debouncing to manage API requests efficiently.

## 4. Filter Implementation Summary
Server-side filtering is achieved by dynamically constructing SQL `WHERE` clauses based on active parameters.
- **Multi-select**: Region, Category, Gender, Payment Method (using `IN` clause).
- **Range Filters**: Date and Age (using `>=` and `<=` operators).
- **Tags**: Keyword matching using `LIKE`.
- **Aggregation**: The backend calculates `SUM(final_amount)` and group-wise counts for the filtered dataset in the same request cycle to ensure stats match the view.

## 5. Sorting Implementation Summary
Sorting is handled via dynamic SQL `ORDER BY` clauses. Users can sort by Date, Quantity, or Customer Name. The implementation preserves all active search and filter states, ensuring consistent data presentation across pages.

## 6. Pagination Implementation Summary
Server-side pagination uses SQL `LIMIT` and `OFFSET`. Along with the paginated data rows, the API returns global metadata for the current filter set (Total Records, Total Sales Volume, Status Breakdown). This allows the UI to display accurate "Page X of Y" and summary statistics without fetching the entire dataset.

## 7. Setup Instructions
### Prerequisites
- Node.js (v16+)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed  # Parses CSV and populates SQLite DB
npm start     # Runs server on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build # For production build
npm run dev   # Runs development server
```

### 3. Deployment
Refer to `DEPLOYMENT.md` for detailed steps on deploying to Render (Backend) and Vercel (Frontend).
