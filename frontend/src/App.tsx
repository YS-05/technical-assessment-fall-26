import { ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import redBullTheme from "./theme";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RaceResults from "./pages/RaceResults";
import Analytics from "./pages/Analytics";

const App = () => {
  return (
    <ThemeProvider theme={redBullTheme}>
      <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<RaceResults />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
    </ThemeProvider>
  );
};

export default App;