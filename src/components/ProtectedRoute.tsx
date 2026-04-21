import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate  = useNavigate();
  
  useEffect(() => {
    // We only want to redirect to login if loading has finished and the user is still not found.
    // The previous code was:
    // if (!user) {
    //   navigate('/', { replace: true });
    // }
    // Which caused a redirect to '/' (also a protected route) causing an infinite loop.
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // console.log(user)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents Outlet from rendering momentarily before redirect
  }

  return <Outlet />;
};

export default ProtectedRoute;

