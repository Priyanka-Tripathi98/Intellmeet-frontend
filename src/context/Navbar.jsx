import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  // State for responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for hover effects since inline pseudo-classes don't exist
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Reusable inline style configurations
  const linkStyle = (id) => ({
    padding: isMobile ? "12px 24px" : "6px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: hoveredLink === id ? "#ffffff" : "#94a3b8",
    backgroundColor: hoveredLink === id ? "rgba(255, 255, 255, 0.06)" : "transparent",
    borderRadius: "9999px",
    textDecoration: "none",
    transition: "all 0.2s ease",
    width: isMobile ? "100%" : "auto",
    textAlign: isMobile ? "center" : "left",
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
      backgroundColor: "rgba(6, 8, 22, 0.9)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: isMobile ? "12px 16px" : "16px 24px",
    }}>
      <div style={{
        margin: "0 auto",
        display: "flex",
        maxWidth: "1200px",
        alignItems: "center",
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
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff" }}>
            Intell<span style={{ color: "#818cf8", fontWeight: "600" }}>Meet</span>
          </span>
        </Link>

        {/* Mobile Burger Menu Button */}
        {isMobile && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ffffff",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        )}

        {/* Center Links (Desktop only, or Mobile when Menu is Open) */}
        {(!isMobile || isMobileMenuOpen) && (
          <nav style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: isMobile ? "transparent" : "rgba(255, 255, 255, 0.03)",
            border: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: isMobile ? "0" : "9999px",
            padding: isMobile ? "0" : "6px",
            position: isMobile ? "absolute" : "static",
            top: isMobile ? "60px" : "auto",
            left: isMobile ? 0 : "auto",
            width: isMobile ? "100%" : "auto",
            flexDirection: isMobile ? "column" : "row",
            background: isMobile ? "rgba(6, 8, 22, 0.98)" : "none",
            boxShadow: isMobile ? "0 20px 40px rgba(0,0,0,0.5)" : "none",
            gap: isMobile ? "8px" : "4px",
            paddingBottom: isMobile ? "20px" : "6px",
          }}>
            <Link to="/features" style={linkStyle("features")} onMouseEnter={() => setHoveredLink("features")} onMouseLeave={() => setHoveredLink(null)}>Features</Link>
            <Link to="/howitworks" style={linkStyle("howitworks")} onMouseEnter={() => setHoveredLink("howitworks")} onMouseLeave={() => setHoveredLink(null)}>How It Works</Link>
            <Link to="/pricing" style={linkStyle("pricing")} onMouseEnter={() => setHoveredLink("pricing")} onMouseLeave={() => setHoveredLink(null)}>Pricing</Link>
            <Link to="/about" style={linkStyle("about")} onMouseEnter={() => setHoveredLink("about")} onMouseLeave={() => setHoveredLink(null)}>About</Link>
            
            {/* Embed action buttons inside the mobile menu stack for small devices */}
            {isMobile && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "80%", marginTop: "16px" }}>
                <Link to="/login" style={{ fontSize: "14px", fontWeight: "500", color: "#cbd5e1", textDecoration: "none", textAlign: "center" }}>Login</Link>
                <Link to="/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", background: "linear-gradient(90deg, #7c3aed, #6366f1)", padding: "12px", fontSize: "14px", fontWeight: "600", color: "#ffffff", textDecoration: "none" }}>Get Started</Link>
              </div>
            )}
          </nav>
        )}

        {/* Action Buttons (Desktop only) */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link to="/login" style={{ fontSize: "14px", fontWeight: "500", color: isLoginHovered ? "#ffffff" : "#cbd5e1", textDecoration: "none", transition: "color 0.2s ease" }} onMouseEnter={() => setIsLoginHovered(true)} onMouseLeave={() => setIsLoginHovered(false)}>Login</Link>
            <Link to="/signup" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", background: "linear-gradient(90deg, #7c3aed, #6366f1)", padding: "10px 20px", fontSize: "14px", fontWeight: "600", color: "#ffffff", textDecoration: "none", boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)", transition: "all 0.2s ease", transform: isBtnHovered ? "scale(1.02)" : "scale(1)" }} onMouseEnter={() => setIsBtnHovered(true)} onMouseLeave={() => setIsBtnHovered(false)}>Get Started</Link>
          </div>
        )}

      </div>
    </header>
  );
}