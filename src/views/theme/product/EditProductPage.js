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
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_HOST } from '../../../api/config';

const validationSchema = Yup.object({
  productName: Yup.string().required('Product Name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .moreThan(0, 'Price must be greater than 0')
    .required('Price is required')
    .typeError('Price must be a number'),
  discount: Yup.number()
    .moreThan(0, 'Discount must be greater than 0')
    .required('Discount is required')
    .typeError('Discount must be a number'),
});

const EditProductPage = () => {
  const { id } = useParams(); // Ensure this is correctly getting the product ID from the URL
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const idbook = location.state?.idbook || id; // Get idbook from state or fallback to id

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_HOST}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Categories response:', response.data); // Log the response for debugging

      // Ensure the response contains a categories array
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
      console.log('Product data:', productData); // Log the product data for debugging
      // Set initial values for Formik
      setProduct({
        productName: productData.name,
        description: productData.description,
        category: productData.category.categoryId,
        price: productData.unitPrice,
        discount: productData.discount,
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
    console.log('Product ID from URL or state:', idbook); // Log the id to verify
    fetchCategories();
    fetchProduct(idbook);
  }, [idbook]);

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_HOST}/api/books/${idbook}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
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
                label="Book Name"
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
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProductPage;
