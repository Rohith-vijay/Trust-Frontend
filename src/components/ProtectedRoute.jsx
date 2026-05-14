import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { canAccess } from "../utils/permissions";

/**
 * ProtectedRoute — guards routes by authentication and role
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children — the route content
 * @param {string[]} [props.allowedRoles] — roles permitted to access (omit for any authenticated user)
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not authenticated → redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but role not allowed → redirect to unauthorized
  if (allowedRoles && !canAccess(user?.role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;