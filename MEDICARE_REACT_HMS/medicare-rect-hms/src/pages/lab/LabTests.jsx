import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/pages/lab-tests.css";

const LabTests = () => {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);

  /* ======================
     LOAD DATA
  ======================= */
  const loadData = async () => {
    const [labRes, patRes] = await Promise.all([
      axios.get("http://localhost:5000/labTests"),
      axios.get("http://localhost:5000/patients")
    ]);

    setLabTests(labRes.data);
    setPatients(patRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     HELPERS
  ======================= */
  const getPatientName = (patientId) => {
    const p = patients.find((x) => x.id === patientId);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown";
  };

  const getTestName = (test) => {
    // Supports both old & new formats
    return typeof test === "string" ? test : test.testName;
  };

  const updateResult = (labId, testName, value) => {
    setLabTests((prev) =>
      prev.map((lab) =>
        lab.id === labId
          ? {
              ...lab,
              results: lab.results.some((r) => r.testName === testName)
                ? lab.results.map((r) =>
                    r.testName === testName
                      ? { ...r, result: value }
                      : r
                  )
                : [...lab.results, { testName, result: value }]
            }
          : lab
      )
    );
  };

  const saveResults = async (lab) => {
    await axios.patch(`http://localhost:5000/labTests/${lab.id}`, {
      results: lab.results,
      status: "COMPLETED"
    });

    alert("Lab results saved successfully");
    loadData();
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="page-content">
      <div className="patient-table-card">
        <div className="table-header">
          <h4>Laboratory Tests</h4>
        </div>

        <table>
          <thead>
            <tr>
              <th>Lab ID</th>
              <th>Patient</th>
              <th>Tests</th>
              <th>Results</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {labTests.map((lab) => (
              <tr key={lab.id}>
                <td>{lab.id}</td>

                <td>{getPatientName(lab.patientId)}</td>

                <td>
                  <ul className="lab-test-list">
                    {lab.tests.map((t, index) => (
                      <li key={index}>{getTestName(t)}</li>
                    ))}
                  </ul>
                </td>

                <td>
                  {lab.tests.map((t, index) => {
                    const testName = getTestName(t);
                    const existing = lab.results.find(
                      (r) => r.testName === testName
                    );

                    return (
                      <input
                        key={index}
                        className="lab-result-input"
                        placeholder={`${testName} result`}
                        value={existing?.result || ""}
                        disabled={lab.status === "COMPLETED"}
                        onChange={(e) =>
                          updateResult(lab.id, testName, e.target.value)
                        }
                      />
                    );
                  })}
                </td>

                <td>
                  <span
                    className={`badge ${
                      lab.status === "COMPLETED" ? "Completed" : "Pending"
                    }`}
                  >
                    {lab.status}
                  </span>
                </td>

                <td>
                  {lab.status === "PENDING" && (
                    <button
                      className="btn-primary"
                      onClick={() => saveResults(lab)}
                    >
                      <i className="bi bi-save"></i> Save Test
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabTests;
