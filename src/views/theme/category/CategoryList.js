/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_HOST } from '../../../api/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_HOST}/api/categories`, {
          params: { pageIndex, pageSize },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API response:', response.data); 
        setCategories(response.data || []);
        setTotalPages(response.data.totalPages || 5);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [pageIndex, pageSize]);

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (category) => {
    handleMenuClose();
    navigate(`/theme/category/edit/${category.id}`, { state: { categoryName: category.name } });
  };

  const handleDeleteClick = (event, category) => {
    handleMenuClose();
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedCategory) {
        console.error('No category selected for deletion.');
        setOpenDialog(false);
        return;
      }
  
      const token = localStorage.getItem('token');
      await axios.delete(`${API_HOST}/api/categories/${selectedCategory.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setOpenDialog(false);
      toast.success('Category deleted successfully.');
      setSelectedCategory(null); 
    } catch (error) {
      console.error('Failed to delete category:', error);
      setOpenDialog(false);
      toast.error('Failed to delete category.');
    }
  };
  
  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedCategory(null); 
  };

  const handleAddCategory = () => {
    navigate('/theme/category/create');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value);
  };

  const filteredCategories = categories.filter((cat) => {
    return cat.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              borderRadius: '999px',
              fontSize: '1rem',
              width: '600px',
              marginLeft: '20px',
            }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleAddCategory}
            sx={{ borderRadius: '20px', padding: '12px 20px', fontSize: '1rem', marginLeft: 2 }}
          >
            Add Category
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, cat)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleEditClick(cat)}>
                      <BorderColorIcon fontSize="small" sx={{ marginRight: 1 }} />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={(event) => handleDeleteClick(event, cat)}>
                      <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination count={totalPages} page={pageIndex} onChange={handlePageChange} color="primary" />
      </Box>

      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ backgroundColor: '#f44336', color: '#fff' }}>
          Delete Category
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this category?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default CategoryList;
