import axios from "axios";

const API_URL = "http://localhost:5000/labTests";

/* ======================
   GET ALL LAB TESTS
====================== */
export const getLabTests = () => {
  return axios.get(API_URL);
};

/* ======================
   GET LAB TEST BY CONSULTATION
====================== */
export const getLabTestByConsultation = (consultationId) => {
  return axios.get(`${API_URL}?consultationId=${consultationId}`);
};

/* ======================
   ADD LAB TEST
====================== */
export const addLabTest = (data) => {
  return axios.post(API_URL, data);
};

/* ======================
   UPDATE LAB TEST
====================== */
export const updateLabTest = (id, data) => {
  return axios.patch(`${API_URL}/${id}`, data);
};
