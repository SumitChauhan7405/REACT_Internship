import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/MediCare_Logo.png";

const LabSidebar = () => {
  return (
    <aside className="sidebar-modern">
      {/* Logo */}
      <div className="sidebar-brand">
        <img src={logo} alt="MediCare Logo" className="sidebar-logo" />
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        {/* DASHBOARD */}
        <NavLink to="/lab/dashboard" className="menu-item">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        {/* LAB TEST MASTER */}
        <NavLink to="/lab/lab-test-masters" className="menu-item">
          <i className="bi bi-list-check"></i>
          <span>Lab Test Masters</span>
        </NavLink>

        {/* LAB TESTS */}
        <NavLink to="/lab/lab-tests" className="menu-item">
          <i className="bi bi-flask"></i>
          <span>Lab Tests</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default LabSidebar;
