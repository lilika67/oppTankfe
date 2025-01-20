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
  FormControlLabel,
  Switch,
} from "@mui/material";
import axios from "axios";

const AddCategory = ({ open, onClose, onCategoryAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    parent: "",
    color: "#000000",
    icon: "default-icon",
  });

  const [isSubcategory, setIsSubcategory] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    if (isSubcategory) {
      fetchParentCategories();
    }
  }, [isSubcategory]);

  const fetchParentCategories = async () => {
    try {
      const response = await axios.get("https://eric-wallet-bn.onrender.com/api/categories");
      setParentCategories(response.data.filter((c) => !c.parent));
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...formData,
        parent: isSubcategory ? formData.parent : null,
      };

      const response = await axios.post(
        "https://eric-wallet-bn.onrender.com/api/categories",
        categoryData
      );
      onCategoryAdded(response.data);
      handleClose();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "expense",
      parent: "",
      color: "#000000",
      icon: "default-icon",
    });
    setIsSubcategory(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add {isSubcategory ? "Subcategory" : "Category"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isSubcategory}
                    onChange={(e) => setIsSubcategory(e.target.checked)}
                  />
                }
                label="Create as subcategory"
              />
            </Grid>

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

            {!isSubcategory && (
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

            {isSubcategory && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Parent Category</InputLabel>
                  <Select
                    name="parent"
                    value={formData.parent}
                    onChange={handleChange}
                    label="Parent Category"
                  >
                    {parentCategories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add {isSubcategory ? "Subcategory" : "Category"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCategory;
