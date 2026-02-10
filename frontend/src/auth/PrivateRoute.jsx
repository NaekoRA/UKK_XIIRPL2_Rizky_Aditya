import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles, guestOnly }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (guestOnly) {
        if (token && role) {
            if (role === 'admin') return <Navigate to="/admin" replace />;
            if (role === 'petugas') return <Navigate to="/petugas" replace />;
            if (role === 'peminjam') return <Navigate to="/peminjam" replace />;
        }
        return <Outlet />;
    }

    if (!token || !role) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
