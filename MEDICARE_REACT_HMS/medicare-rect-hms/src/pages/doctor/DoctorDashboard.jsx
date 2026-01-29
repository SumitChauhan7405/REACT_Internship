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

      setAppointments(apptRes.data.filter(a => a.doctorId === doctorId));
      setConsultations(consultRes.data.filter(c => c.doctorId === doctorId));
      setLabTests(labRes.data.filter(l => l.doctorId === doctorId));
      setSurgeries(surgeryRes.data.filter(s => s.doctorId === doctorId));
    };

    loadData();
  }, [doctorId]);

  /* ======================
     CALCULATIONS
  ======================= */
  const today = new Date().toISOString().split("T")[0];

  const todaysAppointments = appointments.filter(a => a.date === today);

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
      <div className="dashboard-cards doctor-kpis">
        <div className="kpi-card">
          <h6>Today's Appointments</h6>
          <h3>{todaysAppointments.length}</h3>
        </div>

        <div className="kpi-card warning">
          <h6>Pending Prescriptions</h6>
          <h3>{pendingPrescriptions.length}</h3>
        </div>

        <div className="kpi-card info">
          <h6>Lab Reports Pending</h6>
          <h3>{pendingLabs.length}</h3>
        </div>

        <div className="kpi-card danger">
          <h6>Scheduled Surgeries</h6>
          <h3>{upcomingSurgeries.length}</h3>
        </div>
      </div>

      {/* ===== TODAY'S APPOINTMENTS ===== */}
      <div className="dashboard-section">
        <h5>Today's Appointments</h5>

        {todaysAppointments.length === 0 ? (
          <p className="empty-text">No appointments for today</p>
        ) : (
          <table className="table doctor-table">
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
                    <span className="status-pill pending">
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
      <div className="doctor-grid">
        <div className="dashboard-section">
          <h5>Pending Lab Tests</h5>

          {pendingLabs.length === 0 ? (
            <p className="empty-text">No pending lab tests</p>
          ) : (
            <table className="table doctor-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Test(s)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingLabs.slice(0, 5).map(l => (
                  <tr key={l.id}>
                    <td>{l.patientName}</td>
                    <td>{l.tests?.map(t => t.testName).join(", ")}</td>
                    <td>
                      <span className="status-pill pending">PENDING</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-section">
          <h5>Upcoming Surgeries</h5>

          {upcomingSurgeries.length === 0 ? (
            <p className="empty-text">No surgeries scheduled</p>
          ) : (
            <table className="table doctor-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Surgery</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {upcomingSurgeries.slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td>{s.patientName}</td>
                    <td>{s.surgeryType}</td>
                    <td>{s.scheduledDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

{/* ===== DOCTOR SUMMARY ===== */}
<div className="doctor-summary">
  <div className="summary-card">
    <h6>Total Patients</h6>
    <h3>{appointments.length}</h3>
  </div>

  <div className="summary-card">
    <h6>Consultations Done</h6>
    <h3>{consultations.length}</h3>
  </div>

  <div className="summary-card">
    <h6>Surgeries Performed</h6>
    <h3>
      {surgeries.filter(s => s.status === "COMPLETED").length}
    </h3>
  </div>
</div>

{/* ===== PRIORITY ALERTS ===== */}
<div className="dashboard-section">
  <h5>Priority Alerts</h5>

  <ul className="priority-list">
    <li>
      Pending Prescriptions:
      <span className="priority-badge warning">
        {pendingPrescriptions.length}
      </span>
    </li>

    <li>
      Lab Reports Pending:
      <span className="priority-badge info">
        {pendingLabs.length}
      </span>
    </li>

    <li>
      Scheduled Surgeries:
      <span className="priority-badge danger">
        {upcomingSurgeries.length}
      </span>
    </li>
  </ul>
</div>

{/* ===== TODAY WORKFLOW TIMELINE ===== */}
<div className="dashboard-section">
  <h5>Today's Workflow</h5>

  <div className="timeline">
    {todaysAppointments.map(a => (
      <div key={a.id} className="timeline-item">
        <span className="timeline-time">{a.time}</span>
        <span className="timeline-dot"></span>
        <span className="timeline-content">
          Appointment with {a.patientName}
        </span>
      </div>
    ))}

    {upcomingSurgeries.map(s => (
      <div key={s.id} className="timeline-item surgery">
        <span className="timeline-time">{s.scheduledDate}</span>
        <span className="timeline-dot"></span>
        <span className="timeline-content">
          Surgery: {s.surgeryType} ({s.patientName})
        </span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default DoctorDashboard;
