import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorPage from "../pages/ErrorPage";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // ⏳ WAIT until auth is restored
  if (loading) {
    return null; // or spinner if you want
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <ErrorPage type="403" />;
  }

  // ✅ Access granted
  return <Outlet />;
};

export default ProtectedRoute;
