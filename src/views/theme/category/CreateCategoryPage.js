/* eslint-disable prettier/prettier */
import React from 'react'
import { Box, Typography, TextField, Button, Grid } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify' // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css' // Import default react-toastify styles

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
})

const CreateCategoryPage = () => {
  const navigate = useNavigate()

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
    navigate('/categories')
  }

  const handleBack = () => {
    navigate('/theme/category')
    toast.success('Back to Category List') // Show success toast message
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
        initialValues={{ name: '', description: '' }}
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
