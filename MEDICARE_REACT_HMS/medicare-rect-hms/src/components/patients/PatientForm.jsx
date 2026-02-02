import { useEffect, useState } from "react";
import {
  getPatients,
  addPatient,
  updatePatient
} from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import "../../assets/css/components/patient-form.css";

const PatientForm = ({ onSuccess, editPatient, clearEdit }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    phone: "",
    bloodGroup: "",
    doctorName: "",
    timing: ""
  });

  useEffect(() => {
    loadPatients();
    loadDoctors();
  }, []);

  useEffect(() => {
    if (editPatient) {
      setForm({
        firstName: editPatient.firstName,
        lastName: editPatient.lastName,
        gender: editPatient.gender,
        age: editPatient.age,
        phone: editPatient.phone,
        bloodGroup: editPatient.bloodGroup,
        doctorName: editPatient.doctorName,
        timing: editPatient.timing
      });
    }
  }, [editPatient]);

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  const loadDoctors = async () => {
    const res = await getDoctors();
    setDoctors(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ======================
     PATIENT ID GENERATOR
  ======================= */
  const generatePatientId = () => {
    const year = new Date().getFullYear();
    const patOnly = patients.filter(p => p.id?.startsWith("PAT-"));

    if (patOnly.length === 0) {
      return `PAT-${year}-0001`;
    }

    const last = patOnly[patOnly.length - 1];
    const num = Number(last.id.split("-")[2]) + 1;

    return `PAT-${year}-${String(num).padStart(4, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editPatient) {
      await updatePatient(editPatient.id, {
        ...form,
        id: editPatient.id,
        status: editPatient.status,
        createdAt: editPatient.createdAt
      });
      clearEdit();
    } else {
      await addPatient({
        id: generatePatientId(),
        ...form,
        status: "CONFIRMED",
        source: "WALKIN",
        createdAt: new Date().toISOString()
      });

      await loadPatients();
    }

    onSuccess();

    setForm({
      firstName: "",
      lastName: "",
      gender: "",
      age: "",
      phone: "",
      bloodGroup: "",
      doctorName: "",
      timing: ""
    });
  };

  return (
    <div className="patient-form-card">
      <div className="form-header">
        <h5>{editPatient ? "Edit Patient" : "OPD Patient Registration"}</h5>
        <p>Enter patient personal information</p>
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
            <option value="">Select Group</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>

        <div>
          <label>Doctor</label>
          <select name="doctorName" value={form.doctorName} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.name}>
                {doc.name} ({doc.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>OPD Schedule</label>
          <select
            name="timing"
            value={form.timing}
            onChange={handleChange}
            required
          >
            <option value="">Select Schedule</option>
            <option value="MORNING (10:00 - 12:00)">
              Morning (10:00 – 12:00)
            </option>
            <option value="EVENING (5:00 - 7:00)">
              Evening (5:00 – 7:00)
            </option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">
            <i className="bi bi-person-plus-fill"></i>
            {editPatient ? " Update Patient" : " Register Patient"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
