import axios from "axios";

const API_URL = "http://localhost:5000/consultations";

/* ======================
   GET ALL CONSULTATIONS (FOR ID GENERATION)
====================== */
export const getAllConsultations = () => {
  return axios.get(API_URL);
};

/* ======================
   GET CONSULTATION BY APPOINTMENT
====================== */
export const getConsultationsByAppointment = (appointmentId) => {
  return axios.get(`${API_URL}?appointmentId=${appointmentId}`);
};

/* ======================
   ADD NEW CONSULTATION
====================== */
export const addConsultation = (data) => {
  return axios.post(API_URL, data);
};

/* ======================
   UPDATE CONSULTATION
====================== */
export const updateConsultation = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};
