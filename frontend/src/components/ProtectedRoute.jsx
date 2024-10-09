import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx'; // Import your UserContext

function ProtectedRoute({ children }) {
  const { userInfo } = useContext(UserContext);
  console.log('User Info in ProtectedRoute:', userInfo);
  // If user is not authenticated, redirect to login
  if (!userInfo || !userInfo.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the children components (the protected page)
  return children;
}

export default ProtectedRoute;
