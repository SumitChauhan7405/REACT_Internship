import PatientForm from "../components/patients/PatientForm";
import PatientTable from "../components/patients/PatientTable";
import { useState } from "react";

const Patients = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <PatientForm onSuccess={() => setRefresh(!refresh)} />
      <PatientTable key={refresh} />
    </>
  );
};

export default Patients;
