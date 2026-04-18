const express = require('express');
const axios = require('axios');
const RaceResult = require('../models/RaceResults');

const router = express.Router();
const F1_URL = 'https://api.jolpi.ca/ergast/f1/2025/constructors/red_bull/results.json';

// Helper: map a driver result from the API
function mapDriver(result) {
    return {
        driverId: result.Driver.driverId,
        name: `${result.Driver.givenName} ${result.Driver.familyName}`,
        code: result.Driver.code,
        position: result.positionText,
        points: parseFloat(result.points),
        grid: parseInt(result.grid),
        status: result.status,
        fastestLap: result.FastestLap?.Time?.time ?? null,
    };
}

router.post('/sync', async (req, res) => {
    try {
        const { data } = await axios.get(F1_URL);
        const races = data.MRData.RaceTable.Races;

        const ops = races.map((race) => {
            const [r1, r2] = race.Results;

            const driver1 = mapDriver(r1);
            const driver2 = r2 ? mapDriver(r2) : null;
            const teamPoints = driver1.points + (driver2?.points ?? 0);

            return {
                updateOne: {
                    filter: { raceId: `${race.season}-${race.round}` },
                    update: {
                        $set: {
                            raceId: `${race.season}-${race.round}`,
                            season: parseInt(race.season),
                            round: parseInt(race.round),
                            date: new Date(race.date),
                            raceName: race.raceName,
                            location: race.Circuit.Location.locality,
                            country: race.Circuit.Location.country,
                            driver1,
                            driver2,
                            teamPoints,
                            fetchedAt: new Date(),
                        },
                    },
                    upsert: true,
                },
            };
        });

        const result = await RaceResult.bulkWrite(ops);
        res.json({ message: `Synced ${ops.length} races`, result });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sync failed' });
    }
});

// GET all stored results sorted by round
router.get('/', async (req, res) => {
    const results = await RaceResult.find().sort({ round: -1 });
    res.json(results);
});

module.exports = router;