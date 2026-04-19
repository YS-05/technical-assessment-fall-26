import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import {
  Link as RouterLink,
  useLocation,
} from "react-router-dom";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Race Data", path: "/data" },
  { label: "Analytics", path: "/analytics" },
];

function Navbar() {
  const { pathname } = useLocation();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const openMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

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
      <Toolbar
  sx={{
    minHeight: "64px !important",
    height: "64px",
  }}
>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "error.main",
          }}
        >
          RB F1
        </Typography>

        {/* Desktop Nav */}
        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            gap: 3,
          }}
        >
          {navLinks.map(({ label, path }) => (
            <Button
              key={path}
              component={RouterLink}
              to={path}
              sx={{
                color:
                  pathname === path
                    ? "error.main"
                    : "text.disabled",

                fontWeight:
                  pathname === path
                    ? "bold"
                    : "normal",
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Mobile Hamburger */}
        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
          }}
        >
          <IconButton
            onClick={openMenu}
            sx={{ color: "error.main" }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            {navLinks.map(({ label, path }) => (
              <MenuItem
                key={path}
                component={RouterLink}
                to={path}
                onClick={closeMenu}
              >
                {label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;