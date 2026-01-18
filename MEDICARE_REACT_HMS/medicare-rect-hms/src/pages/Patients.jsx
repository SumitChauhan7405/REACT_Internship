import { useEffect, useState } from "react";
import PatientForm from "../components/patients/PatientForm";
import PatientTable from "../components/patients/PatientTable";
import AdmissionModal from "../components/admission/AdmissionModal";
import { getPatients, deletePatient } from "../services/patientService";
// import axios from "axios";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);

  // 🆕 Admission modal state
  const [openAdmission, setOpenAdmission] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleEditPatient = (patient) => {
    setEditPatient(patient);
  };

  const handleDeletePatient = async (id) => {
    await deletePatient(id);
    loadPatients();
  };

  // 🆕 OPEN ADMISSION MODAL
  const handleAdmitPatient = (patient) => {
    setSelectedPatient(patient);
    setOpenAdmission(true);
  };

  const clearEdit = () => {
    setEditPatient(null);
  };

  return (
    <>
      <PatientForm
        onSuccess={loadPatients}
        editPatient={editPatient}
        clearEdit={clearEdit}
      />

      <PatientTable
        patients={patients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onAdmit={handleAdmitPatient}   // 🆕
      />

      {/* 🆕 Admission Modal */}
      <AdmissionModal
        open={openAdmission}
        onClose={() => setOpenAdmission(false)}
        patient={selectedPatient}
        refreshPatients={loadPatients}
      />
    </>
  );
};

export default Patients;
