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
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  role: Yup.string().required('Role is required'),
  banned: Yup.boolean(),
})

const EditUserPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const getUserById = (userId) => {
    return {
      id: userId,
      username: 'User 1',
      email: 'user1@example.com',
      role: 'Admin',
      banned: false,
    }
  }

  const user = getUserById(id)

  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values)
    navigate('/users')
  }

  const handleBack = () => {
    navigate('/theme/user')
    toast.success('Back to UserList')
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h5" gutterBottom>
          Edit User
        </Typography>
        <Button variant="contained" onClick={handleBack} sx={{ borderRadius: '12px' }}>
          Back
        </Button>
      </Box>
      <Formik initialValues={user} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Field
                  as={Select}
                  name="role"
                  label="Role"
                  error={touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Field>
              </FormControl>
            </Box>
            <Box marginBottom={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Field
                  as={Select}
                  name="banned"
                  label="Status"
                  error={touched.banned && !!errors.banned}
                  helperText={touched.banned && errors.banned}
                >
                  <MenuItem value={false}>Active</MenuItem>
                  <MenuItem value={true}>Banned</MenuItem>
                </Field>
              </FormControl>
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

export default EditUserPage
