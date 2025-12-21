import { useEffect, useState } from "react";
import {
  getAppointments,
  addAppointment,
  deleteAppointment
} from "../services/appointmentService";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";

import "../assets/css/pages/appointment.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    status: "PENDING"
  });

  const loadData = async () => {
    const [a, p, d] = await Promise.all([
      getAppointments(),
      getPatients(),
      getDoctors()
    ]);

    setAppointments(a.data);
    setPatients(p.data);
    setDoctors(d.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addAppointment({
      ...form,
      id: `APT-${Date.now()}`,
      source: "ADMIN"
    });

    setForm({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      status: "PENDING"
    });

    loadData();
  };

  const getPatientName = (id) =>
    patients.find(p => p.id === id)?.name || "-";

  const getDoctorName = (id) =>
    doctors.find(d => d.id === id)?.name || "-";

  return (
    <>
      {/* ================= FORM ================= */}
      <div className="appointment-form-card">
        <h5>Create Appointment</h5>
        <p>Schedule patient appointment</p>

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
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
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
              {doctors.map(d => (
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

          <div>
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
            </select>
          </div>

          <div className="appointment-form-actions">
            <button type="submit">
              <i className="bi bi-calendar-plus"></i>
              Create Appointment
            </button>
          </div>
        </form>
      </div>

      {/* ================= LIST ================= */}
      <div className="appointment-table-card">
        <div className="appointment-table-header">
          <h6>Appointments</h6>
          <span>Total: {appointments.length}</span>
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
            {appointments.map(a => (
              <tr key={a.id}>
                <td>{getPatientName(a.patientId)}</td>
                <td>{getDoctorName(a.doctorId)}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.status}</td>
                <td>
                  <button
                    className="icon-btn delete"
                    onClick={() => deleteAppointment(a.id).then(loadData)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Appointments;
