import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages/doctor-patient-history.css";

const DoctorPatientHistory = () => {
    const { id } = useParams(); // patientId
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [surgeries, setSurgeries] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ======================
       LOAD PATIENT + HISTORY
    ======================= */
    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    patientRes,
                    consultRes,
                    labRes,
                    surgeryRes
                ] = await Promise.all([
                    axios.get(`http://localhost:5000/patients/${id}`),
                    axios.get("http://localhost:5000/consultations"),
                    axios.get("http://localhost:5000/labTests"),
                    axios.get("http://localhost:5000/surgeries")
                ]);

                setPatient(patientRes.data);

                setConsultations(
                    consultRes.data.filter(c => c.patientId === id)
                );

                setLabTests(
                    labRes.data.filter(
                        l => l.patientId === id && l.consultationId
                    )
                );

                setSurgeries(
                    surgeryRes.data.filter(s => s.patientId === id)
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return <p style={{ padding: 20 }}>Loading patient history...</p>;
    }

    if (!patient) {
        return <p style={{ padding: 20 }}>Patient not found</p>;
    }

    const downloadPatientHistoryPDF = () => {
        const doc = new jsPDF();

        /* ======================
           HEADER
        ======================= */
        doc.setFontSize(16);
        doc.text("Patient Medical History", 14, 15);

        doc.setFontSize(11);
        doc.text("MediCare Hospital", 14, 22);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        /* ======================
           PATIENT DETAILS
        ======================= */
        autoTable(doc,{
            startY: 34,
            theme: "grid",
            head: [["Patient ID", "Name", "Gender", "Age", "Blood Group", "Phone"]],
            body: [[
                patient.id,
                `${patient.firstName} ${patient.lastName}`,
                patient.gender,
                patient.age,
                patient.bloodGroup,
                patient.phone
            ]]
        });

        /* ======================
           CONSULTATION HISTORY
        ======================= */
        if (consultations.length > 0) {
            doc.text("Consultation History", 14, doc.lastAutoTable.finalY + 10);

            autoTable(doc,{
                startY: doc.lastAutoTable.finalY + 14,
                head: [["Date", "Doctor", "Department", "Diagnosis", "Medicines"]],
                body: consultations.map(c => [
                    new Date(c.createdAt).toLocaleDateString(),
                    c.doctorName,
                    c.department,
                    c.diagnosis,
                    c.medicines?.map(m => `${m.name} (${m.dosage})`).join(", ") || "—"
                ])
            });
        }

        /* ======================
           LAB TEST HISTORY
        ======================= */
        if (labTests.length > 0) {
            doc.text("Lab Test History", 14, doc.lastAutoTable.finalY + 10);

            autoTable(doc,{
                startY: doc.lastAutoTable.finalY + 14,
                head: [["Date", "Tests", "Ordered By", "Results", "Status"]],
                body: labTests.map(l => [
                    new Date(l.createdAt).toLocaleDateString(),
                    l.tests.map(t => typeof t === "string" ? t : t.testName).join(", "),
                    l.doctorName,
                    l.results?.map(r => `${r.testName}: ${r.result}`).join(" | ") || "—",
                    l.status
                ])
            });
        }

        /* ======================
           SURGERY HISTORY
        ======================= */
        if (surgeries.length > 0) {
            doc.text("Surgery History", 14, doc.lastAutoTable.finalY + 10);

            autoTable(doc,{
                startY: doc.lastAutoTable.finalY + 14,
                head: [["Date", "Surgery", "Department", "Surgeon", "Status"]],
                body: surgeries.map(s => [
                    new Date(s.createdAt).toLocaleDateString(),
                    s.surgeryType,
                    s.department,
                    s.doctorName,
                    s.status
                ])
            });
        }

        /* ======================
           SAVE FILE
        ======================= */
        doc.save(`${patient.id}_Medical_History.pdf`);
    };

    return (
        <div className="doctor-patient-history-page">
            {/* ===== HEADER ===== */}
            <div className="history-header">
                <div>
                    <h3>Patient Medical History</h3>
                    <p className="subtitle">Complete treatment timeline</p>
                </div>
            </div>

            <div className="patient-info-card">
                {/* ======================
                PATIENT INFORMATION
                ======================= */}
                <h4 className="section-title">Patient Information</h4>

                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Blood Group</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>{patient.id}</b></td>
                            <td><b>{patient.firstName} {patient.lastName}</b></td>
                            <td><b>{patient.gender}</b></td>
                            <td><b>{patient.age}</b></td>
                            <td><b>{patient.bloodGroup}</b></td>
                            <td><b>{patient.phone}</b></td>
                        </tr>
                    </tbody>
                </table>


                <hr className="history-divider" />
                {/* ======================
                CONSULTATION HISTORY
                ======================= */}
                <h4 className="section-title">Consultation History</h4>

                {consultations.length === 0 ? (
                    <p className="empty-text">No consultation history found</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Department</th>
                                <th>Diagnosis</th>
                                <th>Consultation</th>
                                <th>Medicines</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultations.map(c => (
                                <tr key={c.id}>
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>{c.doctorName}</td>
                                    <td>{c.department}</td>
                                    <td>{c.diagnosis}</td>
                                    <td>{c.consultation}</td>
                                    <td>
                                        {c.medicines && c.medicines.length > 0 ? (
                                            c.medicines.map((m, i) => (
                                                <div key={i}>
                                                    <strong>{m.name}</strong> ({m.dosage})
                                                </div>
                                            ))
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <hr className="history-divider" />

                {/* ======================
                LAB TEST HISTORY
                ======================= */}
                <h4 className="section-title">Lab Test History</h4>

                {labTests.length === 0 ? (
                    <p className="empty-text">No lab test history found</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Tests</th>
                                <th>Ordered By</th>
                                <th>Results</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labTests.map(lab => (
                                <tr key={lab.id}>
                                    <td>{new Date(lab.createdAt).toLocaleDateString()}</td>
                                    <td>{lab.tests.map(t => typeof t === "string" ? t : t.testName).join(", ")}</td>
                                    <td>{lab.doctorName}</td>
                                    <td>
                                        {lab.results?.map((r, i) => (
                                            <div key={i}><strong>{r.testName}:</strong> {r.result}</div>
                                        ))}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${lab.status === "COMPLETED" ? "success" : "danger"}`}>
                                            {lab.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <hr className="history-divider" />

                {/* ======================
                🫀 SURGERY HISTORY
                ======================= */}
                <h4 className="section-title">Surgery History</h4>

                {surgeries.length === 0 ? (
                    <p className="empty-text">No surgery history found</p>
                ) : (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Surgery</th>
                                <th>Department</th>
                                <th>Surgeon</th>
                                <th>Remarks</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {surgeries.map(s => (
                                <tr key={s.id}>
                                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                                    <td>{s.surgeryType}</td>
                                    <td>{s.department}</td>
                                    <td>{s.doctorName}</td>
                                    <td>{s.notes || "—"}</td>
                                    <td>
                                        <span className={`status-pill ${s.status === "COMPLETED" ? "success" : "danger"}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* ======================
                CARD ACTIONS (BOTTOM LEFT)
                ======================= */}
                <div className="history-card-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left"></i> Back
                    </button>

                    <button
                        className="btn-primary"
                        onClick={downloadPatientHistoryPDF}
                    >
                        <i className="bi bi-file-earmark-pdf"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorPatientHistory;
