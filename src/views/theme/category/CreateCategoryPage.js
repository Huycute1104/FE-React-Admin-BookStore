/* eslint-disable prettier/prettier */
import React from 'react'
import { Box, Typography, TextField, Button, Grid } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify' 
import 'react-toastify/dist/ReactToastify.css' 
import axios from 'axios'
import { API_HOST } from '../../../api/config' 

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
})

const CreateCategoryPage = () => {
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token') 
      const response = await axios.post(`${API_HOST}/api/categories`, {
        name: values.name,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('API response:', response.data)
      toast.success('Category created successfully') 
      navigate('/theme/category')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error('API error:', error.response.data.message)
        toast.error(error.response.data.message) 
      } else {
        console.error('Failed to create category:', error)
        toast.error('Failed to create category') 
      }
    }
  }
  

  const handleBack = () => {
    navigate('/theme/category')
    // toast.success('Back to Category List') // Show success toast message
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h5">Create New Category</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleBack} sx={{ borderRadius: '12px' }}>
            Back
          </Button>
        </Grid>
      </Grid>
      <Formik
        initialValues={{ name: '' }}
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
                label="Name"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '12px' }}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default CreateCategoryPage
