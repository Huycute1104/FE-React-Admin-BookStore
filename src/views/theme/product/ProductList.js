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
import { useNavigate } from 'react-router-dom'

const initialProducts = [
  {
    id: 1,
    productName: 'Product 1',
    category: 'Category 1',
    brand: 'Brand 1',
    description: 'Description for Product 1',
    price: 100,
  },
  {
    id: 2,
    productName: 'Product 2',
    category: 'Category 2',
    brand: 'Brand 2',
    description: 'Description for Product 2',
    price: 200,
  },
  {
    id: 3,
    productName: 'Product 3',
    category: 'Category 3',
    brand: 'Brand 3',
    description: 'Description for Product 3',
    price: 300,
  },
]

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [sortOrder, setSortOrder] = useState('none')
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
  }

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const handleEditClick = () => {
    handleMenuClose()
    navigate(`/theme/product/edit/${selectedProduct.id}`)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setOpenDialog(true)
  }

  const handleDeleteConfirm = () => {
    setProducts(products.filter((product) => product.id !== selectedProduct.id))
    setOpenDialog(false)
  }

  const handleDeleteCancel = () => {
    setOpenDialog(false)
  }

  const handleAddProduct = () => {
    navigate('/theme/product/create')
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (event) => {
    const newSortOrder = event.target.value
    setSortOrder(newSortOrder)
    sortProductsByPrice(newSortOrder)
  }

  const sortProductsByPrice = (order) => {
    let sortedProducts = [...products]
    if (order === 'lowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price)
    } else if (order === 'highToLow') {
      sortedProducts.sort((a, b) => b.price - a.price)
    }
    setProducts(sortedProducts)
  }

  const filteredProducts = products.filter((product) => {
    if (filterValue === 'active') {
      return product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  let sortedProducts = [...filteredProducts]
  if (sortOrder === 'lowToHigh') {
    sortedProducts.sort((a, b) => a.price - b.price)
  } else if (sortOrder === 'highToLow') {
    sortedProducts.sort((a, b) => b.price - a.price)
  }

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
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort"
              sx={{ width: 120, borderRadius: '20px' }}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="lowToHigh">Low to High</MenuItem>
              <MenuItem value="highToLow">High to Low</MenuItem>
            </Select>
          </FormControl>
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
              <TableCell>PRODUCT NAME</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>BRAND</TableCell>
              <TableCell>DESCRIPTION</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
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
        <DialogTitle>Delete Product</DialogTitle>
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
    </Box>
  )
}

export default ProductList
