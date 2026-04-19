import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Pagination, Stack, Typography, TextField } from "@mui/material";
import RaceResultsTable from "../components/RaceResultsTable";
import { deleteRaceResults, getRaceResults, syncRaceResults } from "../services/api";
import type { RaceResult } from "../types/RaceResults";

export default function RaceResults() {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loadResults = async (pageNumber: number, searchValue: string) => {
    try {
      setLoading(true);
      const data = await getRaceResults(pageNumber, searchValue);
      setResults(data.results);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setMessage("Failed to load race results");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setMessage("Syncing...");
      await syncRaceResults();
      await loadResults(1, search);
      setMessage("Sync complete");
    } catch {
      setMessage("Sync failed");
    }
  };

  const handleDelete = async () => {
    try {
      setMessage("Deleting...");
      await deleteRaceResults();
      await loadResults(1, search);
      setMessage("All race data deleted");
    } catch {
      setMessage("Delete failed");
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
  loadResults(value, search);
};

const handleSearchChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  setSearch(event.target.value);
};

  useEffect(() => {
  loadResults(1, debouncedSearch);
}, [debouncedSearch]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);

  return (
    <Box sx={{ p: 4, bgcolor: "primary.main", minHeight: "100vh" }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Red Bull Race Results
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSync}>
            Sync Data
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete All
          </Button>
        </Stack>
      </Stack>

      {message && <Typography sx={{ mb: 2 }}>{message}</Typography>}

      <TextField
            label="Search race, country, driver, or season"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            fullWidth
            sx={{
                mb: 3,
                bgcolor: "white",
                borderRadius: 1,
                "& input": { color: "black" },
                "& .MuiInputLabel-root": { color: "black" },
            }}
        />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <RaceResultsTable results={results} />

          <Stack sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Box>
  );
}