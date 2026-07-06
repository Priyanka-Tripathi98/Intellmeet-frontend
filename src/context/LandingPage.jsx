import React, { useState, useEffect } from "react";
import Navbar from "../context/Navbar";
import Features from "../context/Features";
import HowItWorks from "../context/HowItWorks";
import Pricing from "../context/Pricing";
import About from "../context/About";
import Footer from "../context/Footer";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react"; // Imported clean theme switcher icons

export default function LandingPage() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // Theme state initialized from localStorage memory preference fallback to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Write theme modifications out to localStorage persistence memory bank
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextTheme = !prev;
      localStorage.setItem("theme", nextTheme ? "dark" : "light");
      return nextTheme;
    });
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Dynamic Theme Styling Variables
  const theme = {
    bg: isDarkMode ? "#03040b" : "#f8fafc",
    text: isDarkMode ? "#ffffff" : "#0f172a",
    textMuted: isDarkMode ? "#94a3b8" : "#475569",
    cardBg: isDarkMode ? "rgba(9, 12, 26, 0.95)" : "rgba(255, 255, 255, 0.85)",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
    shadow: isDarkMode ? "rgba(0, 0, 0, 0.6)" : "rgba(148, 163, 184, 0.15)",
    mockupBg: isDarkMode ? "#0b1120" : "#f1f5f9",
    badgeBg: isDarkMode ? "rgba(124, 58, 237, 0.14)" : "rgba(124, 58, 237, 0.08)",
    secondaryBtnBg: isDarkMode ? "transparent" : "#ffffff",
    secondaryBtnBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        minHeight: "100vh",
        color: theme.text,
        fontFamily: "Poppins, sans-serif",
        overflowX: "hidden",
        position: "relative",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Pass down theme configurations to parent navigation bars */}
      <Navbar theme={isDarkMode ? "dark" : "light"} />

      {/* FIXED THEME TOGGLE FLOATING ACTION BUTTON */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme Mode"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: isDarkMode ? "#ffffff" : "#0f172a",
          color: isDarkMode ? "#0f172a" : "#ffffff",
          border: "none",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "transform 0.2s ease, background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>

      {/* BACKGROUND GLOWS (Hidden or toned down in light mode for proper visibility) */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: isMobile ? "250px" : "500px", height: isMobile ? "250px" : "500px", background: isDarkMode ? "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)" : "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-10%", width: isMobile ? "250px" : "500px", height: isMobile ? "250px" : "500px", background: isDarkMode ? "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)" : "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />

      {/* HERO CONTAINER */}
      <main
        style={{
          padding: isMobile ? "100px 16px 60px" : "130px 5% 100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* MAIN CARD */}
        <div
          style={{
            maxWidth: "1450px",
            margin: "0 auto",
            borderRadius: isMobile ? "20px" : "34px",
            overflow: "hidden",
            border: `1px solid ${theme.cardBorder}`,
            background: theme.cardBg,
            backdropFilter: "blur(20px)",
            boxShadow: `0 30px 80px ${theme.shadow}`,
            padding: isMobile ? "16px" : "28px",
            position: "relative",
            transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {/* CENTER PURPLE GLOW */}
          {!isMobile && isDarkMode && (
            <div style={{ position: "absolute", width: "450px", height: "450px", background: "#7c3aed", filter: "blur(130px)", opacity: "0.25", bottom: "-180px", left: "35%", zIndex: 0 }} />
          )}

          <div
            style={{
              display: "flex",
              gap: "22px",
              position: "relative",
              zIndex: 1,
              flexDirection: (isMobile || isTablet) ? "column" : "row",
            }}
          >
            {/* LEFT SIDE */}
            <div
              style={{
                flex: "1.1",
                padding: isMobile ? "10px 5px" : "30px 15px",
              }}
            >
              {/* BADGE */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "999px",
                  background: theme.badgeBg,
                  border: "1px solid rgba(124,58,237,0.25)",
                  color: isDarkMode ? "#d8b4fe" : "#6d28d9",
                  fontSize: "13px",
                  marginBottom: isMobile ? "20px" : "35px",
                  fontWeight: "500",
                }}
              >
                ✨ AI Powered Meetings
              </div>

              {/* HEADING */}
              <h1
                style={{
                  fontSize: isMobile ? "36px" : isTablet ? "54px" : "72px",
                  lineHeight: "1.1",
                  fontWeight: "800",
                  marginBottom: "22px",
                  color: theme.text,
                  letterSpacing: isMobile ? "-1px" : "-2px",
                }}
              >
                Smart Meetings.
                <br />
                <span style={{ background: "linear-gradient(135deg,#c084fc,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Better Decisions.
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p
                style={{
                  color: theme.textMuted,
                  lineHeight: "1.7",
                  maxWidth: "580px",
                  marginBottom: "34px",
                  fontSize: isMobile ? "15px" : "17px",
                }}
              >
                IntellMeet brings your team together with AI summaries, real-time collaboration, HD video meetings, and seamless productivity tools.
              </p>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginBottom: "38px",
                }}
              >
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", padding: "16px 28px", borderRadius: "14px", color: "white", fontWeight: "600", cursor: "pointer", fontSize: "15px", flex: isMobile ? "1" : "none", minWidth: isMobile ? "100%" : "auto", boxShadow: "0 10px 30px rgba(124,58,237,0.35)" }}>
                    Get Started Free
                  </button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button style={{ background: theme.secondaryBtnBg, border: `1px solid ${theme.secondaryBtnBorder}`, padding: "16px 28px", borderRadius: "14px", color: theme.text, fontWeight: "500", cursor: "pointer", fontSize: "15px", flex: isMobile ? "1" : "none", minWidth: isMobile ? "100%" : "auto", boxShadow: !isDarkMode ? "0 4px 12px rgba(0,0,0,0.05)" : "none" }}>
                    ▶ Watch Demo
                  </button>
                </Link>
              </div>

              {/* REUSABLE MINIMAL BADGES */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  color: theme.textMuted,
                  fontSize: "13px",
                }}
              >
                <span>🎥 HD Video</span>
                <span>🤖 AI Summaries</span>
                <span>💬 Chat</span>
                <span>🖥️ Screen Share</span>
              </div>
            </div>

            {/* RIGHT SIDE (VIDEO MOCKUP) */}
            <div
              style={{
                flex: "1",
                background: theme.mockupBg,
                borderRadius: "26px",
                padding: isMobile ? "12px" : "20px",
                border: `1px solid ${theme.cardBorder}`,
                marginTop: isMobile ? "20px" : "0",
                transition: "background 0.3s ease, border-color 0.3s ease",
              }}
            >
              {/* TOP BAR */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#facc15" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
                </div>
                <p style={{ color: theme.textMuted, fontSize: "13px", margin: 0 }}>Weekly Team Meeting</p>
              </div>

              {/* VIDEO GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "12px",
                }}
              >
                {[
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                ].map((img, i) => (
                  <div key={i} style={{ position: "relative", overflow: "hidden", borderRadius: "18px", height: isMobile ? "140px" : "160px" }}>
                    <img src={img} alt="user" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.55)", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", color: "#ffffff" }}>
                      Participant
                    </div>
                  </div>
                ))}
              </div>

              {/* CONTROLS */}
              <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "10px" : "16px", marginTop: "24px" }}>
                {["🎤", "📹", "💬", "📞"].map((icon, index) => (
                  <button
                    key={index}
                    style={{
                      width: isMobile ? "46px" : "54px",
                      height: isMobile ? "46px" : "54px",
                      borderRadius: "50%",
                      border: "none",
                      background: icon === "📞" ? "#ef4444" : isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
                      color: isDarkMode ? "white" : "#0f172a",
                      fontSize: isMobile ? "16px" : "20px",
                      cursor: "pointer",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sub-sections inherit context mode values directly */}
      <Features currentTheme={isDarkMode ? "dark" : "light"} />
      <HowItWorks currentTheme={isDarkMode ? "dark" : "light"} />
      <Pricing currentTheme={isDarkMode ? "dark" : "light"} />
      <About currentTheme={isDarkMode ? "dark" : "light"} />
      <Footer currentTheme={isDarkMode ? "dark" : "light"} />
    </div>
  );
}