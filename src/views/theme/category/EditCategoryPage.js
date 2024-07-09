/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_HOST } from '../../../api/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
});

const EditCategoryPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialName = state ? state.categoryName : '';

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_HOST}/api/categories/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Category updated successfully:', response.data.category);
      // navigate('/theme/category');
      toast.success(response.data.message);
      
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category.');
    }
  };

  const handleBack = () => {
    navigate('/theme/category');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Edit Category
        </Typography>
        <Button variant="contained" onClick={handleBack} sx={{ borderRadius: '12px' }}>
          Back
        </Button>
      </Box>
      <Formik initialValues={{ name: initialName }} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Name"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default EditCategoryPage;
