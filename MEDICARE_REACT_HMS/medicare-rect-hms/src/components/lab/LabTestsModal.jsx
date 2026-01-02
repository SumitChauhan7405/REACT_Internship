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

  const handleSave = async () => {
    if (labTest) {
      await axios.patch(
        `http://localhost:5000/labTests/${labTest.id}`,
        { tests: selectedTests }
      );
    } else {
      await axios.post("http://localhost:5000/labTests", {
        id: `LAB-${new Date().getFullYear()}-${Date.now()}`,
        consultationId: consultation.id,
        patientId: patient.id,
        tests: selectedTests,
        results: [],
        status: "PENDING"
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

        <div className="lab-test-grid">
          {LAB_TEST_OPTIONS.map((test) => {
            const checked = selectedTests.includes(test);

            return (
              <div
                key={test}
                className={`lab-test-item ${checked ? "active" : ""}`}
                onClick={() => toggleTest(test)}
              >
                <input type="checkbox" checked={checked} readOnly />
                <span>{test}</span>
              </div>
            );
          })}
        </div>

        {/* ✅ DOCTOR LAB RESULTS (MOVED HERE) */}
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
