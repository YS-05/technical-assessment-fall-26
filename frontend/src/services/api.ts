import type { RaceResult, PaginatedRaceResults } from "../types/RaceResults";

const BASE_URL = "http://localhost:3000/api/f1";

export async function getRaceResults(
    page: number
): Promise<PaginatedRaceResults> {

    const res = await fetch(
        `${BASE_URL}?page=${page}`
    );

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