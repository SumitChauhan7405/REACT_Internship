import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/css/components/admission-modal.css";

const AdmissionModal = ({ open, onClose, patient, refreshPatients }) => {
  const [rooms, setRooms] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      const [roomRes, admRes] = await Promise.all([
        axios.get("http://localhost:5000/rooms"),
        axios.get("http://localhost:5000/admissions")
      ]);

      setRooms(roomRes.data.filter(r => r.status === "AVAILABLE"));
      setAdmissions(admRes.data);
    };

    loadData();
  }, [open]);

  if (!open || !patient) return null;

  const generateAdmissionId = () => {
    if (admissions.length === 0) return "ADM-001";
    const last = admissions[admissions.length - 1];
    const num = Number(last.id.split("-")[1]);
    return `ADM-${String(num + 1).padStart(3, "0")}`;
  };

  const handleAdmit = async () => {
    if (!roomId) {
      alert("Please select a room");
      return;
    }

    const room = rooms.find(r => r.id === roomId);

    await axios.post("http://localhost:5000/admissions", {
      id: generateAdmissionId(),
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorName: patient.doctorName,
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      roomCharge: room.charge,
      admissionDate: new Date().toISOString().split("T")[0],
      status: "ADMITTED"
    });

    await axios.patch(`http://localhost:5000/rooms/${room.id}`, {
      status: "OCCUPIED"
    });

    alert("Patient admitted successfully");
    onClose();
    refreshPatients();
  };

  return (
    <div className="admission-backdrop" onClick={onClose}>
      <div
        className="admission-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h4>Admit Patient</h4>

        <div className="admission-info">
          <p>
            <strong>Patient:</strong> {patient.firstName} {patient.lastName}
          </p>
          <p>
            <strong>Doctor:</strong> {patient.doctorName}
          </p>
        </div>

        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">Select Available Room</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.roomNumber} ({r.type})
            </option>
          ))}
        </select>

        <div className="admission-actions">
          <button className="btn-primary" onClick={handleAdmit}>
            Admit Patient
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionModal;