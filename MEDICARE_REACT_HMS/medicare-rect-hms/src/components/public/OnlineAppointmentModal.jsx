import { useEffect, useState } from "react";
import { addAppointment, getAppointments } from "../../services/appointmentService";
import "../../assets/css/components/patient-form.css";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"
];

const OnlineAppointmentModal = ({ open, doctor, onClose }) => {
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    phone: "",
    bloodGroup: "",
    date: "",
    timing: ""
  });

  /* ======================
     LOAD APPOINTMENTS (FOR ID)
  ======================= */
  useEffect(() => {
    if (open) {
      loadAppointments();
      setForm({
        firstName: "",
        lastName: "",
        gender: "",
        age: "",
        phone: "",
        bloodGroup: "",
        date: "",
        timing: ""
      });
    }
  }, [open]);

  const loadAppointments = async () => {
    const res = await getAppointments();
    setAppointments(res.data);
  };

  if (!open || !doctor) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ======================
     GENERATE APPOINTMENT ID
  ======================= */
  const generateAppointmentId = () => {
    const year = new Date().getFullYear();

    const aptOnly = appointments.filter(
      (a) => a.id && a.id.startsWith(`APT-${year}`)
    );

    if (aptOnly.length === 0) {
      return `APT-${year}-0001`;
    }

    const last = aptOnly[aptOnly.length - 1];
    const num = Number(last.id.split("-")[2]) + 1;

    return `APT-${year}-${String(num).padStart(4, "0")}`;
  };

  /* ======================
     SUBMIT
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await addAppointment({
      id: generateAppointmentId(),

      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      age: form.age,
      phone: form.phone,
      bloodGroup: form.bloodGroup,

      doctorId: doctor.id,
      doctorName: doctor.name,

      date: form.date,
      time: form.timing,

      status: "PENDING",
      source: "ONLINE",
      createdAt: new Date().toISOString()
    });

    alert("Appointment request sent successfully");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card patient-form-card">
        <div className="form-header">
          <h5>Book Appointment</h5>
          <p>Doctor: {doctor.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>

          <div>
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>

          <div>
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} required />
          </div>

          <div>
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>

          <div>
            <label>Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Appointment Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>

          <div>
            <label>Preferred Time</label>
            <input type="time" name="timing" value={form.timing} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="submit">
              <i className="bi bi-calendar-plus"></i>
              Request Appointment
            </button>

            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnlineAppointmentModal;
