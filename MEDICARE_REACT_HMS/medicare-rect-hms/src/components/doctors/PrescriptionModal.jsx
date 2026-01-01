import { useEffect, useState } from "react";
import {
  addConsultation,
  updateConsultation
} from "../../services/consultationService";
import {
  addLabTest,
  updateLabTest,
  getLabTests
} from "../../services/labTestService";
import "../../assets/css/components/prescription-modal.css";
import DoctorLabTests from "../doctors/DoctorLabTests";


const PrescriptionModal = ({
  open,
  onClose,
  appointment,
  patient,
  doctor,
  existingPrescription,
  mode // ADD | EDIT
}) => {
  const emptyForm = {
    diagnosis: "",
    consultation: "",
    medicines: [{ name: "", dosage: "" }]
  };

  const [form, setForm] = useState(emptyForm);

  // 🧪 LAB TEST STATE
  const [selectedTests, setSelectedTests] = useState([]);
  const [labTestId, setLabTestId] = useState(null);

  const LAB_TEST_OPTIONS = [
    "Blood Sugar",
    "CBC",
    "ECG",
    "X-Ray",
    "MRI",
    "CT Scan",
    "Urine Test"
  ];

  /* ======================
     RESET / PREFILL
  ======================= */
  useEffect(() => {
    if (!open) return;

    if (mode === "ADD") {
      setForm(emptyForm);
      setSelectedTests([]);
      setLabTestId(null);
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

      // ✅ LOAD EXISTING LAB TEST
      loadExistingLabTest(existingPrescription.id);
    }
  }, [open, mode, existingPrescription]);

  const loadExistingLabTest = async (consultationId) => {
    const res = await getLabTests();
    const existing = res.data.find(
      (l) => l.consultationId === consultationId
    );

    if (existing) {
      setLabTestId(existing.id);
      setSelectedTests(existing.tests || []);
    } else {
      setLabTestId(null);
      setSelectedTests([]);
    }
  };

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

  const toggleLabTest = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test)
        ? prev.filter((t) => t !== test)
        : [...prev, test]
    );
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

    let consultationId;

    if (mode === "EDIT" && existingPrescription) {
      await updateConsultation(existingPrescription.id, consultationPayload);
      consultationId = existingPrescription.id;
    } else {
      const res = await addConsultation({
        id: `CON-${new Date().getFullYear()}-${Date.now()}`,
        ...consultationPayload
      });
      consultationId = res.data.id;
    }

    // 🧪 SAVE / UPDATE LAB TEST
    if (selectedTests.length > 0) {
      if (labTestId) {
        // ✅ UPDATE
        await updateLabTest(labTestId, {
          tests: selectedTests,
          status: "PENDING"
        });
      } else {
        // ✅ CREATE
        await addLabTest({
          id: `LAB-${new Date().getFullYear()}-${Date.now()}`,
          consultationId,
          patientId: patient.id,
          tests: selectedTests,
          results: [],
          status: "PENDING"
        });
      }
    }

    alert("Prescription & Lab Tests saved successfully");
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

        {/* PATIENT INFO */}
        <div className="form-grid">
          <input value={`${patient.firstName} ${patient.lastName}`} disabled />
          <input value={doctor.name} disabled />
          <input value={appointment.date} disabled />
        </div>

        {/* DIAGNOSIS */}
        <label>Diagnosis</label>
        <textarea
          name="diagnosis"
          rows="3"
          value={form.diagnosis}
          onChange={handleChange}
        />

        {/* CONSULTATION */}
        <label>Consultation</label>
        <textarea
          name="consultation"
          rows="3"
          value={form.consultation}
          onChange={handleChange}
        />

        {/* MEDICINES */}
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
          </div>
        ))}
        <button className="btn-add-medicine" onClick={addMedicineRow}>
          + Add Medicine
        </button>

        {/* 🧪 LAB TESTS */}
        <h6 style={{ marginTop: 16 }}>Lab Tests</h6>
        <div className="lab-test-grid">
          {LAB_TEST_OPTIONS.map((test) => {
            const checked = selectedTests.includes(test);

            return (
              <div
                key={test}
                className={`lab-test-item ${checked ? "active" : ""}`}
                onClick={() => toggleLabTest(test)}
              >
                <input type="checkbox" checked={checked} readOnly />
                <span>{test}</span>
              </div>
            );
          })}
        </div>

        {/* 👨‍⚕️ DOCTOR VIEW – LAB RESULTS */}
        {mode === "EDIT" && existingPrescription?.id && (
          <DoctorLabTests consultationId={existingPrescription.id} />
        )}


        {/* ACTIONS */}
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
