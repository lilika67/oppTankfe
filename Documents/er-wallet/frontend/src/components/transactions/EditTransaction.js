import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

const EditTransaction = ({
  open,
  onClose,
  transaction,
  onTransactionUpdated,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    subCategory: "",
    account: "",
    description: "",
    date: new Date(),
  });

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category?._id,
        subCategory: transaction.subCategory?._id,
        account: transaction.account?._id,
        description: transaction.description,
        date: new Date(transaction.date),
      });
    }
  }, [transaction]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, accountsRes] = await Promise.all([
          axios.get("https://eric-wallet-bn.onrender.com/api/categories"),
          axios.get("https://eric-wallet-bn.onrender.com/api/accounts"),
        ]);
        setCategories(categoriesRes.data);
        setAccounts(accountsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find(
        (c) => c._id === formData.category
      );
      setSubCategories(selectedCategory?.subcategories || []);
    }
  }, [formData.category, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTransaction = {
        ...transaction,
        ...formData,
      };
      onTransactionUpdated(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Transaction</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sub-Category</InputLabel>
                <Select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  label="Sub-Category"
                  disabled={!formData.category}
                >
                  {subCategories.map((subCategory) => (
                    <MenuItem key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Account</InputLabel>
                <Select
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  label="Account"
                >
                  {accounts.map((account) => (
                    <MenuItem key={account._id} value={account._id}>
                      {account.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      date: newValue,
                    }));
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update Transaction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTransaction;
