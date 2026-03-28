import axios from "axios";
import { useEffect, useState } from "react";
import {
  getSurgeries,
  updateSurgery
} from "../services/surgeryService";
import { getRooms } from "../services/roomService";
import "../assets/css/components/surgeries.css";

const Surgery = () => {
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /* Load Surgeries */
  const loadSurgeries = async () => {
    const res = await getSurgeries();
    setSurgeries(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSurgeries();
  }, []);

  const filteredSurgeries = surgeries.filter((s) => {
    const term = searchTerm.toLowerCase();

    return (
      s.patientName?.toLowerCase().includes(term) ||
      s.doctorName?.toLowerCase().includes(term) ||
      s.department?.toLowerCase().includes(term) ||
      s.surgeryType?.toLowerCase().includes(term)
    );
  });

  /* Relese Operation Theatre */
  const releaseOperationTheatre = async (surgeryId) => {
    const roomRes = await getRooms();

    const linkedOT = roomRes.data.find(
      room =>
        room.type === "OPERATION_THEATRE" &&
        room.linkedSurgeryId === surgeryId
    );

    if (!linkedOT) return;

    await axios.put(
      `http://localhost:5000/rooms/${linkedOT.id}`,
      {
        id: linkedOT.id,
        roomNumber: linkedOT.roomNumber,
        type: linkedOT.type,
        status: "AVAILABLE",
        charge: linkedOT.charge
      }
    );
  };


  /* Update Status */
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
      <div className="surgeries-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4>All Surgeries</h4>

        <div className="table-search" style={{ width: "250px" }}>
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search patient, doctor, dept, type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            {filteredSurgeries.map((surgery) => {
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
                            ? "Surgery Completed"
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
                            ? "Surgery Cancelled"
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
