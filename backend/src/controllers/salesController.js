const db = require('../utils/db');

exports.getSales = (req, res) => {
    try {
        const {
            page = 1, limit = 10,
            search,
            sortBy, sortOrder = 'desc',
            region, gender, minAge, maxAge,
            category, tags, paymentMethod,
            startDate, endDate
        } = req.query;

        const offset = (page - 1) * limit;
        const params = [];
        let whereClauses = [];

        // Search (Name or Phone)
        // Case-insensitive by default in SQLite LIKE for ASCII. For unicode, might need raw support, but usually fine.
        if (search) {
            whereClauses.push(`(customer_name LIKE ? OR phone LIKE ?)`);
            params.push(`%${search}%`, `%${search}%`);
        }

        // Filters - Multi-select
        if (region) {
            const regions = region.split(',');
            if (regions.length > 0) {
                whereClauses.push(`region IN (${regions.map(() => '?').join(',')})`);
                params.push(...regions);
            }
        }
        if (gender) {
            const genders = gender.split(',');
            if (genders.length > 0) {
                whereClauses.push(`gender IN (${genders.map(() => '?').join(',')})`);
                params.push(...genders);
            }
        }
        if (category) {
            const cats = category.split(',');
            if (cats.length > 0) {
                whereClauses.push(`category IN (${cats.map(() => '?').join(',')})`);
                params.push(...cats);
            }
        }
        if (paymentMethod) {
            const methods = paymentMethod.split(',');
            if (methods.length > 0) {
                whereClauses.push(`payment_method IN (${methods.map(() => '?').join(',')})`);
                params.push(...methods);
            }
        }

        // Ranges
        if (minAge) {
            whereClauses.push(`age >= ?`);
            params.push(minAge);
        }
        if (maxAge) {
            whereClauses.push(`age <= ?`);
            params.push(maxAge);
        }

        if (startDate) {
            whereClauses.push(`date >= ?`);
            params.push(startDate);
        }
        if (endDate) {
            whereClauses.push(`date <= ?`);
            params.push(endDate);
        }

        // Tags - "Work in combination" -> if multiple tags selected, row must have ANY match (OR logic inside tags filter)
        if (tags) {
            const tagList = tags.split(',');
            if (tagList.length > 0) {
                const tagClauses = tagList.map(t => `tags LIKE ?`).join(' OR ');
                whereClauses.push(`(${tagClauses})`);
                tagList.forEach(t => params.push(`%${t}%`));
            }
        }

        const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

        // Count Query, Total Sales, and Status Breakdown
        const statsSql = `SELECT COUNT(*) as total, SUM(final_amount) as totalSales FROM transactions ${whereSql}`;
        const statusSql = `SELECT status, COUNT(*) as count, SUM(final_amount) as totalAmount FROM transactions ${whereSql} GROUP BY status`;

        // Sorting
        let orderSql = 'ORDER BY date DESC'; // Default
        if (sortBy) {
            const sortMap = {
                'date': 'date',
                'quantity': 'quantity',
                'name': 'customer_name', // mapped customer_name
                'customer_name': 'customer_name'
            };
            const col = sortMap[sortBy];
            if (col) {
                const dir = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
                orderSql = `ORDER BY ${col} ${dir}`;
            }
        }

        const dataSql = `SELECT * FROM transactions ${whereSql} ${orderSql} LIMIT ? OFFSET ?`;

        db.get(statsSql, params, (err, statsRow) => {
            if (err) {
                console.error("Stats Error", err);
                return res.status(500).json({ error: "Database error" });
            }

            const total = statsRow ? statsRow.total : 0;
            const totalSales = statsRow ? statsRow.totalSales : 0;
            const totalPages = Math.ceil(total / limit);

            db.all(statusSql, params, (err, statusRows) => {
                if (err) {
                    console.error("Status Stats Error", err);
                }

                const statusStats = {};
                if (statusRows) {
                    statusRows.forEach(row => {
                        statusStats[row.status] = {
                            count: row.count,
                            amount: row.totalAmount
                        };
                    });
                }

                db.all(dataSql, [...params, limit, offset], (err, rows) => {
                    if (err) {
                        console.error("Data Error", err);
                        return res.status(500).json({ error: "Database error" });
                    }

                    res.json({
                        data: rows,
                        pagination: {
                            total,
                            totalSales,
                            statusStats, // Renamed from statusCounts to statusStats to reflect richer data
                            page: parseInt(page),
                            totalPages,
                            limit: parseInt(limit)
                        }
                    });
                });
            });
        });

    } catch (e) {
        console.error("Server Error", e);
        res.status(500).json({ error: e.message });
    }
};

exports.getMetadata = (req, res) => {
    const queries = {
        regions: "SELECT DISTINCT region FROM transactions WHERE region IS NOT NULL ORDER BY region",
        categories: "SELECT DISTINCT category FROM transactions WHERE category IS NOT NULL ORDER BY category",
        paymentMethods: "SELECT DISTINCT payment_method FROM transactions WHERE payment_method IS NOT NULL ORDER BY payment_method",
    };

    // Manually coordinate simpler than async/await with sqlite3
    db.all(queries.regions, [], (err, rRows) => {
        if (err) return res.status(500).json({ error: err.message });

        db.all(queries.categories, [], (err, cRows) => {
            if (err) return res.status(500).json({ error: err.message });

            db.all(queries.paymentMethods, [], (err, pRows) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    regions: rRows.map(r => r.region),
                    categories: cRows.map(c => c.category),
                    paymentMethods: pRows.map(p => p.payment_method)
                });
            });
        });
    });
};
