import { useEffect, useState } from "react";
import '../assets/css/components/appointment-form.css'
import {
  getAppointments,
  addAppointment,
  deleteAppointment,
  updateAppointment
} from "../services/appointmentService";
import { getPatients, updatePatient } from "../services/patientService";
import { getDoctors } from "../services/doctorService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: ""
  });

  /* ======================
     LOAD DATA
  ======================= */
  const loadData = async () => {
    const [aptRes, patRes, docRes] = await Promise.all([
      getAppointments(),
      getPatients(),
      getDoctors()
    ]);

    setAppointments(aptRes.data);
    setPatients(patRes.data);
    setDoctors(docRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     FORM HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patient = patients.find((p) => p.id === form.patientId);
    const doctor = doctors.find((d) => d.id === form.doctorId);

    const payload = {
      id: `APT-${new Date().getFullYear()}-${Date.now()}`,
      patientId: form.patientId,
      patientName: patient
        ? `${patient.firstName} ${patient.lastName}`
        : "",
      doctorId: form.doctorId,
      doctorName: doctor?.name || "",
      date: form.date,
      time: form.time,
      status: "PENDING", // ✅ ALWAYS PENDING
      source: "ADMIN"
    };

    await addAppointment(payload);

    setForm({
      patientId: "",
      doctorId: "",
      date: "",
      time: ""
    });

    loadData();
  };

  /* ======================
     ACTIONS
  ======================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this appointment?")) {
      await deleteAppointment(id);
      loadData();
    }
  };

  const handleConfirm = async (apt) => {
    // 1️⃣ Update appointment
    await updateAppointment(apt.id, {
      ...apt,
      status: "CONFIRMED"
    });

    // 2️⃣ Update patient status
    await updatePatient(apt.patientId, {
      status: "CONFIRMED"
    });

    loadData();
  };

  /* ======================
     RENDER
  ======================= */
  return (
    <div className="page-content">
      {/* ===== FORM ===== */}
      <div className="appointment-form-card">
        <h5>Create OPD Appointment</h5>
        <p>Assign patient to doctor</p>

        <form onSubmit={handleSubmit} className="appointment-form-grid">
          <div>
            <label>Patient</label>
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Doctor</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="appointment-form-actions">
            <button type="submit">
              <i className="bi bi-calendar-plus"></i>
              Create OPD Appointment
            </button>
          </div>
        </form>
      </div>

      {/* ===== TABLE ===== */}
      <div className="appointment-table-card">
        <div className="appointment-table-header">
          <h6>OPD Appointments</h6>
        </div>

        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.patientName || "—"}</td>
                <td>{apt.doctorName || "—"}</td>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>
                  <span
                    className={`status-badge ${apt.status === "CONFIRMED"
                      ? "status-confirmed"
                      : apt.status === "PENDING"
                        ? "status-pending"
                        : "status-cancelled"
                      }`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td>
                  <div className="action-icons">
                    {apt.status === "PENDING" && (
                      <button
                        className="icon-btn confirm"
                        onClick={() => handleConfirm(apt)}
                        title="Confirm Appointment"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                    )}

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(apt.id)}
                      title="Delete Appointment"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
