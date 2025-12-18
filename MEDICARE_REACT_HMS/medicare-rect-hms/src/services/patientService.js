import axios from "axios";

const API_URL = "http://localhost:5000/patients";

export const getPatients = () => axios.get(API_URL);

export const addPatient = (patient) => axios.post(API_URL, patient);
