import { useState } from "react";
import { addPatient } from "../../services/patientService";
import { generatePatientId } from "../../utils/generatePatientId";
import "../../assets/css/components/patient-form.css";

const PatientForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    dob: "",
    bloodGroup: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPatient = {
      id: generatePatientId(),
      ...form,
      createdAt: new Date().toISOString()
    };

    await addPatient(newPatient);
    onSuccess();
    setForm({
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
      dob: "",
      bloodGroup: ""
    });
  };

  return (
    <div className="patient-form-card">
      <div className="form-header">
        <h5>Patient Registration</h5>
        <p>Enter patient personal information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Gender</label>
            <select
              name="gender"
              required
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              required
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">
            <i className="bi bi-person-plus"></i>
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
