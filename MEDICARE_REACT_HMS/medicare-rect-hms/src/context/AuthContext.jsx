import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { role, data }

  const login = async (email, password) => {
    // ✅ ADMIN LOGIN
    if (email === "admin123@medicare.com" && password === "admin@123") {
      const adminUser = { role: "admin", name: "Admin" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return adminUser;
    }

    // ✅ DOCTOR LOGIN
    const res = await axios.get("http://localhost:5000/doctors");
    const doctor = res.data.find(
      (doc) => doc.email === email && doc.password === password
    );

    if (doctor) {
      const doctorUser = { role: "doctor", data: doctor };
      setUser(doctorUser);
      localStorage.setItem("user", JSON.stringify(doctorUser));
      return doctorUser;
    }

    // ❌ INVALID
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
