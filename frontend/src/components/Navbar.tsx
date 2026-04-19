import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Race Data", path: "/data" },
  { label: "Analytics", path: "/analytics" },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <AppBar
  position="sticky"
  color="transparent"
  sx={{
    backgroundColor: "primary.main",
    px: 3,
    borderBottom: "1px solid white",
    boxShadow: "none",
  }}
>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "error.main" }}>
          Red Bull Analytics
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {navLinks.map(({ label, path }) => (
            <Button
              key={path}
              component={RouterLink}
              to={path}
              sx={{
                color: pathname === path ? "error.main" : "text.disabled",
                fontWeight: pathname === path ? "bold" : "normal",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;