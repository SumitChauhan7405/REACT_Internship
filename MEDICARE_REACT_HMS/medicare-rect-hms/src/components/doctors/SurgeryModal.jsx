import { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/components/surgery-modal.css";

const SurgeryModal = ({ open, onClose, consultation, patient, doctor }) => {
  // ✅ HOOKS MUST BE FIRST (NO CONDITIONS ABOVE THIS)
  const [form, setForm] = useState({
    department: "",
    surgeryType: "",
    scheduledDate: "",
    scheduledTime: "",
    operationTheatre: "",
    notes: ""
  });

  // ✅ SAFE EFFECT
  useEffect(() => {
    if (!open) return;
    setForm({
      department: "",
      surgeryType: "",
      scheduledDate: "",
      scheduledTime: "",
      operationTheatre: "",
      notes: ""
    });
  }, [open]);

  // ✅ CONDITIONAL RETURN AFTER HOOKS
  if (!open || !consultation || !patient || !doctor) return null;

  /* ======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.post("http://localhost:5000/surgeries", {
      id: `SUR-${new Date().getFullYear()}-${Date.now()}`,
      consultationId: consultation.id,

      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,

      doctorId: doctor.id,
      doctorName: doctor.name,

      department: form.department,
      surgeryType: form.surgeryType,

      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,

      operationTheatre: form.operationTheatre,
      status: "SCHEDULED",
      notes: form.notes,

      createdAt: new Date().toISOString()
    });

    alert("Surgery scheduled successfully");
    onClose();
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="surgery-backdrop" onClick={onClose}>
      <div
        className="surgery-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h5>Schedule Surgery</h5>

        <p>
          <strong>Patient:</strong> {patient.firstName} {patient.lastName}
        </p>
        <p>
          <strong>Doctor:</strong> {doctor.name}
        </p>

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <input
          name="surgeryType"
          placeholder="Surgery Type"
          value={form.surgeryType}
          onChange={handleChange}
        />

        <input
          type="date"
          name="scheduledDate"
          value={form.scheduledDate}
          onChange={handleChange}
        />

        <input
          type="time"
          name="scheduledTime"
          value={form.scheduledTime}
          onChange={handleChange}
        />

        <input
          name="operationTheatre"
          placeholder="Operation Theatre"
          value={form.operationTheatre}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Schedule Surgery</button>
        </div>
      </div>
    </div>
  );
};

export default SurgeryModal;
