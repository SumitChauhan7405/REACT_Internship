import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";


import Home from "../pages/public/Home";
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Doctors from "../pages/Doctors";
import Appointments from "../pages/Appointments";
import Admissions from "../pages/Admissions";
import Billing from "../pages/Billing";
import Discharge from "../pages/Discharge";
import Surgery from "../pages/Surgery";
import Lab from "../pages/Lab";
import FollowUp from "../pages/FollowUp";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin / Doctor */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "doctor"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route
          path="patients"
          element={
            <ProtectedRoute allowedRoles={["admin", "doctor"]}>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="doctors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
