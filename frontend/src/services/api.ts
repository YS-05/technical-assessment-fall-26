import type { RaceResult, PaginatedRaceResults, StandingsHistoryResponse } from "../types/RaceResults";

const BASE_URL = "http://localhost:3000/api/f1";

export async function getRaceResults(
    page: number,
    search: string
): Promise<PaginatedRaceResults> {
    const params = new URLSearchParams({
        page: String(page),
        search,
    });

    const res = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!res.ok) {
        throw new Error("Failed to fetch race results");
    }

    return res.json();
}

export async function syncRaceResults() {
    const res = await fetch(`${BASE_URL}/sync`, {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("Failed to sync race results");
    }

    return res.json();
}

export async function deleteRaceResults() {
    const res = await fetch(BASE_URL, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete race results");
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