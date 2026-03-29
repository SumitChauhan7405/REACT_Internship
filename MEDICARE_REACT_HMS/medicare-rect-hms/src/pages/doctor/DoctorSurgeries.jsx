import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSurgeriesByDoctor } from "../../services/surgeryService";
import "../../assets/css/components/surgeries.css";

const DoctorSurgeries = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;

  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* Sort Surgeres */
  const sortSurgeries = (list) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate} ${a.scheduledTime}`);
      const dateB = new Date(`${b.scheduledDate} ${b.scheduledTime}`);
      return dateA - dateB;
    });
  };

  /* Load Surgeries */
  const loadSurgeries = useCallback(async () => {
    if (!doctorId) return;

    const data = await getSurgeriesByDoctor(doctorId);
    setSurgeries(sortSurgeries(data));
    setLoading(false);
  }, [doctorId]);


  useEffect(() => {
    loadSurgeries();
  }, [loadSurgeries]);


  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadSurgeries();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [loadSurgeries]);

  if (loading) {
    return <p>Loading surgeries...</p>;
  }

  const filteredSurgeries = surgeries.filter((s) => {
    const term = searchTerm.toLowerCase();

    return (
      s.patientName?.toLowerCase().includes(term) ||
      s.surgeryType?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="surgeries-container">
      <div
          className="table-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h4>My Surgeries</h4>
          <div className="table-search" style={{ width: "250px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search patient name and surgery type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

      {filteredSurgeries.length === 0 ? (
        <div className="surgeries-empty">
          No surgeries scheduled yet.
        </div>
      ) : (
        <table className="surgeries-table">
          <thead>
            <tr>
              <th>Surgery ID</th>
              <th>Patient</th>
              <th>Department</th>
              <th>Surgery Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>OT</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {filteredSurgeries.map((surgery) => (
              <tr key={surgery.id}>
                <td data-label="Surgery ID">{surgery.id}</td>
                <td data-label="Patient">{surgery.patientName}</td>
                <td data-label="Department">{surgery.department}</td>
                <td data-label="Surgery Type">{surgery.surgeryType}</td>
                <td data-label="Date">{surgery.scheduledDate}</td>
                <td data-label="Time">{surgery.scheduledTime}</td>
                <td data-label="OT">{surgery.operationTheatre}</td>
                <td data-label="Status">
                  <span
                    className={`surgery-badge ${surgery.status?.toLowerCase()
                      }`}
                  >
                    {surgery.status}
                  </span>
                </td>
                <td data-label="Notes" className="surgery-notes">
                  {surgery.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorSurgeries;
