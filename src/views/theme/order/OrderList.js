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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem as SelectMenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle'; // Changed to ChangeCircleIcon
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { API_HOST } from '../../../api/config';
import OrderDetailDialog from './OrderDetailDialog';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false); // Changed to openStatusDialog
  const [newStatus, setNewStatus] = useState(''); // State for the new status
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [fetchData, setFetchData] = useState(false);

  // State for search parameters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [userId, setUserId] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const token = localStorage.getItem('token');

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_HOST}/api/orders`, {
        params: {
          pageIndex,
          pageSize,
          StartDate: startDate || null,
          EndDate: endDate || null,
          MinPrice: minPrice || null,
          MaxPrice: maxPrice || null,
          CustomerPhone: customerPhone || null,
          CustomerName: customerName || null,
          UserId: userId || null,
          OrderStatus: orderStatus || null
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API Response:', response.data); 
      const { totalPages, items } = response.data;
      setOrders(items);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to fetch orders.');
    }
  };

  useEffect(() => {
    if (fetchData) {
      fetchOrders();
      setFetchData(false);
    }
  }, [fetchData, pageIndex]);

  const handleSearch = () => {
    setFetchData(true); 
  };

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

  const handleChangeStatusClick = () => {
    handleMenuClose();
    setOpenStatusDialog(true);
  };

  const handleChangeStatusConfirm = async () => {
    try {
      if (!selectedOrder || !newStatus) {
        console.error('No order selected or status not selected.');
        setOpenStatusDialog(false);
        return;
      }

      await axios.put(`${API_HOST}/api/orders/${selectedOrder.orderId}/status`, null, {
        params: {
          newStatus
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      const updatedOrders = orders.map(order =>
        order.orderId === selectedOrder.orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);
      setOpenStatusDialog(false);
      toast.success('Order status updated successfully.');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update order status.';
      toast.error(`${errorMessage}`);
      setOpenStatusDialog(false);
    }
  };

  const handleChangeStatusCancel = () => {
    setOpenStatusDialog(false);
    setSelectedOrder(null);
    setNewStatus('');
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
      <Box marginBottom={2} display="flex" flexDirection="column" gap={2}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <TextField
            label="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <TextField
            label="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <TextField
            label="Customer Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <TextField
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <TextField
            label="User ID"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            margin="normal"
            sx={{ flexBasis: 'calc(50% - 16px)' }}
          />
          <FormControl fullWidth margin="normal" sx={{ flexBasis: 'calc(50% - 16px)' }}>
            <InputLabel>Order Status</InputLabel>
            <Select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              label="Order Status"
            >
              <SelectMenuItem value="">None</SelectMenuItem>
              <SelectMenuItem value="Pending">Pending</SelectMenuItem>
              <SelectMenuItem value="Processing">Processing</SelectMenuItem>
              <SelectMenuItem value="Shipped">Shipped</SelectMenuItem>
              <SelectMenuItem value="Delivered">Delivered</SelectMenuItem>
              <SelectMenuItem value="Cancelled">Cancelled</SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
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
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuClick(e, order)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={pageIndex}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
      <ToastContainer />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClick}>
          <InfoIcon /> View
        </MenuItem>
        <MenuItem onClick={handleChangeStatusClick}>
          <ChangeCircleIcon /> Change Status
        </MenuItem>
      </Menu>
      <Dialog open={openStatusDialog} onClose={handleChangeStatusCancel}>
        <DialogTitle>Change Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the new status for the order.
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="New Status"
            >
              <SelectMenuItem value="Pending">Pending</SelectMenuItem>
              <SelectMenuItem value="Processing">Processing</SelectMenuItem>
              <SelectMenuItem value="Shipped">Shipped</SelectMenuItem>
              <SelectMenuItem value="Delivered">Delivered</SelectMenuItem>
              <SelectMenuItem value="Cancelled">Cancelled</SelectMenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeStatusCancel}>Cancel</Button>
          <Button onClick={handleChangeStatusConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <OrderDetailDialog
        open={openDetailDialog}
        order={selectedOrder}
        onClose={handleDetailClose}
      />
    </Box>
  );
};

export default OrderList;
