import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/lab-tests.css";

const Lab = () => {
  const [labTests, setLabTests] = useState([]);
  const [patients, setPatients] = useState([]);

  /* Load Data */
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
    return typeof test === "string" ? test : test.testName;
  };

  /* ======================
     UI (READ ONLY)
  ======================= */
  return (
    <div className="page-content">
      <div className="patient-table-card">
        <div className="table-header lab-header">
          <h4>Laboratory Tests</h4>

          <span className="lab-managed-badge">
            Managed by Laboratory Department
          </span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Lab ID</th>
              <th>Patient</th>
              <th>Tests</th>
              <th>Results</th>
              <th>Status</th>
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

                {/* 🔒 RESULTS – READ ONLY */}
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
                        value={existing?.result || ""}
                        disabled={true}   // 🔒 ADMIN CANNOT EDIT
                      />
                    );
                  })}
                </td>

                <td>
                  <span
                    className={`badge ${lab.status === "COMPLETED" ? "Completed" : "Pending"
                      }`}
                  >
                    {lab.status}
                  </span>
                </td>

                {/* ❌ ACTION COLUMN REMOVED FOR ADMIN */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lab;
