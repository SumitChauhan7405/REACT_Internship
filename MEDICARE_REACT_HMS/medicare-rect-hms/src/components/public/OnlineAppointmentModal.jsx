import { useEffect, useState } from "react";
import { addAppointment } from "../../services/appointmentService";
import "../../assets/css/components/patient-form.css";

const OnlineAppointmentModal = ({ open, doctor, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    phone: "",
    bloodGroup: "",
    timing: ""
  });

  useEffect(() => {
    if (open) {
      setForm({
        firstName: "",
        lastName: "",
        gender: "",
        age: "",
        phone: "",
        bloodGroup: "",
        timing: ""
      });
    }
  }, [open]);

  if (!open || !doctor) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addAppointment({
      id: `APT-${new Date().getFullYear()}-${Date.now()}`,

      // Patient details (TEMP – for confirmation step)
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      age: form.age,
      phone: form.phone,
      bloodGroup: form.bloodGroup,

      doctorId: doctor.id,
      doctorName: doctor.name,

      date: new Date().toISOString().split("T")[0],
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
            <label>Preferred Time</label>
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
              Request Appointment
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
