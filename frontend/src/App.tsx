import { ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import redBullTheme from "./theme";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const App = () => {
  return (
    <ThemeProvider theme={redBullTheme}>
      <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </ThemeProvider>
  );
};

export default App;