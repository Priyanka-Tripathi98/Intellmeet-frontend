import React, { useState, useEffect } from "react";
import axios from "axios";
import { VideoOff, Loader2, Trash2 } from "lucide-react";

function RecordingsView() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`https://intellmeet-backend-vufa.onrender.com/meetings/user-history?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const meetingData = Array.isArray(response.data)
          ? response.data
          : response.data.meetings || [];

        const savedRecordings = meetingData.filter(
          (meeting) => meeting.recordingUrl || meeting.recordingURL || meeting.videoUrl
        );

        setRecordings(savedRecordings);
      } catch (error) {
        console.error("Error loading recordings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  const handleDelete = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.delete(`https://intellmeet-backend-vufa.onrender.com/meetings/recording/${meetingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setRecordings((prev) => prev.filter((rec) => rec._id !== meetingId));
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
      alert("Failed to delete recording. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "300px", 
        color: "#94a3b8",
        gap: "12px"
      }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "#6366f1" }} />
        <p style={{ fontSize: "15px", fontWeight: "500" }}>Loading recordings...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "clamp(16px, 4vw, 32px)", 
      color: "white", 
      fontFamily: "system-ui, -apple-system, sans-serif",
      maxWidth: "1400px",
      margin: "0 auto"
    }}>
      {/* Inline styles helper sheet for deep mobile layout optimization */}
      <style>{`
        .recordings-responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: clamp(16px, 3vw, 24px);
        }
        @media (max-width: 480px) {
          .recording-card-title {
            font-size: 16px !important;
          }
          .recording-empty-wrapper {
            padding: 32px 16px !important;
          }
        }
      `}</style>

      <h2 style={{ fontSize: "clamp(20px, 5vw, 24px)", fontWeight: "700", marginBottom: "6px" }}>Saved Recordings</h2>
      <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
        Review, playback, or delete your recorded video sessions.
      </p>

      {recordings.length === 0 ? (
        <div className="recording-empty-wrapper" style={{ 
          marginTop: "40px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "48px",
          background: "#1e293b",
          borderRadius: "16px",
          border: "1px dashed #334155",
          color: "#94a3b8",
          textAlign: "center"
        }}>
          <VideoOff size={44} style={{ marginBottom: "12px", color: "#64748b" }} />
          <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>No recording files found in your database.</p>
        </div>
      ) : (
        <div className="recordings-responsive-grid">
          {recordings.map((rec) => {
            return (
              <div 
                key={rec._id} 
                style={{ 
                  background: "#1e293b", 
                  padding: "clamp(16px, 3vw, 20px)", 
                  borderRadius: "16px", 
                  border: "1px solid #334155",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  minWidth: 0 // Prevents grid layout blowouts from flexing content
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "6px" }}>
                  <h3 className="recording-card-title" style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    margin: 0,
                    color: "#f8fafc",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flex: 1
                  }}>
                    {rec.title || "Untitled Meeting"}
                  </h3>
                  
                  <button
                    onClick={() => handleDelete(rec._id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: "4px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      flexShrink: 0 // Blocks action button from narrowing under flex space strain
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                    title="Delete Recording"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <p style={{ 
                  fontSize: "13px", 
                  color: "#94a3b8", 
                  margin: "0 0 16px 0" 
                }}>
                  Code: <span style={{ color: "#cbd5e1", fontFamily: "monospace", fontWeight: "600" }}>{rec.meetingCode}</span>
                </p>
                
                <div style={{ 
                  width: "100%", 
                  borderRadius: "10px", 
                  overflow: "hidden", 
                  background: "#0f172a",
                  border: "1px solid #475569",
                  position: "relative",
                  aspectRatio: "16/9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "auto" // Forces layout components to anchor cards perfectly even if titles wrap
                }}>
                  {(() => {
                    const rawUrl = rec.recordingUrl || rec.recordingURL || rec.videoUrl || "";
                    
                    if (!rawUrl || rawUrl.includes("undefined")) {
                      return (
                        <p style={{ color: "#64748b", fontSize: "13px", padding: "12px", textAlign: "center" }}>
                          ⚠️ Recording file corrupted or unavailable
                        </p>
                      );
                    }

                    const match = rawUrl.match(/\/video\/([a-fA-F0-9]{24})/);
                    let videoSrc = "";
                    
                    if (match && match[1]) {
                      videoSrc = `https://intellmeet-backend-vufa.onrender.com/meetings/video/${match[1]}`;
                    } else {
                      let cleanPath = rawUrl.replace(/^\/+/, ""); 
                      videoSrc = cleanPath.startsWith("http") ? cleanPath : `https://intellmeet-backend-vufa.onrender.com/${cleanPath}`;
                    }

                    return (
                      <video 
                        src={videoSrc} 
                        controls 
                        width="100%" 
                        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} 
                      />
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecordingsView;