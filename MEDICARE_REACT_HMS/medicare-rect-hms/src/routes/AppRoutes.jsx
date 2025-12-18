import { Routes, Route, Navigate } from "react-router-dom";

/* Pages */
import Dashboard from "../pages/Dashboard";
import Patients from "../pages/Patients";
import Appointments from "../pages/Appointments";
import Doctors from "../pages/Doctors";
import Lab from "../pages/Lab";
import Admissions from "../pages/Admissions";
import Surgery from "../pages/Surgery";
import Billing from "../pages/Billing";
import Discharge from "../pages/Discharge";
import FollowUp from "../pages/FollowUp";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route */}
      <Route path="/" element={<Dashboard />} />

      {/* Core Modules */}
      <Route path="/patients" element={<Patients />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/lab" element={<Lab />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/surgery" element={<Surgery />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/discharge" element={<Discharge />} />
      <Route path="/followup" element={<FollowUp />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
