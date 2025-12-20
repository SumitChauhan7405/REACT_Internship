import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/medicare-logo.png";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { role } = useAuth(); // admin | doctor

  return (
    <aside className="sidebar-modern">
      {/* Brand / Logo */}
      <div className="sidebar-brand">
        <img src={logo} alt="MediCare Logo" className="sidebar-logo" />
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        {/* Dashboard */}
        <NavLink to="/admin" end className="menu-item">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        {/* Patients (Admin + Doctor) */}
        <NavLink to="/admin/patients" className="menu-item">
          <i className="bi bi-people"></i>
          <span>Patients</span>
        </NavLink>

        {/* Appointments (Admin + Doctor) */}
        <NavLink to="/admin/appointments" className="menu-item">
          <i className="bi bi-calendar-check"></i>
          <span>Appointments</span>
        </NavLink>

        {/* Doctors (ADMIN ONLY) */}
        {role === "admin" && (
          <NavLink to="/admin/doctors" className="menu-item">
            <i className="bi bi-person-badge"></i>
            <span>Doctors</span>
          </NavLink>
        )}

        {/* Laboratory */}
        <NavLink to="/admin/lab" className="menu-item">
          <i className="bi bi-flask"></i>
          <span>Laboratory</span>
        </NavLink>

        {/* Admissions */}
        <NavLink to="/admin/admissions" className="menu-item">
          <i className="bi bi-hospital"></i>
          <span>Admissions</span>
        </NavLink>

        {/* Surgery */}
        <NavLink to="/admin/surgery" className="menu-item">
          <i className="bi bi-scissors"></i>
          <span>Surgery</span>
        </NavLink>

        {/* Billing */}
        <NavLink to="/admin/billing" className="menu-item">
          <i className="bi bi-receipt"></i>
          <span>Billing</span>
        </NavLink>

        {/* Discharge */}
        <NavLink to="/admin/discharge" className="menu-item">
          <i className="bi bi-box-arrow-right"></i>
          <span>Discharge</span>
        </NavLink>

        {/* Follow-up */}
        <NavLink to="/admin/followup" className="menu-item">
          <i className="bi bi-arrow-repeat"></i>
          <span>Follow-Up</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;
