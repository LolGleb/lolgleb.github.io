import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Redirect /settings to the unified AuthorPage with the Settings tab open
export function ProfilePage() {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/submit" replace />;
  }
  return <Navigate to={`/author/${currentUser.id}?tab=settings`} replace />;
}