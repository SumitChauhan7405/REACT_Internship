import { useEffect, useState } from "react";
import {
  addConsultation,
  updateConsultation
} from "../../services/consultationService";
import "../../assets/css/components/prescription-modal.css";

const PrescriptionModal = ({
  open,
  onClose,
  appointment,
  patient,
  doctor,
  existingPrescription
}) => {
  const [form, setForm] = useState({
    diagnosis: "",
    consultation: "",
    medicines: [{ name: "", dosage: "" }]
  });

  /* ======================
     PREFILL ON EDIT
  ======================= */
  useEffect(() => {
    if (existingPrescription) {
      setForm({
        diagnosis: existingPrescription.diagnosis || "",
        consultation: existingPrescription.consultation || "",
        medicines: existingPrescription.medicines || [{ name: "", dosage: "" }]
      });
    }
  }, [existingPrescription]);

  if (!open) return null;

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

  const handleSubmit = async () => {
    const payload = {
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

    if (existingPrescription) {
      await updateConsultation(existingPrescription.id, payload);
    } else {
      await addConsultation({
        id: `CON-${new Date().getFullYear()}-${Date.now()}`,
        ...payload
      });
    }

    alert("Prescription saved successfully");
    onClose();
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="modal-overlay">
      <div className="patient-form-card" style={{ maxWidth: 600 }}>
        <h5>Prescription</h5>
        <p>Patient medical details</p>

        <div className="form-grid">
          <div>
            <label>Patient</label>
            <input value={`${patient.firstName} ${patient.lastName}`} disabled />
          </div>

          <div>
            <label>Doctor</label>
            <input value={doctor.name} disabled />
          </div>

          <div>
            <label>Date</label>
            <input value={appointment.date} disabled />
          </div>

          <div>
            <label>Diagnosis</label>
            <input
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Consultation</label>
            <input
              name="consultation"
              value={form.consultation}
              onChange={handleChange}
            />
          </div>
        </div>

        <h6 style={{ marginTop: 16 }}>Medicines</h6>

        {form.medicines.map((m, i) => (
          <div key={i} className="form-grid">
            <input
              placeholder="Medicine name"
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
          </div>
        ))}

        <button className="btn-primary" onClick={addMedicineRow}>
          + Add Medicine
        </button>

        <div className="form-actions">
          <button className="form-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
