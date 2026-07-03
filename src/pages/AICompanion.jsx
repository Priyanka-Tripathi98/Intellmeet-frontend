import React, { useState, useEffect } from "react";
import { Download, Sparkles } from "lucide-react";

function AICompanion({ roomId, socket, fullTranscript }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [aiData, setAiData] = useState({
    summary: "",
    keyPoints: [],
    actionItems: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Catching final AI summaries from the backend pipeline
  useEffect(() => {
    if (!socket) return;

    socket.on("ai-summary-generated", (data) => {
      if (data) {
        setAiData({
          summary: data.summary || "",
          keyPoints: data.keyPoints || [],
          actionItems: data.actionItems || []
        });
      }
    });

    return () => {
      socket.off("ai-summary-generated");
    };
  }, [socket]);

 
const triggerManualSummary = async () => {
 const cleanText = fullTranscript && fullTranscript.trim() !== "" ? fullTranscript.trim() :
   "Hello Team, This is Priyanka. let's discuss about projects."

  setIsLoading(true);
  try {
    const token = localStorage.getItem("userToken");
    const response = await fetch("https://intellmeet-backend-vufa.onrender.com/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        roomId, 
        text: cleanText 
      }),
    });
    
    const data = await response.json();
    console.log("Response data receieved from AI backend:", data)
    if (data.error) {
      console.error("Backend returned an error:", data.error);
      alert("AI Summary failed: " + data.error);
    } else {
      setAiData({
        summary: data.summary || "",
        keyPoints: data.keyPoints || [],
        actionItems: data.actionItems || []
      });
    }
  } catch (err) {
    console.error("Manual aggregation retrieval crashed:", err);
    alert("Could not connect to the backend server.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div style={{
      width: "360px",
      height: "100%",
      backgroundColor: "#0b0f19", // Deep obsidian matching reference
      borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#ffffff"
    }}>
      
      {/* 1. TOP HEADER NAVIGATION BLOCK */}
      <div style={{
        padding: "20px 16px 12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={16} color="#818cf8" />
          <span style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "-0.01em" }}>AI Notes</span>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "6px",
          padding: "6px 10px",
          color: "#94a3b8",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer"
        }}>
          <Download size={13} /> Export
        </button>
      </div>

      {/* 2. SUB NAVIGATION SEGMENT TABS */}
      <div style={{
        display: "flex",
        padding: "4px 16px",
        gap: "4px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.03)"
      }}>
        {["summary", "transcript", "highlights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 12px",
              background: "none",
              border: "none",
              color: activeTab === tab ? "#818cf8" : "#64748b",
              fontSize: "13px",
              fontWeight: activeTab === tab ? "600" : "500",
              cursor: "pointer",
              position: "relative",
              textTransform: "capitalize"
            }}
          >
            {tab}
            {activeTab === tab && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: "12px",
                right: "12px",
                height: "2px",
                backgroundColor: "#818cf8",
                borderRadius: "2px"
              }} />
            )}
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC METADATA CONTENT SCROLL FEED CONTAINER */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        
        {activeTab === "summary" && (
          <>
            {/* AI Generated Overview Paragraph section */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "8px", marginTop: 0 }}>
                AI Generated Summary
              </h4>
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "#94a3b8", margin: 0 }}>
                {aiData.summary || "No automated summary updates captured yet. Speak in the call or trigger an on-demand pass below."}
              </p>
            </div>

            {/* Takeaway Bullet Key Points Section */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "10px", marginTop: 0 }}>
                Key Points
              </h4>
              <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {(aiData.keyPoints || []).length > 0 ? (
                  aiData.keyPoints.map((point, index) => (
                    <li key={index} style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
                      {point}
                    </li>
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: "#475569", fontStyle: "italic" }}>Awaiting discussion milestones...</span>
                )}
              </ul>
            </div>

            {/* Action Items Assignments checklist table mapping */}
            <div>
              <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#ffffff", marginBottom: "12px", marginTop: 0 }}>
                Action Items
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {aiData.actionItems.length > 0 ? (
                  aiData.actionItems.map((item, index) => (
                    <div key={index} style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                      backgroundColor: "rgba(255,255,255,0.01)",
                      border: "1px solid rgba(255,255,255,0.03)",
                      padding: "10px 12px",
                      borderRadius: "8px"
                    }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <input type="checkbox" readOnly style={{ marginTop: "3px", accentColor: "#818cf8" }} />
                        <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                          <strong style={{ color: "#e2e8f0", fontWeight: "600" }}>{item.assigneeName}: </strong>
                          <span style={{ color: "#94a3b8" }}>{item.taskDetail}</span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "500",
                        color: "#6366f1",
                        backgroundColor: "rgba(99, 102, 241, 0.08)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        whiteSpace: "nowrap"
                      }}>
                        {item.dateBadge || "Soon"}
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: "12px", color: "#475569", fontStyle: "italic" }}>No discrete task structures processed.</span>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "transcript" && (
          <div style={{display: "flex", flexDirection: "column", gap: "16px", height:"100%" }}>
            <h4 style={{fontSize:"13px", fontWeight:"600", color:"#ffffff", marginBottom:"4px", marginTop:"0"}}></h4>
          </div>
        )}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
      border: "1px solid rgba(255, 255, 255, 0.04)",
      borderRadius: "12px",
      padding: "14px",
      fontSize: "13px",
      lineHeight: "1.6",
      color: "#cbd5e1",
      maxHeight: "400px",
      overflowY: "auto",
      whiteSpace: "pre-line"}}>

        {fullTranscript && fullTranscript.trim() !== "" ? (
       <div>
          {/* Decorative glowing pulse dot showing it's active */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", fontSize: "11px", color: "#818cf8" }}>
            <span style={{ width: "6px", height: "6px", backgroundColor: "#818cf8", borderRadius: "50%", display: "inline-block" }} />
            Streaming Live...
          </div>
          
          <p style={{ margin: 0, color: "#e2e8f0" }}>{fullTranscript}</p>
        </div>
        ) : (
          <span style={{ color: "#475569", fontStyle: "italic" }}>
          No live text captured yet. Unmute your microphone and start speaking to see the transcript stream here in real-time...
        </span>
        )}
      </div>
      </div>

      {/* 4. FOOTER MANUAL AGGREGATION TRIGGER CONTROLLER */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
        backgroundColor: "rgba(255,255,255,0.01)"
      }}>
        <button
          onClick={triggerManualSummary}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#6366f1",
            border: "none",
            borderRadius: "8px",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {isLoading ? "Analyzing Meeting Data..." : "Generate Final AI Summary"}
        </button>
      </div>

    </div>
  );
}

export default AICompanion;