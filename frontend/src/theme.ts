import { createTheme } from "@mui/material";

const redBullTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#000017",      // very dark navy 
            contrastText: "#FFC906",
        },
        secondary: {
            main: "#FFC906",      // Red Bull yellow
            contrastText: "#0A1F5C",
        },
        error: {
            main: "#ff3b30",      // F1 red
        },
        background: {
            default: "#070736",   // lighter navy 
            paper: "#070736",
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#FFC906",
            disabled: "#6c757d",
        },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { color: "#FFC906" },
        h2: { color: "#FFC906" },
    },
});

export default redBullTheme;