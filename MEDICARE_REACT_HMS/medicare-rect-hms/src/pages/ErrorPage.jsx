import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/pages/error-page.css";
import medicareLogo from "../assets/images/logo/MediCare_Plus_Logo.png";

const ErrorPage = () => {
  return (
    <div className="medicare-error-page">
      {/* Header */}
      <header>
        <div className="header-content">
          <img
            src={medicareLogo}
            alt="Medicare Logo"
            className="header-logo-img"
          />
          <h1>
            MediCare <span>HMS</span>
          </h1>
        </div>
        <p className="header-tagline">Your Health, Our Promise</p>
      </header>

      {/* Main Content */}
      <main>
        <div className="content-grid">
          
          {/* Illustration Side */}
          <div className="illustration-container">
            <div className="illustration-circle">
              <div className="icon-split-layout">
                {/* Left Icon (Lock) */}
                <div className="icon-left">
                  <div className="icon-wrapper">
                    <div className="glow-effect"></div>
                    <span className="material-icons large-icon icon-lock">lock</span>
                    <div className="code-badge badge-right">
                      <span>403</span>
                    </div>
                  </div>
                </div>

                {/* Center Line */}
                <div className="split-line"></div>

                {/* Right Icon (Search) */}
                <div className="icon-right">
                  <div className="icon-wrapper">
                    <div className="glow-effect"></div>
                    <span className="material-icons large-icon icon-search">search</span>
                    <div className="code-badge badge-left">
                      <span>404</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Side */}
          <div className="text-content">
            <h2>Access Issue or Page Missing</h2>
            <p>
              Oops! It seems you've either lost your way or you don't have the
              required permissions to access this area. Please check the URL or
              contact your administrator if you believe this is an error.
            </p>
            <Link to="/login" className="gradient-btn">
              <span className="material-icons btn-icon">login</span>
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p className="copyright">
          © 2026 Medicare Hospital Management System. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default ErrorPage;