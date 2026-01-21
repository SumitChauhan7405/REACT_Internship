import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/discharge.css";

const GST_RATE = 5; // ✅ 5% GST

const Discharge = () => {
  const [admissions, setAdmissions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [bills, setBills] = useState([]);

  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [billPreview, setBillPreview] = useState(null);

  /* ======================
     LOAD DATA
  ======================= */
  const loadData = async () => {
    const [
      admRes,
      roomRes,
      conRes,
      labRes,
      surRes,
      billRes
    ] = await Promise.all([
      axios.get("http://localhost:5000/admissions"),
      axios.get("http://localhost:5000/rooms"),
      axios.get("http://localhost:5000/consultations"),
      axios.get("http://localhost:5000/labTests"),
      axios.get("http://localhost:5000/surgeries"),
      axios.get("http://localhost:5000/bills")
    ]);

    setAdmissions(admRes.data.filter(a => a.status === "ADMITTED"));
    setRooms(roomRes.data);
    setConsultations(conRes.data);
    setLabTests(labRes.data);
    setSurgeries(surRes.data);
    setBills(billRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     GENERATE BILL
  ======================= */
  const generateBill = (adm) => {
    const alreadyBilled = bills.some(b => b.admissionId === adm.id);
    if (alreadyBilled) {
      alert("Bill already generated for this admission");
      return;
    }

    const room = rooms.find(r => r.id === adm.roomId);

    /* 🆕 ADMISSION → DISCHARGE */
    const admissionDate = new Date(adm.admissionDate);
    const dischargeDate = new Date();

    const diffTime = dischargeDate - admissionDate;
    const stayDays = Math.max(
      1,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    );

    const dailyCharge = room?.charge || 0;
    const totalRoomCharge = dailyCharge * stayDays;

    const patientConsultations = consultations.filter(
      c => c.patientId === adm.patientId
    );

    const consultationCharge = patientConsultations.reduce(
      (sum, c) => sum + (c.consultationFee || 0),
      0
    );

    const patientLabs = labTests.filter(
      l => l.patientId === adm.patientId
    );

    const labItems = patientLabs.flatMap(l => l.tests || []);
    const totalLabCharge = labItems.reduce(
      (sum, t) => sum + (t.charge || 0),
      0
    );

    const surgery = surgeries.find(
      s => s.patientId === adm.patientId
    );

    const surgeryCharge = surgery?.surgeryCharge || 0;

    /* 🧮 SUBTOTAL */
    const subtotal =
      totalRoomCharge +
      consultationCharge +
      totalLabCharge +
      surgeryCharge;

    /* 🧾 GST */
    const gstAmount = Math.round((subtotal * GST_RATE) / 100);

    /* 💰 FINAL TOTAL */
    const totalAmount = subtotal + gstAmount;

    setSelectedAdmission(adm);
    setBillPreview({
      admissionDate: adm.admissionDate,
      dischargeDate: dischargeDate.toISOString().split("T")[0],
      stayDays,
      dailyCharge,
      totalRoomCharge,
      consultationCharge,
      labItems,
      totalLabCharge,
      surgeryCharge,
      subtotal,
      gstRate: GST_RATE,
      gstAmount,
      totalAmount
    });
  };

  /* ======================
     CONFIRM DISCHARGE
  ======================= */
  const confirmDischarge = async () => {
    if (!selectedAdmission || !billPreview) return;

    const billId = `BILL-${String(bills.length + 1).padStart(4, "0")}`;

    await axios.post("http://localhost:5000/bills", {
      id: billId,
      admissionId: selectedAdmission.id,
      patientId: selectedAdmission.patientId,
      patientName: selectedAdmission.patientName,
      doctorName: selectedAdmission.doctorName,
      billDate: new Date().toISOString(),

      /* 🏨 ROOM SNAPSHOT */
      room: {
        roomId: selectedAdmission.roomId,
        roomType: selectedAdmission.roomType,
        dailyCharge: billPreview.dailyCharge,
        stayDays: billPreview.stayDays,
        totalRoomCharge: billPreview.totalRoomCharge
      },

      admissionDate: billPreview.admissionDate,
      dischargeDate: billPreview.dischargeDate,

      consultationCharge: billPreview.consultationCharge,
      labTests: billPreview.labItems,
      labCharge: billPreview.totalLabCharge,
      surgeryCharge: billPreview.surgeryCharge,

      subtotal: billPreview.subtotal,
      gstRate: billPreview.gstRate,
      gstAmount: billPreview.gstAmount,

      totalAmount: billPreview.totalAmount,
      status: "UNPAID"
    });

    await axios.patch(
      `http://localhost:5000/admissions/${selectedAdmission.id}`,
      {
        status: "DISCHARGED",
        dischargeDate: billPreview.dischargeDate
      }
    );

    await axios.patch(
      `http://localhost:5000/rooms/${selectedAdmission.roomId}`,
      { status: "AVAILABLE" }
    );

    alert("Patient discharged & bill generated");

    setBillPreview(null);
    setSelectedAdmission(null);
    loadData();
  };

  return (
    <div className="page-content">
      <div className="patient-table-card">
        <div className="table-header">
          <h4>Discharge Patients</h4>
        </div>

        <table>
          <thead>
            <tr>
              <th>Admission ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Room</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {admissions.map(adm => (
              <tr key={adm.id}>
                <td>{adm.id}</td>
                <td>{adm.patientName}</td>
                <td>{adm.doctorName}</td>
                <td>{adm.roomNumber}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => generateBill(adm)}
                  >
                    Discharge Patient
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {billPreview && (
        <div className="patient-table-card" style={{ marginTop: 20 }}>
          <h4>Bill Summary</h4>

          <p>
            <strong>Admission Date:</strong> {billPreview.admissionDate} {""}
            <strong>Discharge Date:</strong> {billPreview.dischargeDate}
          </p>

          <p>
            Room Charge: ₹{billPreview.dailyCharge} × {billPreview.stayDays} days
            = ₹{billPreview.totalRoomCharge}
          </p>

          <p>Consultation Charge: ₹{billPreview.consultationCharge}</p>
          <p>Surgery Charge: ₹{billPreview.surgeryCharge}</p>

          <h5>Lab Tests</h5>
          <ul>
            {billPreview.labItems.map((t, i) => (
              <li key={i}>{t.testName} — ₹{t.charge}</li>
            ))}
          </ul>

          <p><strong>Subtotal:</strong> ₹{billPreview.subtotal}</p>
          <p><strong>GST ({billPreview.gstRate}%):</strong> ₹{billPreview.gstAmount}</p>

          <h4>Total: ₹{billPreview.totalAmount}</h4>

          <button className="btn-success" onClick={confirmDischarge}>
            Confirm Discharge & Generate Bill
          </button>
        </div>
      )}
    </div>
  );
};

export default Discharge;
