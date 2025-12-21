import axios from "axios";

/**
 * ✅ SINGLE AXIOS INSTANCE
 * Used by ALL services (doctors, patients, appointments, etc.)
 */
const api = axios.create({
  baseURL: "http://localhost:5000", // json-server URL
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
