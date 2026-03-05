import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../assets/css/pages/billing.css";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedBill, setSelectedBill] = useState(null);
  const [viewBill, setViewBill] = useState(null);

  const [searchPatient, setSearchPatient] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [paymentForm, setPaymentForm] = useState({
    mode: "Cash",
    amount: ""
  });

  const billRef = useRef();

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

  const getPaidAmount = (billId) => {
    const bill = bills.find(b => b.id === billId);
    if (bill?.amountPaid !== undefined) {
      return Number(bill.amountPaid);
    }

    return payments
      .filter((p) => p.billId === billId)
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  const getRemainingAmount = (bill) => {
    if (bill.remainingAmount !== undefined) {
      return Number(bill.remainingAmount);
    }
    return bill.totalAmount - getPaidAmount(bill.id);
  };

  const filteredBills = bills.filter((bill) => {
    const patientMatch = (bill.patientName || "")
      .toLowerCase()
      .includes(searchPatient.toLowerCase());

    const billDate = bill.billDate?.split("T")[0];

    const fromMatch = fromDate ? billDate >= fromDate : true;
    const toMatch = toDate ? billDate <= toDate : true;

    return patientMatch && fromMatch && toMatch;
  });

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
      patientId: selectedBill.patientId,
      patientName: selectedBill.patientName,
      mode: paymentForm.mode,
      amount,
      date: new Date().toISOString().split("T")[0]
    });

    const alreadyPaid = getPaidAmount(selectedBill.id);
    const newPaidAmount = alreadyPaid + amount;
    const remainingAmount = selectedBill.totalAmount - newPaidAmount;

    let newStatus = "UNPAID";
    if (remainingAmount <= 0) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }

    await axios.patch(
      `http://localhost:5000/bills/${selectedBill.id}`,
      {
        amountPaid: newPaidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        status: newStatus
      }
    );

    alert("Payment added successfully");

    setPaymentForm({ mode: "Cash", amount: "" });
    setSelectedBill(null);
    loadData();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 14;
    const marginRight = 196;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - (marginLeft * 2);

    const logo = require("../assets/images/logo/MediCare_Plus_Logo.png");
    
    doc.addImage(logo, "PNG", marginLeft, 10, 20, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(29, 78, 216); 
    doc.text("MEDICARE HOSPITAL", marginLeft + 25, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text("150 ft Ring Road, Opp. Om Nagar BRTS, Rajkot, Gujarat.", marginLeft + 25, 23);
    doc.text("Ph: +91 90542 77510 | Email: info@medicare.com", marginLeft + 25, 27);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("PATIENT BILLING INVOICE", marginRight, 18, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(viewBill.billDate).toLocaleDateString()}`, marginRight, 25, { align: "right" });

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, 34, marginRight, 34);

    const boxTopY = 40;
    const boxHeight = 26;
    
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.rect(marginLeft, boxTopY, contentWidth, boxHeight);

    const drawField = (label, value, x, y) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${label}:`, x, y);
        
        doc.setFont("helvetica", "normal");
        doc.text(`${value || "N/A"}`, x + 30, y); 
    };

    const col1X = marginLeft + 5;
    const col2X = marginLeft + 100;
    let currentY = boxTopY + 7;
    const rowGap = 7;

    drawField("Bill ID", viewBill.id, col1X, currentY);
    drawField("Admission Date", viewBill.admissionDate, col2X, currentY);

    currentY += rowGap;
    drawField("Patient Name", viewBill.patientName, col1X, currentY);
    drawField("Discharge Date", viewBill.dischargeDate, col2X, currentY);

    currentY += rowGap;
    drawField("Doctor Name", viewBill.doctorName, col1X, currentY);

    // --- Status Pill Rendering ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Status:", col2X, currentY);

    const statusText = viewBill.status || "UNPAID";
    let pillColor = [254, 226, 226]; // Light Red (danger)
    let textColor = [153, 27, 27];   // Dark Red

    if (statusText === "PAID") {
        pillColor = [220, 252, 231]; // Light Green (success)
        textColor = [22, 101, 52];   // Dark Green
    }

    const pillX = col2X + 30;
    const pillY = currentY - 4;
    const pillW = 22;
    const pillH = 5.5;

    doc.setFillColor(...pillColor);
    doc.roundedRect(pillX, pillY, pillW, pillH, 1.5, 1.5, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...textColor);
    doc.text(statusText, pillX + (pillW / 2), currentY, { align: "center" });
    
    doc.setTextColor(0, 0, 0); // Reset text color

    let finalY = boxTopY + boxHeight + 10;

    // Replace ₹ with Rs. to fix jsPDF font rendering issues
    const tableBody = [
        [
            "Room", 
            `Room Charges [${viewBill.room?.roomType || '-'} - Rs. ${viewBill.room?.dailyCharge || 0}] (Rs. ${viewBill.room?.dailyCharge || 0} × ${viewBill.room?.stayDays || 0} day(s))`, 
            `${viewBill.room?.totalRoomCharge || 0}`,
            `${viewBill.room?.totalRoomCharge || 0}`
        ],
        [
            "Consultation", 
            "Doctor Consultation", 
            `${viewBill.consultationCharge || 0}`,
            `${viewBill.consultationCharge || 0}`
        ],
        [
            "Surgery", 
            "Surgical Procedure", 
            `${viewBill.surgeryCharge || 0}`,
            `${viewBill.surgeryCharge || 0}`
        ]
    ];

    if (viewBill.labTests && viewBill.labTests.length > 0) {
        viewBill.labTests.forEach(t => {
            tableBody.push([
                "Lab Test", 
                t.testName, 
                `${t.charge || 0}`,
                `${t.charge || 0}`
            ]);
        });
    }

    tableBody.push([
        { content: "Subtotal", colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, 
        { content: `Rs. ${viewBill.subtotal || 0}`, styles: { fontStyle: 'bold' } }
    ]);

    tableBody.push([
        { content: `GST (${viewBill.gstRate || 5}%)`, colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, 
        { content: `${viewBill.gstAmount || 0}`, styles: { fontStyle: 'bold' } }
    ]);

    tableBody.push([
        { content: "Total Amount", colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', fillColor: [240, 240, 240] } }, 
        { content: `Rs. ${viewBill.totalAmount || 0}`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }
    ]);

    autoTable(doc, {
        startY: finalY,
        theme: "grid",
        head: [["Service", "Description", "Amount (Rs.)", "Total Amount (Rs.)"]],
        body: tableBody,
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

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(marginLeft, pageHeight - 20, marginRight, pageHeight - 20);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("* This is a computer-generated invoice and does not require a physical signature.", marginLeft, pageHeight - 14);
        doc.text("* Confidential Medical Record - For authorized personnel only.", marginLeft, pageHeight - 10);
        doc.setFont("helvetica", "bold");
        doc.text("Authorized Signatory", marginRight, pageHeight - 14, { align: "right" });
    }

    doc.save(`${viewBill.patientName}_Bill.pdf`);
  };

  return (
    <div className="page-content">
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
                    <span className={`badge ${bill.status === "PAID" ? "male" : "female"}`}>
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

                    {bill.status !== "PAID" && (
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

      {selectedBill && (
        <div className="patient-table-card" style={{ marginTop: 20 }}>
          <h4>Add Payment</h4>

          <p><strong>Bill ID:</strong> {selectedBill.id}</p>
          <p><strong>Patient:</strong> {selectedBill.patientName}</p>
          <p><strong>Remaining:</strong> ₹{getRemainingAmount(selectedBill)}</p>

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

      {viewBill && (
        <div className="patient-table-card" style={{ marginTop: 20 }}>
          <div ref={billRef} className="invoice-wrapper">

            <div className="invoice-header">
              <img
                src={require("../assets/images/logo/MediCare_Plus_Logo.png")}
                alt="Medicare"
                className="invoice-logo"
              />
              <div className="invoice-title">
                <h2>MEDICARE HOSPITAL</h2>
                <p>150 ft Ring Road, Opp. Om Nagar BRTS, Rajkot, Gujarat.</p>
                <p>Ph: +91 90542 77510 | Email: info@medicare.com</p>
              </div>
              <div className="invoice-title-right" style={{ marginLeft: "auto", textAlign: "right" }}>
                <h3 style={{ margin: 0 }}>PATIENT BILLING INVOICE</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                  Date: {new Date(viewBill.billDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <hr style={{ margin: "20px 0", border: "1px solid #000" }} />

            <div className="invoice-info-box" style={{ border: "1px solid #ccc", padding: "15px", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <p><strong>Bill ID:</strong> {viewBill.id}</p>
                <p><strong>Patient Name:</strong> {viewBill.patientName}</p>
                <p><strong>Doctor Name:</strong> {viewBill.doctorName}</p>
              </div>
              <div>
                <p><strong>Admission Date:</strong> {viewBill.admissionDate}</p>
                <p><strong>Discharge Date:</strong> {viewBill.dischargeDate}</p>
                <p>
                  <strong>Payment Status:</strong>{" "}
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
                  <th>Total Amount (₹)</th>
                </tr>
              </thead>
              <tbody>

                <tr>
                  <td>Room</td>
                  <td>
                    Room Charges [{viewBill.room?.roomType} - ₹{viewBill.room?.dailyCharge}]
                    (₹{viewBill.room?.dailyCharge} × {viewBill.room?.stayDays} day(s))
                  </td>
                  <td>₹{viewBill.room?.totalRoomCharge}</td>
                  <td>₹{viewBill.room?.totalRoomCharge}</td>
                </tr>
                
                <tr>
                  <td>Consultation</td>
                  <td>Doctor Consultation</td>
                  <td>₹{viewBill.consultationCharge}</td>
                  <td>₹{viewBill.consultationCharge}</td>
                </tr>

                <tr>
                  <td>Surgery</td>
                  <td>Surgical Procedure</td>
                  <td>₹{viewBill.surgeryCharge}</td>
                  <td>₹{viewBill.surgeryCharge}</td>
                </tr>

                {viewBill.labTests && viewBill.labTests.map((t, i) => (
                  <tr key={i}>
                    <td>Lab Test</td>
                    <td>{t.testName}</td>
                    <td>₹{t.charge}</td>
                    <td>₹{t.charge}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="3" style={{ textAlign: "right" }}>
                    <strong>Subtotal</strong>
                  </td>
                  <td>
                    <strong>₹{viewBill.subtotal}</strong>
                  </td>
                </tr>

                <tr>
                  <td colSpan="3" style={{ textAlign: "right" }}>
                    <strong>GST ({viewBill.gstRate}%)</strong>
                  </td>
                  <td>
                    <strong>₹{viewBill.gstAmount}</strong>
                  </td>
                </tr>

                <tr style={{ backgroundColor: "#f5f7fa" }}>
                  <td colSpan="3" style={{ textAlign: "right" }}>
                    <strong>Total Amount</strong>
                  </td>
                  <td>
                    <strong>₹{viewBill.totalAmount}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="invoice-footer-line" style={{ marginTop: "40px", borderTop: "1px solid #000", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: "12px", color: "#666" }}>
                <p style={{ margin: 0 }}>* This is a computer-generated invoice and does not require a physical signature.</p>
                <p style={{ margin: "5px 0 0 0" }}>* Confidential Medical Record - For authorized personnel only.</p> 
              </div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                Authorized Signatory
              </div>
            </div>

          </div>

          <div style={{ marginTop: "20px" }}>
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
        </div>
      )}
    </div>
  );
};

export default Billing;