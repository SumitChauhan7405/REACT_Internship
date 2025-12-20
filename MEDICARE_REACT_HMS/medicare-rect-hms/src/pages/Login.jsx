import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate("/admin");
  };

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h2>Select Role</h2>

      <button onClick={() => handleLogin("admin")}>
        Login as Admin
      </button>

      <br /><br />

      <button onClick={() => handleLogin("doctor")}>
        Login as Doctor
      </button>
    </div>
  );
};

export default Login;
