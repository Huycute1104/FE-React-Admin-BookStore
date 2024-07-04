/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
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
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const initialUsers = [
  {
    id: 1,
    username: 'User 1',
    email: 'user1@example.com',
    role: 'Admin',
    banned: false,
  },
  {
    id: 2,
    username: 'User 2',
    email: 'user2@example.com',
    role: 'User',
    banned: false,
  },
  {
    id: 3,
    username: 'User 3',
    email: 'user3@example.com',
    role: 'User',
    banned: false,
  },
  {
    id: 4,
    username: 'User 4',
    email: 'user3@example.com',
    role: 'User',
    banned: true,
  },
]

const UserList = () => {
  const [users, setUsers] = useState(initialUsers)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const navigate = useNavigate()

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleEditClick = () => {
    handleMenuClose()
    navigate(`/theme/user/edit/${selectedUser.id}`)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setOpenDialog(true)
  }

  const handleDeleteConfirm = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id))
    setOpenDialog(false)
  }

  const handleDeleteCancel = () => {
    setOpenDialog(false)
  }

  const handleAddUser = () => {
    navigate('/theme/user/create')
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  const handleBanUser = () => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, banned: true } : user,
    )
    setUsers(updatedUsers)
    handleMenuClose()
    toast.success(`User ${selectedUser.username} has been banned.`)
  }

  const handleUnbanUser = () => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, banned: false } : user,
    )
    setUsers(updatedUsers)
    handleMenuClose()
    toast.success(`User ${selectedUser.username} has been unbanned.`)
  }

  const filteredUsers = users.filter((user) => {
    const usernameIncludesSearchTerm = user.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    if (filterValue === 'active') {
      return !user.banned && usernameIncludesSearchTerm
    } else if (filterValue === 'banned') {
      return user.banned && usernameIncludesSearchTerm
    }
    return usernameIncludesSearchTerm
  })

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
              <MenuItem value="banned">Ban</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={handleAddUser}
            sx={{ borderRadius: '20px', padding: '12px 20px', fontSize: '1rem', marginLeft: 2 }}
          >
            Add User
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.banned ? 'Banned' : 'Active'}</TableCell>
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
                    <MenuItem onClick={handleEditClick}>
                      <BorderColorIcon fontSize="small" sx={{ marginRight: 1 }} />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick}>
                      <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                      Delete
                    </MenuItem>
                    {user.role === 'User' && user.banned ? (
                      <MenuItem onClick={handleUnbanUser}>
                        <CheckCircleIcon fontSize="small" sx={{ marginRight: 1 }} />
                        Unban
                      </MenuItem>
                    ) : user.role === 'User' ? (
                      <MenuItem onClick={handleBanUser}>
                        <BlockIcon fontSize="small" sx={{ marginRight: 1 }} />
                        Ban
                      </MenuItem>
                    ) : null}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
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
  )
}

export default UserList
