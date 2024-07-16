/* eslint-disable prettier/prettier */
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
  Pagination,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { API_HOST } from '../../../api/config';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'ban', 'unban'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_HOST}/api/users?pageIndex=${page}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers(pageIndex);
  }, [pageIndex]);

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleBanClick = (user) => {
    setSelectedUser(user);
    setDialogType(user.userStatus ? 'ban' : 'unban');
    setOpenDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) {
      toast.error('No user selected.');
      return;
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(`${API_HOST}/api/users/toggle/${selectedUser.id}`, null, config);
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, userStatus: dialogType === 'ban' ? false : true } : user,
      );
      setUsers(updatedUsers);
      toast.success(
        dialogType === 'ban'
          ? `User ${selectedUser.email} has been banned.`
          : `User ${selectedUser.email} has been unbanned.`
      );
    } catch (error) {
      console.error(`Failed to ${dialogType} user:`, error);
      toast.error(`Failed to ${dialogType} user.`);
    }

    setOpenDialog(false);
  };

  const handleCancelAction = () => {
    setOpenDialog(false);
  };

  const handleAddUser = () => {
    navigate('/theme/user/create');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const emailIncludesSearchTerm = user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterValue === 'active') {
      return user.userStatus && emailIncludesSearchTerm;
    } else if (filterValue === 'banned') {
      return !user.userStatus && emailIncludesSearchTerm;
    }
    return emailIncludesSearchTerm;
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
          <FormControl variant="outlined" sx={{ marginLeft: 2 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterValue}
              onChange={handleFilterChange}
              label="Filter"
              sx={{ width: 120, borderRadius: '20px' }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="banned">Banned</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role.roleName}</TableCell>
                <TableCell>{user.userStatus ? 'Active' : 'Banned'}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, user)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl) && selectedUser && selectedUser.id === user.id}
                    onClose={handleMenuClose}
                  >
                    {user.role.roleName === 'Customer' && (
                      <MenuItem onClick={() => handleBanClick(user)}>
                        {user.userStatus ? (
                          <>
                            <BlockIcon fontSize="small" sx={{ marginRight: 1 }} />
                            Ban
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon fontSize="small" sx={{ marginRight: 1 }} />
                            Unban
                          </>
                        )}
                      </MenuItem>
                    )}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={pageIndex}
        onChange={(event, value) => setPageIndex(value)}
        color="primary"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem',
        }}
      />
      <ToastContainer />
      <Dialog open={openDialog} onClose={handleCancelAction}>
        <DialogTitle>{dialogType === 'ban' ? 'Ban User' : 'Unban User'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {dialogType === 'ban' ? 'ban' : 'unban'} user {selectedUser?.email}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
