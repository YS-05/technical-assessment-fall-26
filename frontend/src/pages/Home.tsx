import { Box, Typography } from "@mui/material";
import img from "../assets/redbull.jpg"

const Home = () => {
  return (
    <Box sx={{ height: "calc(100vh - 64px)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
  <Box
  component="img"
  src={img}
  sx={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  }}
/>
<Box
  sx={{
    position: "absolute",
    inset: 0,
    background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8))",
  }}
/>
  <Typography variant="h1" sx={{ zIndex: 2, fontWeight: "bold", color: "error.main" }}>
    Red Bull Racing
  </Typography>
  <Typography sx={{ zIndex: 2, mt: 3 }}>
    Dive deep into Red Bull Racing's F1 journey. Explore historical data, driver statistics, race results, and championship performance analytics.
  </Typography>
</Box>
  );
};

export default Home