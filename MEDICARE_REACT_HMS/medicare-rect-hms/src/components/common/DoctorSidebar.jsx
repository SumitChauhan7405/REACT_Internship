import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/medicare-logo.png";

const DoctorSidebar = () => {
    return (
        <aside className="sidebar-modern">
            {/* Logo */}
            <div className="sidebar-brand">
                <img src={logo} alt="MediCare Logo" className="sidebar-logo" />
            </div>

            {/* Doctor Menu */}
            <nav className="sidebar-menu">
                <NavLink to="/doctor/dashboard" className="menu-item">
                    <i className="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/doctor/profile" className="menu-item">
                    <i className="bi bi-person-circle"></i>
                    <span>My Profile</span>
                </NavLink>


                <NavLink to="/doctor/appointments" className="menu-item">
                    <i className="bi bi-calendar-check"></i>
                    <span>My Appointments</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default DoctorSidebar;
