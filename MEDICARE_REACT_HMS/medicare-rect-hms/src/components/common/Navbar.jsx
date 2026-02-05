import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import adminimg from "../../assets/images/users/admin.jpg";

const Navbar = () => {
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
    }, 1000); // update every minute

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ===============================
     FORMATTERS
  ================================ */
  const formattedDate = dateTime.toLocaleDateString("en-GB"); // DD/MM/YYYY

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return (
    <header className="navbar-emr">
      {/* LEFT SECTION */}
      <div className="navbar-left">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search patients, appointments..."
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="navbar-right">

        {/* 📅 DATE & ⏰ TIME (REPLACED FLAG + BELL) */}
        <div
          className="navbar-datetime"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "#E0ECFF",
            fontSize: "14px",
            fontWeight: 500
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <i className="bi bi-calendar"></i>
            {formattedDate}
          </span>

          <span style={{ opacity: 0.6 }}>|</span>

          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <i className="bi bi-clock"></i>
            {formattedTime}
          </span>
        </div>

        {/* ADMIN PROFILE */}
        <div
          className="navbar-user"
          style={{ position: "relative" }}
          onClick={() => setOpen(!open)}
        >
          <img src={adminimg} alt="Admin" />
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrator</span>
          </div>

          {/* 🔽 DROPDOWN */}
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

export default Navbar;
