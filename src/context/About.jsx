import React from "react";
import {
  SiGooglecalendar,
  SiSlack,
  SiZoom,
  SiDropbox,
  SiGoogledrive,
  SiNotion,
  SiTrello,
  SiJira,
  SiDiscord,
} from "react-icons/si";

function About({ darkMode = true }) {
  // Dynamic Theme Colors
  const bg = darkMode ? "#050816" : "#f1f5f9";
  const textPrimary = darkMode ? "white" : "#0f172a";
  const textSecondary = darkMode ? "#94a3b8" : "#475569";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const iconBoxBg = darkMode ? "#0f172a" : "#ffffff";
  const border = darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)";

  return (
    <section
      id="about"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: bg,
        color: textPrimary,
        padding: "100px 8%",
        display: "flex",
        flexDirection: "column",
        gap: "120px",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "60px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Content */}
        <div style={{ flex: "1", minWidth: "320px" }}>
          <p
            style={{
              color: "#8b5cf6",
              fontSize: "14px",
              letterSpacing: "2px",
              marginBottom: "18px",
              fontWeight: "600",
            }}
          >
            ABOUT US
          </p>

          <h1
            style={{
              fontSize: "52px",
              lineHeight: "1.2",
              marginBottom: "24px",
              fontWeight: "700",
              color: textPrimary,
            }}
          >
            Building the future of <br />
            <span
              style={{
                background: "linear-gradient(90deg,#a855f7,#6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              team collaboration
            </span>
          </h1>

          <p
            style={{
              color: textSecondary,
              fontSize: "16px",
              lineHeight: "1.9",
              maxWidth: "550px",
              marginBottom: "40px",
            }}
          >
            IntellMeet is an AI-powered meeting assistant that helps teams collaborate smarter with automatic meeting summaries, AI notes, recordings, and real-time insights.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontSize: "32px", color: "#8b5cf6" }}>10K+</h2>
              <p style={{ color: textSecondary }}>Teams</p>
            </div>

            <div>
              <h2 style={{ fontSize: "32px", color: "#8b5cf6" }}>500K+</h2>
              <p style={{ color: textSecondary }}>Meetings</p>
            </div>

            <div>
              <h2 style={{ fontSize: "32px", color: "#8b5cf6" }}>99.9%</h2>
              <p style={{ color: textSecondary }}>Uptime</p>
            </div>
          </div>
        </div>

        {/* Right Image Container */}
        <div
          style={{
            flex: "1",
            minWidth: "320px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Team Collaboration"
            style={{
              width: "100%",
              maxWidth: "550px",
              borderRadius: "28px",
              objectFit: "cover",
              boxShadow: "0 0 40px rgba(139,92,246,0.25)",
              border: border,
            }}
          />
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <p
          style={{
            color: "#8b5cf6",
            fontSize: "14px",
            letterSpacing: "2px",
            marginBottom: "18px",
            fontWeight: "600",
          }}
        >
          TESTIMONIALS
        </p>

        <h2 style={{ fontSize: "48px", marginBottom: "60px", color: textPrimary }}>
          Loved by teams <br />
          <span style={{ color: "#8b5cf6" }}>around the world.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              text: "IntellMeet completely changed how our remote team collaborates.",
              name: "Sarah Johnson",
              role: "Product Manager",
            },
            {
              text: "The AI summaries save hours every week. Amazing tool.",
              name: "David Lee",
              role: "Startup Founder",
            },
            {
              text: "Clean UI and powerful AI features improved productivity instantly.",
              name: "Emily Carter",
              role: "Team Lead",
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                background: cardBg,
                border: border,
                padding: "32px",
                borderRadius: "24px",
                textAlign: "left",
                backdropFilter: "blur(10px)",
              }}
            >
              <p style={{ color: textSecondary, marginBottom: "24px" }}>
                “{t.text}”
              </p>
              <h4 style={{ color: textPrimary }}>{t.name}</h4>
              <p style={{ color: "#8b5cf6", fontSize: "14px" }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* INTEGRATIONS */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <p
          style={{
            color: "#8b5cf6",
            fontSize: "14px",
            letterSpacing: "2px",
            marginBottom: "18px",
            fontWeight: "600",
          }}
        >
          INTEGRATIONS
        </p>

        <h2 style={{ fontSize: "48px", marginBottom: "10px", color: textPrimary }}>
          Work with your <br />
          <span style={{ color: "#8b5cf6" }}>favourite tools.</span>
        </h2>

        <p style={{ color: textSecondary, marginBottom: "40px" }}>
          Seamlessly connect IntellMeet with the tools your team already uses.
        </p>

        {/* ICON GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
            gap: "20px",
            justifyItems: "center",
          }}
        >
          {[
            { Icon: SiSlack, name: "Slack", color: "#4A154B" },
            { Icon: SiGooglecalendar, name: "Google Calendar", color: "#4285F4" },
            { Icon: SiZoom, name: "Zoom", color: "#2D8CFF" },
            { Icon: SiGoogledrive, name: "Google Drive", color: "#34A853" },
            { Icon: SiDropbox, name: "Dropbox", color: "#0061FF" },
            { Icon: SiNotion, name: "Notion", color: darkMode ? "#ffffff" : "#000000" },
            { Icon: SiTrello, name: "Trello", color: "#0052CC" },
            { Icon: SiJira, name: "Jira", color: "#2684FF" },
            { Icon: SiDiscord, name: "Discord", color: "#5865F2" },
          ].map(({ Icon, name, color }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "20px",
                  background: iconBoxBg,
                  border: border,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.3s",
                }}
              >
                <Icon size={34} color={color} />
              </div>

              <span style={{ fontSize: "12px", color: textSecondary }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;