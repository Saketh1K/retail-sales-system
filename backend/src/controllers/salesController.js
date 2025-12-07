const salesService = require('../services/salesService');

const getSales = (req, res) => {
    try {
        const { q, sort, page, limit, ...filters } = req.query;

        // Parse array filters (e.g. region=North&region=South -> ['North', 'South'])
        // Express handles this automatically if multiple params have same name, 
        // but if single, it's a string. We need to ensure arrays for multi-selects.

        const normalizeArray = (val) => {
            if (!val) return [];
            return Array.isArray(val) ? val : [val];
        };

        const parsedFilters = {
            region: normalizeArray(filters.region),
            gender: normalizeArray(filters.gender),
            category: normalizeArray(filters.category),
            paymentMethod: normalizeArray(filters.paymentMethod),
            tags: normalizeArray(filters.tags),
            minAge: filters.minAge,
            maxAge: filters.maxAge,
            startDate: filters.startDate,
            endDate: filters.endDate
        };

        const result = salesService.getSales({
            q,
            filters: parsedFilters,
            sort,
            page: page || 1,
            limit: limit || 10
        });

        res.json(result);
    } catch (error) {
        console.error('Error in getSales controller:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getFilterOptions = (req, res) => {
    try {
        const regions = salesService.getUniqueValues('Customer Region');
        const categories = salesService.getUniqueValues('Product Category');
        const paymentMethods = salesService.getUniqueValues('Payment Method');
        const genders = salesService.getUniqueValues('Gender');

        // Handle Tags specially to split comma-separated values
        const allTags = salesService.getUniqueValues('Tags');
        const uniqueTags = new Set();
        allTags.forEach(tagStr => {
            if (tagStr) {
                tagStr.split(',').forEach(t => uniqueTags.add(t.trim()));
            }
        });
        const tags = Array.from(uniqueTags).sort();

        res.json({
            regions,
            categories,
            paymentMethods,
            genders,
            tags
        });
    } catch (error) {
        console.error('Error in getFilterOptions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

module.exports = { getSales, getFilterOptions };
