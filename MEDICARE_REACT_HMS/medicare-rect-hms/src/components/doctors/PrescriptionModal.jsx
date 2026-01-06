import { useEffect, useState } from "react";
import {
  addConsultation,
  updateConsultation,
  getConsultations
} from "../../services/consultationService";
import "../../assets/css/components/prescription-modal.css";

/* ✅ FIX: always return a fresh object */
const getEmptyForm = () => ({
  diagnosis: "",
  consultation: "",
  medicines: [{ name: "", dosage: "" }]
});

const PrescriptionModal = ({
  open,
  onClose,
  appointment,
  patient,
  doctor,
  existingPrescription,
  mode,
  refreshAppointments
}) => {
  const [form, setForm] = useState(getEmptyForm());

  /* ======================
     RESET / PREFILL
  ======================= */
  useEffect(() => {
    if (!open) return;

    if (mode === "ADD") {
      setForm(getEmptyForm());
    }

    // ✅ FIX: prescription removed manually from db.json
    if (mode === "EDIT" && !existingPrescription) {
      setForm(getEmptyForm());
    }

    if (mode === "EDIT" && existingPrescription) {
      setForm({
        diagnosis: existingPrescription.diagnosis || "",
        consultation: existingPrescription.consultation || "",
        medicines:
          existingPrescription.medicines?.length > 0
            ? existingPrescription.medicines
            : [{ name: "", dosage: "" }]
      });
    }
  }, [open, mode, existingPrescription]);

  if (!open || !appointment || !patient || !doctor) return null;

  /* ======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...form.medicines];
    updated[index][field] = value;
    setForm({ ...form, medicines: updated });
  };

  const addMedicineRow = () => {
    setForm({
      ...form,
      medicines: [...form.medicines, { name: "", dosage: "" }]
    });
  };

  const removeMedicineRow = (index) => {
    const updated = form.medicines.filter((_, i) => i !== index);
    setForm({
      ...form,
      medicines: updated.length > 0 ? updated : [{ name: "", dosage: "" }]
    });
  };

  /* ======================
     NORMALIZED CONSULTATION ID
  ======================= */
  const generateConsultationId = async () => {
    const year = new Date().getFullYear();
    const res = await getConsultations();

    const consOnly = res.data.filter(
      (c) => c.id && c.id.startsWith(`CON-${year}-`)
    );

    if (consOnly.length === 0) {
      return `CON-${year}-0001`;
    }

    const last = consOnly[consOnly.length - 1];
    const lastNum = Number(last.id.split("-")[2]) || 0;
    const next = lastNum + 1;

    return `CON-${year}-${String(next).padStart(4, "0")}`;
  };

  /* ======================
     SUBMIT
  ======================= */
  const handleSubmit = async () => {
    const consultationPayload = {
      appointmentId: appointment.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      diagnosis: form.diagnosis,
      consultation: form.consultation,
      medicines: form.medicines,
      createdAt: new Date().toISOString()
    };

    if (mode === "EDIT" && existingPrescription) {
      await updateConsultation(existingPrescription.id, consultationPayload);
    } else {
      const newId = await generateConsultationId();
      await addConsultation({
        id: newId,
        ...consultationPayload
      });
    }

    await refreshAppointments();
    alert("Prescription saved successfully");
    onClose();
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="prescription-backdrop" onClick={onClose}>
      <div
        className="prescription-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h5>Prescription</h5>

        <div className="form-grid">
          <input value={`${patient.firstName} ${patient.lastName}`} disabled />
          <input value={doctor.name} disabled />
          <input value={appointment.date} disabled />
        </div>

        <label>Diagnosis</label>
        <textarea
          name="diagnosis"
          rows="3"
          value={form.diagnosis}
          onChange={handleChange}
        />

        <label>Consultation</label>
        <textarea
          name="consultation"
          rows="3"
          value={form.consultation}
          onChange={handleChange}
        />

        <h6>Medicines</h6>
        {form.medicines.map((m, i) => (
          <div key={i} className="medicine-row">
            <input
              placeholder="Medicine"
              value={m.name}
              onChange={(e) =>
                handleMedicineChange(i, "name", e.target.value)
              }
            />
            <input
              placeholder="Dosage (1-0-1)"
              value={m.dosage}
              onChange={(e) =>
                handleMedicineChange(i, "dosage", e.target.value)
              }
            />

            <button
              type="button"
              className="icon-btn delete"
              onClick={() => removeMedicineRow(i)}
              title="Remove Medicine"
            >
              <i className="bi bi-trash-fill"></i>
            </button>
          </div>
        ))}

        <button className="btn-add-medicine" onClick={addMedicineRow}>
          + Add Medicine
        </button>

        <div className="form-actions">
          <button className="form-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-presave" onClick={handleSubmit}>
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
