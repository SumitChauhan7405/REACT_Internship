// 🔹 Doctor Navbar (SEPARATE from Admin Navbar)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import doctorImg from "../../assets/images/users/admin.jpg";
import flagimg from "../../assets/images/users/us.png";

const DoctorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-emr">
      {/* LEFT */}
      <div className="navbar-left">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input placeholder="Search appointments, patients..." />
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <div className="navbar-country">
          <img src={flagimg} alt="flag" />
        </div>

        <button className="nav-icon-btn">
          <i className="bi bi-bell"></i>
        </button>

        {/* Doctor Profile */}
        <div
          className="navbar-user"
          onClick={() => setOpen(!open)}
          style={{ position: "relative" }}
        >
          <img src={doctorImg} alt="Doctor" />
          <div className="user-info">
            <span className="user-name">
               {user?.data?.name}
            </span>
            <span className="user-role">Doctor</span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("/doctor/profile")}>
                <i className="bi bi-person"></i> My Profile
              </button>
              <button onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DoctorNavbar;
