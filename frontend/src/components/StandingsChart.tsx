import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type {
  ConstructorHistoryPoint,
  BestDriverHistoryPoint,
} from "../types/f1";
import { useTheme } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  constructorHistory: ConstructorHistoryPoint[];
  bestDriverHistory: BestDriverHistoryPoint[];
}

export default function StandingsHistoryCharts({
  constructorHistory,
  bestDriverHistory,
}: Props) {    
    
  const theme = useTheme();

  const constructorData = {
    labels: constructorHistory.map((point) => point.season),
    datasets: [
      {
        label: "Constructor Finish",
        data: constructorHistory.map((point) => point.position),
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
        borderWidth: 2,
        tension: 0.25,
      },
    ],
  };

  const bestDriverData = {
    labels: bestDriverHistory.map((point) => point.season),
    datasets: [
      {
        label: "Best Driver Finish",
        data: bestDriverHistory.map((point) => point.position),
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
        borderWidth: 2,
        tension: 0.25,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        reverse: true,
        min: 1,
        max: 22,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Final Standing",
        },
      },
      x: {
        title: {
          display: true,
          text: "Season",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Red Bull Constructor Standing by Season
        </Typography>
        <Box sx={{ height: 350 }}>
          <Line data={constructorData} options={{ ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, max: 11 } } }} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Best Red Bull Driver Standing by Season
        </Typography>
        <Box sx={{ height: 350 }}>
          <Line data={bestDriverData} options={commonOptions} />
        </Box>
      </Paper>
    </Stack>
  );
}