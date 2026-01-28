import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/dashboard.css";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    rooms: 0,
    admissions: 0,
    admittedPatients: 0,
    pendingLabs: 0,
    pendingSurgeries: 0,
    pendingDischarges: 0,
    unpaidBills: 0
  });

  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [pendingSurgeriesList, setPendingSurgeriesList] = useState([]);
  const [pendingLabsList, setPendingLabsList] = useState([]);
  const [unpaidBillsList, setUnpaidBillsList] = useState([]);

  const loadCounts = async () => {
    try {
      const [
        patientsRes,
        doctorsRes,
        roomsRes,
        admissionsRes,
        labsRes,
        surgeriesRes,
        billsRes
      ] = await Promise.all([
        axios.get("http://localhost:5000/patients"),
        axios.get("http://localhost:5000/doctors"),
        axios.get("http://localhost:5000/rooms"),
        axios.get("http://localhost:5000/admissions"),
        axios.get("http://localhost:5000/labTests"),
        axios.get("http://localhost:5000/surgeries"),
        axios.get("http://localhost:5000/bills")
      ]);

      setCounts({
        patients: patientsRes.data.length,
        doctors: doctorsRes.data.length,
        rooms: roomsRes.data.length,
        admissions: admissionsRes.data.length,
        admittedPatients: admissionsRes.data.filter(a => a.status === "ADMITTED").length,
        pendingLabs: labsRes.data.filter(l => l.status !== "COMPLETED").length,
        pendingSurgeries: surgeriesRes.data.filter(s => s.status === "SCHEDULED").length,
        pendingDischarges: admissionsRes.data.filter(a => a.status === "ADMITTED").length,
        unpaidBills: billsRes.data.filter(b => b.status === "UNPAID").length
      });

      setRecentAdmissions(
        admissionsRes.data.filter(a => a.status === "ADMITTED").slice(-5).reverse()
      );

      setPendingSurgeriesList(
        surgeriesRes.data.filter(s => s.status === "SCHEDULED").slice(0, 5)
      );

      setPendingLabsList(
        labsRes.data.filter(l => l.status !== "COMPLETED").slice(0, 5)
      );

      setUnpaidBillsList(
        billsRes.data.filter(b => b.status === "UNPAID").slice(0, 5)
      );
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

      {/* KPI CARDS */}
      <div className="dashboard-cards">
        {[
          ["Patients", counts.patients, "bi-people"],
          ["Doctors", counts.doctors, "bi-person-badge"],
          ["Rooms", counts.rooms, "bi-door-open"],
          ["Admissions", counts.admissions, "bi-hospital"],
          ["Currently Admitted", counts.admittedPatients, "bi-person-check"],
          ["Pending LabTests", counts.pendingLabs, "bi-beaker"],
          ["Pending Surgeries", counts.pendingSurgeries, "bi-scissors"],
          ["Pending Discharges", counts.pendingDischarges, "bi-box-arrow-right"],
          ["Unpaid Bills", counts.unpaidBills, "bi-cash-coin"]
        ].map(([title, value, icon], i) => (
          <div className="dashboard-card" key={i}>
            <div className="card-info">
              <span className="card-title">{title}</span>
              <h2>{value}</h2>
            </div>
            <div className="card-icon">
              <i className={`bi ${icon}`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVITY PANELS */}
      <div className="dashboard-activity">

        {/* Recent Admissions */}
        <div className="activity-card">
          <h4>Recent Admissions</h4>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Room</th>
                <th>Doctor</th>
              </tr>
            </thead>
            <tbody>
              {recentAdmissions.map(a => (
                <tr key={a.id}>
                  <td>{a.patientName}</td>
                  <td>{a.roomNumber}</td>
                  <td>{a.doctorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Surgeries */}
        <div className="activity-card">
          <h4>Pending Surgeries</h4>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Surgery</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingSurgeriesList.map(s => (
                <tr key={s.id}>
                  <td>{s.patientName}</td>
                  <td>{s.surgeryType}</td>
                  <td>
                    <span className={`status-badge ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Lab Tests */}
        <div className="activity-card">
          <h4>Pending Lab Tests</h4>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Test</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingLabsList.map(l => (
                <tr key={l.id}>
                  <td>{l.patientName}</td>
                  <td>
                    {Array.isArray(l.tests) && l.tests.length > 0
                      ? l.tests.length > 1
                        ? `${l.tests[0].testName} (+${l.tests.length - 1} more)`
                        : l.tests[0].testName
                      : "—"}
                  </td>
                  <td>
                    <span className={`status-badge ${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unpaid Bills */}
        <div className="activity-card">
          <h4>Unpaid Bills</h4>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {unpaidBillsList.map(b => (
                <tr key={b.id}>
                  <td>{b.patientName}</td>
                  <td className={`bill-amount ${b.status?.toLowerCase()}`}>
                    ₹{b.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
