import React from "react";
import {
  Video,
  FileText,
  Mic
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#050816",
        color: "#fff",
        padding: "80px 7%",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1.5fr",
          gap: "50px",
          paddingBottom: "60px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Video size={22} color="#fff" />
            </div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              IntellMeet
            </h2>
          </div>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.9",
              fontSize: "16px",
              marginBottom: "35px",
            }}
          >
            AI-powered meetings that help teams collaborate smarter,
            save time, and achieve more.
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div style={featureStyle}>
              <div style={iconStyle}>
                <FileText size={16} />
              </div>
              <span>AI Meeting Summaries</span>
            </div>

            <div style={featureStyle}>
              <div style={iconStyle}>
                <Mic size={16} />
              </div>
              <span>Smart Notes & Insights</span>
            </div>

            <div style={featureStyle}>
              <div style={iconStyle}>
                <Video size={16} />
              </div>
              <span>Record & Share Meetings</span>
            </div>
          </div>
        </div>

        {/* Product */}
        <div>
          <h2 style={{marginBottom:"30px"}}>Product</h2>

          <div style={linkContainer}>
            <a href="#" style={linkStyle}>Features</a>
            <a href="#" style={linkStyle}>How it Works</a>
            <a href="#" style={linkStyle}>Pricing</a>
            <a href="#" style={linkStyle}>Integrations</a>
            <a href="#" style={linkStyle}>Changelog</a>
            <a href="#" style={linkStyle}>Roadmap</a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h2 style={{marginBottom:"30px"}}>Company</h2>

          <div style={linkContainer}>
            <a href="#" style={linkStyle}>About Us</a>
            <a href="#" style={linkStyle}>Blog</a>
            <a href="#" style={linkStyle}>Careers</a>
            <a href="#" style={linkStyle}>Press Kit</a>
            <a href="#" style={linkStyle}>Contact Us</a>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 style={{marginBottom:"30px"}}>Resources</h2>

          <div style={linkContainer}>
            <a href="#" style={linkStyle}>Help Center</a>
            <a href="#" style={linkStyle}>Guides</a>
            <a href="#" style={linkStyle}>API Docs</a>
            <a href="#" style={linkStyle}>Privacy Policy</a>
            <a href="#" style={linkStyle}>Terms of Service</a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h2 style={{marginBottom:"20px"}}>Stay in the loop</h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.8",
              marginBottom: "28px",
            }}
          >
            Subscribe to our newsletter for the latest updates and tips.
          </p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "40px",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "#fff",
                outline: "none",
                fontSize: "15px",
              }}
            />

            <button
              style={{
                padding: "16px 28px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                color: "#fff",
                background:
                  "linear-gradient(135deg,#c084fc,#8b5cf6)",
              }}
            >
              Subscribe
            </button>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          paddingTop: "35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <p
          style={{
            color: "#94a3b8",
            fontSize: "15px",
          }}
        >
          © 2026 IntellMeet.<br/> All rights reserved.
          made with care.
        </p>

        <div
          style={{
            display: "flex",
            gap: "30px",
          }}
        >
          <a href="#" style={bottomLink}>
            Privacy Policy
          </a>

          <a href="#" style={bottomLink}>
            Terms of Service
          </a>

          <a href="#" style={bottomLink}>
            Cookies Settings
          </a>
        </div>
      </div>
    </footer>
  );
}

const headingStyle = {
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "30px",
};

const linkContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "22px",
};

const linkStyle = {
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: "16px",
  transition: "0.3s",
};

const bottomLink = {
  color: "#94a3b8",
  textDecoration: "none",
  fontSize: "15px",
};

const featureStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  color: "#cbd5e1",
  fontSize: "16px",
};

const iconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#c084fc,#8b5cf6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};