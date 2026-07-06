import React, { useState } from "react";
import { UserPlus, Users, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks({ darkMode = true }) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  
  const steps = [
    {
      icon: <UserPlus size={28} />,
      number: "01",
      title: "Create a Meeting",
      desc: "Signup for free and setup your team in minutes.",
    },
    {
      icon: <Users size={28} />,
      number: "02",
      title: "Invite Your Team",
      desc: "Schedule or join meetings with your team.",
    },
    {
      icon: <FileText size={28} />,
      number: "03",
      title: "AI Takes Notes",
      desc: "Our AI records, transcribes, and summarizes automatically.",
    },
    {
      icon: <BarChart3 size={28} />,
      number: "04",
      title: "Get Insights",
      desc: "Review summaries, action items and insights to drive results.",
    },
  ];

  // Dynamic Theme Colors
  const bg = darkMode ? "#03040b" : "#f8fafc";
  const textPrimary = darkMode ? "#fff" : "#0f172a";
  const textSecondary = darkMode ? "#94a3b8" : "#475569";
  const numberColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const cardBg = darkMode 
    ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" 
    : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))";
  const border = darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)";

  return (
    <section
      id="howitworks"
      style={{
        padding: "120px 5%",
        background: bg,
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s ease",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          width: "450px",
          height: "450px",
          background: darkMode
            ? "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
          filter: "blur(90px)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p
            style={{
              color: "#a855f7",
              letterSpacing: "2px",
              fontWeight: "700",
              marginBottom: "18px",
            }}
          >
            HOW IT WORKS
          </p>

          <h2
            style={{
              fontSize: "56px",
              lineHeight: "1.1",
              fontWeight: "800",
              color: textPrimary,
              maxWidth: "850px",
              margin: "0 auto",
            }}
          >
            Simple workflow for
            <span
              style={{
                background: "linear-gradient(135deg,#c084fc,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}smarter collaboration
            </span>
          </h2>

          <p
            style={{
              color: textSecondary,
              marginTop: "24px",
              fontSize: "18px",
              lineHeight: "1.8",
              maxWidth: "700px",
              marginInline: "auto",
            }}
          >
            IntellMeet streamlines communication with AI-powered workflows designed for modern remote teams.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "28px",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                padding: "38px",
                borderRadius: "30px",
                background: cardBg,
                border: border,
                backdropFilter: "blur(18px)",
                transition: "0.35s ease",
                cursor: "pointer",
                boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.25)" : "0 10px 30px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.border = "1px solid rgba(168,85,247,0.35)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(124,58,237,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.border = border;
                e.currentTarget.style.boxShadow = darkMode ? "0 10px 30px rgba(0,0,0,0.25)" : "0 10px 30px rgba(0,0,0,0.05)";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg,#7c3aed,#6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "28px",
                  color: "#fff",
                  boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
                }}
              >
                {step.icon}
              </div>

              <h1
                style={{
                  fontSize: "58px",
                  fontWeight: "800",
                  color: numberColor,
                  marginBottom: "12px",
                  lineHeight: "1",
                }}
              >
                {step.number}
              </h1>

              <h3 style={{ fontSize: "26px", marginBottom: "16px", color: textPrimary }}>
                {step.title}
              </h3>

              <p style={{ color: textSecondary, lineHeight: "1.8", fontSize: "16px" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "50px",
          }}
        >
          <Link
            to="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              background: "linear-gradient(90deg, #7c3aed, #6366f1)",
              padding: "20px 40px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
              transform: isBtnHovered ? "translateY(-2px)" : "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}