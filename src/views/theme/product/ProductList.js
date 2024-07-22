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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { API_HOST } from '../../../api/config';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_HOST}/api/books?pageIndex=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Book response:', response.data); 
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchProducts(pageIndex);
  }, [pageIndex]);

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = (product) => {
    handleMenuClose();
    console.log('Selected product ID:', selectedProduct.id);
    navigate(`/theme/product/edit/${selectedProduct.id}`, { state: { idbook: selectedProduct.id } });
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleAddProduct = () => {
    navigate('/theme/product/create');
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedProduct) {
        console.error('No product selected for deletion.');
        setOpenDialog(false);
        return;
      }

      const token = localStorage.getItem('token');
      await axios.delete(`${API_HOST}/api/books/${selectedProduct.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== selectedProduct.id));
      setOpenDialog(false);
      toast.success('Product deleted successfully.');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setOpenDialog(false);
      toast.error('Failed to delete product.');
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            onClick={handleAddProduct}
            sx={{ borderRadius: '20px', padding: '12px 24px', fontSize: '1rem', marginLeft: 3 }}
          >
            Add Product
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>UnitsInStock</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.images && product.images.length > 0 && (
                    <img src={product.images[0].url} alt={product.name} width="50" />
                  )}
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.unitPrice}</TableCell>
                <TableCell>{product.unitsInStock}</TableCell>
                <TableCell>{product.discount}</TableCell>
                <TableCell>{product.category.categoryName}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, product)}
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
                    <MenuItem onClick={() => handleEditClick(product)}>
                      <BorderColorIcon fontSize="small" sx={{ marginRight: 1 }} />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick}>
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
          Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
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

export default ProductList;
