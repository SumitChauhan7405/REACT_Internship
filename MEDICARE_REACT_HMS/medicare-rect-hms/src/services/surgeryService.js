import axios from "axios";

const API_URL = "http://localhost:5000/surgeries";

/* ======================
   GET ALL SURGERIES
====================== */
export const getSurgeries = () => {
  return axios.get(API_URL);
};

/* ======================
   GET SURGERIES BY DOCTOR
====================== */
export const getSurgeriesByDoctor = (doctorId) => {
  return axios.get(API_URL).then((res) =>
    res.data.filter((s) => s.doctorId === doctorId)
  );
};

/* ======================
   GET SURGERIES BY PATIENT
====================== */
export const getSurgeriesByPatient = (patientId) => {
  return axios.get(API_URL).then((res) =>
    res.data.filter((s) => s.patientId === patientId)
  );
};

/* ======================
   ADD / SCHEDULE SURGERY
====================== */
export const addSurgery = (surgeryData) => {
  return axios.post(API_URL, surgeryData);
};

/* ======================
   UPDATE SURGERY
====================== */
export const updateSurgery = (id, updatedData) => {
  return axios.patch(`${API_URL}/${id}`, updatedData);
};
