import { useState, useEffect, useCallback } from 'react';
import { fetchSales, fetchMetadata } from '../services/api';

export const useSales = () => {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({ regions: [], categories: [], paymentMethods: [] });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        region: [],
        gender: [],
        minAge: '',
        maxAge: '',
        category: [],
        tags: [],
        paymentMethod: [],
        startDate: '',
        endDate: ''
    });

    const [sort, setSort] = useState({ by: 'date', order: 'desc' });

    // Fetch Metadata once
    useEffect(() => {
        fetchMetadata().then(res => {
            if (res.data) setMeta(res.data);
        }).catch(err => console.error("Meta fetch error", err));
    }, []);

    // Fetch Data
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Clean simple filters
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sortBy: sort.by,
                sortOrder: sort.order,
                search: filters.search,
                region: filters.region.join(','),
                gender: filters.gender.join(','),
                category: filters.category.join(','),
                paymentMethod: filters.paymentMethod.join(','),
                minAge: filters.minAge,
                maxAge: filters.maxAge,
                tags: filters.tags.join(','),
                startDate: filters.startDate,
                endDate: filters.endDate
            };

            // Remove empty keys
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null || params[key] === undefined) {
                    delete params[key];
                }
            });

            const response = await fetchSales(params);
            if (response.data) {
                setData(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error("Data fetch error", err);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, sort, filters]);

    // Debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timeout);
    }, [loadData]); // Deep dependency check might cause loops if not careful? 
    // loadData depends on state. filters/sort changes -> loadData changes. 
    // This is standard React hook pattern.

    // Actions
    const setPage = (p) => setPagination(prev => ({ ...prev, page: p }));

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Only reset page if filter changes (not pagination)
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            region: [],
            gender: [],
            minAge: '',
            maxAge: '',
            category: [],
            tags: [],
            paymentMethod: [],
            startDate: '',
            endDate: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const updateSort = (by) => {
        setSort(prev => {
            if (prev.by === by) {
                return { by, order: prev.order === 'asc' ? 'desc' : 'asc' };
            }
            return { by, order: 'desc' };
        });
    };

    return {
        data, meta, loading, pagination,
        filters, sort,
        setPage, updateFilter, resetFilters, updateSort
    };
};
