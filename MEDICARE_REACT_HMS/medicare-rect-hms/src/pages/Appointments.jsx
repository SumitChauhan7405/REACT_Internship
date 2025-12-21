import { useEffect, useState } from "react";
import {
  getAppointments,
  addAppointment,
  deleteAppointment,
} from "../services/appointmentService";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    status: "PENDING",
  });

  /* =====================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    const [aptRes, patRes, docRes] = await Promise.all([
      getAppointments(),
      getPatients(),
      getDoctors(),
    ]);

    setAppointments(aptRes.data);
    setPatients(patRes.data);
    setDoctors(docRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =====================
     FORM HANDLERS
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CRITICAL FIX: patientId MUST be saved
    const payload = {
      patientId: form.patientId,
      doctorId: form.doctorId,
      date: form.date,
      time: form.time,
      status: form.status,
    };

    await addAppointment(payload);
    setForm({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      status: "PENDING",
    });

    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      await deleteAppointment(id);
      loadData();
    }
  };

  /* =====================
     RENDER
  ====================== */
  return (
    <div className="page-content">
      {/* ===== CREATE APPOINTMENT ===== */}
      <div className="card mb-4">
        <h4>Create Appointment</h4>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Patient */}
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

          {/* Doctor */}
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

          {/* Date */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          {/* Time */}
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          {/* Status */}
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button type="submit" className="btn-primary">
            Create Appointment
          </button>
        </form>
      </div>

      {/* ===== APPOINTMENT LIST ===== */}
      <div className="card">
        <h4>Appointments</h4>

        <table className="table">
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
            {appointments.map((apt) => {
              const patient = patients.find((p) => p.id === apt.patientId);
              const doctor = doctors.find((d) => d.id === apt.doctorId);

              return (
                <tr key={apt.id}>
                  <td>
                    {patient ? `${patient.firstName} ${patient.lastName}` : "—"}
                  </td>
                  <td>{doctor?.name || "—"}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.status}</td>
                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(apt.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
