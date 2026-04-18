require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const f1Routes = require('./routes/f1');

const app = express();

app.use(express.json());

// Temporary test route
app.post('/test', (req, res) => res.json({ ok: true }));

app.use('/api/f1', f1Routes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });