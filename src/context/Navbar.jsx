import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  // State for hover effects since inline pseudo-classes don't exist
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  // Reusable inline style configurations
  const linkStyle = (id) => ({
    padding: "6px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: hoveredLink === id ? "#ffffff" : "#94a3b8",
    backgroundColor: hoveredLink === id ? "rgba(255, 255, 255, 0.06)" : "transparent",
    borderRadius: "9999px",
    textDecoration: "none",
    transition: "all 0.2s ease",
  });

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 50,
      width: "100%",
      boxSizing: "border-box",
      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      backgroundColor: "rgba(6, 8, 22, 0.75)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "16px 24px",
    }}>
      <div style={{
        margin: "0 auto",
        display: "flex",
        maxWidth: "1200px",
        alignItems: "center",
        justifyContent: "between",
        justifyContent: "space-between",
      }}>
        
        {/* Branding / Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ 
            background: "linear-gradient(135deg, #6366f1, #a855f7)", 
            padding: "8px", 
            borderRadius: "10px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
            </svg>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "700", trackingTight: "-0.025em", color: "#ffffff" }}>
            Intell<span style={{ color: "#818cf8", fontWeight: "600" }}>Meet</span>
          </span>
        </Link>

        {/* Center Links */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "9999px",
          padding: "6px",
        }}>
          <Link to="/features" 
            style={linkStyle("features")}
            onMouseEnter={() => setHoveredLink("features")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Features
          </Link>
          <Link to="/howitworks" 
            style={linkStyle("howitworks")}
            onMouseEnter={() => setHoveredLink("howitworks")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            How It Works
          </Link>
          <Link to="/pricing" 
            style={linkStyle("pricing")}
            onMouseEnter={() => setHoveredLink("pricing")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Pricing
          </Link>
          <Link to="/about" 
            style={linkStyle("about")}
            onMouseEnter={() => setHoveredLink("about")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            About
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link 
            to="/login" 
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: isLoginHovered ? "#ffffff" : "#cbd5e1",
              textDecoration: "none",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
          >
            Login
          </Link>
          
          <Link 
            to="/signup" 
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #7c3aed, #6366f1)",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
              transition: "all 0.2s ease",
              transform: isBtnHovered ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            Get Started
          </Link>
        </div>

      </div>
    </header>
  );
}