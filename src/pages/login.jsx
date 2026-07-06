import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
  // Track window size for fine-tuned responsive elements if needed
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 480;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://intellmeet-backend-vufa.onrender.com/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      alert("Login successful 🎉🎉");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper" style={{ padding: "20px 12px" }}>
      <div 
        className="login-card" 
        style={{ 
          width: "100%", 
          maxWidth: "420px", 
          boxSizing: "border-box" 
        }}
      >
        {/* Brand / Logo Header */}
        <div 
          className="logo-container" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "10px", 
            padding: "10px 0 20px 0",
            margin: "0 auto"
          }}
        >
          <div 
            className="logo-icon" 
            style={{ 
              background: "linear-gradient(135deg, #6366f1, #a855f7)", 
              padding: "6px", 
              borderRadius: "8px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
            </svg>
          </div>
          <h2 className="logo" style={{ margin: 0, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px", color: "#ffffff" }}>
            Intell<span style={{ fontWeight: "500", color: "#94a3b8" }}>Meet</span>
          </h2>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue 👇</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div className="input-group" style={{ width: "100%", boxSizing: "border-box" }}>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div className="input-group" style={{ width: "100%", boxSizing: "border-box" }}>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          {/* Flexible Alignment Container replaces strict marginRight wrapper layout */}
          <div style={{ width: "100%", textAlign: "left", marginBottom: "20px" }}>
            <Link 
              to="/forgot-password" 
              className="forgot-link" 
              style={{
                textDecoration: "none",
                color: "#667eea", 
                fontSize: "14px",
                display: "inline-block"
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn" style={{ width: "100%", boxSizing: "border-box" }}>
            Login
          </button>
        </form>

        <p className="bottom-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;