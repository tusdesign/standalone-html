// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import React from 'react';
import { getAuthInfoFromCookie } from './lib/cookie';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authInfo = getAuthInfoFromCookie();

  return authInfo?.token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
