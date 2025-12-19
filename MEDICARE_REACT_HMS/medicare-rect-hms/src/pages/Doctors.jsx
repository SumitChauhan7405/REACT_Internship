import { useState } from "react";
import DoctorForm from "../components/doctors/DoctorForm";
import DoctorList from "../components/doctors/DoctorList";

const Doctors = () => {
  const [editDoctor, setEditDoctor] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Called after add / update / delete
  const handleSuccess = () => {
    setEditDoctor(null);
    setRefresh(!refresh);
  };

  return (
    <>
      {/* Doctor Form */}
      <DoctorForm
        editDoctor={editDoctor}
        clearEdit={() => setEditDoctor(null)}
        onSuccess={handleSuccess}
      />

      {/* Doctor List */}
      <DoctorList
        key={refresh}        // forces reload (simple trick)
        onEdit={(doc) => setEditDoctor(doc)}
      />
    </>
  );
};

export default Doctors;
