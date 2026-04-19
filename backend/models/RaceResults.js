const mongoose = require('mongoose');

const driverResultSchema = new mongoose.Schema({
    driverId: String,
    name: String,
    code: String,
    position: String,
    points: Number,
    grid: Number,
    status: String,
}, { _id: false });

const raceResultSchema = new mongoose.Schema({
    raceId: { type: String, unique: true },

    season: Number,
    round: Number,
    date: Date,
    raceName: String,
    location: String,
    country: String,

    driver1: driverResultSchema,
    driver2: driverResultSchema,

    teamPoints: Number,

    fetchedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RaceResult', raceResultSchema);