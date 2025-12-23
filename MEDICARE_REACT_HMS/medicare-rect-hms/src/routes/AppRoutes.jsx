import { Routes, Route } from "react-router-dom";

/* Layouts */
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";

/* Route Protection */
import ProtectedRoute from "./ProtectedRoute";

/* Public Pages */
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";

/* Admin Pages */
import Dashboard from "../pages/Dashboard";
import Doctors from "../pages/Doctors";
import Patients from "../pages/Patients";
import Appointments from "../pages/Appointments";
import Billing from "../pages/Billing";
import Lab from "../pages/Lab";
import Admissions from "../pages/Admissions";
import Surgery from "../pages/Surgery";
import Discharge from "../pages/Discharge";
import FollowUp from "../pages/FollowUp";

/* Doctor Pages */
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/Appointments";
import DoctorProfile from "../pages/doctor/Profile";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= ADMIN PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="billing" element={<Billing />} />
          <Route path="lab" element={<Lab />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="surgery" element={<Surgery />} />
          <Route path="discharge" element={<Discharge />} />
          <Route path="followup" element={<FollowUp />} />
        </Route>
      </Route>

      {/* ================= DOCTOR PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>
      </Route>


    </Routes>
  );
};

export default AppRoutes;
