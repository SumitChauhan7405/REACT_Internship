import axios from "axios";

const API_URL = "http://localhost:5000/labTests";

export const getLabTests = () => {
  return axios.get(API_URL);
};

export const getLabTestByConsultation = (consultationId) => {
  return axios.get(`${API_URL}?consultationId=${consultationId}`);
};

export const addLabTest = (data) => {
  return axios.post(API_URL, data);
};

export const updateLabTest = (id, data) => {
  return axios.patch(`${API_URL}/${id}`, data);
};
