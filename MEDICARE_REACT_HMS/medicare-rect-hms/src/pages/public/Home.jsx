import { useEffect, useState } from "react";
import axios from "axios";
import DoctorCard from "../public/DoctorCard";

const Home = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/doctors")
      .then(res => setDoctors(res.data));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Our Doctors</h2>
      <p>Meet our experienced medical specialists</p>

      <div className="doctor-grid">
        {doctors.map(doc => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
};

export default Home;
