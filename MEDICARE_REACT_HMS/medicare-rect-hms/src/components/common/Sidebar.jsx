import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/medicare-logo.png";

const Sidebar = () => {
  return (
    <aside className="sidebar-modern">
      {/* Brand / Logo */}
      <div className="sidebar-brand">
        <img src={logo} alt="MediCare Logo" className="sidebar-logo" />
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        <NavLink to="/" end className="menu-item">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/patients" className="menu-item">
          <i className="bi bi-people"></i>
          <span>Patients</span>
        </NavLink>

        <NavLink to="/appointments" className="menu-item">
          <i className="bi bi-calendar-check"></i>
          <span>Appointments</span>
        </NavLink>

        <NavLink to="/doctors" className="menu-item">
          <i className="bi bi-person-badge"></i>
          <span>Doctors</span>
        </NavLink>

        <NavLink to="/lab" className="menu-item">
          <i className="bi bi-flask"></i>
          <span>Laboratory</span>
        </NavLink>

        <NavLink to="/admissions" className="menu-item">
          <i className="bi bi-hospital"></i>
          <span>Admissions</span>
        </NavLink>

        <NavLink to="/surgery" className="menu-item">
          <i className="bi bi-scissors"></i>
          <span>Surgery</span>
        </NavLink>

        <NavLink to="/billing" className="menu-item">
          <i className="bi bi-receipt"></i>
          <span>Billing</span>
        </NavLink>

        <NavLink to="/discharge" className="menu-item">
          <i className="bi bi-box-arrow-right"></i>
          <span>Discharge</span>
        </NavLink>

        <NavLink to="/followup" className="menu-item">
          <i className="bi bi-arrow-repeat"></i>
          <span>Follow-Up</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
