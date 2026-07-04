import React, { useState, useEffect } from "react";
import Navbar from "../context/Navbar";
import Features from "../context/Features";
import HowItWorks from "../context/HowItWorks";
import Pricing from "../context/Pricing";
import About from "../context/About";
import Footer from "../context/Footer";

export default function LandingPage() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <div
      style={{
        backgroundColor: "#03040b",
        minHeight: "100vh",
        color: "#ffffff",
        fontFamily: "Poppins, sans-serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Navbar />

      {/* BACKGROUND GLOWS */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: isMobile ? "250px" : "500px", height: isMobile ? "250px" : "500px", background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 70%)", filter: "blur(90px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "0%", right: "-10%", width: isMobile ? "250px" : "500px", height: isMobile ? "250px" : "500px", background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />

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
            border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(9,12,26,0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            padding: isMobile ? "16px" : "28px",
            position: "relative",
          }}
        >
          {/* CENTER PURPLE GLOW */}
          {!isMobile && (
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
                  background: "rgba(124,58,237,0.14)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  color: "#d8b4fe",
                  fontSize: "13px",
                  marginBottom: isMobile ? "20px" : "35px",
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
                  color: "#94a3b8",
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
                <button style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", padding: "16px 28px", borderRadius: "14px", color: "white", fontWeight: "600", cursor: "pointer", fontSize: "15px", flex: isMobile ? "1" : "none", minWidth: isMobile ? "100%" : "auto", boxShadow: "0 10px 30px rgba(124,58,237,0.35)" }}>
                  Get Started Free
                </button>
                <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", padding: "16px 28px", borderRadius: "14px", color: "white", fontWeight: "500", cursor: "pointer", fontSize: "15px", flex: isMobile ? "1" : "none", minWidth: isMobile ? "100%" : "auto" }}>
                  ▶ Watch Demo
                </button>
              </div>

              {/* REUSABLE MINIMAL BADGES */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  color: "#94a3b8",
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
                background: "#0b1120",
                borderRadius: "26px",
                padding: isMobile ? "12px" : "20px",
                border: "1px solid rgba(255,255,255,0.06)",
                marginTop: isMobile ? "20px" : "0",
              }}
            >
              {/* TOP BAR */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#facc15" }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }} />
                </div>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>Weekly Team Meeting</p>
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
                    <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,0.45)", padding: "4px 8px", borderRadius: "6px", fontSize: "11px" }}>
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
                      background: icon === "📞" ? "#ef4444" : "rgba(255,255,255,0.08)",
                      color: "white",
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

      <Features />
      <HowItWorks />
      <Pricing />
      <About />
      <Footer />
    </div>
  );
}