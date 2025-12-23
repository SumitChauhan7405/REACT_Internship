import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  const doctorId = user?.data?.id;

  // ✅ FIX 1: make function stable
  const loadAppointments = useCallback(async () => {
    if (!doctorId) return; // ✅ FIX 2: guard

    const [aptRes, patientRes] = await Promise.all([
      axios.get("http://localhost:5000/appointments"),
      axios.get("http://localhost:5000/patients"),
    ]);

    // filter doctor appointments
    const myAppointments = aptRes.data.filter(
      (apt) => apt.doctorId === doctorId
    );

    // attach patient name
    const merged = myAppointments.map((apt) => {
      const patient = patientRes.data.find(
        (p) => p.id === apt.patientId
      );

      return {
        ...apt,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : "N/A",
      };
    });

    setAppointments(merged);
  }, [doctorId]);

  // ✅ FIX 3: correct dependency
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  if (appointments.length === 0) {
    return <p>No appointments assigned.</p>;
  }

  return (
    <div className="patient-table-card">
      <div className="table-header">
        <h6>My Appointments</h6>
        <span>Assigned patients</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id}>
              <td>{apt.id}</td>
              <td>{apt.patientName}</td>
              <td>{apt.date}</td>
              <td>{apt.time}</td>
              <td>{apt.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
