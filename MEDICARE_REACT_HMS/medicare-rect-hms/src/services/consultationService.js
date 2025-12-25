import axios from "axios";

const API_URL = "http://localhost:5000/consultations";

/* Get consultation by appointment */
export const getConsultations = (appointmentId) => {
  return axios.get(`${API_URL}?appointmentId=${appointmentId}`);
};

/* Add new consultation */
export const addConsultation = (data) => {
  return axios.post(API_URL, data);
};

/* Update existing consultation */
export const updateConsultation = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};
