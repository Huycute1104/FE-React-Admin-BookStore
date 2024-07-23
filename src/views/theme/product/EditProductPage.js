/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_HOST } from '../../../api/config';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const validationSchema = Yup.object({
  productName: Yup.string().required('Product Name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  unitsInStock: Yup.number()
    .moreThan(0, 'Units in Stock must be greater than 0')
    .required('Units in Stock is required')
    .typeError('Units in Stock must be a number'),
  price: Yup.number()
    .moreThan(0, 'Price must be greater than 0')
    .required('Price is required')
    .typeError('Price must be a number'),
    discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .required('Discount is required')
    .typeError('Discount must be a number'),
});

const EditProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const idbook = location.state?.idbook || id;
  const [pageIndex] = useState(1);
  const [pageSize] = useState(1000);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_HOST}/api/categories?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else {
        throw new Error('Categories response does not contain an array');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else {
        toast.error('Failed to fetch categories.');
      }
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_HOST}/api/books/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productData = response.data;
      setProduct({
        productName: productData.name,
        description: productData.description,
        category: productData.category.categoryId,
        unitsInStock: productData.unitsInStock,
        price: productData.unitPrice,
        discount: productData.discount,
        images: productData.images || [],
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else {
        toast.error('Failed to fetch product.');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct(idbook);
  }, [idbook]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      
      // Cập nhật thông tin sản phẩm
      const productData = {
        bookName: values.productName,
        description: values.description,
        unitPrice: values.price,
        unitsInStock: values.unitsInStock,
        discount: values.discount,
        categoryId: values.category,
      };

      await axios.put(`${API_HOST}/api/books/${idbook}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Product updated successfully.');
      navigate('/theme/product');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product.');
    }
  };

  const handleBack = () => {
    navigate('/theme/product');
    toast.success('Back to ProductList');
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_HOST}/api/books/${idbook}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Image deleted successfully.');
      fetchProduct(idbook);
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image.');
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setNewImages([...newImages, ...files]);
  };

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Edit Product
        </Typography>
        <Button variant="contained" onClick={handleBack} sx={{ borderRadius: '12px' }}>
          Back
        </Button>
      </Box>
      <Formik initialValues={product} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="productName"
                label="Product Name"
                error={touched.productName && !!errors.productName}
                helperText={touched.productName && errors.productName}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Field
                  as={Select}
                  name="category"
                  label="Category"
                  error={touched.category && !!errors.category}
                  helperText={touched.category && errors.category}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="unitsInStock"
                label="Units In Stock"
                type="number"
                error={touched.unitsInStock && !!errors.unitsInStock}
                helperText={touched.unitsInStock && errors.unitsInStock}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="price"
                label="Price"
                type="number"
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="discount"
                label="Discount"
                type="number"
                error={touched.discount && !!errors.discount}
                helperText={touched.discount && errors.discount}
              />
            </Box>
            <Box marginBottom={2}>
              <Typography variant="h6">Images</Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {product.images.map((image) => (
                  <Box key={image.imageId} position="relative">
                    <img
                      src={image.url}
                      alt={`Image ${image.imageId}`}
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton
                      onClick={() => handleDeleteImage(image.imageId)}
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                {newImages.map((file, index) => (
                  <Box key={index} position="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New Image ${index}`}
                      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
            <Box marginBottom={2}>
              <Button
                variant="contained"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                sx={{ borderRadius: '12px' }}
              >
                Upload Images
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Box>
            <Box>
              <Button variant="contained" type="submit" sx={{ borderRadius: '12px' }}>
                Save Changes
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProductPage;
