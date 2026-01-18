import { useEffect, useState } from "react";
import axios from "axios";
import DoctorLabTests from "../doctors/DoctorLabTests";
import "../../assets/css/components/lab-tests-modal.css";

const LabTestsModal = ({ open, onClose, consultation, patient }) => {
  const [labTest, setLabTest] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [labMasters, setLabMasters] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  /* ======================
     LOAD LAB MASTER + EXISTING LAB TEST
  ======================= */
  useEffect(() => {
    if (!open || !consultation) return;

    const loadData = async () => {
      const [labRes, masterRes] = await Promise.all([
        axios.get("http://localhost:5000/labTests"),
        axios.get("http://localhost:5000/labTestMasters")
      ]);

      const existing = labRes.data.find(
        (l) => l.consultationId === consultation.id
      );

      if (existing) {
        setLabTest(existing);

        // ✅ Support OLD + NEW format
        const tests = Array.isArray(existing.tests)
          ? existing.tests.map((t) =>
              typeof t === "string" ? t : t.testName
            )
          : [];

        setSelectedTests(tests);
      } else {
        setLabTest(null);
        setSelectedTests([]);
      }

      setLabMasters(masterRes.data);
    };

    loadData();
  }, [open, consultation]);

  if (!open || !consultation || !patient) return null;

  const toggleTest = (testName) => {
    setSelectedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    );
  };

  /* ======================
     NORMALIZED LAB ID
  ======================= */
  const generateLabTestId = async () => {
    const year = new Date().getFullYear();
    const res = await axios.get("http://localhost:5000/labTests");

    const labOnly = res.data.filter(
      (l) => l.id && l.id.startsWith(`LAB-${year}-`)
    );

    if (labOnly.length === 0) return `LAB-${year}-0001`;

    const last = labOnly[labOnly.length - 1];
    const next = Number(last.id.split("-")[2]) + 1;

    return `LAB-${year}-${String(next).padStart(4, "0")}`;
  };

  /* ======================
     SAVE LAB TEST
  ======================= */
  const handleSave = async () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one lab test");
      return;
    }

    // ✅ Convert selection → priced objects
    const pricedTests = selectedTests.map((name) => {
      const master = labMasters.find((m) => m.name === name);
      return {
        testId: master?.id || "",
        testName: name,
        charge: master?.charge || 0
      };
    });

    if (labTest) {
      await axios.patch(
        `http://localhost:5000/labTests/${labTest.id}`,
        {
          tests: pricedTests,
          doctorId: consultation.doctorId,
          doctorName: consultation.doctorName
        }
      );
    } else {
      const newId = await generateLabTestId();

      await axios.post("http://localhost:5000/labTests", {
        id: newId,
        consultationId: consultation.id,
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: consultation.doctorId,
        doctorName: consultation.doctorName,
        tests: pricedTests,
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
          <p><strong>Patient:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Consultation ID:</strong> {consultation.id}</p>
        </div>

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
              {labMasters.map((test) => (
                <label key={test.id} className="lab-dropdown-item">
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(test.name)}
                    onChange={() => toggleTest(test.name)}
                  />
                  <span>
                    {test.name} — ₹{test.charge}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

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
