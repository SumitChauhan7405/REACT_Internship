import axios from "axios";

const API_URL = "http://localhost:5000/rooms";

// ✅ Get all rooms
export const getRooms = () => {
  return axios.get(API_URL);
};

// ✅ Add new room
export const addRoom = (room) => {
  return axios.post(API_URL, room);
};

// ✅ Update room (status, type, etc.)
export const updateRoom = (id, updatedRoom) => {
  return axios.patch(`${API_URL}/${id}`, updatedRoom);
};

// ✅ Delete room
export const deleteRoom = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
