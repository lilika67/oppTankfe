import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 2 }}>
          ER Wallet
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate("/")}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={() => navigate("/accounts")}
          >
            Accounts
          </Button>

          <Button
            color="inherit"
            startIcon={<MonetizationOnIcon />}
            onClick={() => navigate("/transactions")}
          >
            Transactions
          </Button>

          <Button
            color="inherit"
            startIcon={<CategoryIcon />}
            onClick={() => navigate("/categories")}
          >
            Categories
          </Button>
        </Box>

        <IconButton
          color="inherit"
          onClick={() => navigate("/profile")}
          sx={{ ml: 2 }}
        >
          <AccountBalanceWalletIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
