import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/components/patient-table.css";

const DoctorAllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  /* ======================
     LOAD ALL PATIENTS
  ======================= */
  useEffect(() => {
    const loadPatients = async () => {
      const res = await axios.get("http://localhost:5000/patients");
      setPatients(res.data);
    };

    loadPatients();
  }, []);

  const navigate = useNavigate();

  /* ======================
     GROUP BY DEPARTMENT
  ======================= */
  const groupedPatients = patients.reduce((acc, p) => {
    const department =
      p.doctorName?.includes("(")
        ? p.doctorName.split("(")[1].replace(")", "")
        : "General";

    if (!acc[department]) acc[department] = [];
    acc[department].push(p);
    return acc;
  }, {});

  /* ======================
     SEARCH FILTER
  ======================= */
  const matchesSearch = (p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="page-content">
      <div className="table-header table-header-with-search">
        <div>
          <h4>All Patients</h4>
          <span>Department-wise patient directory</span>
        </div>

        <div className="patient-search-box">
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>
      </div>

      {/* ======================
         DEPARTMENT SECTIONS
      ======================= */}
      {Object.keys(groupedPatients).map((dept) => {
        const deptPatients = groupedPatients[dept].filter(matchesSearch);

        if (deptPatients.length === 0) return null;

        return (
          <div className="patient-table-card" key={dept}>
            <div className="table-header">
              <h6>{dept} Department</h6>
              <span>Total: {deptPatients.length}</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Blood Group</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {deptPatients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.firstName} {p.lastName}</td>

                    <td>
                      <span className={`gender-badge ${p.gender.toLowerCase()}`}>
                        {p.gender}
                      </span>
                    </td>

                    <td>{p.age}</td>
                    <td>{p.phone}</td>
                    <td>{p.bloodGroup}</td>
                    <td>{p.doctorName}</td>

                    <td>
                      <span className={`status-badge ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* 👁 VIEW HISTORY ONLY */}
                    <td>
                      <button
                        className="view-btn"
                        title="View Patient History"
                        onClick={() => navigate(`/doctor/patients/${p.id}/history`)}
                      >
                        <i className="bi bi-eye-fill text-primary"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* EMPTY STATE */}
      {patients.length === 0 && (
        <p className="no-data">No patients found</p>
      )}
    </div>
  );
};

export default DoctorAllPatients;
