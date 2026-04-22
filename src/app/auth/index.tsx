import React from 'react';
import { Navigate } from 'react-router-dom';

// Auth index now redirects to login — no more redundant selection page.
// The login page has a clear "Join Team / Already a Member?" link at the bottom.
const AuthIndex: React.FC = () => {
  return <Navigate to="/auth/login" replace />;
};

export default AuthIndex;
