import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/MediCare_Logo.png";

const BillSidebar = () => {
  return (
    <aside className="sidebar-modern">
      {/* Logo */}
      <div className="sidebar-brand">
        <img src={logo} alt="MediCare Logo" className="sidebar-logo" />
      </div>

      <nav className="sidebar-menu">

        {/* DASHBOARD */}
        <NavLink to="/bill/dashboard" className="menu-item">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        {/* BILLING */}
        <NavLink to="/bill/billing" className="menu-item">
          <i className="bi bi-receipt"></i>
          <span>Billing</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default BillSidebar;