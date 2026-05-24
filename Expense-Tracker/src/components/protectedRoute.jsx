import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If the user isn't logged in, instantly kick them to the login view
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;