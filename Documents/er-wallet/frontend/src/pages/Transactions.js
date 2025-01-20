import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TablePagination,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddTransaction from "../components/transactions/AddTransaction";
import EditTransaction from "../components/transactions/EditTransaction";
import DeleteDialog from "../components/common/DeleteDialog";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "https://eric-wallet-bn.onrender.com/api/transactions"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
    setOpenAdd(false);
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenEdit(true);
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      await axios.put(
        `https://eric-wallet-bn.onrender.com/api/transactions/${updatedTransaction._id}`,
        updatedTransaction
      );
      setTransactions(
        transactions.map((t) =>
          t._id === updatedTransaction._id ? updatedTransaction : t
        )
      );
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDelete(true);
  };

  const handleDeleteTransaction = async () => {
    try {
      await axios.delete(
        `https://eric-wallet-bn.onrender.com/api/transactions/${selectedTransaction._id}`
      );
      setTransactions(
        transactions.filter((t) => t._id !== selectedTransaction._id)
      );
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Transactions</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.category?.name || "Uncategorized"}
                    {transaction.subCategory?.name && (
                      <Chip
                        size="small"
                        label={transaction.subCategory.name}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{transaction.account?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type}
                      color={
                        transaction.type === "income" ? "success" : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={
                        transaction.type === "income"
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      ${transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(transaction)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(transaction)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Transaction Dialog */}
      <AddTransaction
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onTransactionAdded={handleAddTransaction}
      />

      {/* Edit Transaction Dialog */}
      {selectedTransaction && (
        <EditTransaction
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          transaction={selectedTransaction}
          onTransactionUpdated={handleEditTransaction}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        content="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </Box>
  );
};

export default Transactions;
