import { useNavigate } from "react-router-dom";
import "../../assets/css/public/doctors-public.css";

const DoctorCard = ({ doctor, onBook }) => {
  const navigate = useNavigate();

  return (
    <div
      className="doctor-card"
      onClick={() => navigate(`/doctors/${doctor.id}`)}
    >
      <div className="doctor-image">
        <img
          src={
            doctor.image
              ? `/images/doctors/${doctor.image}`
              : "/images/doctors/default-doctor.png"
          }
          alt={doctor.name}
        />
      </div>

      <div className="doctor-body">
        <h4 className="doctor-name">{doctor.name}</h4>
        <p className="doctor-dept">{doctor.department}</p>

        <p><strong>Experience:</strong> {doctor.experience} yrs</p>
        <p><strong>Education:</strong> {doctor.education}</p>
        <p><strong>OPD Days:</strong> {doctor.availableDays.join(", ")}</p>
        <p><strong>OPD Time:</strong> {doctor.timeSlots.join(", ")}</p>

        <p className="doctor-fee">₹{doctor.consultationFee}</p>

        {/* STOP PROPAGATION so card click doesn't trigger */}
        <button
          className="btn-book"
          onClick={(e) => {
            e.stopPropagation();
            onBook(doctor);
          }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
