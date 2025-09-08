import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProfileRedirect() {
  const { currentUser, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login/submit page
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/submit" replace />;
  }

  // Redirect to the user's own profile
  return <Navigate to={`/author/${currentUser.id}`} replace />;
}