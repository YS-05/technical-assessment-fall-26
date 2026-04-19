const axios = require('axios');
const StandingsHistory = require('../models/StandingsHistory');

const START_SEASON = 2005;
const CURRENT_SEASON = new Date().getFullYear();
const DELAY_MS = 1000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function constructorUrl(season) {
    return `https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`;
}

function driverUrl(season) {
    return `https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`;
}

async function syncStandingsHistory() {
    let totalProcessed = 0;
    const errors = [];

    for (let season = START_SEASON; season <= CURRENT_SEASON; season++) {
        try {
            const constructorResponse = await axios.get(constructorUrl(season));
            await sleep(DELAY_MS);
            const driverResponse = await axios.get(driverUrl(season));
            await sleep(DELAY_MS);

            const constructorStandings =
                constructorResponse.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];
            const driverStandings =
                driverResponse.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
            const redBullConstructor = constructorStandings.find(
                team => team.Constructor.constructorId === 'red_bull'
            );

            const redBullDrivers = driverStandings.filter(driver =>
                driver.Constructors.some(
                    constructor => constructor.constructorId === 'red_bull'
                )
            );
            if (!redBullConstructor || redBullDrivers.length === 0) {
                errors.push({
                    season,
                    error: 'Missing constructor or driver standings data',
                });
                continue;
            }
            const bestDriver = redBullDrivers.reduce((best, current) => {
                const bestPosition = parseInt(best.position, 10);
                const currentPosition = parseInt(current.position, 10);
                return currentPosition < bestPosition ? current : best;
            });

            await StandingsHistory.updateOne(
                { season },
                {
                    $set: {
                        season,
                        constructorPosition: parseInt(redBullConstructor.position, 10),
                        constructorPoints: parseFloat(redBullConstructor.points),
                        constructorWins: parseInt(redBullConstructor.wins, 10),
                        bestDriverPosition: parseInt(bestDriver.position, 10),
                        bestDriverName: `${bestDriver.Driver.givenName} ${bestDriver.Driver.familyName}`,
                        bestDriverPoints: parseFloat(bestDriver.points),
                        bestDriverWins: parseInt(bestDriver.wins, 10),
                        fetchedAt: new Date(),
                    },
                },
                { upsert: true }
            );
            totalProcessed += 1;
            console.log(`Synced standings for season ${season}`);
        } catch (err) {
            console.error(`Failed standings sync for ${season}:`, err.message);
            errors.push({
                season,
                error: err.message,
            });
        }
    }

    return {
        totalProcessed,
        errors,
    };
}

async function getStandingsHistoryFromDb() {
    const rows = await StandingsHistory.find().sort({ season: 1 });
    return {
        constructorHistory: rows.map(row => ({
            season: row.season,
            position: row.constructorPosition,
            points: row.constructorPoints,
            wins: row.constructorWins,
        })),
        bestDriverHistory: rows.map(row => ({
            season: row.season,
            position: row.bestDriverPosition,
            driver: row.bestDriverName,
            points: row.bestDriverPoints,
            wins: row.bestDriverWins,
        })),
    };
}

module.exports = {
    syncStandingsHistory,
    getStandingsHistoryFromDb,
};