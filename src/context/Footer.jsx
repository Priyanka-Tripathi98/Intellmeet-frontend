import React, { useState, useEffect } from "react";
import { Video, FileText, Mic } from "lucide-react";
import emailjs from "@emailjs/browser"; // 1. Import EmailJS

export default function Footer() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [email, setEmail] = useState(""); // 2. State for input tracking
  const [loading, setLoading] = useState(false); // 3. State for submission loading spinner/disable

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Determine grid layout dynamically based on screen size
  const getGridTemplateColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "1fr 1fr";
    return "1.4fr 1fr 1fr 1fr 1.5fr"; // Desktop layout
  };

  // 4. Handle newsletter form submission via EmailJS
  const handleSubscribe = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      subscriber_email: email, // This must match your target {{subscriber_email}} variable in the EmailJS panel template
    };

    emailjs
      .send(
        "service_dhyhuag",
        "template_1x5r6gl",
        templateParams,
        "vG69igiSI3mR8BND-"
      )
      .then((response) => {
        alert("🎉 Successfully subscribed! Check your inbox.");
        setEmail(""); // Reset input field on complete success
      })
      .catch((err) => {
        console.error("EmailJS Submission Error:", err);
        alert("Something went wrong. Please check your credentials and try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <footer
      style={{
        background: "#050816",
        color: "#fff",
        padding: isMobile ? "60px 20px" : "80px 7%",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: getGridTemplateColumns(),
          gap: isMobile ? "40px" : "50px",
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

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
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
            AI-powered meetings that help teams collaborate smarter, save time,
            and achieve more.
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
          <h2 style={headingStyle}>Product</h2>
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
          <h2 style={headingStyle}>Company</h2>
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
          <h2 style={headingStyle}>Resources</h2>
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
          <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px", marginTop: 0 }}>
            Stay in the loop
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.8",
              marginBottom: "28px",
            }}
          >
            Subscribe to our newsletter for the latest updates and tips.
          </p>

          {/* 5. Converted wrapper <div> to a <form> element */}
          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "14px",
              marginBottom: "40px",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                color: "#fff",
                outline: "none",
                fontSize: "15px",
                width: isMobile ? "100%" : "auto",
                boxSizing: "border-box",
              }}
            />

            {/* 6. Hooked button up to submission handling & tracking states */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "16px 28px",
                borderRadius: "12px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontWeight: "600",
                color: "#fff",
                background: "linear-gradient(135deg,#c084fc,#8b5cf6)",
                width: isMobile ? "100%" : "auto",
              }}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Subfooter */}
      <div
        style={{
          paddingTop: "35px",
          display: "flex",
          flexDirection: isMobile ? "column-reverse" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: "24px",
        }}
      >
        <p
          style={{
            color: "#94a3b8",
            fontSize: "15px",
            margin: 0,
            lineHeight: "1.6",
          }}
        >
          © 2026 IntellMeet. All rights reserved. <br />
          made with care.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "14px" : "30px",
          }}
        >
          <a href="#" style={bottomLink}>Privacy Policy</a>
          <a href="#" style={bottomLink}>Terms of Service</a>
          <a href="#" style={bottomLink}>Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}

// Inline constant styles
const headingStyle = {
  fontSize: "22px",
  fontWeight: "600",
  marginBottom: "30px",
  marginTop: 0,
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
  flexShrink: 0,
};