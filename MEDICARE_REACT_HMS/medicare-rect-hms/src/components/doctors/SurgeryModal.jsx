import { useState, useEffect } from "react";
import axios from "axios";
import {
  addSurgery,
  getSurgeries
} from "../../services/surgeryService";
import { getRooms, updateRoom } from "../../services/roomService";
import "../../assets/css/components/surgery-modal.css";

const SurgeryModal = ({
  open,
  onClose,
  consultation,
  patient,
  doctor,
  refreshAppointments
}) => {
  /* ======================
     STATE
  ======================= */
  const [form, setForm] = useState({
    department: "",
    surgeryId: "",
    scheduledDate: "",
    scheduledTime: "",
    operationTheatre: "",
    notes: ""
  });

  const [availableOTs, setAvailableOTs] = useState([]);
  const [surgeryMasters, setSurgeryMasters] = useState([]);

  /* ======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    if (!open || !doctor) return;

    setForm({
      department: doctor.department || "",
      surgeryId: "",
      scheduledDate: "",
      scheduledTime: "",
      operationTheatre: "",
      notes: ""
    });

    loadAvailableOTs();
    loadSurgeryMasters();
  }, [open, doctor]); // ✅ FIXED HERE

  const loadAvailableOTs = async () => {
    const res = await getRooms();
    setAvailableOTs(
      res.data.filter(
        r =>
          r.type === "OPERATION_THEATRE" &&
          r.status === "AVAILABLE"
      )
    );
  };

  const loadSurgeryMasters = async () => {
    const res = await axios.get(
      "http://localhost:5000/surgeryMasters"
    );
    setSurgeryMasters(res.data);
  };

  if (!open || !consultation || !patient || !doctor) return null;

  /* ======================
     FILTER SURGERIES
  ======================= */
  const visibleSurgeries = surgeryMasters.filter(s =>
    s.visibility === "GENERAL"
      ? true
      : s.department === form.department
  );

  /* ======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ======================
     SURGERY ID
  ======================= */
  const generateSurgeryId = async () => {
    const year = new Date().getFullYear();
    const res = await getSurgeries();

    const list = res.data.filter(s =>
      s.id?.startsWith(`SUR-${year}-`)
    );

    if (list.length === 0) return `SUR-${year}-0001`;

    const last = list[list.length - 1];
    const next = Number(last.id.split("-")[2]) + 1;

    return `SUR-${year}-${String(next).padStart(4, "0")}`;
  };

  /* ======================
     DUPLICATE CHECK
  ======================= */
  const checkExistingSurgery = async () => {
    const res = await getSurgeries();
    return res.data.some(
      s => s.consultationId === consultation.id
    );
  };

  /* ======================
     SAVE
  ======================= */
  const handleSave = async () => {
    if (
      !form.surgeryId ||
      !form.scheduledDate ||
      !form.scheduledTime ||
      !form.operationTheatre
    ) {
      alert("Please fill all required fields");
      return;
    }

    const exists = await checkExistingSurgery();
    if (exists) {
      alert("Surgery already scheduled for this consultation");
      return;
    }

    const surgeryMaster = surgeryMasters.find(
      s => s.id === form.surgeryId
    );

    const selectedOT = availableOTs.find(
      ot => ot.id === form.operationTheatre
    );

    if (!surgeryMaster || !selectedOT) {
      alert("Invalid selection");
      return;
    }

    const surgeryId = await generateSurgeryId();

    await addSurgery({
      id: surgeryId,
      consultationId: consultation.id,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: form.department,

      surgeryType: surgeryMaster.name,
      surgeryMasterId: surgeryMaster.id,
      surgeryCharge: surgeryMaster.charge,

      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      operationTheatre: selectedOT.roomNumber,

      status: "SCHEDULED",
      notes: form.notes,
      createdAt: new Date().toISOString()
    });

    await updateRoom(selectedOT.id, {
      status: "OCCUPIED",
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      linkedSurgeryId: surgeryId
    });

    refreshAppointments?.();
    alert("Surgery scheduled successfully");
    onClose();
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="surgery-backdrop" onClick={onClose}>
      <div
        className="surgery-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h5>Schedule Surgery</h5>

        <p><strong>Patient:</strong> {patient.firstName} {patient.lastName}</p>
        <p><strong>Doctor:</strong> {doctor.name}</p>

        <input
          value={form.department}
          disabled
          placeholder="Department"
        />

        <select
          name="surgeryId"
          value={form.surgeryId}
          onChange={handleChange}
        >
          <option value="">Select Surgery</option>
          {visibleSurgeries.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} — ₹{s.charge}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="scheduledDate"
          value={form.scheduledDate}
          onChange={handleChange}
        />

        <input
          type="time"
          name="scheduledTime"
          value={form.scheduledTime}
          onChange={handleChange}
        />

        <select
          name="operationTheatre"
          value={form.operationTheatre}
          onChange={handleChange}
        >
          <option value="">Select Operation Theatre</option>
          {availableOTs.map(ot => (
            <option key={ot.id} value={ot.id}>
              Operation Theatre {ot.roomNumber}
            </option>
          ))}
        </select>

        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        <div className="form-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Schedule Surgery</button>
        </div>
      </div>
    </div>
  );
};

export default SurgeryModal;
