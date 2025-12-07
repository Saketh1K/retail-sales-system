# Backend Service

Node.js + Express server for the Retail Sales Management System.

## Structure
- `src/app.js`: Entry point.
- `src/controllers`: Request handlers.
- `src/services`: Business logic.
- `src/utils`: Data loading utilities.
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
└── README.md
```

## API Endpoints

### `GET /sales`
Fetch sales data with optional search, filter, sort, and pagination.

**Parameters:**
- `q`: Search query (name or phone).
- `page`: Page number (default 1).
- `limit`: Items per page (default 10).
- `sort`: Sort option (`date_desc`, `date_asc`, `quantity_desc`, `quantity_asc`, `name_asc`, `name_desc`).
- `region`: Filter by region (can be multiple).
- `gender`: Filter by gender.
- `category`: Filter by product category.
- `minAge`, `maxAge`: Filter by age range.
- `startDate`, `endDate`: Filter by date range.

### `GET /sales/options`
Fetch available filter options (regions, categories, etc.).
