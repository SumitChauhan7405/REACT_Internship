import "../../assets/css/public/doctor-cards.css";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card">
      <img
        src={doctor.image}
        alt={doctor.name}
        className="doctor-image"
      />

      <h4>{doctor.name}</h4>
      <p className="department">{doctor.department}</p>

      <p><strong>Experience:</strong> {doctor.experience} Years</p>
      <p><strong>Education:</strong> {doctor.education}</p>
      <p><strong>OPD:</strong> {doctor.opdTimings}</p>
      <p><strong>Fees:</strong> ₹{doctor.consultationFee}</p>

      <button className="book-btn">
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorCard;
