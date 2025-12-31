import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/admissions.css";

const Admissions = () => {
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [admissions, setAdmissions] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    roomId: ""
  });

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const loadData = async () => {
    const [patRes, roomRes, admRes] = await Promise.all([
      axios.get("http://localhost:5000/patients"),
      axios.get("http://localhost:5000/rooms"),
      axios.get("http://localhost:5000/admissions")
    ]);

    setPatients(patRes.data);
    setRooms(roomRes.data);
    setAdmissions(admRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     SEARCH
  ======================= */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setForm({ ...form, patientId: "" });

    if (!value) {
      setSuggestions([]);
      return;
    }

    const matches = patients.filter(
      (p) =>
        p.id.toLowerCase().includes(value.toLowerCase()) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(matches);
  };

  const selectPatient = (patient) => {
    setSearch(`${patient.id} - ${patient.firstName} ${patient.lastName}`);
    setForm({ ...form, patientId: patient.id });
    setSuggestions([]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateAdmissionId = () => {
    if (admissions.length === 0) return "ADM-001";
    const last = admissions[admissions.length - 1];
    const num = Number(last.id.split("-")[1]);
    return `ADM-${String(num + 1).padStart(3, "0")}`;
  };

  /* ======================
     ADMIT
  ======================= */
  const handleAdmit = async (e) => {
    e.preventDefault();

    const patient = patients.find((p) => p.id === form.patientId);
    const room = rooms.find((r) => r.id === form.roomId);

    if (!patient || !room) return;

    const alreadyAdmitted = admissions.some(
      (a) => a.patientId === patient.id && a.status === "ADMITTED"
    );

    if (alreadyAdmitted) {
      alert("This patient is already admitted.");
      return;
    }

    await axios.post("http://localhost:5000/admissions", {
      id: generateAdmissionId(),
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorName: patient.doctorName || "Not Assigned", // ✅ ADDED
      roomId: room.id,
      roomNumber: room.roomNumber,
      roomType: room.type,
      admissionDate: new Date().toISOString().split("T")[0],
      status: "ADMITTED"
    });

    await axios.patch(`http://localhost:5000/rooms/${room.id}`, {
      status: "OCCUPIED"
    });

    setForm({ patientId: "", roomId: "" });
    setSearch("");
    loadData();
  };

  /* ======================
     DISCHARGE
  ======================= */
  const handleDischarge = async (adm) => {
    if (!window.confirm("Discharge this patient?")) return;

    await axios.patch(`http://localhost:5000/admissions/${adm.id}`, {
      status: "DISCHARGED"
    });

    await axios.patch(`http://localhost:5000/rooms/${adm.roomId}`, {
      status: "AVAILABLE"
    });

    loadData();
  };

  return (
    <div className="admissions-page">
      {/* ===== ADMIT ===== */}
      <div className="admissions-card">
        <h4>Admit Patient</h4>

        <form className="admissions-form" onSubmit={handleAdmit}>
          <div className="patient-search">
            <input
              type="text"
              placeholder="Search Patient by ID or Name"
              value={search}
              onChange={handleSearchChange}
              required
            />

            {suggestions.length > 0 && (
              <ul className="patient-suggestions">
                {suggestions.map((p) => (
                  <li key={p.id} onClick={() => selectPatient(p)}>
                    <strong>{p.id}</strong> – {p.firstName} {p.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <select
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            required
          >
            <option value="">Select Available Room</option>
            {rooms
              .filter((r) => r.status === "AVAILABLE")
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} ({r.type})
                </option>
              ))}
          </select>

          <button type="submit" className="btn-primary">
            <i className="bi bi-hospital"></i> Admit Patient
          </button>
        </form>
      </div>

      {/* ===== LIST ===== */}
      <div className="admissions-card">
        <h4>Admissions</h4>

        <table className="admissions-table">
          <thead>
            <tr>
              <th>Admission ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Room No</th>
              <th>Room Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map((adm) => (
              <tr key={adm.id}>
                <td>{adm.id}</td>
                <td>{adm.patientName}</td>
                <td>{adm.doctorName || "—"}</td>
                <td>{adm.roomNumber}</td>
                <td>{adm.roomType}</td>
                <td>{adm.admissionDate}</td>
                <td>
                  <span className={`admission-badge ${adm.status.toLowerCase()}`}>
                    {adm.status}
                  </span>
                </td>
                <td>
                  {adm.status === "ADMITTED" && (
                    <button
                      className="btn-discharge-icon"
                      title="Discharge Patient"
                      onClick={() => handleDischarge(adm)}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admissions;
