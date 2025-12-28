import { useState, useEffect } from "react";
import { addPatient, getPatients } from "../../services/patientService";
import "../../assets/css/components/patient-form.css";

const OnlineAppointmentModal = ({ open, doctor, onClose }) => {
  // ✅ ALL HOOKS AT TOP (NO CONDITIONS ABOVE)
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    phone: "",
    bloodGroup: "",
    timing: ""
  });

  // ✅ useEffect MUST be before return
  useEffect(() => {
    if (open) {
      loadPatients();
    }
  }, [open]);

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  // ✅ SAFE RETURN AFTER ALL HOOKS
  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SAME ID LOGIC AS ADMIN
  const generatePatientId = () => {
    const year = new Date().getFullYear();

    if (patients.length === 0) {
      return `PAT-${year}-0001`;
    }

    const lastPatient = patients[patients.length - 1];
    const lastNumber = Number(lastPatient.id.split("-")[2]);
    const nextNumber = lastNumber + 1;

    return `PAT-${year}-${String(nextNumber).padStart(4, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addPatient({
      id: generatePatientId(),
      ...form,
      doctorName: doctor.name,
      status: "PENDING",
      source: "ONLINE",
      createdAt: new Date().toISOString()
    });

    alert("Appointment booked successfully");
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
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Blood Group</label>
            <input
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Timing</label>
            <input
              type="time"
              name="timing"
              value={form.timing}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              <i className="bi bi-calendar-plus"></i>
              Book Appointment
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnlineAppointmentModal;
