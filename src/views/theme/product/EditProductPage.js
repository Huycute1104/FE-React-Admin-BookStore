/* eslint-disable prettier/prettier */
import React from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useParams, useNavigate } from 'react-router-dom'
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

const EditProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const getProductById = (productId) => {
    return {
      id: productId,
      productName: 'Product Name',
      category: 'Category 1',
      description: 'Product Description',
      price: 100,
    }
  }

  const product = getProductById(id)

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
  }

  const handleBack = () => {
    navigate('/theme/product')
    toast.success('Back to ProductList')
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
                  <MenuItem value="Category 1">Category 1</MenuItem>
                  <MenuItem value="Category 2">Category 2</MenuItem>
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
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default EditProductPage
