import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import doctorImg from "../../assets/images/users/admin.jpg";

const DoctorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  /* ===============================
     DATE & TIME
  ================================ */
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("en-GB");
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

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

        {/* 📅 DATE & TIME */}
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

        {/* Doctor Profile */}
        <div
          className="navbar-user"
          onClick={() => setOpen(!open)}
          style={{ position: "relative" }}
        >
          <img src={doctorImg} alt="Doctor" />
          <div className="user-info">
            <span className="user-name">{user?.data?.name}</span>
            <span className="user-role">Doctor</span>
          </div>

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
