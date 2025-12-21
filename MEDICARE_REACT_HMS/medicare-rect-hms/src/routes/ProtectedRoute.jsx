// 🔒 ROUTE PROTECTION COMPONENT
// Controls access based on login & role

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
};

export default ProtectedRoute;
