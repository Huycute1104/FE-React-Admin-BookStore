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
  Grid,
  Card,
  CardMedia,
  LinearProgress
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_HOST } from '../../../api/config'; 
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Book Name is required'),
  description: Yup.string().required('Description is required'),
  unitPrice: Yup.number()
    .moreThan(0, 'Price must be greater than 0')
    .required('Price is required')
    .typeError('Price must be a number'),
  unitsInStock: Yup.number()
    .moreThan(0, 'Units In Stock must be greater than 0')
    .required('Units In Stock is required')
    .integer('Units In Stock must be an integer')
    .typeError('Units In Stock must be a number'),
  discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .required('Discount is required')
    .typeError('Discount must be a number'),
  categoryId: Yup.number()
    .required('Category ID is required')
    .integer('Category ID must be an integer')
    .typeError('Category ID must be a number'),
  images: Yup.array()
    .min(1, 'At least one image is required')
    .required('Images are required')
    .of(Yup.mixed().required('An image is required')),
});

const initialValues = {
  name: '',
  description: '',
  unitPrice: '',
  unitsInStock: '',
  discount: '',
  categoryId: '',
  images: [],
};

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }
      const response = await axios.get(`${API_HOST}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Categories response:', response.data);

      if (response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
        if (response.data.categories.length === 0) {
          toast.warning('No categories available. Please create a category first.');
        }
      } else {
        throw new Error('Categories response does not contain an array');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to fetch categories. Please check the console for more details.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = async (values, { setErrors }) => {
    if (selectedImages.length === 0) {
      setErrors({ images: 'Please select at least one image.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('Name', values.name);
      formData.append('Description', values.description);
      formData.append('UnitPrice', values.unitPrice);
      formData.append('UnitsInStock', values.unitsInStock);
      formData.append('Discount', values.discount);
      formData.append('CategoryId', values.categoryId);

      selectedImages.forEach((image) => {
        formData.append('Images', image);
      });

      const response = await axios.post(`${API_HOST}/api/books`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Product created:', response.data);
      navigate('/theme/product');
      toast.success('Book created successfully!');
    } catch (error) {
      console.error('Error creating product:', error.response?.data);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/theme/product');
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h5">Create New Book</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleBack} sx={{ borderRadius: '12px' }}>
            Back
          </Button>
        </Grid>
      </Grid>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Book Name"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ borderRadius: '20px' }}
              />
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
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="unitPrice"
                label="Unit Price"
                type="number"
                error={touched.unitPrice && !!errors.unitPrice}
                helperText={touched.unitPrice && errors.unitPrice}
                sx={{ borderRadius: '20px' }}
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
                sx={{ borderRadius: '20px' }}
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
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Field
                  as={Select}
                  name="categoryId"
                  label="Category"
                  error={touched.categoryId && !!errors.categoryId}
                  helperText={touched.categoryId && errors.categoryId}
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
              <Typography variant="subtitle1">Upload Images:</Typography>
              <input
                id="contained-button-file"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setSelectedImages(files);
                  setFieldValue('images', files);
                }}
                style={{ display: 'none' }}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span" sx={{ borderRadius: '20px' }}>
                  Choose Images
                </Button>
              </label>
              <Box display="flex" flexDirection="row" marginTop={2}>
                {selectedImages.map((image, index) => (
                  <Card key={index} sx={{ width: 150, marginRight: 2 }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={URL.createObjectURL(image)}
                      alt={`Image ${index + 1}`}
                    />
                  </Card>
                ))}
              </Box>
              <Box marginTop={1}>
                {errors.images && touched.images && (
                  <Typography color="error">{errors.images}</Typography>
                )}
              </Box>
            </Box>
            {uploadProgress > 0 && (
              <Box marginBottom={2}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="textSecondary">{`Upload Progress: ${uploadProgress}%`}</Typography>
              </Box>
            )}
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateProductPage;
