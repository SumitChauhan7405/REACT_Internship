import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/layout/lab-navbar.css";

import userimg from "../../assets/images/users/admin.jpg";

const LabNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* ===============================
     DATE & TIME
  ================================ */
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("en-GB");
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-emr lab-navbar">
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

        {/* 📅 DATE & TIME */}
        <div
          className="navbar-datetime"
        >
          <span>
            <i className="bi bi-calendar"></i>
            {formattedDate}
          </span>

          <span style={{ opacity: 0.6 }}>|</span>

          <span>
            <i className="bi bi-clock"></i>
            {formattedTime}
          </span>
        </div>

        {/* User */}
        <div
          className="navbar-user"
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
