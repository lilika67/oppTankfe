import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddAccount from "../components/accounts/AddAccount";
import EditAccount from "../components/accounts/EditAccount";
import DeleteDialog from "../components/common/DeleteDialog";
import axios from "axios";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("https://eric-wallet-bn.onrender.com/api/accounts");
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
    setOpenAdd(false);
  };

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setOpenEdit(true);
  };

  const handleEditAccount = async (updatedAccount) => {
    try {
      await axios.put(
        `https://eric-wallet-bn.onrender.com/api/accounts/${updatedAccount._id}`,
        updatedAccount
      );
      setAccounts(
        accounts.map((a) => (a._id === updatedAccount._id ? updatedAccount : a))
      );
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleDeleteClick = (account) => {
    setSelectedAccount(account);
    setOpenDelete(true);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `https://eric-wallet-bn.onrender.com/api/accounts/${selectedAccount._id}`
      );
      setAccounts(accounts.filter((a) => a._id !== selectedAccount._id));
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case "bank":
        return <AccountBalanceIcon />;
      case "mobile_money":
        return <AccountBalanceWalletIcon />;
      case "cash":
        return <PaymentsIcon />;
      default:
        return <AccountBalanceIcon />;
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Accounts</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Account
        </Button>
      </Box>

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account._id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box color="primary.main" mr={1}>
                    {getAccountIcon(account.type)}
                  </Box>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {account.name}
                  </Typography>
                  <Chip
                    label={account.type.replace("_", " ").toUpperCase()}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Typography variant="h5" color="primary.main" gutterBottom>
                  {account.currency} {account.balance.toFixed(2)}
                </Typography>
                {account.description && (
                  <Typography color="text.secondary" variant="body2">
                    {account.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(account)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(account)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Account Dialog */}
      <AddAccount
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAccountAdded={handleAddAccount}
      />

      {/* Edit Account Dialog */}
      {selectedAccount && (
        <EditAccount
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          account={selectedAccount}
          onAccountUpdated={handleEditAccount}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        content="Are you sure you want to delete this account? This will also delete all associated transactions. This action cannot be undone."
      />
    </Box>
  );
};

export default Accounts;