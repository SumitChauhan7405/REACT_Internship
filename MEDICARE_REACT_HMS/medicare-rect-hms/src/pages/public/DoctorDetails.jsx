import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getDoctors } from "../../services/doctorService";
import OnlineAppointmentModal from "../../components/public/OnlineAppointmentModal";
import "../../assets/css/public/doctor-details.css";

/* ✅ LOAD IMAGE FROM src/assets */
const getDoctorImage = (imageName) => {
  try {
    return require(`../../assets/images/doctors/${imageName}`);
  } catch (err) {
    return require(`../../assets/images/doctors/doc.png`);
  }
};

const DoctorDetails = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  /* ======================
     LOAD DOCTOR (MEMOIZED)
  ======================= */
  const loadDoctor = useCallback(async () => {
    const res = await getDoctors();
    const selectedDoctor = res.data.find((d) => d.id === id);
    setDoctor(selectedDoctor);
  }, [id]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  if (!doctor) return <p>Loading doctor details...</p>;

  return (
    <div className="doctor-details-container">
      <div className="doctor-details-card">

        {/* LEFT PANEL */}
        <div className="doctor-details-left">
          <img
            src={getDoctorImage(doctor.image)}
            alt={doctor.name}
          />

          <h3>{doctor.name}</h3>
          <p className="education">{doctor.education}</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="doctor-details-right">
          <h2 className="dept-title">{doctor.department}</h2>
          <h4 className="experience">{doctor.experience} Years Experience</h4>

          {/* ABOUT DOCTOR */}
          {doctor.about && (
            <p className="doctor-description">
              {doctor.about}
            </p>
          )}

          {/* OPD INFO */}
          <div className="opd-info-grid">

            <div className="info-box">
              <strong>Languages Spoken</strong>
              <span>{doctor.languages?.join(", ")}</span>
            </div>

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

          {/* BOOK APPOINTMENT */}
          <div className="book-bar">
            <span>Book Appointment Now</span>
            <button onClick={() => setOpenModal(true)}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <OnlineAppointmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        doctor={doctor}
      />
    </div>
  );
};

export default DoctorDetails;
