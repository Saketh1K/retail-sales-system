# Retail Sales Management - Frontend

A responsive, high-performance dashboard for analyzing retail transaction data. Built with React and Vite, this application focuses on speed, usability, and clean aesthetics.

##  Features

- ** Data Visualization**: Interactive table displaying sales transactions with status indicators (Completed, Pending, Failed).
- **  Advanced Search**: Real-time, debounced search capability for Customer Names and Phone Numbers.
- **Multifaceted Filtering**: 
  - **Categorical**: Region, Product Category, Payment Method, Status.
  - **Numerical/Date**: Price Range, Age Group, Date Range.
- **Sortable Columns**: Dynamic sorting for Dates, Quantities, and Customer details.
- **Pagination**: Server-side pagination with adjustable page sizes.
- **Real-time Statistics**: Dashboard header updates instantly with Total Sales Volume and Transaction Counts reflecting the current filter view.

##  Tech Stack

- **Core**: React 18
- **Build Tool**: Vite (Lightning fast HMR)
- **Styling**: Vanilla CSS 3 (CSS Variables, Flexbox, Grid, Glassmorphism effects)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Checking**: ESLint

## Installation & Setup

### 1. Prerequisites
Ensure you have the backend server running (default: `http://localhost:5000`).

### 2. Install Dependencies
Navigate to the frontend directory and install the required packages:

```bash
cd frontend
npm install
```

### 3. Environment Configuration
The application connects to the backend API. By default, it looks for `http://localhost:5000/api`.
To override this (e.g., for local testing against a different port), create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

*Note: Production deployments (like Vercel) automatically use `.env.production`.*

### 4. Run Development Server
Start the local development server:

```bash
npm run dev
```
Access the app at `http://localhost:5173`.

### 5. Build for Production
To generate the optimized static files for deployment:

```bash
npm run build
```
The output will be in the `dist/` folder.

## 📂 Project Structure

```text
src/
├── components/        # Reusable UI components
│   ├── FilterPanel.jsx    # Sidebar for applying complex filters
│   ├── Header.jsx         # Top bar with stats and theme controls
│   ├── Pagination.jsx     # Page navigation controls
│   ├── SalesTable.jsx     # Main data grid
│   └── SearchBar.jsx      # Global search input
├── services/          # API integration
│   └── api.js             # Axios instance and endpoint functions
├── App.jsx            # Main Layout and State Management
├── index.css          # Global styles and CSS variables
└── main.jsx           # Application Entry Point
```

## 🎨 Design Philosophy
The UI follows a **"Clean & Modern"** aesthetic, utilizing:
- **Light Theme**: Crisp white backgrounds with subtle gray borders.
- **Visual Hierarchies**: Bold metrics for totals, distinct badges for contract statuses.
- **Feedback**: Loading states, hover effects, and smooth transitions.
