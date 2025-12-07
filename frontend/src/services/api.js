const API_BASE_URL = 'http://localhost:5000/sales';

export const fetchSales = async (params) => {
    const queryParams = new URLSearchParams();

    if (params.q) queryParams.append('q', params.q);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    // Filters
    if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(key, v));
            } else if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });
    }

    const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch sales data');
    }
    return response.json();
};

export const fetchFilterOptions = async () => {
    const response = await fetch(`${API_BASE_URL}/options`);
    if (!response.ok) {
        throw new Error('Failed to fetch filter options');
    }
    return response.json();
};
