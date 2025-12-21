import { useEffect, useState } from "react";
import { getDoctors } from "../../services/doctorService";
import DoctorCard from "../../components/public/DoctorCard";
import "../../assets/css/public/doctors-public.css";

const Home = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const res = await getDoctors();
    setDoctors(res.data);
  };

  const handleBook = (doctor) => {
    alert(`Booking appointment with ${doctor.name}`);
  };

  return (
    <div className="public-container">
      <div className="public-header">
        <h2>Our Doctors</h2>
        <p>Meet our experienced and qualified medical professionals</p>
      </div>

      <div className="doctor-grid">
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.id}
            doctor={doc}
            onBook={handleBook}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
