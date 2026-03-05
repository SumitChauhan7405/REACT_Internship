import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     RESTORE USER ON REFRESH
  =============================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /* ===============================
   LOGIN
=============================== */
  const login = async (email, password) => {

    // 🔹 ADMIN
    if (email === "admin123@medicare.com" && password === "admin@123") {
      const adminUser = { role: "admin", name: "Admin" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return adminUser;
    }

    // 🔹 LAB
    if (email === "lab@medicare.com" && password === "lab@123") {
      const labUser = { role: "lab", name: "Lab Technician" };
      setUser(labUser);
      localStorage.setItem("user", JSON.stringify(labUser));
      return labUser;
    }

    // 🔹 BILLING
    if (email === "bill@medicare.com" && password === "bill@123") {
      const billUser = { role: "bill", name: "Billing Staff" };
      setUser(billUser);
      localStorage.setItem("user", JSON.stringify(billUser));
      return billUser;
    }

    // 🔹 DOCTOR
    const res = await axios.get("http://localhost:5000/doctors");

    /* ✅ NEW: normalize email for safety */
    const normalizedEmail = email.toLowerCase();

    const doctor = res.data.find(
      (doc) =>
        doc.email.toLowerCase() === normalizedEmail &&
        doc.password === password
    );

    if (doctor) {
      const doctorUser = { role: "doctor", data: doctor };
      setUser(doctorUser);
      localStorage.setItem("user", JSON.stringify(doctorUser));
      return doctorUser;
    }

    return null;
  };

  /* ===============================
     LOGOUT
  =============================== */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
