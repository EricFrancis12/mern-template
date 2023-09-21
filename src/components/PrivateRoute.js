import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
    console.log('PrivateRoute');

    const { currentUser } = useAuth();
    console.log(currentUser);

    return currentUser
        ? children
        : <Navigate to='/login' />
}