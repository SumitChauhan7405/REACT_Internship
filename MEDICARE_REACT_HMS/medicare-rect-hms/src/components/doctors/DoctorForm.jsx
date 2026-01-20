import { useEffect, useState } from "react";
import {
  getDoctors,
  addDoctor,
  updateDoctor
} from "../../services/doctorService";
import "../../assets/css/components/doctor-form.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const OPD_TIMINGS = [
  { label: "Morning (10:00 – 12:00)", value: "10:00-12:00" },
  { label: "Evening (5:00 – 7:00)", value: "5:00-7:00" }
];

const DoctorForm = ({ onSuccess, editDoctor, clearEdit }) => {
  const [form, setForm] = useState({
    name: "",
    department: "",
    experience: "",
    education: "",
    availableDays: [],
    opdTimings: [],
    consultationFee: "",
    image: ""
  });

  /* ===============================
     PREFILL EDIT
  =============================== */
  useEffect(() => {
    if (editDoctor) {
      setForm({
        name: editDoctor.name.replace(/^Dr\.\s*/i, ""),
        department: editDoctor.department,
        experience: editDoctor.experience,
        education: editDoctor.education,
        availableDays: editDoctor.availableDays || [],
        opdTimings: editDoctor.timeSlots || [],
        consultationFee: editDoctor.consultationFee,
        image: editDoctor.image || ""
      });
    }
  }, [editDoctor]);

  /* ===============================
     HANDLERS
  =============================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const toggleOpdTiming = (time) => {
    setForm((prev) => ({
      ...prev,
      opdTimings: prev.opdTimings.includes(time)
        ? prev.opdTimings.filter((t) => t !== time)
        : [...prev.opdTimings, time]
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, image: e.target.files[0].name });
    }
  };

  /* ===============================
     DOCTOR ID GENERATION
  =============================== */
  const generateDoctorId = async () => {
    const res = await getDoctors();
    if (res.data.length === 0) return "DOC-001";

    const last = res.data[res.data.length - 1];
    const next = Number(last.id.split("-")[1]) + 1;
    return `DOC-${String(next).padStart(3, "0")}`;
  };

  /* ===============================
     CREDENTIALS
  =============================== */
  const generateCredentials = (name) => {
    const firstName = name.split(" ")[0].toLowerCase();
    return {
      email: `${firstName}@medicare.com`,
      password: `${firstName}@123`
    };
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.opdTimings.length === 0) {
      alert("Please select at least one OPD timing");
      return;
    }

    const finalName = form.name.startsWith("Dr.")
      ? form.name
      : `Dr. ${form.name}`;

    const credentials = generateCredentials(
      finalName.replace(/^Dr\.\s*/i, "")
    );

    const payload = {
      name: finalName,
      email: credentials.email,
      password: credentials.password,
      department: form.department,
      experience: Number(form.experience),
      education: form.education,
      availableDays: form.availableDays,
      timeSlots: form.opdTimings,
      consultationFee: Number(form.consultationFee),
      image: form.image
    };

    if (editDoctor) {
      await updateDoctor(editDoctor.id, payload);
      clearEdit();
    } else {
      const newId = await generateDoctorId();
      await addDoctor({ id: newId, ...payload });
    }

    onSuccess();

    setForm({
      name: "",
      department: "",
      experience: "",
      education: "",
      availableDays: [],
      opdTimings: [],
      consultationFee: "",
      image: ""
    });
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="doctor-form-card">
      <h5>{editDoctor ? "Edit Doctor" : "Add Doctor"}</h5>
      <p>Doctor details & OPD availability</p>

      <form onSubmit={handleSubmit} className="doctor-form-grid">
        <div>
          <label>Doctor Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option>Cardiology</option>
            <option>Orthopedics</option>
            <option>Neurology</option>
            <option>Radiology</option>
            <option>ENT</option>
            <option>General Medicine</option>
          </select>
        </div>

        <div>
          <label>Experience (Years)</label>
          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Education</label>
          <input
            name="education"
            value={form.education}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Available Days</label>
          <div className="available-days">
            {DAYS.map((day) => (
              <label key={day} className="available-day-item">
                <input
                  type="checkbox"
                  checked={form.availableDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>OPD Timings</label>
          <div className="opd-container">
            {OPD_TIMINGS.map((t) => (
              <label key={t.value} className="opd-option">
                <input
                  type="checkbox"
                  checked={form.opdTimings.includes(t.value)}
                  onChange={() => toggleOpdTiming(t.value)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Consultation Fee (₹)</label>
          <input
            type="number"
            name="consultationFee"
            value={form.consultationFee}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Doctor Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <div className="doctor-form-actions">
          <button type="submit">
            <i className="bi bi-person-plus-fill"></i>
            {editDoctor ? " Update Doctor" : " Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
