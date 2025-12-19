import { useEffect, useState } from "react";
import { getDoctors, addDoctor, updateDoctor } from "../../services/doctorService";
import "../../assets/css/components/doctor-form.css";

const DoctorForm = ({ onSuccess, editDoctor, clearEdit }) => {
  const [form, setForm] = useState({
    name: "",
    department: "",
    availableDays: [],
    opdTime: "",
    consultationFee: "",
    image: ""
  });

  useEffect(() => {
    if (editDoctor) {
      setForm(editDoctor);
    }
  }, [editDoctor]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "availableDays") {
      const values = Array.from(e.target.selectedOptions, o => o.value);
      setForm({ ...form, availableDays: values });
    } else if (name === "image" && files[0]) {
      setForm({ ...form, image: files[0].name });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const generateDoctorId = async () => {
    const res = await getDoctors();
    const count = res.data.length + 1;
    return `DOC-${String(count).padStart(3, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      consultationFee: Number(form.consultationFee),
      timeSlots: [form.opdTime] // keep DB compatible
    };

    delete payload.opdTime;

    if (editDoctor) {
      await updateDoctor(editDoctor.id, payload);
      clearEdit();
    } else {
      const newId = await generateDoctorId();
      await addDoctor({
        id: newId,
        ...payload
      });
    }

    onSuccess();
    setForm({
      name: "",
      department: "",
      availableDays: [],
      opdTime: "",
      consultationFee: "",
      image: ""
    });
  };

  return (
    <div className="doctor-form-card">
      <h5>{editDoctor ? "Edit Doctor" : "Add Doctor"}</h5>
      <p>Doctor details & OPD availability</p>

      <form onSubmit={handleSubmit} className="doctor-form-grid">

        <div>
          <label>Doctor Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Department</label>
          <select name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select</option>
            <option>Cardiology</option>
            <option>Orthopedics</option>
            <option>Neurology</option>
            <option>Dermatology</option>
            <option>ENT</option>
            <option>General Medicine</option>
          </select>
        </div>

        <div>
          <label>Available Days</label>
          <select
            multiple
            name="availableDays"
            value={form.availableDays}
            onChange={handleChange}
          >
            <option>Mon</option>
            <option>Tue</option>
            <option>Wed</option>
            <option>Thu</option>
            <option>Fri</option>
            <option>Sat</option>
          </select>
        </div>

        <div>
          <label>OPD Timings</label>
          <select
            name="opdTime"
            value={form.opdTime}
            onChange={handleChange}
            required
          >
            <option value="">Select OPD Time</option>
            <option value="10:00-12:00">Morning (10:00 – 12:00)</option>
            <option value="17:00-19:00">Evening (17:00 – 19:00)</option>
          </select>
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
          <input type="file" name="image" onChange={handleChange} />
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
