const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sales', salesRoutes);

// Basic health check
app.get('/', (req, res) => {
    res.send('Retail Sales Management API is running');
});

// For local dev
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
