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

        // --- Layout Constants ---
        const marginLeft = 14;
        const marginRight = 196;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (marginLeft * 2);

        // --- 1. HEADER SECTION ---
        const logo = require("../../assets/images/logo/MediCare_Black_Logo.png");
        
        doc.addImage(logo, "PNG", marginLeft, 10, 20, 20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text("MEDICARE HOSPITAL", marginLeft + 25, 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text("123 Health Avenue, Medical District, NY 10001", marginLeft + 25, 23);
        doc.text("Ph: +91 90542-77510 | Email: info@medicare.com", marginLeft + 25, 27);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("MEDICAL DOSSIER", marginRight, 18, { align: "right" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, marginRight, 25, { align: "right" });

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(marginLeft, 32, marginRight, 32);

        // --- 2. PATIENT INFO BOX ---
        const boxTopY = 38;
        const boxHeight = 35;
        
        doc.setDrawColor(0);
        doc.setLineWidth(0.1);
        doc.rect(marginLeft, boxTopY, contentWidth, boxHeight);

        const drawField = (label, value, x, y) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(`${label}:`, x, y);
            
            doc.setFont("helvetica", "normal");
            doc.text(`${value || "N/A"}`, x + 35, y); 
        };

        const col1X = marginLeft + 5;
        const col2X = marginLeft + 100;
        let currentY = boxTopY + 7;
        const rowGap = 6;

        const mainDoctor = consultations.length > 0 ? consultations[0].doctorName : "Dr. On Duty";
        const mainDept = consultations.length > 0 ? consultations[0].department : "General";

        // Row 1
        drawField("Patient Name", `${patient.firstName} ${patient.lastName}`, col1X, currentY);
        drawField("Department", mainDept, col2X, currentY);

        // Row 2
        currentY += rowGap;
        drawField("Patient ID", patient.id, col1X, currentY);
        drawField("Consultant", mainDoctor, col2X, currentY);

        // Row 3
        currentY += rowGap;
        drawField("Age / Gender", `${patient.age} Yrs / ${patient.gender}`, col1X, currentY);
        drawField("Reg. Date", new Date().toLocaleDateString(), col2X, currentY);

        // Row 4
        currentY += rowGap;
        drawField("Contact", patient.phone, col1X, currentY);
        drawField("Address", "Rajkot, Gujarat", col2X, currentY);

        // --- 3. HELPER FOR SECTION HEADERS ---
        let finalY = boxTopY + boxHeight + 10;

        const drawSectionHeader = (title, y) => {
            doc.setFillColor(245, 245, 245);
            doc.rect(marginLeft, y, contentWidth, 7, "F");
            doc.setDrawColor(0);
            doc.setLineWidth(1);
            doc.line(marginLeft, y, marginLeft, y + 7);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(0);
            doc.text(title.toUpperCase(), marginLeft + 4, y + 4.5);
        };

        // --- 4. CONSULTATION HISTORY ---
        if (consultations.length > 0) {
            drawSectionHeader("Consultation History", finalY);
            
            autoTable(doc, {
                startY: finalY + 8,
                theme: "grid",
                // Updated Columns to match your screenshot
                head: [["Date", "Doctor Name", "Dept", "Diagnosis", "Consultation", "Medicines(Dosage)"]],
                body: consultations.map(c => [
                    new Date(c.createdAt).toLocaleDateString(),
                    c.doctorName,
                    c.department,
                    c.diagnosis,
                    c.consultation, // This matches the "Consultation" text in your screenshot
                    c.medicines?.map(m => `${m.name} (${m.dosage})`).join(", ") || "-"
                ]),
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: 0,
                    fontStyle: "bold",
                    lineColor: 200,
                    lineWidth: 0.1
                },
                bodyStyles: { textColor: 0, lineColor: 200, lineWidth: 0.1 },
                styles: { fontSize: 8, cellPadding: 2 }, // Reduced font size slightly to fit more columns
            });
            finalY = doc.lastAutoTable.finalY + 10;
        }

        // --- 5. LAB INVESTIGATIONS ---
        if (labTests.length > 0) {
            drawSectionHeader("Lab Test History", finalY);

            autoTable(doc, {
                startY: finalY + 8,
                theme: "grid",
                // Updated Columns to match your screenshot
                head: [["Date", "Lab Tests Name", "Ordered By", "Lab Test Results", "Status"]],
                body: labTests.map(l => [
                    new Date(l.createdAt).toLocaleDateString(),
                    l.tests.map(t => typeof t === "string" ? t : t.testName).join(", "),
                    l.doctorName, // Added "Ordered By"
                    l.results?.map(r => `${r.testName}: ${r.result}`).join(" | ") || "-",
                    l.status
                ]),
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: 0,
                    fontStyle: "bold",
                    lineColor: 200,
                    lineWidth: 0.1
                },
                bodyStyles: { textColor: 0, lineColor: 200, lineWidth: 0.1 },
                styles: { fontSize: 9, cellPadding: 3 },
            });
            finalY = doc.lastAutoTable.finalY + 10;
        }

        // --- 6. SURGICAL PROCEDURES ---
        if (surgeries.length > 0) {
            drawSectionHeader("Surgery History", finalY);

            autoTable(doc, {
                startY: finalY + 8,
                theme: "grid",
                // Updated Columns to match your screenshot
                head: [["Date", "Surgery Name", "Dept", "Surgeon", "Remarks", "Status"]],
                body: surgeries.map(s => [
                    new Date(s.createdAt).toLocaleDateString(),
                    s.surgeryType,
                    s.department, // Added Department
                    s.doctorName, // Added Surgeon
                    s.notes || "-", // Added Remarks (mapped to notes)
                    s.status
                ]),
                headStyles: {
                    fillColor: [240, 240, 240],
                    textColor: 0,
                    fontStyle: "bold",
                    lineColor: 200,
                    lineWidth: 0.1
                },
                bodyStyles: { textColor: 0, lineColor: 200, lineWidth: 0.1 },
                styles: { fontSize: 9, cellPadding: 3 },
            });
            finalY = doc.lastAutoTable.finalY + 10;
        }

        // --- 7. FOOTER ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            const pageHeight = doc.internal.pageSize.height;
            doc.setDrawColor(0);
            doc.setLineWidth(0.5);
            doc.line(marginLeft, pageHeight - 20, marginRight, pageHeight - 20);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text("* This is a computer-generated medical record and does not require a physical signature.", marginLeft, pageHeight - 14);
            doc.text("* Confidential Medical Record - For authorized personnel only.", marginLeft, pageHeight - 10);
            doc.setFont("helvetica", "bold");
            doc.text("Authorized Signatory", marginRight, pageHeight - 14, { align: "right" });
        }

        doc.save(`${patient.firstName} ${patient.lastName}_Medical_History.pdf`);
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
                        <i className="bi bi-download"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorPatientHistory;
