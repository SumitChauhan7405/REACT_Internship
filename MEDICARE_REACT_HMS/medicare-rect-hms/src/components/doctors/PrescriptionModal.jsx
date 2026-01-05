import { useEffect, useState, useRef } from "react";
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

const EMPTY_FORM = {
  diagnosis: "",
  consultation: "",
  medicines: [{ name: "", dosage: "" }]
};

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
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedTests, setSelectedTests] = useState([]);
  const [labTestId, setLabTestId] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const LAB_TEST_OPTIONS = [
    "Blood Sugar",
    "CBC",
    "ECG",
    "X-Ray",
    "MRI",
    "CT Scan",
    "Urine Test"
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    if (mode === "ADD") {
      setForm(EMPTY_FORM);
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
    }
  };

  if (!open || !appointment || !patient || !doctor) return null;

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

    if (selectedTests.length > 0) {
      const labPayload = {
        consultationId,
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        tests: selectedTests,
        results: [],
        status: "PENDING",
        createdAt: new Date().toISOString()
      };

      if (labTestId) {
        await updateLabTest(labTestId, labPayload);
      } else {
        await addLabTest({
          id: `LAB-${new Date().getFullYear()}-${Date.now()}`,
          ...labPayload
        });
      }
    }

    await refreshAppointments();
    alert("Prescription saved successfully");
    onClose();
  };

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
          </div>
        ))}

        <button className="btn-add-medicine" onClick={addMedicineRow}>
          + Add Medicine
        </button>

        <h6 style={{ marginTop: 16 }}>Lab Tests</h6>

        <div className="lab-dropdown" ref={dropdownRef}>
          <div
            className="lab-dropdown-toggle"
            onClick={() => setIsDropdownOpen((p) => !p)}
          >
            {selectedTests.length > 0
              ? `${selectedTests.length} test(s) selected`
              : "Select Lab Tests"}
          </div>

          {isDropdownOpen && (
            <div className="lab-dropdown-menu">
              {LAB_TEST_OPTIONS.map((test) => (
                <div
                  key={test}
                  className="lab-dropdown-item"
                  onClick={() => toggleLabTest(test)}
                >
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(test)}
                    readOnly
                  />
                  <span>{test}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="btn-presave" onClick={handleSubmit}>
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
