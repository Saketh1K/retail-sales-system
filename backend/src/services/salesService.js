const { getData } = require('../utils/dataLoader');

const getSales = ({ q, filters, sort, page = 1, limit = 10 }) => {
    let results = getData();

    // 1. Search (Full-Text)
    if (q) {
        const query = q.toLowerCase();
        results = results.filter(item =>
            (item['Customer Name'] && item['Customer Name'].toLowerCase().includes(query)) ||
            (item['Phone Number'] && item['Phone Number'].includes(query))
        );
    }

    // 2. Filters
    if (filters) {
        // Expected filters format: { region: ['North'], gender: ['Male'], minAge: 20, maxAge: 30, ... }
        // We need to parse the query params properly in the controller, here we expect a structured object

        if (filters.region && filters.region.length > 0) {
            results = results.filter(item => filters.region.includes(item['Customer Region']));
        }

        if (filters.gender && filters.gender.length > 0) {
            results = results.filter(item => filters.gender.includes(item['Gender']));
        }

        if (filters.category && filters.category.length > 0) {
            results = results.filter(item => filters.category.includes(item['Product Category']));
        }

        if (filters.paymentMethod && filters.paymentMethod.length > 0) {
            results = results.filter(item => filters.paymentMethod.includes(item['Payment Method']));
        }

        if (filters.minAge || filters.maxAge) {
            results = results.filter(item => {
                const age = parseInt(item['Age'], 10);
                if (isNaN(age)) return false;
                const min = filters.minAge ? parseInt(filters.minAge, 10) : 0;
                const max = filters.maxAge ? parseInt(filters.maxAge, 10) : 150;
                return age >= min && age <= max;
            });
        }

        if (filters.startDate || filters.endDate) {
            results = results.filter(item => {
                const itemDate = new Date(item['Date']);
                const start = filters.startDate ? new Date(filters.startDate) : new Date('1900-01-01');
                const end = filters.endDate ? new Date(filters.endDate) : new Date();
                return itemDate >= start && itemDate <= end;
            });
        }

        // Tags might be a comma-separated string in the CSV? Or just a single tag?
        // Assuming 'Tags' field exists and might contain multiple values.
        // If exact match:
        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(item => {
                if (!item['Tags']) return false;
                const itemTags = item['Tags'].split(',').map(t => t.trim());
                return filters.tags.some(tag => itemTags.includes(tag));
            });
        }
    }

    // 3. Sorting
    if (sort) {
        results.sort((a, b) => {
            switch (sort) {
                case 'date_desc':
                    return new Date(b['Date']) - new Date(a['Date']);
                case 'date_asc':
                    return new Date(a['Date']) - new Date(b['Date']);
                case 'quantity_desc':
                    return (parseInt(b['Quantity'], 10) || 0) - (parseInt(a['Quantity'], 10) || 0);
                case 'quantity_asc':
                    return (parseInt(a['Quantity'], 10) || 0) - (parseInt(b['Quantity'], 10) || 0);
                case 'name_asc':
                    return (a['Customer Name'] || '').localeCompare(b['Customer Name'] || '');
                case 'name_desc':
                    return (b['Customer Name'] || '').localeCompare(a['Customer Name'] || '');
                default:
                    return 0;
            }
        });
    } else {
        // Default sort: Date Newest
        results.sort((a, b) => new Date(b['Date']) - new Date(a['Date']));
    }

    // 4. Pagination
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit, 10);
    const paginatedResults = results.slice(startIndex, endIndex);

    // 5. Statistics (on filtered results)
    const stats = {
        totalTransactions: totalItems,
        totalAmount: 0,
        byStatus: {
            'Completed': { count: 0, amount: 0 },
            'Cancelled': { count: 0, amount: 0 },
            'Returned': { count: 0, amount: 0 },
            'Pending': { count: 0, amount: 0 }
        }
    };

    results.forEach(item => {
        const amount = parseFloat(item['Total Amount']) || 0;
        const status = item['Order Status'];

        stats.totalAmount += amount;

        if (stats.byStatus[status]) {
            stats.byStatus[status].count += 1;
            stats.byStatus[status].amount += amount;
        }
    });

    return {
        data: paginatedResults,
        pagination: {
            totalItems,
            totalPages,
            currentPage: parseInt(page, 10),
            itemsPerPage: parseInt(limit, 10)
        },
        stats
    };
};

const getUniqueValues = (field) => {
    const data = getData();
    const values = new Set();
    data.forEach(item => {
        if (item[field]) {
            values.add(item[field]);
        }
    });
    return Array.from(values).sort();
};

module.exports = { getSales, getUniqueValues };
