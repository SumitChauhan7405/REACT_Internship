import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PrescriptionModal from "../../components/doctors/PrescriptionModal";
import "../../assets/css/components/patient-table.css";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Prescription modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [existingPrescription, setExistingPrescription] = useState(null);

  /* ======================
     LOAD DATA
  ======================= */
  const loadAppointments = async () => {
    const [aptRes, patRes, conRes] = await Promise.all([
      axios.get("http://localhost:5000/appointments"),
      axios.get("http://localhost:5000/patients"),
      axios.get("http://localhost:5000/consultations")
    ]);

    // Only doctor specific appointments
    const myAppointments = aptRes.data.filter(
      (apt) => apt.doctorId === doctorId
    );

    setAppointments(myAppointments);
    setPatients(patRes.data);

    // keep consultations to match later
    setExistingPrescription(conRes.data);
  };

  useEffect(() => {
    loadAppointments();
  }, [doctorId]);

  /* ======================
     OPEN PRESCRIPTION
  ======================= */
  const openPrescriptionModal = (apt) => {
    const prescription = existingPrescription?.find(
      (c) => c.appointmentId === apt.id
    );

    setSelectedAppointment(apt);
    setExistingPrescription(prescription || null);
    setOpenModal(true);
  };

  if (appointments.length === 0) {
    return <p>No appointments assigned.</p>;
  }

  return (
    <>
      {/* ===== APPOINTMENT TABLE ===== */}
      <div className="patient-table-card">
        <div className="table-header">
          <h6>My Appointments</h6>
          <span>Doctor view</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Prescription</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => {
              const patient = patients.find(
                (p) => p.id === apt.patientId
              );

              return (
                <tr key={apt.id}>
                  <td>{apt.id}</td>
                  <td>
                    {patient
                      ? `${patient.firstName} ${patient.lastName}`
                      : "—"}
                  </td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>
                    <span
                      className={`badge ${
                        apt.status === "CONFIRMED"
                          ? "male"
                          : "female"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openPrescriptionModal(apt)}
                    >
                      <i className="bi bi-file-earmark-medical"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== PRESCRIPTION MODAL ===== */}
      <PrescriptionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        appointment={selectedAppointment}
        patient={patients.find(
          (p) => p.id === selectedAppointment?.patientId
        )}
        doctor={user.data}
        existingPrescription={existingPrescription}
      />
    </>
  );
};

export default DoctorAppointments;
