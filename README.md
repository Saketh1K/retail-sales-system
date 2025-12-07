# Retail Sales Management System

## Overview
A production-ready Retail Sales Management System incorporating a Node.js/Express backend and a Next.js frontend. The application processes a provided dataset to offer efficient sales tracking, featuring advanced search, multi-faceted filtering, sorting, and server-side pagination capabilities, along with a clean, responsive user interface.

## Tech Stack
- **Frontend:** Next.js, React, Vanilla CSS (Module-based)
- **Backend:** Node.js, Express.js
- **Data Processing:** csv-parser
- **Data Store:** In-memory array (loaded from CSV)

## Search Implementation Summary
Full-text search logic is implemented in the backend service. It performs case-insensitive matching against:
- **Customer Name**
- **Phone Number**
The search query (`?q=...`) filters the in-memory dataset before applying specific field filters.

## Filter Implementation Summary
Multi-faceted filtering supports single and multiple values. The backend parses query parameters into structured filter objects:
- **Exact Matches:** Region, Gender, Category, Payment Method (supports multiple selections, e.g., `region=North&region=South`).
- **Tag Matching:** Checks if selected tags exist within the comma-separated `Tags` field of a record.
- **Range Queries:** 
  - Age (`minAge`, `maxAge`)
  - Date (`startDate`, `endDate`)

## Sorting Implementation Summary
Sorting is handled dynamically based on the `sort` query parameter:
- **Date:** `date_desc` (Newest first), `date_asc` (Oldest first)
- **Quantity:** `quantity_desc` (High to Low), `quantity_asc` (Low to High)
- **Customer Name:** `name_asc` (A-Z), `name_desc` (Z-A)
Defaults to `date_desc` if no sort parameter is provided.

## Pagination Implementation Summary
Server-side pagination logic ensures efficient data delivery:
- Accepts `page` (default 1) and `limit` (default 10) parameters.
- Calculates `startIndex` and `endIndex` to slice the processed result set.
- Returns `data` (current page items) along with `pagination` metadata (total items, total pages, current page, items per page).

## Setup Instructions
1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   # App runs on http://localhost:3000
   ```
