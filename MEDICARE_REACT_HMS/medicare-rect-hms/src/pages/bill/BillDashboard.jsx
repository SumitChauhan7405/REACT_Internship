import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/bill-dashboard.css";

const BillDashboard = () => {

    const navigate = useNavigate();

    const [bills, setBills] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        const [billRes, paymentRes] = await Promise.all([
            axios.get("http://localhost:5000/bills"),
            axios.get("http://localhost:5000/payments")
        ]);

        setBills(billRes.data);
        setPayments(paymentRes.data);

    };

    /* ===============================
       KPI CALCULATIONS
    =============================== */

    const totalBills = bills.length;
    const paidBills = bills.filter(b => b.status === "PAID").length;
    const pendingBills = bills.filter(b => b.status !== "PAID").length;

    const totalRevenue = payments.reduce(
        (sum, p) => sum + Number(p.amount), 0
    );

    const today = new Date().toISOString().split("T")[0];

    const todayPayments = payments.filter(
        p => p.date === today
    );

    /* ===============================
       PAYMENT MODE SUMMARY
    =============================== */

    const cashPayments = payments.filter(p => p.mode === "Cash").length;
    const upiPayments = payments.filter(p => p.mode === "UPI").length;
    const cardPayments = payments.filter(p => p.mode === "Card").length;

    /* ===============================
       HIGHEST PENDING BILL
    =============================== */

    const highestPending = bills
        .filter(b => b.status !== "PAID")
        .sort((a, b) => b.remainingAmount - a.remainingAmount)[0];

    return (
        <div className="bill-dashboard-page">

            <h3 className="bill-page-title">Billing Dashboard</h3>

            {/* KPI CARDS */}

            <div className="bill-dashboard-cards">

                {[
                    ["Total Bills", totalBills, "bi-receipt"],
                    ["Paid Bills", paidBills, "bi-cash-coin"],
                    ["Pending Bills", pendingBills, "bi-exclamation-circle"],
                    ["Today's Payments", todayPayments.length, "bi-calendar-check"],
                    ["Total Revenue", `₹${totalRevenue}`, "bi-graph-up"]
                ].map(([title, value, icon], i) => (

                    <div className="bill-dashboard-card" key={i}>

                        <div className="bill-card-info">

                            <span className="bill-card-title">{title}</span>

                            <h2>{value}</h2>

                        </div>

                        <div className="bill-card-icon">

                            <i className={`bi ${icon}`}></i>

                        </div>

                    </div>

                ))}

            </div>

            {/* PAYMENT MODE SUMMARY */}

            <div className="bill-payment-summary">

                <div className="bill-summary-card">
                    <span>Cash Payments</span>
                    <h3>{cashPayments}</h3>
                </div>

                <div className="bill-summary-card">
                    <span>UPI Payments</span>
                    <h3>{upiPayments}</h3>
                </div>

                <div className="bill-summary-card">
                    <span>Card Payments</span>
                    <h3>{cardPayments}</h3>
                </div>

            </div>

            {/* ACTIVITY PANELS */}

            <div className="bill-dashboard-activity">

                {/* RECENT PAYMENTS */}

                <div className="bill-activity-card">

                    <h4>Recent Payments</h4>

                    <table>

                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Patient</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {payments.slice(-5).reverse().map(p => (

                                <tr key={p.id}>

                                    <td>{p.id}</td>

                                    <td>{p.patientName}</td>

                                    <td>₹{p.amount}</td>

                                    <td>{p.mode}</td>

                                    <td>{p.date}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {/* TOP PENDING BILLS */}

                <div className="bill-activity-card">

                    <h4>Top Pending Bills</h4>

                    <table>

                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Patient</th>
                                <th>Total</th>
                                <th>Remaining</th>
                            </tr>
                        </thead>

                        <tbody>

                            {bills
                                .filter(b => b.status !== "PAID")
                                .slice(0, 5)
                                .map(bill => (

                                    <tr key={bill.id}>

                                        <td>{bill.id}</td>

                                        <td>{bill.patientName}</td>

                                        <td>₹{bill.totalAmount}</td>

                                        <td className="bill-remaining">

                                            ₹{bill.remainingAmount}

                                        </td>

                                    </tr>

                                ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* HIGHEST PENDING BILL ALERT */}

            {highestPending && (

                <div className="bill-highlight-card">

                    <div className="bill-highlight-icon">
                        <i className="bi bi-receipt"></i>
                    </div>

                    <div className="bill-highlight-content">

                        <span className="bill-highlight-title">
                            Highest Pending Bill
                        </span>

                        <h3>Patient Name : {highestPending.patientName}</h3>

                        <p className="bill-highlight-amount">
                            Outstanding Amount: ₹{highestPending.remainingAmount}
                        </p>

                    </div>

                </div>

            )}

            {/* QUICK ACTIONS */}

            <div className="bill-quick-actions">

                <button
                    className="bill-action-btn"
                    onClick={() => navigate("/bill/billing")}
                >
                    View All Bills
                </button>

                <button
                    className="bill-action-btn secondary"
                    onClick={() => navigate("/bill/billing")}
                >
                    Add Payment
                </button>

            </div>

        </div>
    );

};

export default BillDashboard;