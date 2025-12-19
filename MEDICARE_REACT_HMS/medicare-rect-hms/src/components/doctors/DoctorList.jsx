import { useEffect, useState } from "react";
import { getDoctors, deleteDoctor } from "../../services/doctorService";
import "../../assets/css/components/doctor-list.css";

const DoctorList = ({ onEdit }) => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        const res = await getDoctors();
        setDoctors(res.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            await deleteDoctor(id);
            loadDoctors();
        }
    };

    // group doctors by department (simple logic)
    const departments = {};
    doctors.forEach((doc) => {
        if (!departments[doc.department]) {
            departments[doc.department] = [];
        }
        departments[doc.department].push(doc);
    });

    return (
        <>
            {Object.keys(departments).map((dept) => (
                <div className="doctor-table-card" key={dept}>
                    <div className="doctor-table-header">
                        <h6>{dept}</h6>
                        <span>Total: {departments[dept].length}</span>
                    </div>

                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Days</th>
                                <th>OPD Time</th>
                                <th>Fee</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments[dept].map((doc) => (
                                <tr key={doc.id}>
                                    <td>
                                        <div className="doctor-info">
                                            <img
                                                src={`/Doctorimages/${doc.image}`}
                                                alt={doc.name}
                                                className="doctor-avatar"
                                            />
                                            {doc.name}
                                        </div>
                                    </td>
                                    <td>{doc.availableDays.join(", ")}</td>
                                    <td>{doc.timeSlots.join(", ")}</td>
                                    <td>₹{doc.consultationFee}</td>
                                    <td>
                                        <div className="doctor-actions">
                                            <button
                                                className="icon-btn edit"
                                                title="Edit"
                                                onClick={() => onEdit(doc)}
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>

                                            <button
                                                className="icon-btn delete"
                                                title="Delete"
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
        </>
    );
};

export default DoctorList;
