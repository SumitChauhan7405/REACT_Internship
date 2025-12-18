import { useEffect, useState } from "react";
import { getPatients } from "../../services/patientService";
import "../../assets/css/components/patient-table.css";

const PatientTable = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients().then((res) => setPatients(res.data));
  }, []);

  return (
    <div className="patient-table-card">
      <div className="table-header">
        <h6>Registered Patients</h6>
        <span>Total: {patients.length}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Blood</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.firstName} {p.lastName}</td>
              <td>
                <span className={`badge ${p.gender === "Male" ? "male" : "female"}`}>
                  {p.gender}
                </span>
              </td>
              <td>{p.phone}</td>
              <td>{p.bloodGroup}</td>
              <td>
                <button className="view-btn">
                  <i className="bi bi-eye"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
