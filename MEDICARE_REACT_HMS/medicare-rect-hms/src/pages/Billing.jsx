import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../assets/css/pages/billing.css";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedBill, setSelectedBill] = useState(null);
  const [viewBill, setViewBill] = useState(null);

  /* 🔍 FILTER STATES */
  const [searchPatient, setSearchPatient] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [paymentForm, setPaymentForm] = useState({
    mode: "Cash",
    amount: ""
  });

  const billRef = useRef();

  /* ======================
     LOAD DATA
  ======================= */
  const loadData = async () => {
    const [billRes, payRes] = await Promise.all([
      axios.get("http://localhost:5000/bills"),
      axios.get("http://localhost:5000/payments")
    ]);

    setBills(billRes.data);
    setPayments(payRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     HELPERS
  ======================= */
  const getPaidAmount = (billId) => {
    return payments
      .filter((p) => p.billId === billId)
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  const getRemainingAmount = (bill) => {
    return bill.totalAmount - getPaidAmount(bill.id);
  };

  /* ======================
     FILTERED BILLS
  ======================= */
  const filteredBills = bills.filter((bill) => {
    const patientMatch = (bill.patientName || "")
      .toLowerCase()
      .includes(searchPatient.toLowerCase());

    const billDate = bill.billDate?.split("T")[0];

    const fromMatch = fromDate ? billDate >= fromDate : true;
    const toMatch = toDate ? billDate <= toDate : true;

    return patientMatch && fromMatch && toMatch;
  });

  /* ======================
     ADD PAYMENT (AUTO PAID)
  ======================= */
  const handleAddPayment = async () => {
    if (!paymentForm.amount || paymentForm.amount <= 0) {
      alert("Enter valid payment amount");
      return;
    }

    const paymentId = `PAY-${String(payments.length + 1).padStart(4, "0")}`;
    const amount = Number(paymentForm.amount);

    await axios.post("http://localhost:5000/payments", {
      id: paymentId,
      billId: selectedBill.id,
      mode: paymentForm.mode,
      amount,
      date: new Date().toISOString().split("T")[0]
    });

    const updatedPaid = getPaidAmount(selectedBill.id) + amount;

    if (updatedPaid >= selectedBill.totalAmount) {
      await axios.patch(
        `http://localhost:5000/bills/${selectedBill.id}`,
        { status: "PAID" }
      );
    }

    alert("Payment added successfully");

    setPaymentForm({ mode: "Cash", amount: "" });
    setSelectedBill(null);
    loadData();
  };

  /* ======================
     DOWNLOAD PDF
  ======================= */
  const downloadPDF = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Bill-${viewBill.id}.pdf`);
  };

  /* ======================
     UI
  ======================= */
  return (
    <div className="page-content">
      {/* ===== FILTER BAR ===== */}
      <div className="patient-table-card">
        <div className="table-header">
          <h4>Billing History</h4>
        </div>

        <div className="billing-filters">
          <input
            type="text"
            placeholder="Search by patient name"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button
            className="btn-secondary"
            onClick={() => {
              setSearchPatient("");
              setFromDate("");
              setToDate("");
            }}
          >
            Reset
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Patient</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredBills.map((bill) => {
              const paid = getPaidAmount(bill.id);
              const remaining = getRemainingAmount(bill);

              return (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.patientName}</td>
                  <td>₹{bill.totalAmount}</td>
                  <td>₹{paid}</td>
                  <td>₹{remaining}</td>
                  <td>
                    <span
                      className={`badge ${bill.status === "PAID" ? "male" : "female"
                        }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => setViewBill(bill)}
                    >
                      View / PDF
                    </button>

                    {bill.status === "UNPAID" && (
                      <button
                        className="btn-primary"
                        style={{ marginLeft: 8 }}
                        onClick={() => setSelectedBill(bill)}
                      >
                        Add Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== PAYMENT PANEL ===== */}
      {selectedBill && (
        <div className="patient-table-card" style={{ marginTop: 20 }}>
          <h4>Add Payment</h4>

          <p><strong>Bill ID:</strong> {selectedBill.id}</p>
          <p><strong>Patient:</strong> {selectedBill.patientName}</p>
          <p>
            <strong>Remaining:</strong> ₹
            {getRemainingAmount(selectedBill)}
          </p>

          <select
            value={paymentForm.mode}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, mode: e.target.value })
            }
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          <input
            type="number"
            placeholder="Enter amount"
            value={paymentForm.amount}
            onChange={(e) =>
              setPaymentForm({ ...paymentForm, amount: e.target.value })
            }
          />

          <button className="btn-success" onClick={handleAddPayment}>
            Save Payment
          </button>

          <button
            className="btn-closed"
            onClick={() => setSelectedBill(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ===== BILL VIEW / INVOICE ===== */}
      {viewBill && (
        <div className="patient-table-card" style={{ marginTop: 20 }}>
          <div ref={billRef} className="invoice-wrapper">

            <div className="invoice-header">
              <img
                src={require("../assets/images/logo/MediCare_Logo.png")}
                alt="Medicare"
                className="invoice-logo"
              />
              <div className="invoice-title">
                <h2>Medicare Hospital</h2>
                <p>Patient Billing Invoice</p>
              </div>
            </div>

            <hr />

            <div className="invoice-info">
              <div>
                <p><strong>Bill ID:</strong> {viewBill.id}</p>
                <p><strong>Patient:</strong> {viewBill.patientName}</p>
                <p><strong>Doctor:</strong> {viewBill.doctorName}</p>
                <p><strong>Admission Date:</strong> {viewBill.admissionDate}</p>
                <p><strong>Discharge Date:</strong> {viewBill.dischargeDate}</p>
              </div>
              <div>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(viewBill.billDate).toDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${viewBill.status === "PAID" ? "male" : "female"}`}>
                    {viewBill.status}
                  </span>
                </p>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Description</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>

                <tr>
                  <td>Room</td>
                  <td>
                    Room Charges [{viewBill.room?.roomType} - ₹{viewBill.room?.dailyCharge}]
                    (₹{viewBill.room?.dailyCharge} × {viewBill.room?.stayDays} day(s))
                  </td>
                  <td>{viewBill.room?.totalRoomCharge}</td>
                </tr>
                
                <tr>
                  <td>Consultation</td>
                  <td>Doctor Consultation</td>
                  <td>{viewBill.consultationCharge}</td>
                </tr>

                <tr>
                  <td>Surgery</td>
                  <td>Surgical Procedure</td>
                  <td>{viewBill.surgeryCharge}</td>
                </tr>

                {viewBill.labTests.map((t, i) => (
                  <tr key={i}>
                    <td>Lab Test</td>
                    <td>{t.testName}</td>
                    <td>{t.charge}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="2">
                    <strong>Subtotal</strong>
                  </td>
                  <td>
                    <strong>₹{viewBill.subtotal}</strong>
                  </td>
                </tr>

                <tr>
                  <td colSpan="2">
                    <strong>GST ({viewBill.gstRate}%)</strong>
                  </td>
                  <td>
                    <strong>{viewBill.gstAmount}</strong>
                  </td>
                  
                </tr>
              </tbody>
            </table>

            <div className="invoice-total">
              <h3>Total Amount: ₹{viewBill.totalAmount}</h3>
            </div>

            <p className="invoice-footer">
              This is a computer-generated invoice. No signature required.
            </p>
          </div>

          <button className="btn-success" onClick={downloadPDF}>
            Download PDF
          </button>

          <button
            className="btn-closed"
            style={{ marginLeft: 10 }}
            onClick={() => setViewBill(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Billing;
