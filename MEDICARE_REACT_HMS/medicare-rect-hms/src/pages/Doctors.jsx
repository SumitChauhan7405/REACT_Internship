import { useState } from "react";
import DoctorForm from "../components/doctors/DoctorForm";
import DoctorList from "../components/doctors/DoctorList";

const Doctors = () => {
  const [editDoctor, setEditDoctor] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Doctor List */}
      <DoctorList
        key={refresh}
        onEdit={(doc) => setEditDoctor(doc)}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default Doctors;
