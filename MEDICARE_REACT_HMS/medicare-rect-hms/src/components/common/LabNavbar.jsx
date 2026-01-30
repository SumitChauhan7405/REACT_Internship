import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import userimg from "../../assets/images/users/admin.jpg";
import flagimg from "../../assets/images/users/us.png";

const LabNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-emr">
      {/* LEFT SECTION */}
      <div className="navbar-left">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search lab tests, patients..."
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="navbar-right">
        {/* Country */}
        <div className="navbar-country">
          <img src={flagimg} alt="India" />
        </div>

        {/* Notifications */}
        <button className="nav-icon-btn">
          <i className="bi bi-bell"></i>
        </button>

        {/* User */}
        <div
          className="navbar-user"
          style={{ position: "relative" }}
          onClick={() => setOpen(!open)}
        >
          <img src={userimg} alt="Lab User" />
          <div className="user-info">
            <span className="user-name">Lab Technician</span>
            <span className="user-role">Laboratory</span>
          </div>

          {open && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LabNavbar;
