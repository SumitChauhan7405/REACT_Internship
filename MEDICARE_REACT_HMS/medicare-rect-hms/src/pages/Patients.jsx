import { useEffect, useState } from "react";
import PatientForm from "../components/patients/PatientForm";
import PatientTable from "../components/patients/PatientTable";
import { getPatients, deletePatient } from "../services/patientService";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);

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
      />
    </>
  );
};

export default Patients;
