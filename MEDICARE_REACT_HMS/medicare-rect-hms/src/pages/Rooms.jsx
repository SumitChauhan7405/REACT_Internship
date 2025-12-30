import { useEffect, useState } from "react";
import {
  getRooms,
  addRoom,
  deleteRoom
} from "../services/roomService";
import "../assets/css/pages/rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  const [form, setForm] = useState({
    roomNumber: "",
    type: "",
    status: "AVAILABLE"
  });

  /* ======================
     LOAD ROOMS
  ======================= */
  const loadRooms = async () => {
    const res = await getRooms();
    setRooms(res.data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  /* ======================
     FORM HANDLERS
  ======================= */
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

    await addRoom({
      id: generateRoomId(),
      ...form
    });

    setForm({
      roomNumber: "",
      type: "",
      status: "AVAILABLE"
    });

    loadRooms();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this room?")) {
      await deleteRoom(id);
      loadRooms();
    }
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="page-content">
      {/* ===== ADD ROOM ===== */}
      <div className="patient-form-card mb-4">
        <div className="form-header">
          <h4>Add Room</h4>
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
            <option value="ICU">ICU</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <button type="submit" className="btn-primary">
            <i className="bi bi-plus-circle"></i>
            Add Room
          </button>
        </form>
      </div>

      {/* ===== ROOM LIST ===== */}
      <div className="patient-table-card">
        <div className="table-header">
          <h4>Rooms</h4>
        </div>

        <table>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Room No</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.roomNumber}</td>
                <td>{room.type}</td>
                <td>
                  <span
                    className={`badge ${
                      room.status === "AVAILABLE"
                        ? "male"
                        : "female"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td>
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
    </div>
  );
};

export default Rooms;
