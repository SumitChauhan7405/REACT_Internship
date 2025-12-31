import "../../assets/css/components/patient-table.css";

const PatientTable = ({ patients, onEdit, onDelete }) => {
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
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.firstName} {p.lastName}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
              <td>{p.phone}</td>
              <td>{p.bloodGroup}</td>
              <td>{p.doctorName}</td>
              <td>{p.timing}</td>

              <td>
                <span className={`status-badge ${p.status?.toLowerCase()}`}>
                  {p.status || "PENDING"}
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
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
