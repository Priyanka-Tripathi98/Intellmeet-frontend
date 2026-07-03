import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:3001/login",
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
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0 20px 0', marginLeft:'60px'}}>
          <div className="logo-icon" style={{ 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
            padding: '6px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
            </svg>
          </div>
          <h2 className="logo" style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', color: '#ffffff' }}>
            Intell<span style={{ fontWeight: '500', color: '#94a3b8' }}>Meet</span>
          </h2>
        </div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue 👇</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" name="email" placeholder="Enter you email"
              value={form.email}
              onChange={handleChange}
              required
            />
           
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <Link to="/forgot-password" className="forgot-link" style={{textDecoration: "none",color: "#667eea", 
            marginRight:"200px", fontSize:"14px"}}>
          Forgot Password?</Link>

          <button type="submit" className="btn">
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