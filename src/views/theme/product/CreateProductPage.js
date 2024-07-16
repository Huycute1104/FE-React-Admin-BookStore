/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Card, CardMedia } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product Name is required'),
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
    .moreThan(0, 'Discount must be greater than 0')
    .required('Discount is required')
    .typeError('Discount must be a number'),
  categoryId: Yup.number()
    .required('Category ID is required')
    .integer('Category ID must be an integer')
    .typeError('Category ID must be a number'),
});

const initialValues = {
  name: '',
  description: '',
  unitPrice: '',
  unitsInStock: '',
  discount: '',
  categoryId: '',
};

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('Name', values.name);
      formData.append('Description', values.description);
      formData.append('UnitPrice', values.unitPrice);
      formData.append('UnitsInStock', values.unitsInStock);
      formData.append('Discount', values.discount);
      formData.append('CategoryId', values.categoryId);

      selectedImages.forEach((image, index) => {
        formData.append('Images', image);
      });

      const response = await axios.post(`${API_HOST}/api/books`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Product created:', response.data);
      navigate('/theme/product');
      toast.success('Product created successfully!');
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
          <Typography variant="h5">Create New Product</Typography>
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
        {({ errors, touched }) => (
          <Form>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Product Name"
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
              <Field
                as={TextField}
                fullWidth
                name="categoryId"
                label="Category ID"
                type="number"
                error={touched.categoryId && !!errors.categoryId}
                helperText={touched.categoryId && errors.categoryId}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <Typography variant="subtitle1">Upload Images:</Typography>
              <input
                id="contained-button-file"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
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
            </Box>
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
