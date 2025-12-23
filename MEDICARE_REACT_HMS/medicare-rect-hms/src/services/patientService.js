import api from "./api";

export const getPatients = () => api.get("/patients");
export const addPatient = (data) => api.post("/patients", data);
export const deletePatient = (id) =>
  api.delete(`/patients/${id}`);

export const updatePatient = (id, data) =>
  api.patch(`/patients/${id}`, data); // ✅ ADD
