import { useEffect, useState } from "react";
import {
  getSurgeries,
  updateSurgery
} from "../services/surgeryService";
import { getRooms, updateRoom } from "../services/roomService";
import "../assets/css/components/surgeries.css";

const Surgery = () => {
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD ALL SURGERIES
  ======================= */
  const loadSurgeries = async () => {
    const res = await getSurgeries();
    setSurgeries(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSurgeries();
  }, []);

  /* ======================
     RELEASE OPERATION THEATRE
  ======================= */
  const releaseOperationTheatre = async (surgeryId) => {
    const roomRes = await getRooms();

    const linkedOT = roomRes.data.find(
      (room) =>
        room.type === "OPERATION_THEATRE" &&
        room.linkedSurgeryId === surgeryId
    );

    if (!linkedOT) return;

    await updateRoom(linkedOT.id, {
      status: "AVAILABLE",
      patientId: null,
      patientName: null,
      linkedSurgeryId: null
    });
  };

  /* ======================
     STATUS UPDATE
  ======================= */
  const handleStatusChange = async (id, status) => {
    await updateSurgery(id, { status });

    if (status === "COMPLETED" || status === "CANCELLED") {
      await releaseOperationTheatre(id);
    }

    loadSurgeries();
  };

  if (loading) {
    return <p>Loading surgeries...</p>;
  }

  return (
    <div className="surgeries-container">
      <div className="surgeries-header">
        <h4>All Surgeries</h4>
        <span>Admin view</span>
      </div>

      {surgeries.length === 0 ? (
        <div className="surgeries-empty">
          No surgeries found.
        </div>
      ) : (
        <table className="surgeries-table">
          <thead>
            <tr>
              <th>Surgery ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Surgery Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>OT</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {surgeries.map((surgery) => {
              const isFinal =
                surgery.status === "COMPLETED" ||
                surgery.status === "CANCELLED";

              return (
                <tr key={surgery.id}>
                  <td>{surgery.id}</td>
                  <td>{surgery.patientName}</td>
                  <td>{surgery.doctorName}</td>
                  <td>{surgery.department}</td>
                  <td>{surgery.surgeryType}</td>
                  <td>{surgery.scheduledDate}</td>
                  <td>{surgery.scheduledTime}</td>
                  <td>{surgery.operationTheatre}</td>

                  <td>
                    <span
                      className={`surgery-badge ${surgery.status?.toLowerCase()}`}
                    >
                      {surgery.status}
                    </span>
                  </td>

                  <td>
                    <div className={`surgery-actions ${isFinal ? "final-disabled" : ""}`}>
                      <button
                        className="btn-success-surgery"
                        disabled={isFinal}
                        title={
                          isFinal
                            ? "🚫 Surgery is in final state"
                            : "Mark surgery as completed"
                        }
                        onClick={() =>
                          handleStatusChange(surgery.id, "COMPLETED")
                        }
                      >
                        Complete
                      </button>

                      <button
                        className="btn-danger-surgery"
                        disabled={isFinal}
                        title={
                          isFinal
                            ? "🚫 Surgery is in final state"
                            : "Cancel surgery"
                        }
                        onClick={() =>
                          handleStatusChange(surgery.id, "CANCELLED")
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Surgery;
