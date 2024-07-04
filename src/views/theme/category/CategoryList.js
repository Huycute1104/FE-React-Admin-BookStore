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
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { useNavigate } from 'react-router-dom'

const initialCategories = [
  { id: 1, name: 'Category 1', description: 'Description for Category 1' },
  { id: 2, name: 'Category 2', description: 'Description for Category 2' },
]

const CategoryList = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const navigate = useNavigate()

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget)
    setSelectedCategory(category)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedCategory(null)
  }

  const handleEditClick = () => {
    handleMenuClose()
    navigate(`/theme/category/edit/${selectedCategory.id}`)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setOpenDialog(true)
  }

  const handleDeleteConfirm = () => {
    setCategories(categories.filter((category) => category.id !== selectedCategory.id))
    setOpenDialog(false)
  }

  const handleDeleteCancel = () => {
    setOpenDialog(false)
  }

  const handleAddCategory = () => {
    navigate('/theme/category/create')
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  const filteredCategories = categories.filter((category) => {
    if (filterValue === 'active') {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            </Select>
          </FormControl>
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
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, category)}
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
                    <MenuItem onClick={handleEditClick}>
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
    </Box>
  )
}

export default CategoryList
