import { useEffect, useState } from "react";
import {
  addConsultation,
  getAllConsultations
} from "../../services/consultationService";
import "../../assets/css/components/prescription-modal.css";

/* ✅ Always return a fresh object */
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
  refreshAppointments
}) => {
  const [form, setForm] = useState(getEmptyForm());
  const [lastConsultationNumber, setLastConsultationNumber] = useState(0);

  /* 🆕 Prescription History */
  const [history, setHistory] = useState([]);

  /* ======================
     LOAD CONSULTATION COUNTER (GLOBAL)
  ======================= */
  useEffect(() => {
    if (!open) return;

    const loadCounter = async () => {
      const year = new Date().getFullYear();
      const res = await getAllConsultations();

      const nums = res.data
        .filter((c) => c.id?.startsWith(`CON-${year}-`))
        .map((c) => Number(c.id.split("-")[2]))
        .filter((n) => !isNaN(n));

      setLastConsultationNumber(
        nums.length > 0 ? Math.max(...nums) : 0
      );
    };

    loadCounter();
  }, [open]);

  /* ======================
     LOAD PRESCRIPTION HISTORY
  ======================= */
  useEffect(() => {
    if (!open || !patient) return;

    const loadHistory = async () => {
      const res = await getAllConsultations();
      const filtered = res.data
        .filter((c) => c.patientId === patient.id)
        .sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      setHistory(filtered);
    };

    loadHistory();
  }, [open, patient]);

  /* ======================
     FORCE RESET FORM ON OPEN
  ======================= */
  useEffect(() => {
    if (open) {
      setForm(getEmptyForm());
    }
  }, [open]);

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
     SUBMIT (ADD ONLY)
  ======================= */
  const handleSubmit = async () => {
    const year = new Date().getFullYear();
    const nextNumber = lastConsultationNumber + 1;

    const consultationPayload = {
      id: `CON-${year}-${String(nextNumber).padStart(4, "0")}`,
      appointmentId: appointment.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      diagnosis: form.diagnosis,
      consultation: form.consultation,
      consultationFee: doctor.consultationFee,
      medicines: form.medicines,
      createdAt: new Date().toISOString()
    };

    await addConsultation(consultationPayload);

    setLastConsultationNumber(nextNumber);
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
        className="prescription-card prescription-split"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== LEFT FORM ===== */}
        <div className="prescription-left">
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

        {/* ===== RIGHT HISTORY ===== */}
        <div className="prescription-history">
          <h6>Prescription History</h6>

          {history.length === 0 && (
            <p className="history-empty">No previous prescriptions</p>
          )}

          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-header">
                <strong>{item.patientName}</strong>
                <span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
              <p><strong>Consultation:</strong> {item.consultation}</p>

              <div className="history-meds">
                <strong>Medicines:</strong>
                <ul>
                  {item.medicines?.map((m, i) => (
                    <li key={i}>
                      {m.name} – {m.dosage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PrescriptionModal;
