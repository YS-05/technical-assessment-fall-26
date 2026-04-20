const express = require('express');
const axios = require('axios');
const RaceResult = require('../models/RaceResults');
const {
    syncStandingsHistory,
    getStandingsHistoryFromDb,
} = require('../services/standingService');
const { getDashboardData } = require('../services/dashboardService');

const router = express.Router();

const START_SEASON = 2005;
const CURRENT_SEASON = new Date().getFullYear();
const DELAY_MS = 500; // for rate limits

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildUrl(season) {
    return `https://api.jolpi.ca/ergast/f1/${season}/constructors/red_bull/results.json?limit=100`;
}

function mapDriver(result) {
    return {
        driverId: result.Driver.driverId,
        name: `${result.Driver.givenName} ${result.Driver.familyName}`,
        code: result.Driver.code,
        position: result.positionText,
        points: parseFloat(result.points),
        grid: parseInt(result.grid),
        status: result.status,
    };
}

router.post('/sync', async (req, res) => {
    let totalProcessed = 0;
    const errors = [];
    for (let season = START_SEASON; season <= CURRENT_SEASON; season++) {
        try {
            const { data } = await axios.get(buildUrl(season));
            const races = data.MRData.RaceTable.Races;

            if (!races.length) {
                await sleep(DELAY_MS);
                continue;
            }

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

            await RaceResult.bulkWrite(ops);
            totalProcessed += ops.length;
            console.log(`Season ${season}: processed ${ops.length} races`);
        } catch (err) {
            console.error(`Failed on season ${season}:`, err.message);
            errors.push({ season, error: err.message });
        }
        await sleep(DELAY_MS);
    }

    res.json({
        message: 'Full sync complete',
        totalProcessed,
        errors,
    });
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search?.trim() || "";
        let query = {};

        if (search) {
            const regex = new RegExp(search, "i");
            query = {
                $or: [
                    { raceName: regex },
                    { country: regex },
                    { location: regex },
                    { "driver1.name": regex },
                    { "driver2.name": regex },
                    { season: Number(search) || -1 },
                ],
            };
        }

        const totalResults = await RaceResult.countDocuments(query);

        const results = await RaceResult.find(query)
            .sort({ season: -1, round: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            results,
            currentPage: page,
            totalPages: Math.ceil(totalResults / limit),
            totalResults,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Failed to fetch results',
        });
    }
});

router.post('/analytics/sync', async (req, res) => {
    try {
        const result = await syncStandingsHistory();

        res.json({
            message: 'Standings history sync complete',
            totalProcessed: result.totalProcessed,
            errors: result.errors,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to sync standings history',
        });
    }
});

router.get('/analytics/standings-history', async (req, res) => {
    try {
        const data = await getStandingsHistoryFromDb();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch standings history',
        });
    }
});

router.get('/dashboard', async (req, res) => {
    try {
        const data = await getDashboardData();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch dashboard data',
        });
    }
});

router.delete('/', async (req, res) => {
    try {
        const result = await RaceResult.deleteMany({});

        res.json({
            message: 'All race data deleted',
            deletedCount: result.deletedCount
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Delete failed'
        });
    }
});

module.exports = router;