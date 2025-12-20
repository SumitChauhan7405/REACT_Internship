import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(
    localStorage.getItem("role") || null
  );

  const login = (selectedRole) => {
    localStorage.setItem("role", selectedRole);
    setRole(selectedRole);
  };

  const logout = () => {
    localStorage.removeItem("role");
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
