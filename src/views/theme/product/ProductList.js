import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import axios from 'axios'; // Import Axios for making HTTP requests
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchBooks();
  }, [currentPage, limit]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching books with token:', token);

      const response = await axios.get('https://localhost:7050/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pageIndex: currentPage,
          pageSize: limit,
          //bookName: searchTerm,
        },
      });

      console.log('Response:', response);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);

      if (error.response) {
        // Server responded with a status code out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Request data:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error message:', error.message);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (bookId) => {
    setSelectedBookId(bookId);
    setOpenDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedBookId(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://localhost:7050/api/books/${selectedBookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Delete response:', response);

      // Update books list after deletion
      fetchBooks();

      setOpenDialog(false);
      setSelectedBookId(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      // Handle error
    }
  };

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
            component={Link}
            to="/theme/create-product"
            sx={{ borderRadius: '20px', padding: '12px 24px', fontSize: '1rem', marginLeft: 3 }}
          >
            Add Book
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Units In Stock</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.description}</TableCell>
                <TableCell>{book.unitPrice}</TableCell>
                <TableCell>{book.unitsInStock}</TableCell>
                <TableCell>{book.discount}</TableCell>
                <TableCell>{book.category.categoryName}</TableCell>
                <TableCell>
                  {book.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.altText}
                      style={{ width: '50px', height: '50px' }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteClick(book.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this book?</DialogContentText>
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
    </Box>
  );
};

export default ProductList;
