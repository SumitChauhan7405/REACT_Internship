import { useEffect, useState } from "react";
import {
    addConsultation,
    updateConsultation
} from "../../services/consultationService";
import "../../assets/css/components/prescription-modal.css";

const PrescriptionModal = ({
    open,
    onClose,
    appointment,
    patient,
    doctor,
    existingPrescription,
    mode // ADD | EDIT
}) => {
    const emptyForm = {
        diagnosis: "",
        consultation: "",
        medicines: [{ name: "", dosage: "" }]
    };

    const [form, setForm] = useState(emptyForm);

    /* ======================
       RESET / PREFILL LOGIC
    ======================= */
    useEffect(() => {
        if (!open) return;

        // ✅ ADD MODE → CLEAN FORM
        if (mode === "ADD") {
            setForm(emptyForm);
        }

        // ✅ EDIT MODE → PREFILL
        if (mode === "EDIT" && existingPrescription) {
            setForm({
                diagnosis: existingPrescription.diagnosis || "",
                consultation: existingPrescription.consultation || "",
                medicines:
                    existingPrescription.medicines?.length > 0
                        ? existingPrescription.medicines
                        : [{ name: "", dosage: "" }]
            });
        }
    }, [open, mode, existingPrescription]);

    if (!open || !appointment || !patient || !doctor) return null;

    /* ======================
       HANDLERS
    ======================= */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleMedicineChange = (index, field, value) => {
        const updated = [...form.medicines];
        updated[index][field] = value;
        setForm({ ...form, medicines: updated });
    };

    const addMedicineRow = () => {
        setForm({
            ...form,
            medicines: [...form.medicines, { name: "", dosage: "" }]
        });
    };

    const handleSubmit = async () => {

        const cleanedMedicines = form.medicines.filter(
            (m) => m.name.trim() && m.dosage.trim()
        );


        const payload = {
            appointmentId: appointment.id,
            doctorId: doctor.id,
            doctorName: doctor.name,
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`,
            diagnosis: form.diagnosis,
            consultation: form.consultation,
            medicines: cleanedMedicines,
            createdAt: new Date().toISOString()
        };

        if (mode === "EDIT" && existingPrescription) {
            await updateConsultation(existingPrescription.id, payload);
        } else {
            await addConsultation({
                id: `CON-${new Date().getFullYear()}-${Date.now()}`,
                ...payload
            });
        }

        alert("Prescription saved successfully");
        setForm(emptyForm);
        onClose();
    };

    /* ======================
       UI
    ======================= */
    return (
        <div className="prescription-backdrop" onClick={onClose}>
            <div className="prescription-card" onClick={(e) => e.stopPropagation()}>
                <h5>Prescription</h5>
                <p>Patient medical details</p>

                {/* PATIENT / DOCTOR */}
                <div className="form-grid">
                    <div>
                        <label>Patient</label>
                        <input
                            value={`${patient.firstName} ${patient.lastName}`}
                            disabled
                        />
                    </div>

                    <div>
                        <label>Doctor</label>
                        <input value={doctor.name} disabled />
                    </div>

                    <div>
                        <label>Date</label>
                        <input value={appointment.date} disabled />
                    </div>
                </div>

                {/* DIAGNOSIS */}
                <label>Diagnosis</label>
                <textarea
                    name="diagnosis"
                    rows="3"
                    placeholder="Write diagnosis here..."
                    value={form.diagnosis}
                    onChange={handleChange}
                />

                {/* CONSULTATION */}
                <label>Consultation</label>
                <textarea
                    name="consultation"
                    rows="3"
                    placeholder="Write consultation notes..."
                    value={form.consultation}
                    onChange={handleChange}
                />

                {/* MEDICINES */}
                <h6>Medicines</h6>

                {form.medicines.map((m, i) => (
                    <div key={i} className="medicine-row">
                        <input
                            placeholder="Medicine name"
                            value={m.name}
                            onChange={(e) =>
                                handleMedicineChange(i, "name", e.target.value)
                            }
                        />
                        <input
                            placeholder="Dosage (1-0-1)"
                            value={m.dosage}
                            onChange={(e) =>
                                handleMedicineChange(i, "dosage", e.target.value)
                            }
                        />
                    </div>
                ))}

                <button className="btn-add-medicine" onClick={addMedicineRow}>
                    + Add Medicine
                </button>

                {/* ACTIONS */}
                <div className="form-actions">
                    <button className="form-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSubmit}>
                        Save Prescription
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;
