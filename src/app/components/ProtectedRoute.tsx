import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('CLIENTE' | 'CAFICULTOR')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F72585]"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to auth page but save the location they were trying to access
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        // Redirect to their default dashboard if role not allowed
        const defaultPath = user.role === 'CAFICULTOR' ? '/admin' : '/catalog';
        return <Navigate to={defaultPath} replace />;
    }

    return <>{children}</>;
}
