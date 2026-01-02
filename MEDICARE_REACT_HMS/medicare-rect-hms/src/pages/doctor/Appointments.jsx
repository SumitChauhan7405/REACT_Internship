import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PrescriptionModal from "../../components/doctors/PrescriptionModal";
// ⬇️ LAB MODAL (will be created next)
import LabTestsModal from "../../components/lab/LabTestsModal";

import "../../assets/css/components/patient-table.css";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);

  // Prescription modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [existingPrescription, setExistingPrescription] = useState(null);
  const [modalMode, setModalMode] = useState("ADD");

  // 🧪 Lab modal
  const [openLabModal, setOpenLabModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  /* ======================
     LOAD DATA
  ======================= */
  const loadAppointments = useCallback(async () => {
    if (!doctorId) return;

    const [aptRes, patRes, conRes] = await Promise.all([
      axios.get("http://localhost:5000/appointments"),
      axios.get("http://localhost:5000/patients"),
      axios.get("http://localhost:5000/consultations")
    ]);

    const myAppointments = aptRes.data.filter(
      (apt) => apt.doctorId === doctorId
    );

    setAppointments(myAppointments);
    setPatients(patRes.data);
    setConsultations(conRes.data);
  }, [doctorId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  /* ======================
     PRESCRIPTION HANDLERS
  ======================= */
  const handleAddPrescription = (apt) => {
    setSelectedAppointment(apt);
    setExistingPrescription(null);
    setModalMode("ADD");
    setOpenModal(true);
  };

  const handleEditPrescription = (apt) => {
    const prescription = consultations.find(
      (c) => c.appointmentId === apt.id
    );

    setSelectedAppointment(apt);
    setExistingPrescription(prescription || null);
    setModalMode("EDIT");
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
    setExistingPrescription(null);
    setModalMode("ADD");
  };

  /* ======================
     🧪 LAB HANDLER
  ======================= */
  const handleOpenLabTests = (apt) => {
    const consultation = consultations.find(
      (c) => c.appointmentId === apt.id
    );
    if (!consultation) return;

    setSelectedConsultation(consultation);
    setOpenLabModal(true);
  };

  if (appointments.length === 0) {
    return <p>No appointments assigned.</p>;
  }

  return (
    <>
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => {
              const patient = patients.find(
                (p) => p.id === apt.patientId
              );

              const hasPrescription = consultations.some(
                (c) => c.appointmentId === apt.id
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
                    <div className="action-icons">
                      {/* ADD */}
                      <button
                        className="icon-btn add"
                        onClick={() => handleAddPrescription(apt)}
                        title="Add Prescription"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>

                      {/* EDIT */}
                      {hasPrescription && (
                        <>
                          <button
                            className="icon-btn edited"
                            onClick={() => handleEditPrescription(apt)}
                            title="Edit Prescription"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          {/* 🧪 LAB */}
                          <button
                            className="icon-btn lab"
                            onClick={() => handleOpenLabTests(apt)}
                            title="Lab Tests"
                          >
                            <i className="bi bi-flask"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PRESCRIPTION MODAL */}
      <PrescriptionModal
        open={openModal}
        onClose={closeModal}
        appointment={selectedAppointment}
        patient={patients.find(
          (p) => p.id === selectedAppointment?.patientId
        )}
        doctor={user.data}
        existingPrescription={existingPrescription}
        mode={modalMode}
        refreshAppointments={loadAppointments}
      />

      {/* 🧪 LAB TEST MODAL (NEXT STEP) */}
      <LabTestsModal
        open={openLabModal}
        onClose={() => setOpenLabModal(false)}
        consultation={selectedConsultation}
        patient={patients.find(
          (p) => p.id === selectedConsultation?.patientId
        )}
      />
    </>
  );
};

export default DoctorAppointments;
