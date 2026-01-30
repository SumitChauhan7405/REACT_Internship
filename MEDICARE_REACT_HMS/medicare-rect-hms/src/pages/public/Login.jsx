import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/login.css"; // ✅ IMPORTANT

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await login(email, password);

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    /* ===============================
       ROLE BASED REDIRECT
    =============================== */
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "doctor") {
      navigate("/doctor/dashboard");
    } else if (user.role === "lab") {
      navigate("/lab/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h4>Login</h4>
        <p>Access your MediCare account</p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
