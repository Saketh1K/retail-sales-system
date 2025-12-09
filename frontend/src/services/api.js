import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const fetchSales = (params) => api.get('/sales', { params });
export const fetchMetadata = () => api.get('/sales/meta');

export default api;
