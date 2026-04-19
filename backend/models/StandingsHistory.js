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

    fetchedAt: Date,
});

module.exports = mongoose.model(
    'StandingsHistory',
    standingsHistorySchema
);