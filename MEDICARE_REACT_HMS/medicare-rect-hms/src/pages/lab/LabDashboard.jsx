import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/pages/lab-dashboard.css";

const LabDashboard = () => {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  /* ======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    const loadData = async () => {
      const [labRes, patRes, docRes] = await Promise.all([
        axios.get("http://localhost:5000/labTests"),
        axios.get("http://localhost:5000/patients"),
        axios.get("http://localhost:5000/doctors")
      ]);

      setLabTests(labRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
    };

    loadData();
  }, []);

  /* ======================
     CALCULATIONS (EXISTING)
  ======================= */
  const today = new Date().toISOString().split("T")[0];

  const todayTests = labTests.filter(
    l => l.createdAt?.startsWith(today)
  );

  const pendingTests = labTests.filter(
    l => l.status === "PENDING"
  );

  const completedTests = labTests.filter(
    l => l.status === "COMPLETED"
  );

  const uniquePatients = [
    ...new Set(labTests.map(l => l.patientId))
  ];

  const getPatientName = (id) => {
    const p = patients.find(x => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  };

  /* ======================
     DOCTOR-WISE WORKLOAD (NEW)
  ======================= */
  const doctorWorkload = doctors.map(doc => {
    const doctorLabs = labTests.filter(
      l => l.doctorId === doc.id
    );

    return {
      doctorName: doc.name,
      pending: doctorLabs.filter(l => l.status === "PENDING").length,
      completed: doctorLabs.filter(l => l.status === "COMPLETED").length
    };
  });

  return (
    <div className="lab-dashboard-page">
      <h3 className="page-title">Laboratory Dashboard</h3>

      {/* ======================
         KPI CARDS (UNCHANGED)
      ======================= */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Today's Tests</span>
            <h2>{todayTests.length}</h2>
          </div>
          <div className="card-icon">
            <i className="bi bi-calendar-day"></i>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Pending Tests</span>
            <h2>{pendingTests.length}</h2>
          </div>
          <div className="card-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Completed Tests</span>
            <h2>{completedTests.length}</h2>
          </div>
          <div className="card-icon">
            <i className="bi bi-check-circle"></i>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-info">
            <span className="card-title">Patients Served</span>
            <h2>{uniquePatients.length}</h2>
          </div>
          <div className="card-icon">
            <i className="bi bi-people"></i>
          </div>
        </div>
      </div>

      {/* ======================
         PENDING LAB TESTS (UNCHANGED)
      ======================= */}
      <div className="activity-card">
        <h4>Pending Lab Tests</h4>

        {pendingTests.length === 0 ? (
          <p className="empty">No pending lab tests</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Lab ID</th>
                <th>Patient</th>
                <th>Tests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingTests.slice(0, 5).map(lab => (
                <tr key={lab.id}>
                  <td>{lab.id}</td>
                  <td>{getPatientName(lab.patientId)}</td>
                  <td>
                    {lab.tests
                      ?.map(t =>
                        typeof t === "string" ? t : t.testName
                      )
                      .join(", ")}
                  </td>
                  <td>
                    <span className="status-badge pending">
                      PENDING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ======================
         DOCTOR-WISE WORKLOAD (NEW)
      ======================= */}
      <div className="activity-card mt-24">
        <h4>Doctor-wise Test Workload</h4>

        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Pending</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {doctorWorkload.map((d, index) => (
              <tr key={index}>
                <td>{d.doctorName}</td>
                <td>{d.pending}</td>
                <td>{d.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabDashboard;
