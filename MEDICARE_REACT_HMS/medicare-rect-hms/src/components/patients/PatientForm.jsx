import { useEffect, useState } from "react";
import { addPatient } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { generatePatientId } from "../../utils/generatePatientId";
import "../../assets/css/components/patient-form.css";

const PatientForm = ({ onSuccess }) => {
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    age: "",
    bloodGroup: "",
    doctorId: "",
    doctorName: "",
    timing: ""
  });

  /* Load doctors */
  useEffect(() => {
    getDoctors().then((res) => setDoctors(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "doctorId") {
      const selectedDoctor = doctors.find((d) => d.id === value);
      setForm({
        ...form,
        doctorId: value,
        doctorName: selectedDoctor?.name || ""
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

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
      age: "",
      bloodGroup: "",
      doctorId: "",
      doctorName: "",
      timing: ""
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
          {/* Row 1 */}
          <div>
            <label>First Name</label>
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
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

          {/* Row 2 */}
          <div>
            <label>Phone</label>
            <input
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Age</label>
            <input
              type="number"
              name="age"
              required
              value={form.age}
              onChange={handleChange}
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

          {/* Row 3 */}
          <div>
            <label>Doctor</label>
            <select
              name="doctorId"
              required
              value={form.doctorId}
              onChange={handleChange}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Appointment Time</label>
            <input
              type="time"
              name="timing"
              required
              value={form.timing}
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
