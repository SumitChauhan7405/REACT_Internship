import { useEffect, useState } from "react";
import axios from "axios";
import {
  getRooms,
  addRoom,
  deleteRoom,
  updateRoom
} from "../services/roomService";
import "../assets/css/pages/rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [editRoomId, setEditRoomId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    roomNumber: "",
    type: "",
    status: "AVAILABLE",
    charge: ""
  });

  /* Load Rooms + Admissions */
  const loadRooms = async () => {
    const [roomRes, admRes] = await Promise.all([
      getRooms(),
      axios.get("http://localhost:5000/admissions")
    ]);

    setRooms(roomRes.data);
    setAdmissions(admRes.data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  /*  Form Handelers */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateRoomId = () => {
    if (rooms.length === 0) return "ROOM-001";
    const lastRoom = rooms[rooms.length - 1];
    const lastNumber = Number(lastRoom.id.split("-")[1]);
    return `ROOM-${String(lastNumber + 1).padStart(3, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      charge:
        form.type === "OPERATION_THEATRE"
          ? 0
          : Number(form.charge)
    };

    /* Update Logic*/
    if (editRoomId) {
      await updateRoom(editRoomId, payload);
      setEditRoomId(null);
    } else {
      await addRoom({
        id: generateRoomId(),
        ...payload
      });
    }

    setForm({
      roomNumber: "",
      type: "",
      status: "AVAILABLE",
      charge: ""
    });

    loadRooms();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this room?")) {
      await deleteRoom(id);
      loadRooms();
    }
  };


  const handleEdit = (room) => {
    setEditRoomId(room.id);
    setForm({
      roomNumber: room.roomNumber,
      type: room.type,
      status: room.status,
      charge: room.charge || ""
    });
  };

  const cancelEdit = () => {
    setEditRoomId(null);
    setForm({
      roomNumber: "",
      type: "",
      status: "AVAILABLE",
      charge: ""
    });
  };

  /* Helpers */
  const getAssignedPatient = (room) => {
    if (room.type === "OPERATION_THEATRE") {
      return room.patientName || "Not Assigned";
    }

    const admission = admissions.find(
      (adm) =>
        adm.roomId === room.id && adm.status === "ADMITTED"
    );

    return admission ? admission.patientName : "Not Assigned";
  };

  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.toLowerCase();

    return (
      room.roomNumber?.toString().toLowerCase().includes(term) ||
      room.type?.toLowerCase().includes(term)
    );
  });

  /* Grouping Rooms by Type */
  const groupedRooms = filteredRooms.reduce((acc, room) => {
    acc[room.type] = acc[room.type] || [];
    acc[room.type].push(room);
    return acc;
  }, {});

  return (
    <div className="page-content">
      <div className="patient-form-card mb-4">
        <div className="form-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4>{editRoomId ? "Edit Room" : "Add Room"}</h4>

          <div className="table-search" style={{ width: "250px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search Room No or Type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            name="roomNumber"
            placeholder="Room Number"
            value={form.roomNumber}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Room Type</option>
            <option value="GENERAL">General</option>
            <option value="DELUXE">Deluxe</option>
            <option value="PRIVATE">Private</option>
            <option value="ICU">ICU</option>
            <option value="OPERATION_THEATRE">
              OPERATION_THEATRE
            </option>
          </select>

          {/* ✅ HIDE CHARGE FOR OT */}
          {form.type !== "OPERATION_THEATRE" && (
            <input
              type="number"
              name="charge"
              placeholder="Room Charge (₹)"
              value={form.charge}
              onChange={handleChange}
              required
            />
          )}

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <button type="submit" className="btn-primary">
            <i className={`bi ${editRoomId ? "bi-pencil-square" : "bi-plus-circle"}`}></i>
            {editRoomId ? "Update Room" : "Add Room"}
          </button>

          {editRoomId && (
            <button
              type="button"
              className="rooms-button btn-secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Grouping Room List */}
      {Object.keys(groupedRooms).map((type) => (
        <div key={type} className="patient-table-card mb-4">
          <div className="table-header">
            <h4>{type.replace("_", " ")}</h4>
            <span>Total: {groupedRooms[type].length}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room No</th>
                <th>Type</th>
                <th>Charge (₹)</th>
                <th>Patient Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {groupedRooms[type].map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>
                    {room.type === "OPERATION_THEATRE"
                      ? "—"
                      : `₹ ${room.charge}`}
                  </td>
                  <td>
                    {room.status === "OCCUPIED"
                      ? getAssignedPatient(room)
                      : "Not Assigned"}
                  </td>
                  <td>
                    <span
                      className={`badge ${room.status === "AVAILABLE"
                        ? "male"
                        : "female"
                        }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td>

                    <button
                      className="icon-btn edit"
                      onClick={() => handleEdit(room)}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(room.id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Rooms;
