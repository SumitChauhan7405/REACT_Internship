import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/medicare-logo.png";

const Sidebar = () => {
  return (
    <aside className="sidebar-modern">
      {/* Logo */}
      <div className="sidebar-brand">
        <img src={logo} alt="MediCare Logo" className="sidebar-logo" />
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        {/* ✅ DASHBOARD */}
        <NavLink to="/admin/dashboard" className="menu-item">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        {/* ✅ PATIENTS */}
        <NavLink to="/admin/patients" className="menu-item">
          <i className="bi bi-people"></i>
          <span>Patients</span>
        </NavLink>

        {/* ✅ APPOINTMENTS */}
        <NavLink to="/admin/appointments" className="menu-item">
          <i className="bi bi-calendar-check"></i>
          <span>OPD Appointments</span>
        </NavLink>

        {/* ✅ DOCTORS (THIS WAS MISSING / WRONG) */}
        <NavLink to="/admin/doctors" className="menu-item">
          <i className="bi bi-person-badge"></i>
          <span>Doctors</span>
        </NavLink>

        {/* LAB */}
        <NavLink to="/admin/lab" className="menu-item">
          <i className="bi bi-flask"></i>
          <span>Laboratory</span>
        </NavLink>

        {/* ADMISSIONS */}
        <NavLink to="/admin/admissions" className="menu-item">
          <i className="bi bi-hospital"></i>
          <span>Admissions</span>
        </NavLink>

        {/* SURGERY */}
        <NavLink to="/admin/surgery" className="menu-item">
          <i className="bi bi-scissors"></i>
          <span>Surgery</span>
        </NavLink>

        {/* BILLING */}
        <NavLink to="/admin/billing" className="menu-item">
          <i className="bi bi-receipt"></i>
          <span>Billing</span>
        </NavLink>

        {/* DISCHARGE */}
        <NavLink to="/admin/discharge" className="menu-item">
          <i className="bi bi-box-arrow-right"></i>
          <span>Discharge</span>
        </NavLink>

        {/* FOLLOW UP */}
        <NavLink to="/admin/followup" className="menu-item">
          <i className="bi bi-arrow-repeat"></i>
          <span>Follow-Up</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
