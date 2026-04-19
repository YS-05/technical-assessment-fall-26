import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import RaceResultsTable from "../components/RaceResultsTable";
import { deleteRaceResults, getRaceResults, syncRaceResults } from "../services/api";
import type { RaceResult } from "../types/RaceResults";

export default function RaceResults() {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await getRaceResults();
      setResults(data);
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
      await loadResults();
      setMessage("Sync complete");
    } catch {
      setMessage("Sync failed");
    }
  };

  const handleDelete = async () => {
    try {
      setMessage("Deleting...");
      await deleteRaceResults();
      await loadResults();
      setMessage("All race data deleted");
    } catch {
      setMessage("Delete failed");
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "primary.main" }}>
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

      {loading ? <CircularProgress /> : <RaceResultsTable results={results} />}
    </Box>
  );
}