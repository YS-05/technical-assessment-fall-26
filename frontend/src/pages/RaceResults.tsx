import { useEffect, useState } from "react";
import { Box, CircularProgress, Pagination, Stack, Typography, TextField, MenuItem } from "@mui/material";
import RaceResultsTable from "../components/RaceResultsTable";
import { getRaceResults } from "../services/api";
import type { RaceResult } from "../types/f1";

export default function RaceResults() {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const loadResults = async (
  pageNumber: number,
  searchValue: string,
  limit = rowsPerPage
) => {
    try {
      setLoading(true);
      const data = await getRaceResults(pageNumber, searchValue, limit);
      setResults(data.results);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setMessage("Failed to load race results");
    } finally {
      setLoading(false);
    }
  };

  const handleRowsChange = (
    event: React.ChangeEvent<HTMLInputElement>
    ) => {
    const value = Number(event.target.value);
    setRowsPerPage(value);
    loadResults(1, search, value);
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
}, [debouncedSearch, rowsPerPage]);

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
        <Typography variant="h4" sx={{ fontWeight: 700, color: "secondary.main" }}>
          Race Results
        </Typography>
      </Stack>

      {message && <Typography sx={{ mb: 2 }}>{message}</Typography>}

      <Stack
        direction="row"
        spacing={2}
        sx={{
            mb: 3,
            alignItems: "center",
        }}
        >
        <TextField
            label="Search race, country, driver, or season"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            fullWidth
            sx={{
            bgcolor: "white",
            borderRadius: 3,
            "& input": { color: "error.main" },
            "& .MuiInputLabel-root": { color: "error.main" },
            }}
        />

        <TextField
            select
            label="Rows"
            value={rowsPerPage}
            onChange={handleRowsChange}
            sx={{
            width: 140,
            bgcolor: "white",
            borderRadius: 3,
            "& .MuiInputLabel-root": { color: "error.main" },
            "& .MuiSelect-select": { color: "error.main" },
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
            },
            }}
        >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
        </TextField>
        </Stack>

      {loading ? (
        <CircularProgress sx={{ color: "white" }} />
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