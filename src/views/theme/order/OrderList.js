/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Mock data for viewing
    const mockOrders = [
      { id: 1, customerName: 'John Doe', orderDate: '2023-07-01', totalAmount: 100, status: 'Completed' },
      { id: 2, customerName: 'Jane Smith', orderDate: '2023-07-02', totalAmount: 200, status: 'Pending' },
      { id: 3, customerName: 'Alice Johnson', orderDate: '2023-07-03', totalAmount: 150, status: 'Shipped' },
      { id: 4, customerName: 'Bob Brown', orderDate: '2023-07-04', totalAmount: 250, status: 'Processing' },
      { id: 5, customerName: 'Charlie Green', orderDate: '2023-07-05', totalAmount: 300, status: 'Delivered' },
    ];
    setOrders(mockOrders);
    setTotalPages(1); // Set total pages to 1 for mock data
  }, []);

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewClick = () => {
    handleMenuClose();
    setOpenDetailDialog(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    const newOrders = orders.filter(order => order.id !== selectedOrder.id);
    setOrders(newOrders);
    setOpenDeleteDialog(false);
    toast.success('Order deleted successfully.');
    setSelectedOrder(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedOrder(null);
  };

  const handleDetailClose = () => {
    setOpenDetailDialog(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value);
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, order)}
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
                    <MenuItem onClick={handleViewClick}>
                      <InfoIcon fontSize="small" sx={{ marginRight: 1 }} />
                      View Order Detail
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
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ backgroundColor: '#f44336', color: '#fff' }}>
          Delete Order
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this order?</DialogContentText>
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
      <Dialog open={openDetailDialog} onClose={handleDetailClose}>
        <DialogTitle>Order Detail</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography>ID: {selectedOrder.id}</Typography>
              <Typography>Customer Name: {selectedOrder.customerName}</Typography>
              <Typography>Order Date: {selectedOrder.orderDate}</Typography>
              <Typography>Total Amount: {selectedOrder.totalAmount}</Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default OrderList;
