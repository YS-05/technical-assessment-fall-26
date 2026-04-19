require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const f1Routes = require('./routes/f1');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/f1', f1Routes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });