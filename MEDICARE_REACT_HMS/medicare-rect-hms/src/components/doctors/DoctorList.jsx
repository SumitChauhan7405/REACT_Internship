import { useEffect, useState } from "react";
import { getDoctors, deleteDoctor } from "../../services/doctorService";
import "../../assets/css/components/doctor-list.css";

const DoctorList = ({ onEdit }) => {
  const [doctors, setDoctors] = useState([]);

  const loadDoctors = async () => {
    const res = await getDoctors();
    setDoctors(res.data || []);
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      await deleteDoctor(id);
      loadDoctors();
    }
  };

  if (doctors.length === 0) {
    return (
      <div className="doctor-table-card">
        No doctors found. Please add a doctor.
      </div>
    );
  }

  /* ✅ GROUP BY DEPARTMENT */
  const groupedDoctors = doctors.reduce((acc, doc) => {
    acc[doc.department] = acc[doc.department] || [];
    acc[doc.department].push(doc);
    return acc;
  }, {});

  /* ✅ SAFE IMAGE LOADER FROM src/assets */
  const getDoctorImage = (imageName) => {
    try {
      return require(`../../assets/images/doctors/${imageName}`);
    } catch (err) {
      return require(`../../assets/images/doctors/doc.png`);
    }
  };

  return (
    <div className="doctor-list-wrapper">
      {Object.keys(groupedDoctors).map((dept) => (
        <div key={dept} className="doctor-table-card">
          
          {/* Header */}
          <div className="doctor-table-header">
            <h6>{dept}</h6>
            <span>Total: {groupedDoctors[dept].length}</span>
          </div>

          {/* Table */}
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Experience / Education</th>
                <th>Available Days</th>
                <th>OPD Time</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {groupedDoctors[dept].map((doc) => (
                <tr key={doc.id}>
                  
                  {/* Doctor */}
                  <td>
                    <div className="doctor-info">
                      <img
                        src={getDoctorImage(doc.image)}
                        alt={doc.name}
                        className="doctor-avatar"
                      />
                      <strong>{doc.name}</strong>
                    </div>
                  </td>

                  <td>{doc.department}</td>

                  <td>
                    {doc.experience} yrs · {doc.education}
                  </td>

                  <td>
                    {doc.availableDays?.length
                      ? doc.availableDays.join(", ")
                      : "-"}
                  </td>

                  <td>{doc.timeSlots?.join(", ")}</td>

                  <td>₹{doc.consultationFee}</td>

                  {/* Action */}
                  <td>
                    <div className="doctor-actions">
                      <button
                        className="icon-btn edit"
                        onClick={() => onEdit(doc)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
