/* eslint-disable prettier/prettier */
import React from 'react'
import { Box, Typography, TextField, Button, Grid } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const validationSchema = Yup.object({
  productName: Yup.string().required('Product Name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .moreThan(0, 'Price must be greater than 0')
    .required('Price is required')
    .typeError('Price must be a number'),
})

const CreateProductPage = () => {
  const initialValues = {
    productName: '',
    category: '',
    description: '',
    price: '',
  }

  const navigate = useNavigate()

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
  }

  const handleBack = () => {
    navigate('/theme/product')
    toast.success('Back to ProductList')
  }

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
                name="productName"
                label="Product Name"
                error={touched.productName && !!errors.productName}
                helperText={touched.productName && errors.productName}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="category"
                label="Category"
                error={touched.category && !!errors.category}
                helperText={touched.category && errors.category}
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
                name="price"
                label="Price"
                type="number"
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default CreateProductPage
