import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/pages/doctor-dashboard.css";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;

  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  /* ======================
     LOAD DASHBOARD DATA
  ======================= */
  useEffect(() => {
    if (!doctorId) return;

    const loadData = async () => {
      const [
        apptRes,
        consultRes,
        labRes,
        surgeryRes
      ] = await Promise.all([
        axios.get("http://localhost:5000/appointments"),
        axios.get("http://localhost:5000/consultations"),
        axios.get("http://localhost:5000/labTests"),
        axios.get("http://localhost:5000/surgeries")
      ]);

      setAppointments(
        apptRes.data.filter(a => a.doctorId === doctorId)
      );

      setConsultations(
        consultRes.data.filter(c => c.doctorId === doctorId)
      );

      setLabTests(
        labRes.data.filter(l => l.doctorId === doctorId)
      );

      setSurgeries(
        surgeryRes.data.filter(s => s.doctorId === doctorId)
      );
    };

    loadData();
  }, [doctorId]);

  /* ======================
     CALCULATIONS
  ======================= */
  const today = new Date().toISOString().split("T")[0];

  const todaysAppointments = appointments.filter(
    a => a.date === today
  );

  const pendingPrescriptions = todaysAppointments.filter(
    a => !consultations.some(c => c.appointmentId === a.id)
  );

  const pendingLabs = labTests.filter(l => l.status === "PENDING");

  const upcomingSurgeries = surgeries.filter(
    s => s.status === "SCHEDULED"
  );

  return (
    <div className="doctor-dashboard">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h3>Doctor Dashboard</h3>
        <p>
          Welcome <strong>{user?.data?.name}</strong>
        </p>
        <p>Department: {user?.data?.department}</p>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="row dashboard-cards">
        <div className="col-md-3">
          <div className="card kpi-card">
            <h6>Today's Appointments</h6>
            <h3>{todaysAppointments.length}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card kpi-card warning">
            <h6>Pending Prescriptions</h6>
            <h3>{pendingPrescriptions.length}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card kpi-card info">
            <h6>Lab Reports Pending</h6>
            <h3>{pendingLabs.length}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card kpi-card danger">
            <h6>Scheduled Surgeries</h6>
            <h3>{upcomingSurgeries.length}</h3>
          </div>
        </div>
      </div>

      {/* ===== TODAY'S APPOINTMENTS ===== */}
      <div className="card dashboard-section">
        <h5>Today's Appointments</h5>

        {todaysAppointments.length === 0 ? (
          <p className="empty-text">No appointments for today</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todaysAppointments.map(a => (
                <tr key={a.id}>
                  <td>{a.time}</td>
                  <td>{a.patientName}</td>
                  <td>
                    <span className="badge badge-pending">
                      {a.status || "PENDING"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== LAB & SURGERY ===== */}
      <div className="row">
        <div className="col-md-6">
          <div className="card dashboard-section">
            <h5>Pending Lab Tests</h5>

            {pendingLabs.length === 0 ? (
              <p className="empty-text">No pending lab tests</p>
            ) : (
              <ul className="simple-list">
                {pendingLabs.slice(0, 5).map(l => (
                  <li key={l.id}>
                    {l.patientName} –{" "}
                    {l.tests?.map(t => t.testName).join(", ")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card dashboard-section">
            <h5>Upcoming Surgeries</h5>

            {upcomingSurgeries.length === 0 ? (
              <p className="empty-text">No surgeries scheduled</p>
            ) : (
              <ul className="simple-list">
                {upcomingSurgeries.slice(0, 5).map(s => (
                  <li key={s.id}>
                    {s.patientName} – {s.surgeryType} (
                    {s.scheduledDate})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
