import { useNavigate } from "react-router-dom";
import "../../assets/css/public/doctors-public.css";

/* ✅ LOAD IMAGE FROM src/assets */
const getDoctorImage = (imageName) => {
  try {
    return require(`../../assets/images/doctors/${imageName}`);
  } catch (err) {
    return require(`../../assets/images/doctors/doc.png`);
  }
};

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
          src={getDoctorImage(doctor.image)}
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
