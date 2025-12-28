import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoctors } from "../../services/doctorService";
import OnlineAppointmentModal from "../../components/public/OnlineAppointmentModal";
import "../../assets/css/public/doctor-details.css";

const DoctorDetails = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    const res = await getDoctors();
    const selectedDoctor = res.data.find((d) => d.id === id);
    setDoctor(selectedDoctor);
  };

  /* ======================
     DEPARTMENT DESCRIPTION
  ======================= */
  const getDepartmentDescription = (department) => {
    switch (department?.toLowerCase()) {
      case "cardiology":
        return "Specializes in diagnosing and treating heart-related conditions such as hypertension, heart disease, and cardiac disorders. Focuses on preventive care and long-term heart health.";
      case "neurology":
        return "Expert in treating disorders of the brain, spine, and nervous system including migraines, epilepsy, stroke, and neurological disorders.";
      case "orthopedics":
        return "Specializes in bones, joints, muscles, and movement-related disorders including fractures, arthritis, and sports injuries.";
      case "general medicine":
        return "Provides comprehensive care for a wide range of medical conditions with a holistic and patient-focused approach.";
      default:
        return "An experienced medical professional dedicated to accurate diagnosis, effective treatment, and compassionate patient care.";
    }
  };

  if (!doctor) return <p>Loading doctor details...</p>;

  return (
  <div className="doctor-details-container">
    <div className="doctor-details-card">

      {/* LEFT PANEL */}
      <div className="doctor-details-left">
        <img
          src={
            doctor.image
              ? `/images/doctors/${doctor.image}`
              : "/images/doctors/default-doctor.png"
          }
          alt={doctor.name}
        />

        <h3>{doctor.name}</h3>
        <p className="education">{doctor.education}</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="doctor-details-right">
        <h2 className="dept-title">{doctor.department}</h2>
        <h4 className="experience">{doctor.experience} Years Experience</h4>

        <p className="doctor-description">
          Dr. {doctor.name} is a highly qualified specialist in {doctor.department}.
          With {doctor.experience} years of experience and an education background
          of {doctor.education}, the doctor is known for patient-centric care,
          accurate diagnosis, and long-term treatment planning.
        </p>

        {/* OPD INFO */}
        <div className="opd-info-grid">
          <div className="info-box">
            <strong>OPD Days</strong>
            <span>{doctor.availableDays.join(", ")}</span>
          </div>

          <div className="info-box">
            <strong>OPD Time</strong>
            <span>{doctor.timeSlots.join(", ")}</span>
          </div>

          <div className="info-box">
            <strong>Consultation Fee</strong>
            <span>₹{doctor.consultationFee}</span>
          </div>
        </div>

        {/* EMERGENCY CARE */}
        <div className="emergency-box">
          <strong>Emergency Care</strong>
          <span>+91 80504 80504</span>
        </div>

        {/* BOOK APPOINTMENT BAR */}
        <div className="book-bar">
          <span>Book Appointment Now</span>
          <button onClick={() => setOpenModal(true)}>
            Book Now
          </button>
        </div>
      </div>
    </div>

    {/* MODAL (UNCHANGED) */}
    <OnlineAppointmentModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      doctor={doctor}
    />
  </div>
);

};

export default DoctorDetails;
