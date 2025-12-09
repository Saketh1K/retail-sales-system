# Retail Sales Management System

## 1. Overview
A high-performance retail analytics dashboard built with Node.js and React. It processes a large dataset of sales transactions, offering real-time search, multi-faceted filtering, and sorting capabilities wrapped in a modern, responsive user interface.

## 2. Tech Stack
- **Frontend**: React (Vite), Vanilla CSS (Dark Mode), Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, SQLite (sqlite3).
- **Architecture**: Client-Server with REST API.

## 3. Search Implementation Summary
Full-text search logic is implemented in the backend using SQL `LIKE` operators with wildcards (`%query%`). It targets `customer_name` and `phone` columns. The database is indexed on these fields to ensure sub-100ms response times even with large datasets. The frontend debounces input to minimize API load.

## 4. Filter Implementation Summary
Filtering is handled dynamically on the server. The `salesController` constructs a flexible SQL `WHERE` clause.
- **Multi-select**: Region, Category, Gender, Payment Method use `IN (...)` clauses.
- **Ranges**: Date and Age use `>=` and `<=` operators.
- **Tags**: Implemented using `LIKE` with logical OR combinations for multiple tag inputs.
Metadata for filter options is dynamically fetched from the database to ensure accuracy.

## 5. Sorting Implementation Summary
Sorting is server-side to handle pagination correctly. The user can sort by Date, Quantity, or Customer Name. The SQL `ORDER BY` clause is dynamically updated based on the user's selection, preserving all active filters and search contexts.

## 6. Pagination Implementation Summary
Server-side pagination is implemented using SQL `LIMIT` and `OFFSET`. The frontend calculates total pages based on the `count(*)` returned by the backend (filtered count). The UI provides Next/Previous controls that update the page state, triggering a data refresh while keeping filters intact.

## 7. Setup Instructions
### Prerequisites
- Node.js (v16+)
- npm

### 1. Backend Setup & Data Seeding
```bash
cd backend
npm install
npm run seed  # Parses CSV and populates SQLite DB (takes ~1-2 mins)
npm start     # Runs server on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Runs React app on port 5173
```

### 3. Access
Open [http://localhost:5173](http://localhost:5173) in your browser.
