import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 5, sm: 6 },

        background: `
  linear-gradient(
    -45deg,
    #000017,
    #8b0000,
    #070736,
    #ff0000
  )
`,
backgroundSize: "600% 600%",
animation: "gradientShift 10s ease infinite",

        "@keyframes gradientShift": {
          "0%": {
            backgroundPosition: "0% 50%",
          },

          "50%": {
            backgroundPosition: "100% 50%",
          },

          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
          zIndex: 1,
          p: 2,
        }}
      />

      <Typography
        variant="h1"
        sx={{
          zIndex: 2,
          fontWeight: "bold",
          color: "error.main",
          fontSize: { xs: "3rem", md: "6rem" },
          textAlign: "center"
        }}
      >
        Red Bull Racing
      </Typography>

      <Typography
      variant="h6"
        sx={{
          zIndex: 2,
          mt: 3,
          maxWidth: 900,
          textAlign: "center",
        }}
      >
        Analyze Red Bull Racing’s constructor dominance,
        driver performance, championship history, and
        race-level results from 2005 to today.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "center",
          mt: 4,
          zIndex: 2,
        }}
      >
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          size="large"
          sx={{
            border: "1px solid white",
          }}
        >
          Explore Dashboard
        </Button>

        <Button
          component={RouterLink}
          to="/data"
          variant="contained"
          size="large"
          sx={{
            border: "1px solid white",
          }}
        >
          View Race Data
        </Button>
      </Stack>

    </Box>
  );
};

export default Home;