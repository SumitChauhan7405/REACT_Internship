import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages/doctor-patient-history.css";

const DoctorPatientHistory = () => {
  const { id } = useParams(); // patientId
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD PATIENT + CONSULTATIONS
  ======================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientRes, consultationRes] = await Promise.all([
          axios.get(`http://localhost:5000/patients/${id}`),
          axios.get(`http://localhost:5000/consultations`)
        ]);

        setPatient(patientRes.data);

        // ✅ REAL CONSULTATION HISTORY
        const patientConsultations = consultationRes.data.filter(
          (c) => c.patientId === id
        );

        setConsultations(patientConsultations);
      } catch (err) {
        console.error("Error loading patient history", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading patient history...</p>;
  }

  if (!patient) {
    return <p style={{ padding: 20 }}>Patient not found</p>;
  }

  return (
    <div className="doctor-patient-history-page">
      {/* ===== HEADER ===== */}
      <div className="history-header">
        <div>
          <h3>Patient Medical History</h3>
          <p className="subtitle">Complete treatment timeline (Read-only)</p>
        </div>

        <button className="btn-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      {/* ===== PATIENT INFO ===== */}
      <div className="patient-info-card">
        <div className="info-grid">
          <div><label>Patient ID</label><span>{patient.id}</span></div>
          <div><label>Name</label><span>{patient.firstName} {patient.lastName}</span></div>
          <div><label>Gender</label><span>{patient.gender}</span></div>
          <div><label>Age</label><span>{patient.age}</span></div>
          <div><label>Blood Group</label><span>{patient.bloodGroup}</span></div>
          <div><label>Phone</label><span>{patient.phone}</span></div>
          <div>
            <label>Status</label>
            <span className={`status-pill ${patient.status.toLowerCase()}`}>
              {patient.status}
            </span>
          </div>
        </div>
      </div>

      {/* ======================
         CONSULTATION HISTORY
      ======================= */}
      <div className="history-section">
        <h4>Consultation History</h4>

        {consultations.length === 0 ? (
          <p className="empty">No consultation history found</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Diagnosis</th>
                <th>Consultation</th>
              </tr>
            </thead>

            <tbody>
              {consultations.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{c.doctorName}</td>
                  <td>{c.department}</td>
                  <td>{c.diagnosis || "—"}</td>
                  <td>{c.consultation || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PLACEHOLDERS */}
      <div className="history-placeholder">
        <p>Lab test history coming next…</p>
        <p>Surgery history coming next…</p>
      </div>
    </div>
  );
};

export default DoctorPatientHistory;