const mongoose = require('mongoose');

const standingsHistorySchema = new mongoose.Schema({
    season: { type: Number, unique: true },

    constructorPosition: Number,
    constructorPoints: Number,
    constructorWins: Number,

    bestDriverPosition: Number,
    bestDriverName: String,
    bestDriverPoints: Number,
    bestDriverWins: Number,

    drivers: [
        {
            driverId: String,
            name: String,
            position: Number,
            points: Number,
            wins: Number,
        }
    ],

    fetchedAt: Date,
});

module.exports = mongoose.model(
    'StandingsHistory',
    standingsHistorySchema
);