import { useEffect, useState } from "react";
import axios from "axios";
import DoctorLabTests from "../doctors/DoctorLabTests";
import "../../assets/css/components/lab-tests-modal.css";

const LAB_TEST_OPTIONS = [
  "Blood Sugar",
  "CBC",
  "ECG",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Urine Test"
];

const LabTestsModal = ({ open, onClose, consultation, patient }) => {
  const [labTest, setLabTest] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  /* ======================
     LOAD EXISTING LAB TEST
  ======================= */
  useEffect(() => {
    if (!open || !consultation) return;

    const loadLabTest = async () => {
      const res = await axios.get("http://localhost:5000/labTests");
      const existing = res.data.find(
        (l) => l.consultationId === consultation.id
      );

      if (existing) {
        setLabTest(existing);
        setSelectedTests(existing.tests || []);
      } else {
        setLabTest(null);
        setSelectedTests([]);
      }
    };

    loadLabTest();
  }, [open, consultation]);

  if (!open || !consultation || !patient) return null;

  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test)
        ? prev.filter((t) => t !== test)
        : [...prev, test]
    );
  };

  /* ======================
     SAVE LAB TEST (FIXED)
  ======================= */
  const handleSave = async () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one lab test");
      return;
    }

    // ✅ IMPORTANT:
    // Do NOT create consultation if it does not exist
    // TEMP consultationId is allowed ONLY for labTests

    if (labTest) {
      // Update existing lab test
      await axios.patch(
        `http://localhost:5000/labTests/${labTest.id}`,
        {
          tests: selectedTests,
          doctorId: consultation.doctorId,
          doctorName: consultation.doctorName
        }
      );
    } else {
      // Create new lab test ONLY
      await axios.post("http://localhost:5000/labTests", {
        id: `LAB-${new Date().getFullYear()}-${Date.now()}`,
        consultationId: consultation.id, // TEMP or REAL – both allowed
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: consultation.doctorId,
        doctorName: consultation.doctorName,
        tests: selectedTests,
        results: [],
        status: "PENDING",
        createdAt: new Date().toISOString()
      });
    }

    alert("Lab tests saved successfully");
    onClose();
  };

  return (
    <div className="lab-modal-backdrop" onClick={onClose}>
      <div
        className="lab-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h5>Lab Tests</h5>

        <div className="lab-info">
          <p>
            <strong>Patient:</strong> {patient.firstName} {patient.lastName}
          </p>
          <p>
            <strong>Consultation ID:</strong> {consultation.id}
          </p>
        </div>

        {/* 🔽 DROPDOWN */}
        <div className="lab-dropdown">
          <button
            type="button"
            className="lab-dropdown-btn"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {selectedTests.length > 0
              ? `${selectedTests.length} test(s) selected`
              : "Select Lab Tests"}
            <span className="caret">▾</span>
          </button>

          {openDropdown && (
            <div className="lab-dropdown-menu">
              {LAB_TEST_OPTIONS.map((test) => (
                <label key={test} className="lab-dropdown-item">
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(test)}
                    onChange={() => toggleTest(test)}
                  />
                  <span>{test}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 🧪 DOCTOR LAB RESULTS */}
        {consultation?.id && (
          <DoctorLabTests consultationId={consultation.id} />
        )}

        <div className="form-actions">
          <button className="form-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-savelab-primary" onClick={handleSave}>
            Save Lab Tests
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabTestsModal;
