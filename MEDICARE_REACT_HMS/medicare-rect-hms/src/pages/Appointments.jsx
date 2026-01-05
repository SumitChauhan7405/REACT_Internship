import { useEffect, useState } from "react";
import "../assets/css/components/appointment-form.css";

import {
  getAppointments,
  deleteAppointment,
  updateAppointment
} from "../services/appointmentService";

import { addPatient, getPatients } from "../services/patientService";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* ======================
     LOAD DATA
  ======================= */
  const loadData = async () => {
    const [aptRes, patRes] = await Promise.all([
      getAppointments(),
      getPatients()
    ]);

    setAppointments(aptRes.data);
    setPatients(patRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     GENERATE PATIENT ID
  ======================= */
  const generatePatientId = () => {
    const year = new Date().getFullYear();
    const patOnly = patients.filter((p) => p.id?.startsWith("PAT-"));

    if (patOnly.length === 0) {
      return `PAT-${year}-0001`;
    }

    const last = patOnly[patOnly.length - 1];
    const num = Number(last.id.split("-")[2]) + 1;
    return `PAT-${year}-${String(num).padStart(4, "0")}`;
  };

  /* ======================
     GENERATE APPOINTMENT ID
  ======================= */
  const generateAppointmentId = () => {
    const year = new Date().getFullYear();
    const aptOnly = appointments.filter((a) =>
      a.id?.startsWith(`APT-${year}-`)
    );

    if (aptOnly.length === 0) {
      return `APT-${year}-0001`;
    }

    const last = aptOnly[aptOnly.length - 1];
    const num = Number(last.id.split("-")[2]) + 1;
    return `APT-${year}-${String(num).padStart(4, "0")}`;
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
    const newPatientId = generatePatientId();

    await addPatient({
      id: newPatientId,
      firstName: apt.firstName,
      lastName: apt.lastName,
      gender: apt.gender,
      age: apt.age,
      phone: apt.phone,
      bloodGroup: apt.bloodGroup || "",
      doctorName: apt.doctorName,
      timing: apt.time,
      status: "CONFIRMED",
      source: "ONLINE",
      createdAt: new Date().toISOString()
    });

    await updateAppointment(apt.id, {
      ...apt,
      id: generateAppointmentId(),
      patientId: newPatientId,
      patientName: `${apt.firstName} ${apt.lastName}`,
      status: "CONFIRMED"
    });

    alert("Appointment confirmed and patient registered");
    loadData();
  };

  /* ======================
     FILTER
  ======================= */
  const filteredAppointments = appointments.filter((apt) => {
    const term = searchTerm.toLowerCase();
    return (
      apt.patientName?.toLowerCase().includes(term) ||
      apt.id?.toLowerCase().includes(term)
    );
  });

  /* ======================
     UI
  ======================= */
  return (
    <div className="page-content">
      <div className="appointment-table-card">
        <div className="appointment-table-header">
          <h6>Online Appointments</h6>

          <div className="table-search">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by Appointment ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="appointment-table">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.id}</td>
                <td>
                  {apt.firstName
                    ? `${apt.firstName} ${apt.lastName}`
                    : "—"}
                </td>
                <td>{apt.doctorName}</td>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>
                  <span
                    className={`status-badge ${
                      apt.status === "CONFIRMED"
                        ? "status-confirmed"
                        : "status-pending"
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
                      <i className="bi bi-trash-fill"></i>
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
