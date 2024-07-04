/* eslint-disable prettier/prettier */
import React from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useParams, useNavigate } from 'react-router-dom'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
})

const EditCategoryPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const getCategoryById = (categoryId) => {
    return { id: categoryId, name: 'Category Name', description: 'Category Description' }
  }

  const category = getCategoryById(id)

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
    navigate('/theme/category')
  }

  const handleBack = () => {
    navigate('/theme/category')
  }

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
      <Formik initialValues={category} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
            <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default EditCategoryPage
