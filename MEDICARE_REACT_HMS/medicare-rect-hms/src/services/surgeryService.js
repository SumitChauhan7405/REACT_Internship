import axios from "axios";

const BASE_URL = "http://localhost:5000/surgeries";

/* =========================
   GET ALL SURGERIES
========================= */
export const getSurgeries = () => {
  return axios.get(BASE_URL);
};

/* =========================
   GET SURGERY BY ID
========================= */
export const getSurgeryById = (id) => {
  return axios.get(`${BASE_URL}/${id}`);
};

/* =========================
   ADD SURGERY
========================= */
export const addSurgery = (surgeryData) => {
  return axios.post(BASE_URL, surgeryData);
};

/* =========================
   UPDATE SURGERY
========================= */
export const updateSurgery = (id, updatedData) => {
  return axios.patch(`${BASE_URL}/${id}`, updatedData);
};

/* =========================
   DELETE SURGERY (OPTIONAL)
========================= */
export const deleteSurgery = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
