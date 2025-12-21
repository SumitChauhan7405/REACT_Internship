import api from "./api";

export const getAppointments = () => api.get("/appointments");
export const addAppointment = (data) => api.post("/appointments", data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
