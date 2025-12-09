# System Architecture

## Overview
The Retail Sales Management System is a full-stack web application designed to handle large datasets of retail transactions. It provides a responsive interface for searching, filtering, and analyzing sales data.

## Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (using `sqlite3` driver)
  - SQLite was chosen for its zero-configuration, self-contained nature, and ability to handle the provided dataset effectively within a local environment.
  - **WAL Mode**: Write-Ahead Logging is enabled to support higher concurrency.
- **Data Ingestion**: A custom seeding script streams the CSV dataset, creating an optimized database table with appropriate indices for performant search and filtering.

### Modules
- **Controllers**: Handle business logic and SQL query construction (`salesController.js`).
- **Routes**: Define API endpoints (`salesRoutes.js`).
- **Utils**: Database connection singleton (`db.js`).

## Frontend Architecture
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS with CSS Variables for consistent theming and dark mode.
- **State Management**: Custom Hook (`useSales`) manages API state, debouncing, and filter synchronization.
- **Components**: Modular components for Table, Filters, and Pagination.

## Data Flow
1. **User Interaction**: User updates filters/search in the React UI.
2. **State Update**: `useSales` hook debounces the input.
3. **API Request**: Axios sends a GET request with query parameters to `/api/sales`.
4. **Query Construction**: Express controller dynamically builds the SQL `WHERE` clause based on active filters.
5. **Database Execution**: SQLite executes the optimized query (utilizing indices on `customer_name`, `phone`, `date`, etc.).
6. **Response**: JSON data + pagination metadata is returned to the client.
7. **Render**: UI updates the table and pagination controls.

## Folder Structure
```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API definitions
│   │   ├── utils/         # DB connection
│   │   ├── scripts/       # Data seeding
│   │   └── index.js       # Entry point
│   └── sales.db           # SQLite Database (generated)
├── frontend/
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── hooks/         # Logic hooks
│   │   ├── services/      # API calls
│   │   └── ...
│   └── ...
└── docs/                  # Documentation
```
