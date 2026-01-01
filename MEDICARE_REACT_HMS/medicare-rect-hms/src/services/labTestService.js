import axios from "axios";

const BASE_URL = "http://localhost:5000/labTests";

/* ======================
   GET ALL LAB TESTS
====================== */
export const getLabTests = () => {
  return axios.get(BASE_URL);
};

/* ======================
   GET LAB TEST BY CONSULTATION
====================== */
export const getLabTestByConsultation = (consultationId) => {
  return axios.get(`${BASE_URL}?consultationId=${consultationId}`);
};

/* ======================
   ADD LAB TEST
====================== */
export const addLabTest = (data) => {
  return axios.post(BASE_URL, data);
};

/* ======================
   UPDATE LAB TEST
====================== */
export const updateLabTest = (id, data) => {
  return axios.patch(`${BASE_URL}/${id}`, data);
};
