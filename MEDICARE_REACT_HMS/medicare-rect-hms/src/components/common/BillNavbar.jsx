import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/layout/bill-navbar.css";

import adminimg from "../../assets/images/users/admin.jpg";

const BillNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* ===============================
     DATE & TIME STATE
  ================================ */
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ===============================
     FORMATTERS
  ================================ */
  const formattedDate = dateTime.toLocaleDateString("en-GB");

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return (
    <header className="navbar-emr bill-navbar">

      {/* LEFT */}
      <div className="navbar-left">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search bills, patients..."
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        {/* DATE & TIME */}
        <div className="navbar-datetime">

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

        {/* BILLING USER */}
        <div
          className="navbar-user"
          onClick={() => setOpen(!open)}
        >

          <img src={adminimg} alt="Billing Staff" />

          <div className="user-info">
            <span className="user-name">Billing</span>
            <span className="user-role">Billing Staff</span>
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

export default BillNavbar;