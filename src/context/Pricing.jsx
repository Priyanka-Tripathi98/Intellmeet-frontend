import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing({ darkMode = true }) {
  const plans = [
    {
      title: "Starter",
      price: "Free",
      desc: "Perfect for individuals and small teams.",
      features: [
        "HD Video Meetings",
        "AI Meeting Notes",
        "Unlimited Chats",
        "Basic Analytics",
      ],
      button: "Get Started",
      highlight: false,
    },
    {
      title: "Pro",
      price: "$19",
      desc: "Advanced collaboration for growing teams.",
      features: [
        "Everything in Starter",
        "AI Summaries",
        "Meeting Recordings",
        "Team Collaboration",
        "Priority Support",
      ],
      button: "Start Free Trial",
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      desc: "Built for large organizations & security.",
      features: [
        "Custom Integrations",
        "Advanced Security",
        "Dedicated Support",
        "Unlimited Storage",
        "Enterprise Analytics",
      ],
      button: "Contact Sales",
      highlight: false,
    },
  ];

  // Dynamic Theme Colors
  const bg = darkMode ? "#03040b" : "#f8fafc";
  const textPrimary = darkMode ? "#fff" : "#0f172a";
  const textSecondary = darkMode ? "#94a3b8" : "#475569";
  const textFeatures = darkMode ? "#cbd5e1" : "#334155";
  
  const standardCardBg = darkMode 
    ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" 
    : "linear-gradient(180deg, rgba(255,255,255,1), rgba(241,245,249,0.5))";
    
  const highlightedCardBg = darkMode
    ? "linear-gradient(180deg, rgba(124,58,237,0.22), rgba(99,102,241,0.08))"
    : "linear-gradient(180deg, rgba(124,58,237,0.08), rgba(99,102,241,0.03))";

  const standardBorder = darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)";
  const highlightedBorder = "1px solid rgba(168,85,247,0.45)";

  return (
    <section
      id="pricing"
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
          left: "-10%",
          width: "400px",
          height: "400px",
          background: darkMode
            ? "radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)"
            : "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
          filter: "blur(80px)",
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
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "18px",
            }}
          >
            PRICING
          </p>

          <h2
            style={{
              fontSize: "56px",
              lineHeight: "1.1",
              fontWeight: "800",
              color: textPrimary,
            }}
          >
            Flexible plans for every
            <span
              style={{
                background: "linear-gradient(135deg,#c084fc,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}modern team
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
            Choose a plan that fits your workflow and scale your meetings with AI-powered collaboration.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "30px",
          }}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                padding: "40px",
                borderRadius: "30px",
                background: plan.highlight ? highlightedCardBg : standardCardBg,
                border: plan.highlight ? highlightedBorder : standardBorder,
                backdropFilter: "blur(18px)",
                transition: "0.35s ease",
                boxShadow: plan.highlight
                  ? "0 20px 50px rgba(124,58,237,0.25)"
                  : (darkMode ? "0 10px 30px rgba(0,0,0,0.25)" : "0 10px 30px rgba(0,0,0,0.04)"),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              <h3 style={{ fontSize: "28px", color: textPrimary, marginBottom: "10px" }}>
                {plan.title}
              </h3>

              <p style={{ color: textSecondary, marginBottom: "28px", lineHeight: "1.7" }}>
                {plan.desc}
              </p>

              <div style={{ marginBottom: "35px" }}>
                <span style={{ fontSize: "54px", fontWeight: "800", color: textPrimary }}>
                  {plan.price}
                </span>

                {plan.price !== "Free" && plan.price !== "Custom" && (
                  <span style={{ color: textSecondary, fontSize: "18px" }}>
                    /month
                  </span>
                )}
              </div>

              {/* Features Breakdown */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  marginBottom: "40px",
                }}
              >
                {plan.features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#7c3aed,#6366f1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={14} />
                    </div>

                    <p style={{ color: textFeatures, fontSize: "15px" }}>
                      {feature}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    background: plan.highlight
                      ? "linear-gradient(90deg,#7c3aed,#6366f1)"
                      : (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                    color: plan.highlight ? "#fff" : textPrimary,
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "0.3s ease",
                    boxShadow: plan.highlight ? "0 10px 30px rgba(124,58,237,0.35)" : "none",
                  }}
                >
                  {plan.button}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}