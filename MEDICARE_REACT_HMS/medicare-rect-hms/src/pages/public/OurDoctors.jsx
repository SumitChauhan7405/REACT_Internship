import { useEffect, useState } from "react";
import { getDoctors } from "../../services/doctorService";
import DoctorCard from "../../components/public/DoctorCard";
import OnlineAppointmentModal from "../../components/public/OnlineAppointmentModal";
import "../../assets/css/public/doctors-public.css";

const OurDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  // 🔹 MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const res = await getDoctors();
    setDoctors(res.data);
  };

  // 🔹 OPEN MODAL (NO UI CHANGE)
  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="public-container">
      <div className="public-header">
        <h2>Our Doctors</h2>
        <p>Meet our experienced and qualified medical professionals</p>
      </div>

      <div className="doctor-grid">
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onBook={handleBook}
          />
        ))}
      </div>

      {/* 🔹 ONLINE APPOINTMENT MODAL */}
      {showModal && (
        <OnlineAppointmentModal
          doctor={selectedDoctor}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default OurDoctors;
