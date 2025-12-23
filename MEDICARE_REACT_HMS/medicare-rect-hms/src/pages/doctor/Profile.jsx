import { useAuth } from "../../context/AuthContext";

const DoctorProfile = () => {
  const { user } = useAuth();
  const doctor = user?.data;

  if (!doctor) return null;

  return (
    <div className="patient-form-card">
      <h5>My Profile</h5>
      <p>Personal & professional information</p>

      <div className="form-grid">
        <div>
          <label>Name</label>
          <input value={doctor.name} disabled />
        </div>

        <div>
          <label>Department</label>
          <input value={doctor.department} disabled />
        </div>

        <div>
          <label>Experience</label>
          <input value={`${doctor.experience} years`} disabled />
        </div>

        <div>
          <label>Education</label>
          <input value={doctor.education} disabled />
        </div>

        <div>
          <label>Available Days</label>
          <input value={doctor.availableDays?.join(", ")} disabled />
        </div>

        <div>
          <label>OPD Timings</label>
          <input value={doctor.timeSlots?.join(", ")} disabled />
        </div>

        <div>
          <label>Consultation Fee</label>
          <input value={`₹ ${doctor.consultationFee}`} disabled />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
