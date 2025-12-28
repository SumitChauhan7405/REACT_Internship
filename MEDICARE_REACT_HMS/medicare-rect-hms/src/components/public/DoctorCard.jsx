import { useNavigate } from "react-router-dom";
import "../../assets/css/public/doctors-public.css";

const DoctorCard = ({ doctor, onBook }) => {
  const navigate = useNavigate();

  return (
    <div
      className="doctor-card"
      onClick={() => navigate(`/doctors/${doctor.id}`)}
    >
      {/* IMAGE */}
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

      {/* BODY */}
      <div className="doctor-body">
        <h4 className="doctor-name">{doctor.name}</h4>
        <p className="doctor-dept">{doctor.department}</p>

        {/* OPD INFO */}
        <div className="doctor-opd">
          <p>
            <strong>OPD Days:</strong>{" "}
            {doctor.availableDays.join(", ")}
          </p>
          <p>
            <strong>OPD Time:</strong>{" "}
            {doctor.timeSlots.join(", ")}
          </p>
        </div>

        {/* BOOK BUTTON */}
        <button
          className="btn-book"
          onClick={(e) => {
            e.stopPropagation(); // ✅ VERY IMPORTANT
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
