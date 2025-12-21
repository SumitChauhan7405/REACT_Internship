import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ role, children }) => {
  const { user } = useAuth();

  // ❌ Safety check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role trying to access
  if (user.role !== role) {
    return user.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/doctor/dashboard" replace />;
  }

  // ✅ Correct role
  return children;
};

export default RoleRoute;
