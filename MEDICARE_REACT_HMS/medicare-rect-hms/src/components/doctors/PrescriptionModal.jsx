import { useEffect, useState, useCallback } from "react";
import axios from "axios"; // ✅ ADDED
import {
  addConsultation,
  getAllConsultations,
  updateConsultation
} from "../../services/consultationService";

import LabTestsModal from "../lab/LabTestsModal";
import SurgeryModal from "../doctors/SurgeryModal";

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
  const [editingId, setEditingId] = useState(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState(null);

  /* 🧪 LAB */
  const [openLabModal, setOpenLabModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  /* ❤️ SURGERY */
  const [openSurgeryModal, setOpenSurgeryModal] = useState(false);
  const [surgeryConsultation, setSurgeryConsultation] = useState(null);

  /* ======================
     LOAD CONSULTATION COUNTER
  ======================= */
  useEffect(() => {
    if (!open) return;

    const loadCounter = async () => {
      const year = new Date().getFullYear();
      const res = await getAllConsultations();

      const nums = res.data
        .filter(c => c.id?.startsWith(`CON-${year}-`))
        .map(c => Number(c.id.split("-")[2]))
        .filter(n => !isNaN(n));

      setLastConsultationNumber(nums.length > 0 ? Math.max(...nums) : 0);
    };

    loadCounter();
  }, [open]);

  /* ======================
     LOAD PRESCRIPTION HISTORY
  ======================= */
  const loadHistory = useCallback(async () => {
    if (!patient) return;

    const res = await getAllConsultations();
    const filtered = res.data
      .filter(c => c.patientId === patient.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setHistory(filtered);
  }, [patient]);

  useEffect(() => {
    if (!open) return;
    loadHistory();
  }, [open, loadHistory]);

  /* ======================
     RESET FORM
  ======================= */
  useEffect(() => {
    if (open) {
      setForm(getEmptyForm());
      setEditingId(null);
      setEditingCreatedAt(null);
    }
  }, [open]);

  if (!open || !appointment || !patient || !doctor) return null;

  /* ======================
     FORM HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = form.medicines.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
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
      medicines: updated.length ? updated : [{ name: "", dosage: "" }]
    });
  };

  /* ======================
     EDIT HISTORY
  ======================= */
  const editPrescription = (item) => {
    setEditingId(item.id);
    setEditingCreatedAt(item.createdAt);
    setForm({
      diagnosis: item.diagnosis,
      consultation: item.consultation,
      medicines: item.medicines
        ? item.medicines.map(m => ({ ...m }))
        : [{ name: "", dosage: "" }]
    });
  };

  /* ======================
     SUBMIT PRESCRIPTION
  ======================= */
  const handleSubmit = async () => {
    const year = new Date().getFullYear();
    const nextNumber = lastConsultationNumber + 1;

    const consultationId = editingId
      ? editingId
      : `CON-${year}-${String(nextNumber).padStart(4, "0")}`;

    const payload = {
      id: consultationId,
      appointmentId: appointment.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      diagnosis: form.diagnosis,
      consultation: form.consultation,
      consultationFee: doctor.consultationFee,
      medicines: form.medicines.map(m => ({ ...m })),
      createdAt: editingId ? editingCreatedAt : new Date().toISOString()
    };

    if (editingId) {
      await updateConsultation(editingId, payload);
    } else {
      await addConsultation(payload);
      setLastConsultationNumber(nextNumber);
    }

    /* ======================
       🔥 LINK LAB TESTS
    ======================= */
    const labRes = await axios.get("http://localhost:5000/labTests");

    const pendingLabs = labRes.data.filter(
      l => l.consultationId === null && l.patientId === patient.id
    );

    for (const lab of pendingLabs) {
      await axios.patch(
        `http://localhost:5000/labTests/${lab.id}`,
        {
          consultationId,
          doctorId: doctor.id,
          doctorName: doctor.name
        }
      );
    }

    /* ======================
       🔥 LINK SURGERIES (NEW)
    ======================= */
    const surgeryRes = await axios.get("http://localhost:5000/surgeries");

    const pendingSurgeries = surgeryRes.data.filter(
      s => s.consultationId === null && s.patientId === patient.id
    );

    for (const surgery of pendingSurgeries) {
      await axios.patch(
        `http://localhost:5000/surgeries/${surgery.id}`,
        {
          consultationId,
          doctorId: doctor.id,
          doctorName: doctor.name
        }
      );
    }

    await refreshAppointments();
    await loadHistory();

    alert(editingId ? "Prescription updated successfully" : "Prescription saved successfully");

    setForm(getEmptyForm());
    setEditingId(null);
    setEditingCreatedAt(null);
  };

  /* ======================
     LAB & SURGERY OPENERS
  ======================= */
  const openLab = (consultation) => {
    setSelectedConsultation(consultation);
    setOpenLabModal(true);
  };

  const openSurgery = (consultation) => {
    setSurgeryConsultation(consultation);
    setOpenSurgeryModal(true);
  };

  /* ======================
     UI
  ======================= */
  return (
    <>
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

            {/* 🔥 LAB & SURGERY ICONS INSIDE FORM */}
            <div className="history-actions" style={{ marginTop: 10 }}>
              <button
                className="icon-btn lab"
                onClick={() => openLab({ id: editingId })}
              >
                <i className="bi bi-flask"></i>
              </button>

              <button
                className="icon-btn surgery"
                onClick={() => openSurgery({ id: editingId })}
              >
                <i className="bi bi-heart-pulse"></i>
              </button>
            </div>

            <div className="form-actions">
              <button className="form-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-presave" onClick={handleSubmit}>
                {editingId ? "Update Prescription" : "Save Prescription"}
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
              <div
                key={item.id}
                className="history-card"
              >

                <div className="history-header">
                  <strong>{item.patientName}</strong>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
                <p><strong>Consultation:</strong> {item.consultation}</p>

                <div className="history-meds">
                  <strong>Medicines:</strong>
                  <ul>
                    {item.medicines?.map((m, i) => (
                      <li key={i}>{m.name} – {m.dosage}</li>
                    ))}
                  </ul>
                </div>

                <div className="history-actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => editPrescription(item)}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>

                  <button
                    className="icon-btn lab"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLab(item);
                    }}
                  >
                    <i className="bi bi-flask"></i>
                  </button>

                  <button
                    className="icon-btn surgery"
                    onClick={(e) => {
                      e.stopPropagation();
                      openSurgery(item);
                    }}
                  >
                    <i className="bi bi-heart-pulse"></i>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🧪 LAB MODAL */}
      <LabTestsModal
        open={openLabModal}
        onClose={() => setOpenLabModal(false)}
        consultation={selectedConsultation}
        patient={patient}
      />

      {/* ❤️ SURGERY MODAL */}
      <SurgeryModal
        open={openSurgeryModal}
        onClose={() => setOpenSurgeryModal(false)}
        consultation={surgeryConsultation}
        patient={patient}
        doctor={doctor}
      />
    </>
  );
};

export default PrescriptionModal;
