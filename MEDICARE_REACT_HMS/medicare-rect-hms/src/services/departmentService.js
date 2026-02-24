import api from "./api";

export const getDepartments = () => api.get("/departments");

export const addDepartment = (data) =>
  api.post("/departments", data);

export const updateDepartment = (id, data) =>
  api.patch(`/departments/${id}`, data);

export const deleteDepartment = (id) =>
  api.delete(`/departments/${id}`);