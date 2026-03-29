import { useEffect, useState } from "react";
import axios from "axios";

const DoctorLabTests = ({ consultationId }) => {
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    if (!consultationId) return;

    axios
      .get(
        `http://localhost:5000/labTests?consultationId=${consultationId}`
      )
      .then((res) => setLabTests(res.data));
  }, [consultationId]);

  if (labTests.length === 0) return null;

  return (
    <>
      <h5 style={{ marginTop: 20 }}>Lab Test Results</h5>

      {labTests.map((lab) => {
        const testNames = Array.isArray(lab.tests)
          ? lab.tests.map((t) =>
              typeof t === "string" ? t : t.testName
            )
          : [];

        return (
          <div
            key={lab.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12
            }}
          >
            <p>
              <strong>Lab Tests:</strong> {testNames.join(", ")}
            </p>

            <span
              className={`badge ${
                lab.status === "COMPLETED" ? "male" : "female"
              }`}
            >
              {lab.status}
            </span>

            {lab.status === "COMPLETED" && (
              <ul style={{ marginTop: 10 }}>
                {lab.results.map((r, i) => (
                  <li key={i}>
                    <strong>{r.testName}:</strong> {r.result}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
};

export default DoctorLabTests;
