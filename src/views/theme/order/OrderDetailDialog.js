/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const OrderDetailDialog = ({ open, onClose, order }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Order Detail</DialogTitle>
      <DialogContent>
        {order && (
          <Box>
            <Box marginBottom={2}>
              <Typography variant="h6" marginBottom={1}>
                Order Information
              </Typography>
              <Typography>ID: {order.orderId}</Typography>
              <Typography>Customer Name: {order.customerName}</Typography>
              <Typography>Order Date: {order.orderDate}</Typography>
              <Typography>Total Amount: {order.total}</Typography>
              <Typography>Status: {order.orderStatus}</Typography>
              <Typography>Phone: {order.customerPhone}</Typography>
            </Box>
            <Typography variant="h6" marginBottom={1}>
              Order Details
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Name</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Image</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderDetails.map((detail) => (
                    <TableRow key={detail.bookId}>
                      <TableCell>{detail.book?.bookName || 'N/A'}</TableCell>
                      <TableCell align="right">{detail.unitPrice}</TableCell>
                      <TableCell align="right">{detail.quantity}</TableCell>
                      <TableCell align="right">{detail.discount}</TableCell>
                      <TableCell align="right">
                        {detail.book && detail.book.images && detail.book.images.length > 0 ? (
                          <img
                            src={detail.book.images[1].url}
                            alt={detail.book.bookName}
                            width="100"
                          />
                        ) : (
                          <Typography>No image available</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
