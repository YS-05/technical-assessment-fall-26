export interface DriverResult {
    driverId: string;
    name: string;
    code: string;
    position: string;
    points: number;
    grid: number | null;
    status: string;
}

export interface RaceResult {
    raceId: string;
    season: number;
    round: number;
    date: string;
    raceName: string;
    location: string;
    country: string;
    driver1: DriverResult;
    driver2: DriverResult | null;
    teamPoints: number;
    fetchedAt: string;
}

export interface PaginatedRaceResults {
    results: RaceResult[];
    currentPage: number;
    totalPages: number;
    totalResults: number;
}

export interface ConstructorHistoryPoint {
    season: number;
    position: number;
    points: number;
    wins: number;
}

export interface BestDriverHistoryPoint {
    season: number;
    position: number;
    driver: string;
    points: number;
    wins: number;
}

export interface StandingsHistoryResponse {
    constructorHistory: ConstructorHistoryPoint[];
    bestDriverHistory: BestDriverHistoryPoint[];
}