'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SortDropdown from '../components/SortDropdown';
import StatsCard from '../components/StatsCard';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import { fetchSales, fetchFilterOptions } from '../services/api';

export default function Home() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('date_desc');
  const [filterOptions, setFilterOptions] = useState({});

  // Load filter options on mount
  useEffect(() => {
    fetchFilterOptions()
      .then(setFilterOptions)
      .catch(err => console.error('Failed to load filter options', err));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSales({
        q: searchQuery,
        filters,
        sort: sortOption,
        page: pagination.currentPage,
        limit: 10
      });
      setData(result.data);
      setStats(result.stats);
      setPagination(result.pagination);
    } catch (err) {
      setError('Failed to load data. Please check backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortOption, pagination.currentPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleSortChange = useCallback((sort) => {
    setSortOption(sort);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Retail Sales Management</h1>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            options={filterOptions}
          />
        </aside>

        <section className={styles.results}>
          {stats && (
            <div className={styles.statsGrid}>
              <StatsCard title="Total Transactions" count={stats.totalTransactions} amount={stats.totalAmount} type="total" />
              <StatsCard title="Completed" count={stats.byStatus.Completed.count} amount={stats.byStatus.Completed.amount} type="completed" />
              <StatsCard title="Pending" count={stats.byStatus.Pending.count} amount={stats.byStatus.Pending.amount} type="pending" />
              <StatsCard title="Cancelled" count={stats.byStatus.Cancelled.count} amount={stats.byStatus.Cancelled.amount} type="cancelled" />
              <StatsCard title="Returned" count={stats.byStatus.Returned.count} amount={stats.byStatus.Returned.amount} type="returned" />
            </div>
          )}

          <div className={styles.controls}>
            <SearchBar onSearch={handleSearch} />
            <SortDropdown value={sortOption} onChange={handleSortChange} />
          </div>

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <TransactionTable data={data} />
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
