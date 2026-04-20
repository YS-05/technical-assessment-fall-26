import type { PaginatedRaceResults, StandingsHistoryResponse, DashboardData } from "../types/f1";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/f1`;

export async function getRaceResults(
    page: number,
    search: string,
    limit = 20
): Promise<PaginatedRaceResults> {
    const params = new URLSearchParams({
        page: String(page),
        search,
        limit: String(limit),
    });
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) {
        throw new Error("Failed to fetch race results");
    }

    return res.json();
}

export async function getStandingsHistory(): Promise<StandingsHistoryResponse> {
    const res = await fetch(`${BASE_URL}/analytics/standings-history`);

    if (!res.ok) {
        throw new Error("Failed to fetch standings history");
    }

    return res.json();
}

export async function getDashboardData(): Promise<DashboardData> {
    const res = await fetch(`${BASE_URL}/dashboard`);

    if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    return res.json();
}