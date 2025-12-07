# System Architecture

## 1. Backend Architecture
The backend is built with **Node.js** and **Express.js**, following a clean **MVC (Model-View-Controller)** separation of concerns (though "Model" here is replaced by a Service/Data layer since we use an in-memory dataset).

- **Server:** `app.js` initializes the Express app, middleware (CORS, JSON parser), and mounts routes.
- **Routing:** `salesRoutes.js` maps HTTP endpoints (e.g., `GET /sales`) to controller functions.
- **Controller:** `salesController.js` parses incoming requests (query parameters for search/filter), delegates business logic to the service layer, and handles HTTP responses.
- **Service:** `salesService.js` contains the core business logic. It handles data filtering, sorting, pagination, and statistical aggregation.
- **Data Access:** `dataLoader.js` (Utils) is responsible for reading and parsing the CSV dataset into memory upon server startup.

## 2. Frontend Architecture
The frontend is a **Next.js** application emphasizing a responsive and interactive user experience.

- **Routing:** Uses Next.js file-system based routing (App Router).
- **State Management:** React `useState` and `useEffect` hooks manage local UI state (search queries, active filters, sort options) and data fetching side effects.
- **Component Design:** Modular components (Search, Filter, Table, Pagination) promote reusability and maintainability.
- **Styling:** Vanilla CSS Modules provide scoped and collision-free styling for components.
- **API Integration:** A dedicated `api.js` service parses frontend state into URL query parameters and handles asynchronous data fetching.

## 3. Data Flow
1.  **User Interaction:** User updates a filter, types a search query, or changes a page in the UI.
2.  **Request Construction:** Frontend `api.js` constructs a URL with query parameters (e.g., `?q=phone&region=North&sort=date_desc`).
3.  **API Call:** Next.js sends an HTTP GET request to the Express backend.
4.  **Request Handling:** Express Router directs the request to `salesController`.
5.  **Processing:** `salesService` filters the in-memory data array, sorts it, and calculates pagination/stats.
6.  **Response:** A JSON object containing the data slice, pagination metadata, and statistics is returned.
7.  **Rendering:** Frontend updates its state with the new data and re-renders the Transaction Table and Dashboard.

## 4. Folder Structure

### Backend
```
backend/
├── src/
│   ├── app.js                 # Entry point, app config
│   ├── controllers/
│   │   └── salesController.js # Request parsing, response formatting
│   ├── routes/
│   │   └── salesRoutes.js     # API Route definitions
│   ├── services/
│   │   └── salesService.js    # Business logic (Filter/Sort/Search)
│   └── utils/
│       └── dataLoader.js      # CSV Parser and data loading
├── package.json
└── truestate_assignment_dataset.csv
```

### Frontend
```
frontend/
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # Reusable UI components
│   │   ├── FilterPanel.js
│   │   ├── Pagination.js
│   │   ├── SalesTable.js
│   │   ├── SearchBar.js
│   │   ├── SortDropdown.js
│   │   └── StatsDashboard.js
│   └── services/
│       └── api.js             # API fetch functions
├── public/                    # Static assets
└── package.json
```

## 5. Module Responsibilities

| Module | Responsibility |
| :--- | :--- |
| **salesController.js** | Extracts `req.query`, sanitizes inputs (ensuring arrays for filters), and calls `salesService`. Returns JSON or Error. |
| **salesService.js** | Implements the core logic: full-text search, multi-faceted filtering (AND/OR logic), sorting (Date/Qty/Name), and pagination slicing. implementation. |
| **dataLoader.js** | Reads the local CSV file using `csv-parser` and stores the result in a global variable for fast access. |
| **api.js (Frontend)** | Abstraction layer for HTTP requests. Converts a complex JS object of filters into a standard URL query string. |
| **SalesTable.js** | Displays transaction data in a responsive table. Handles empty states. |
| **FilterPanel.js** | Renders dynamic filter options (checkboxes, ranges) fetched from the backend (`/sales/options`). |
