import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import PrescriptionModal from "../../components/doctors/PrescriptionModal";
import LabTestsModal from "../../components/lab/LabTestsModal";
import SurgeryModal from "../../components/doctors/SurgeryModal";

import "../../assets/css/components/patient-table.css";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;
  const doctorName = user?.data?.name;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);

  // Prescription modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Lab modal
  const [openLabModal, setOpenLabModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Surgery modal
  const [openSurgeryModal, setOpenSurgeryModal] = useState(false);
  const [surgeryConsultation, setSurgeryConsultation] = useState(null);

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

    const onlineAppointments = aptRes.data.filter(
      (apt) => apt.doctorId === doctorId
    );

    const walkInPatients = patRes.data.filter(
      (p) =>
        p.doctorName === doctorName &&
        p.status === "CONFIRMED" &&
        !onlineAppointments.some((a) => a.patientId === p.id)
    );

    const walkInAsAppointments = walkInPatients.map((p) => ({
      id: `WALKIN-${p.id}`,
      patientId: p.id,
      patientName: `${p.firstName} ${p.lastName}`,
      doctorId,
      doctorName,
      date: new Date().toISOString().split("T")[0],
      time: p.timing || "--",
      status: "CONFIRMED",
      isWalkIn: true
    }));

    setAppointments([...onlineAppointments, ...walkInAsAppointments]);
    setPatients(patRes.data);
    setConsultations(conRes.data);
  }, [doctorId, doctorName]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  /* ======================
     PRESCRIPTION (ADD ONLY)
  ======================= */
  const handleAddPrescription = (apt) => {
    setSelectedAppointment(apt);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  /* ======================
     LAB
  ======================= */
  const handleOpenLabTests = (apt) => {
    const consultation = consultations.find(
      (c) => c.appointmentId === apt.id
    );

    setSelectedConsultation(
      consultation || {
        appointmentId: apt.id,
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        doctorName: apt.doctorName
      }
    );

    setOpenLabModal(true);
  };

  /* ======================
     SURGERY
  ======================= */
  const handleOpenSurgery = (apt) => {
    const consultation = consultations.find(
      (c) => c.appointmentId === apt.id
    );

    setSurgeryConsultation(
      consultation || {
        appointmentId: apt.id,
        patientId: apt.patientId,
        doctorId: apt.doctorId
      }
    );

    setOpenSurgeryModal(true);
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
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.id}</td>
                <td>{apt.patientName}</td>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>
                  <span className="badge male">{apt.status}</span>
                </td>

                <td>
                  <div className="action-icons">
                    <button
                      className="icon-btn add"
                      onClick={() => handleAddPrescription(apt)}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>

                    <button
                      className="icon-btn lab"
                      onClick={() => handleOpenLabTests(apt)}
                    >
                      <i className="bi bi-flask"></i>
                    </button>

                    <button
                      className="icon-btn surgery"
                      onClick={() => handleOpenSurgery(apt)}
                    >
                      <i className="bi bi-heart-pulse"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <PrescriptionModal
        open={openModal}
        onClose={closeModal}
        appointment={selectedAppointment}
        patient={patients.find(
          (p) => p.id === selectedAppointment?.patientId
        )}
        doctor={user.data}
        refreshAppointments={loadAppointments}
      />

      <LabTestsModal
        open={openLabModal}
        onClose={() => setOpenLabModal(false)}
        consultation={selectedConsultation}
        patient={patients.find(
          (p) => p.id === selectedConsultation?.patientId
        )}
      />

      <SurgeryModal
        open={openSurgeryModal}
        onClose={() => setOpenSurgeryModal(false)}
        consultation={surgeryConsultation}
        patient={patients.find(
          (p) => p.id === surgeryConsultation?.patientId
        )}
        doctor={user.data}
      />
    </>
  );
};

export default DoctorAppointments;
