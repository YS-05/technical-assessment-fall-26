import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { RaceResult } from "../types/f1";

interface Props {
  results: RaceResult[];
}

export default function RaceResultsTable({ results }: Props) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Season</TableCell>
            <TableCell>Round</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Race</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Driver 1</TableCell>
            <TableCell>P1</TableCell>
            <TableCell>PTS</TableCell>
            <TableCell>Driver 2</TableCell>
            <TableCell>P2</TableCell>
            <TableCell>PTS</TableCell>
            <TableCell>Team PTS</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {results.map((race) => (
            <TableRow key={race.raceId}>
              <TableCell>{race.season}</TableCell>
              <TableCell>{race.round}</TableCell>
              <TableCell>{new Date(race.date).toISOString().split("T")[0]}</TableCell>
              <TableCell>{race.raceName}</TableCell>
              <TableCell>{race.country}</TableCell>
              <TableCell>{race.driver1?.name}</TableCell>
              <TableCell>{race.driver1?.position}</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>{race.driver1?.points}</TableCell>
              <TableCell>{race.driver2?.name ?? "-"}</TableCell>
              <TableCell>{race.driver2?.position ?? "-"}</TableCell>
              <TableCell sx={{ color: "secondary.main" }}>{race.driver2?.points ?? "-"}</TableCell>
              <TableCell sx={{ color: "secondary.main", fontWeight: 600 }}>{race.teamPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}