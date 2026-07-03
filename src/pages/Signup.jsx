import React, { useState } from "react";
import axios from "axios";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
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
      const res = await axios.post("http://localhost:3001/users/", form);
      alert("Signup successful!");
      navigate("/login"); // redirect after signup
    } catch (error) {
      alert("Error signing up");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
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
        <h2>Create Account</h2>
        <p className="subtitle">Join us and get started 🚀</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
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

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;