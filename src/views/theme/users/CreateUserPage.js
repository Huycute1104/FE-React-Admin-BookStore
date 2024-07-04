/* eslint-disable prettier/prettier */
import React from 'react'
import { Box, Typography, TextField, Button, Grid } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const CreateUserPage = () => {
  const initialValues = {
    username: '',
    email: '',
    role: '',
    password: '',
  }

  const navigate = useNavigate()

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
    // Add logic to create a new user (API call or state update)
    navigate('/users') // Redirect to user list after submission
    toast.success('User created successfully')
  }

  const handleBack = () => {
    navigate('/users') // Navigate back to user list
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Grid item>
          <Typography variant="h5">Create New User</Typography>
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
                name="username"
                label="Username"
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="role"
                label="Role"
                error={touched.role && !!errors.role}
                helperText={touched.role && errors.role}
                sx={{ borderRadius: '20px' }}
              />
            </Box>
            <Box marginBottom={2}>
              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
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

export default CreateUserPage
