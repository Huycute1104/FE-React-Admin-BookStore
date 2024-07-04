/* eslint-disable prettier/prettier */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeOnClick
      pauseOnHover={false}
      theme="dark"
      draggable={true}
    />
    <App />
  </Provider>,
)
