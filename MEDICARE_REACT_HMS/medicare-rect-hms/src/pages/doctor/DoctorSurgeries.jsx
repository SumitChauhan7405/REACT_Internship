import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSurgeriesByDoctor } from "../../services/surgeryService";
import "../../assets/css/components/surgeries.css";

const DoctorSurgeries = () => {
  const { user } = useAuth();
  const doctorId = user?.data?.id;

  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD SURGERIES
  ======================= */
  useEffect(() => {
    if (!doctorId) return;

    const loadSurgeries = async () => {
      const data = await getSurgeriesByDoctor(doctorId);
      setSurgeries(data);
      setLoading(false);
    };

    loadSurgeries();
  }, [doctorId]);

  if (loading) {
    return <p>Loading surgeries...</p>;
  }

  return (
    <div className="surgeries-container">
      <div className="surgeries-header">
        <h4>My Surgeries</h4>
        <span>Doctor view</span>
      </div>

      {surgeries.length === 0 ? (
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
            {surgeries.map((surgery) => (
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
                    className={`surgery-badge ${
                      surgery.status?.toLowerCase()
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
