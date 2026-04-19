import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { getDashboardData } from "../services/api";
import type { DashboardData } from "../types/RaceResults";

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData();
        setData(result);
      } catch {
        setMessage("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>
          {message || "No dashboard data found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "primary.main", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard
      </Typography>

      {message && (
        <Typography sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      {/* Top Stat Cards */}

      <Grid container spacing={3} sx={{ mb: 4 }}>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Constructor Championships"
            value={data.allTimeConstructorChampionships}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Driver Championships"
            value={data.allTimeDriverChampionships}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Current Constructor Standing"
            value={data.currentConstructorStanding ?? "-"}
          />
        </Grid>

      </Grid>

      {/* Lower Section */}

      <Grid container spacing={3}>

        {/* Current Drivers */}

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Current Red Bull Driver Standings
            </Typography>

            <Stack spacing={2}>
              {data.currentDriverStandings.map((driver) => (
                <Paper
                  key={driver.driverId}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    {driver.name}
                  </Typography>

                  <Typography>
                    Position: {driver.position}
                  </Typography>

                  <Typography>
                    Points: {driver.points}
                  </Typography>

                  <Typography>
                    Wins: {driver.wins}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Top Drivers Table */}

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Top 5 Red Bull Drivers
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Driver</TableCell>
                  <TableCell>Avg Points</TableCell>
                  <TableCell>Total Points</TableCell>
                  <TableCell>Races</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.topDriversByAvgPoints.map((driver) => (
                  <TableRow key={driver.driverId}>
                    <TableCell>
                      {driver.driver}
                    </TableCell>

                    <TableCell>
                      {driver.avgPoints}
                    </TableCell>

                    <TableCell>
                      {driver.totalPoints}
                    </TableCell>

                    <TableCell>
                      {driver.races}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}