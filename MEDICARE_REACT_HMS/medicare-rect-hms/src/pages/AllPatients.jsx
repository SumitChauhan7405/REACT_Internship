import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/components/patient-table.css";

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  /* Load All Patients */
  useEffect(() => {
    const loadPatients = async () => {
      const res = await axios.get("http://localhost:5000/patients");
      setPatients(res.data);
    };

    loadPatients();
  }, []);

  const navigate = useNavigate();

  /* Group by Department */
  const groupedPatients = patients.reduce((acc, p) => {
    const department =
      p.doctorName?.includes("(")
        ? p.doctorName.split("(")[1].replace(")", "")
        : "All";

    if (!acc[department]) acc[department] = [];
    acc[department].push(p);
    return acc;
  }, {});

  /* Search Filter */
  const matchesSearch = (p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="page-content">
      <div className="table-header table-header-with-search">
        <div>
          <h4>All Patients</h4>
          <span>Department-wise patient directory</span>
        </div>

        <div
          className="patient-search-box"
          style={{ position: "relative" }}
        >
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingRight: "35px" }}
          />

          <i
            className="bi bi-search"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }}
          ></i>
        </div>
      </div>

      {/* Department Section */}
      {Object.keys(groupedPatients).map((dept) => {
        const deptPatients = groupedPatients[dept].filter(matchesSearch);

        if (deptPatients.length === 0) return null;

        return (
          <div className="patient-table-card" key={dept}>
            <div className="table-header">
              <h6>{dept} Department Patients</h6>
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
                      <button
                        className="view-btn"
                        title="View Patient History"
                        onClick={() => navigate(`/admin/patients/${p.id}/history`)}
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

      {patients.length === 0 && (
        <p className="no-data">No patients found</p>
      )}
    </div>
  );
};

export default AllPatients;
