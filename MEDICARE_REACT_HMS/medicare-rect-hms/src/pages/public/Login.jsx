import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/login.css"; 

import medicareLogo from "../../assets/images/logo/MediCare_Logo.png";
import Doctor from "../../assets/images/media/Doctor.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = await login(email, password);

    if (!user) {
      setError("Invalid email or password");
      return;
    }

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
    <div className="medcore-login-page"> 
      <div className="container-fluid h-100 p-0">
        <div className="row g-0 h-100">
          
          {/* LEFT SIDE (Hidden on mobile) */}
          <div className="col-lg-6 d-none d-lg-block p-0">
            <div className="branding-section">
              <div className="bg-pattern"></div>
              <img 
                src={Doctor} 
                alt="Medical Background" 
                className="bg-image"
              />

              <div className="z-10">
                <div className="brand-header">
                  {/* Logo Image without white box */}
                  <img 
                    src={medicareLogo} 
                    alt="Medicare Hospital" 
                    className="brand-logo-img" 
                  />
                </div>
              </div>

              <div className="z-10">
                 <h1 className="hero-title">
                   The Future of <br />
                   <span className="highlight">Healthcare <br/>Management</span>
                 </h1>
                 <p className="hero-desc">
                   Secure, efficient, and reliable. Streamline patient care and administrative workflows with our next-gen hospital ERP.
                 </p>
              </div>

              <div className="z-10 brand-footer">
                <div className="cert-item">
                  <span className="material-symbols-outlined">verified_user</span>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="cert-item">
                  <span className="material-symbols-outlined">lock</span>
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: LOGIN FORM */}
          <div className="col-lg-6 col-12 p-0">
            <div className="login-section">
              <div className="login-container">
                
                {/* Mobile Header */}
                <div className="d-lg-none mobile-header">
                   <div className="mobile-logo-box">
                      <span className="material-symbols-outlined">local_hospital</span>
                   </div>
                   <h3 className="mobile-brand-title">MediCare ERP</h3>
                </div>

                <div className="form-header-desktop">
                  <h2>Welcome back!</h2>
                  <p>Please enter your credentials to access the MediCare-HMS dashboard.</p>
                </div>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon material-symbols-outlined">mail</span>
                      <input
                        id="email"
                        type="email"
                        className="custom-input"
                        placeholder="name@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <span className="input-icon material-symbols-outlined">key</span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="custom-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="actions-row">
                    <div className="d-flex align-items-center">
                      <input className="custom-checkbox" type="checkbox" id="rememberMe" />
                      <label className="checkbox-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <a href="/login" className="forgot-link">Forgot Password?</a>
                  </div>

                  <button type="submit" className="submit-btn">
                    <span>Log In</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </form>

                {/* Divider */}
                <div className="divider-container">
                  <div className="divider-line">
                    <div></div>
                  </div>
                  <div className="divider-text-wrapper">
                    <span className="divider-text">Support Options</span>
                  </div>
                </div>

                {/* Support Links */}
                <div className="support-options">
                  <a href="/login" className="support-link">
                    <span className="material-symbols-outlined">help</span>
                    Help Center
                  </a>
                  <a href="/login" className="support-link">
                    <span className="material-symbols-outlined">support_agent</span>
                    Contact IT
                  </a>
                </div>

                <div className="copyright">
                  © 2026 MediCare Systems. All rights reserved.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;