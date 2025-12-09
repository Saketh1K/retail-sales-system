import React, { useState } from 'react';
import { Filter as FilterIcon, Search, Package } from 'lucide-react';
import { useSales } from './hooks/useSales';
import { SalesTable } from './components/SalesTable';
import { FilterPanel } from './components/FilterPanel';
import { Pagination } from './components/Pagination';

function App() {
  const {
    data, meta, loading, pagination,
    filters, sort,
    setPage, updateFilter, resetFilters, updateSort
  } = useSales();

  const [isFilterOpen, setIsFilterOpen] = useState(true);

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.8)', // White with opacity
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '0.6rem',
            borderRadius: '0.75rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <Package size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>TruEstate Retail</h1>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            style={{ paddingLeft: '2.8rem', width: '100%', background: 'var(--bg-secondary)', borderColor: 'transparent' }}
          />
        </div>
      </header>

      {/* Main Layout */}
      <main className="main-content" style={{ display: 'flex', gap: '2rem' }}>
        {/* Filter Panel */}
        <div style={{ display: isFilterOpen ? 'block' : 'none' }}>
          <FilterPanel
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            meta={meta}
            isOpen={isFilterOpen}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              className={`btn ${isFilterOpen ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FilterIcon size={18} /> {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Total Sales Display */}
            <div style={{ marginRight: 'auto', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-active)' }}>
                Total Sales: <span style={{ color: 'var(--accent)' }}>₹{pagination.totalSales ? pagination.totalSales.toLocaleString() : '0'}</span>
              </div>
              {pagination.statusStats && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {Object.entries(pagination.statusStats).map(([status, stats]) => (
                    <span key={status} style={{
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.8rem',
                      borderRadius: '999px',
                      fontWeight: 500,
                      background: status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                        status === 'Returned' ? 'rgba(239, 68, 68, 0.1)' :
                          status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: status === 'Completed' ? 'var(--success)' :
                        status === 'Returned' ? 'var(--danger)' :
                          status === 'Cancelled' ? 'var(--danger)' : 'var(--warning)',
                      border: `1px solid ${status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' :
                        status === 'Returned' ? 'rgba(239, 68, 68, 0.2)' :
                          status === 'Cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                        }`
                    }}>
                      {status}: {stats.count} (₹{stats.amount ? stats.amount.toLocaleString() : '0'})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-secondary)', padding: '0.3rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Sort by</span>
              <select
                value={sort.by}
                onChange={(e) => updateSort(e.target.value)}
                style={{ border: 'none', background: 'transparent', padding: '0', width: 'auto', fontWeight: 600, color: 'var(--text-active)', cursor: 'pointer' }}
              >
                <option value="date">Date</option>
                <option value="quantity">Quantity</option>
                <option value="customer_name">Customer Name</option>
              </select>
            </div>
          </div>

          <SalesTable
            data={data}
            loading={loading}
            sort={sort}
            updateSort={updateSort}
          />

          <Pagination pagination={pagination} setPage={setPage} />
        </div>
      </main>
    </div>
  );
}

export default App;
