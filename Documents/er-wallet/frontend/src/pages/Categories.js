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
import AddCategory from "../components/categories/AddCategory";
import EditCategory from "../components/categories/EditCategory";
import DeleteDialog from "../components/common/DeleteDialog";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://eric-wallet-bn.onrender.com/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setOpenAdd(false);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setOpenEdit(true);
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      await axios.put(
        `https://eric-wallet-bn.onrender.com/api/categories/${updatedCategory._id}`,
        updatedCategory
      );
      setCategories(
        categories.map((c) =>
          c._id === updatedCategory._id ? updatedCategory : c
        )
      );
      setOpenEdit(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setOpenDelete(true);
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(
        `https://eric-wallet-bn.onrender.com/api/categories/${selectedCategory._id}`
      );
      setCategories(categories.filter((c) => c._id !== selectedCategory._id));
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting category:", error);
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
        <Typography variant="h5">Categories</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Category
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={category.type}
                    color={category.type === "income" ? "success" : "error"}
                    size="small"
                  />
                </Box>

                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <Box mt={2}>
                      <Typography color="textSecondary" gutterBottom>
                        Subcategories:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {category.subcategories.map((sub) => (
                          <Chip key={sub._id} label={sub.name} size="small" />
                        ))}
                      </Box>
                    </Box>
                  )}
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(category)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(category)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Category Dialog */}
      <AddCategory
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onCategoryAdded={handleAddCategory}
      />

      {/* Edit Category Dialog */}
      {selectedCategory && (
        <EditCategory
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          category={selectedCategory}
          onCategoryUpdated={handleEditCategory}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        content="Are you sure you want to delete this category? This will also delete all subcategories. This action cannot be undone."
      />
    </Box>
  );
};

export default Categories;
