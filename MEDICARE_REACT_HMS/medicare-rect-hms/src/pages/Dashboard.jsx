import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/dashboard.css";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    rooms: 0,
    admissions: 0
  });

  /* ======================
     LOAD DASHBOARD DATA
  ======================= */
  const loadCounts = async () => {
    try {
      const [patientsRes, doctorsRes, roomsRes, admissionsRes] =
        await Promise.all([
          axios.get("http://localhost:5000/patients"),
          axios.get("http://localhost:5000/doctors"),
          axios.get("http://localhost:5000/rooms"),
          axios.get("http://localhost:5000/admissions")
        ]);

      setCounts({
        patients: patientsRes.data.length,
        doctors: doctorsRes.data.length,
        rooms: roomsRes.data.length,
        admissions: admissionsRes.data.length
      });
    } catch (error) {
      console.error("Dashboard load error", error);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  return (
    <div className="dashboard-page">
      <h3 className="page-title">Dashboard</h3>

      <div className="dashboard-cards">
        {/* PATIENTS */}
        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Patients</span>
            <h2>{counts.patients}</h2>
            <span className="card-badge">Live</span>
          </div>
          <div className="card-icon">
            <i className="bi bi-people"></i>
          </div>
        </div>

        {/* DOCTORS */}
        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Doctors</span>
            <h2>{counts.doctors}</h2>
            <span className="card-badge">Live</span>
          </div>
          <div className="card-icon">
            <i className="bi bi-person-badge"></i>
          </div>
        </div>

        {/* ROOMS */}
        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Rooms</span>
            <h2>{counts.rooms}</h2>
            <span className="card-badge">Live</span>
          </div>
          <div className="card-icon">
            <i className="bi bi-door-open"></i>
          </div>
        </div>

        {/* ADMISSIONS */}
        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Admissions</span>
            <h2>{counts.admissions}</h2>
            <span className="card-badge">Live</span>
          </div>
          <div className="card-icon">
            <i className="bi bi-hospital"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
