import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserStore from '../../stores/userStore';

const SellerProtectedRoute = () => {
    const { user, loading, fetchUser } = useUserStore();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (token && !user) {
            fetchUser(token);
        }
    }, [token, user, fetchUser]);

    if (!token) {
        toast.error('Please login to access this page.');
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return null; // Or a spinner
    }

    if (user && !user.is_staff) {
        toast.error('Access Denied: Sellers only.');
        return <Navigate to="/dashboard" replace />;
    }

    return user && user.is_staff ? <Outlet /> : null;
};

export default SellerProtectedRoute;
