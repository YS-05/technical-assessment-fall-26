const StandingsHistory = require('../models/StandingsHistory');
const RaceResult = require('../models/RaceResults');

async function getDashboardData() {
    const standingsRows = await StandingsHistory.find().sort({ season: 1 });
    const raceRows = await RaceResult.find().sort({ season: 1, round: 1 });

    if (standingsRows.length === 0) {
        return {
            allTimeConstructorChampionships: 0,
            allTimeDriverChampionships: 0,
            currentConstructorStanding: null,
            currentDriverStandings: [],
            topDriversByAvgPoints: [],
        };
    }

    const latestSeasonRow = standingsRows[standingsRows.length - 1];

    const allTimeConstructorChampionships = standingsRows.filter(
        row => row.constructorPosition === 1
    ).length;

    const allTimeDriverChampionships = standingsRows.filter(
        row => row.bestDriverPosition === 1
    ).length;

    const currentConstructorStanding = latestSeasonRow.constructorPosition;
    const currentDriverStandings = (latestSeasonRow.drivers || []).map(driver => ({
        driverId: driver.driverId,
        name: driver.name,
        position: driver.position,
        points: driver.points,
        wins: driver.wins,
    }));
    const driverStatsMap = new Map();

    function addDriverRace(driver) {
        if (!driver) return;

        const key = driver.driverId;

        if (!driverStatsMap.has(key)) {
            driverStatsMap.set(key, {
                driverId: driver.driverId,
                name: driver.name,
                totalPoints: 0,
                races: 0,
            });
        }

        const existing = driverStatsMap.get(key);
        existing.totalPoints += driver.points;
        existing.races += 1;
    }

    for (const race of raceRows) {
        addDriverRace(race.driver1);
        addDriverRace(race.driver2);
    }

    const topDriversByAvgPoints = Array.from(driverStatsMap.values())
        .map(driver => ({
            driverId: driver.driverId,
            driver: driver.name,
            totalPoints: Number(driver.totalPoints.toFixed(2)),
            races: driver.races,
            avgPoints: Number((driver.totalPoints / driver.races).toFixed(2)),
        }))
        .sort((a, b) => b.avgPoints - a.avgPoints)
        .slice(0, 5);

    return {
        allTimeConstructorChampionships,
        allTimeDriverChampionships,
        currentConstructorStanding,
        currentDriverStandings,
        topDriversByAvgPoints,
    };
}

module.exports = {
    getDashboardData,
};