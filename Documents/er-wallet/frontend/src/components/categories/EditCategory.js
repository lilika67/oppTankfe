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
} from "@mui/material";

const EditCategory = ({ open, onClose, category, onCategoryUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#000000",
    icon: "default-icon",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCategory = {
        ...category,
        ...formData,
      };
      onCategoryUpdated(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
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
      <DialogTitle>Edit Category</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            {!category.parent && (
              <Grid item xs={12}>
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
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                sx={{ "& input": { height: 40 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update Category
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCategory;
