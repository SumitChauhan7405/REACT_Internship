import { useState } from "react";
import "../../assets/css/components/patient-table.css";

const PatientTable = ({ patients, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  if (patients.length === 0) {
    return (
      <div className="patient-table-card">
        <p>No patients found. Please add the first patient.</p>
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      onDelete(id);
    }
  };

  /* 🔍 SEARCH FILTER */
  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="patient-table-card">
      <div className="table-header table-header-with-search">
        {/* LEFT */}
        <div>
          <h6>Registered Patients</h6>
        </div>

        {/* RIGHT */}
        <div className="patient-search-box">
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="bi bi-search"></i>

          {/* ✅ TOTAL AFTER SEARCH */}
          <span className="search-total">
            Total: {filteredPatients.length}
          </span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Phone No</th>
            <th>Blood Group</th>
            <th>Doctor Name</th>
            <th>Timing</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.firstName} {p.lastName}</td>

              {/* ✅ GENDER BADGE FIX */}
              <td>
                <span className={`gender-badge ${p.gender.toLowerCase()}`}>
                  {p.gender}
                </span>
              </td>

              <td>{p.age}</td>
              <td>{p.phone}</td>
              <td>{p.bloodGroup}</td>
              <td>{p.doctorName}</td>
              <td>{p.timing}</td>

              <td>
                <span className={`status-badge ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>
              </td>

              <td>
                <button className="view-btn" onClick={() => onEdit(p)}>
                  <i className="bi bi-pencil-fill text-primary"></i>
                </button>

                <button className="view-btn" onClick={() => handleDelete(p.id)}>
                  <i className="bi bi-trash-fill text-danger"></i>
                </button>
              </td>
            </tr>
          ))}

          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan="10" className="no-data">
                No matching patients found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
