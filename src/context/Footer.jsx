import React, { useState, useEffect } from "react";
import { Video, FileText, Mic, ChevronDown, ChevronUp, Sun, Moon } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function Footer() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 1. Theme state: controls colors dynamically
  const [isDark, setIsDark] = useState(true);

  const [openSections, setOpenSections] = useState({
    product: false,
    company: false,
    resources: false,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isCollapsible = windowWidth < 1024;

  const getGridTemplateColumns = () => {
    if (isMobile) return "1fr";
    if (isTablet) return "1fr 1fr";
    return "1.4fr 1fr 1fr 1fr 1.5fr";
  };

  const toggleSection = (section) => {
    if (!isCollapsible) return;
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      subscriber_email: email,
    };

    emailjs
      .send("service_dhyhuag", "template_1x5r6gl", templateParams, "vG69igiSI3mR8BND-")
      .then(() => {
        alert("🎉 Successfully subscribed!");
        setEmail("");
      })
      .catch((err) => {
        console.error("EmailJS Submission Error:", err);
        alert("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 2. Dynamic Theme Variables based on `isDark`
  const themeBg = isDark ? "#050816" : "#ffffff";
  const themeText = isDark ? "#ffffff" : "#0f172a";
  const themeSubText = isDark ? "#94a3b8" : "#475569";
  const themeBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const themeInputBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";

  return (
    <footer
      style={{
        background: themeBg,
        color: themeText,
        padding: isMobile ? "60px 20px" : "80px 7%",
        borderTop: `1px solid ${themeBorder}`,
        transition: "background 0.3s ease, color 0.3s ease", // Smooth transition effect
        position: "relative",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: getGridTemplateColumns(),
          gap: isMobile ? "30px" : "50px",
          paddingBottom: "60px",
          borderBottom: `1px solid ${themeBorder}`,
        }}
      >
        {/* Brand */}
        <div style={{ marginBottom: isCollapsible ? "15px" : "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px" }}>
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
            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>IntellMeet</h2>
          </div>

          <p style={{ color: themeSubText, lineHeight: "1.9", fontSize: "16px", marginBottom: "35px" }}>
            AI-powered meetings that help teams collaborate smarter, save time, and achieve more.
          </p>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={featureStyle(isDark)}>
              <div style={iconStyle}><FileText size={16} /></div>
              <span>AI Meeting Summaries</span>
            </div>
            <div style={featureStyle(isDark)}>
              <div style={iconStyle}><Mic size={16} /></div>
              <span>Smart Notes & Insights</span>
            </div>
            <div style={featureStyle(isDark)}>
              <div style={iconStyle}><Video size={16} /></div>
              <span>Record & Share Meetings</span>
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div style={collapsibleContainer(isCollapsible, themeBorder)}>
          <h2 style={headingStyle(isCollapsible)} onClick={() => toggleSection("product")}>
            Product
            {isCollapsible && (openSections.product ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
          </h2>
          <div style={linkContainer(isCollapsible, openSections.product)}>
            <a href="#" style={linkStyle(themeSubText)}>Features</a>
            <a href="#" style={linkStyle(themeSubText)}>How it Works</a>
            <a href="#" style={linkStyle(themeSubText)}>Pricing</a>
            <a href="#" style={linkStyle(themeSubText)}>Integrations</a>
            <a href="#" style={linkStyle(themeSubText)}>Changelog</a>
            <a href="#" style={linkStyle(themeSubText)}>Roadmap</a>
          </div>
        </div>

        {/* Company Section */}
        <div style={collapsibleContainer(isCollapsible, themeBorder)}>
          <h2 style={headingStyle(isCollapsible)} onClick={() => toggleSection("company")}>
            Company
            {isCollapsible && (openSections.company ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
          </h2>
          <div style={linkContainer(isCollapsible, openSections.company)}>
            <a href="#" style={linkStyle(themeSubText)}>About Us</a>
            <a href="#" style={linkStyle(themeSubText)}>Blog</a>
            <a href="#" style={linkStyle(themeSubText)}>Careers</a>
            <a href="#" style={linkStyle(themeSubText)}>Press Kit</a>
            <a href="#" style={linkStyle(themeSubText)}>Contact Us</a>
          </div>
        </div>

        {/* Resources Section */}
        <div style={collapsibleContainer(isCollapsible, themeBorder)}>
          <h2 style={headingStyle(isCollapsible)} onClick={() => toggleSection("resources")}>
            Resources
            {isCollapsible && (openSections.resources ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
          </h2>
          <div style={linkContainer(isCollapsible, openSections.resources)}>
            <a href="#" style={linkStyle(themeSubText)}>Help Center</a>
            <a href="#" style={linkStyle(themeSubText)}>Guides</a>
            <a href="#" style={linkStyle(themeSubText)}>API Docs</a>
            <a href="#" style={linkStyle(themeSubText)}>Privacy Policy</a>
            <a href="#" style={linkStyle(themeSubText)}>Terms of Service</a>
          </div>
        </div>

        {/* Newsletter */}
        <div style={{ marginTop: isCollapsible ? "20px" : "0" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px", marginTop: 0 }}>
            Stay in the loop
          </h2>
          <p style={{ color: themeSubText, lineHeight: "1.8", marginBottom: "28px" }}>
            Subscribe to our newsletter for the latest updates and tips.
          </p>

          <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "14px", marginBottom: "40px" }}>
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
                border: `1px solid ${themeBorder}`,
                background: themeInputBg,
                color: themeText,
                outline: "none",
                fontSize: "15px",
                width: isMobile ? "100%" : "auto",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "16px 28px",
                borderRadius: "12px",
                border: "0",
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
        <p style={{ color: themeSubText, fontSize: "15px", margin: 0, lineHeight: "1.6" }}>
          © 2026 IntellMeet. All rights reserved. <br />
          made with care.
        </p>

        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "14px" : "30px", alignItems: "center" }}>
          <a href="#" style={bottomLink(themeSubText)}>Privacy Policy</a>
          <a href="#" style={bottomLink(themeSubText)}>Terms of Service</a>
          <a href="#" style={bottomLink(themeSubText)}>Cookies Settings</a>

          {/* 3. Floating Theme Toggle Action Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              border: "none",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: themeText,
              marginLeft: isMobile ? "0" : "10px",
              transition: "transform 0.2s ease",
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </footer>
  );
}

// Custom style helpers receiving theme attributes
const collapsibleContainer = (isCollapsible, themeBorder) => ({
  borderBottom: isCollapsible ? `1px solid ${themeBorder}` : "none",
  paddingBottom: isCollapsible ? "10px" : "0",
});

const headingStyle = (isCollapsible) => ({
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: isCollapsible ? "12px" : "30px",
  marginTop: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: isCollapsible ? "pointer" : "default",
  userSelect: "none",
});

const linkContainer = (isCollapsible, isOpen) => ({
  display: isCollapsible && !isOpen ? "none" : "flex",
  flexDirection: "column",
  gap: "18px",
  paddingBottom: isCollapsible ? "15px" : "0",
  paddingLeft: isCollapsible ? "5px" : "0",
});

const linkStyle = (color) => ({
  color: color,
  textDecoration: "none",
  fontSize: "16px",
});

const bottomLink = (color) => ({
  color: color,
  textDecoration: "none",
  fontSize: "15px",
});

const featureStyle = (isDark) => ({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  color: isDark ? "#cbd5e1" : "#334155",
  fontSize: "16px",
});

const iconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "linear-gradient(135deg,#c084fc,#8b5cf6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: "#fff",
};