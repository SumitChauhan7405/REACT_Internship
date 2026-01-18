import { useState, useEffect } from "react";
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
    surgeryType: "",
    scheduledDate: "",
    scheduledTime: "",
    operationTheatre: "",
    notes: ""
  });

  const [availableOTs, setAvailableOTs] = useState([]);

  /* ======================
     RESET + LOAD OTs
  ======================= */
  useEffect(() => {
    if (!open) return;

    setForm({
      department: "",
      surgeryType: "",
      scheduledDate: "",
      scheduledTime: "",
      operationTheatre: "",
      notes: ""
    });

    loadAvailableOTs();
  }, [open]);

  const loadAvailableOTs = async () => {
    const res = await getRooms();
    const ots = res.data.filter(
      (r) =>
        r.type === "OPERATION_THEATRE" &&
        r.status === "AVAILABLE"
    );
    setAvailableOTs(ots);
  };

  if (!open || !consultation || !patient || !doctor) return null;

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

    const surOnly = res.data.filter(
      (s) => s.id && s.id.startsWith(`SUR-${year}-`)
    );

    if (surOnly.length === 0) {
      return `SUR-${year}-0001`;
    }

    const last = surOnly[surOnly.length - 1];
    const lastNum = Number(last.id.split("-")[2]) || 0;

    return `SUR-${year}-${String(lastNum + 1).padStart(4, "0")}`;
  };

  /* ======================
     DUPLICATE CHECK
  ======================= */
  const checkExistingSurgery = async () => {
    const res = await getSurgeries();
    return res.data.some(
      (s) => s.consultationId === consultation.id
    );
  };

  /* ======================
     SAVE
  ======================= */
  const handleSave = async () => {
    if (
      !form.department ||
      !form.surgeryType ||
      !form.scheduledDate ||
      !form.scheduledTime ||
      !form.operationTheatre
    ) {
      alert("Please fill all required fields");
      return;
    }

    const alreadyExists = await checkExistingSurgery();
    if (alreadyExists) {
      alert("Surgery is already scheduled for this consultation");
      return;
    }

    const surgeryId = await generateSurgeryId();

    const selectedOT = availableOTs.find(
      (ot) => ot.id === form.operationTheatre
    );

    if (!selectedOT) {
      alert("Selected Operation Theatre is no longer available");
      return;
    }

    await addSurgery({
      id: surgeryId,
      consultationId: consultation.id,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: form.department,
      surgeryType: form.surgeryType,
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      operationTheatre: selectedOT.roomNumber,

      // ✅ NEW: SURGERY CHARGE
      surgeryCharge: selectedOT.charge,

      status: "SCHEDULED",
      notes: form.notes,
      createdAt: new Date().toISOString()
    });

    // ✅ Mark OT as occupied
    await updateRoom(selectedOT.id, {
      status: "OCCUPIED",
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      linkedSurgeryId: surgeryId
    });

    if (refreshAppointments) {
      await refreshAppointments();
    }

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
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <input
          name="surgeryType"
          placeholder="Surgery Type"
          value={form.surgeryType}
          onChange={handleChange}
        />

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
          {availableOTs.map((ot) => (
            <option key={ot.id} value={ot.id}>
              {ot.roomNumber} {ot.type} — ₹{ot.charge}
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
