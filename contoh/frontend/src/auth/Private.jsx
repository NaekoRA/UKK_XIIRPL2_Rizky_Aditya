import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const token = localStorage.getItem('token')  // Memeriksa token di localStorage

  if (!token) {
    // Jika tidak ada token, redirect ke halaman login
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default PrivateRoute
