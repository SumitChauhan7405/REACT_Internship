import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import PrescriptionModal from "../../components/doctors/PrescriptionModal";

import "../../assets/css/components/patient-table.css";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;
  const doctorName = user?.data?.name;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Prescription modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  /* ======================
     LOAD DATA
  ======================= */
  const loadAppointments = useCallback(async () => {
    if (!doctorId) return;

    const [aptRes, patRes] = await Promise.all([
      axios.get("http://localhost:5000/appointments"),
      axios.get("http://localhost:5000/patients")
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

  if (appointments.length === 0) {
    return <p>No Patients assigned.</p>;
  }

  return (
    <>
      <div className="patient-table-card">
        <div className="table-header">
          <h6>My Patients</h6>
          <span>Doctor view</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              {/* <th>Status</th> */}
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>{apt.id}</td>
                <td>{apt.patientName}</td>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                {/* <td>
                  <span className="badge male">{apt.status}</span>
                </td> */}

                {/* ✅ ONLY PRESCRIPTION BUTTON */}
                <td>
                  <button
                    className="icon-btn add"
                    onClick={() => handleAddPrescription(apt)}
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </td>
              </tr>
            ))}
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
        refreshAppointments={loadAppointments}
      />
    </>
  );
};

export default DoctorAppointments;
