import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import StandingsHistoryCharts from "../components/StandingsChart";
import {
  getStandingsHistory,
} from "../services/api";
import type { ConstructorHistoryPoint, BestDriverHistoryPoint } from "../types/RaceResults"

export default function Analytics() {
  const [constructorHistory, setConstructorHistory] = useState<ConstructorHistoryPoint[]>([]);
  const [bestDriverHistory, setBestDriverHistory] = useState<BestDriverHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getStandingsHistory();
        setConstructorHistory(data.constructorHistory);
        setBestDriverHistory(data.bestDriverHistory);
      } catch {
        setMessage("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "primary.main", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Red Bull Analytics
      </Typography>

      {message && (
        <Typography sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <StandingsHistoryCharts
          constructorHistory={constructorHistory}
          bestDriverHistory={bestDriverHistory}
        />
      )}
    </Box>
  );
}