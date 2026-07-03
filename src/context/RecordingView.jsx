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
    <div style={{ padding: "32px", color: "white", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "6px" }}>Saved Recordings</h2>
      <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
        Review, playback, or delete your recorded video sessions.
      </p>

      {recordings.length === 0 ? (
        <div style={{ 
          marginTop: "40px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "48px",
          background: "#1e293b",
          borderRadius: "16px",
          border: "1px dashed #334155",
          color: "#94a3b8"
        }}>
          <VideoOff size={44} style={{ marginBottom: "12px", color: "#64748b" }} />
          <p style={{ fontSize: "16px", fontWeight: "500" }}>No recording files found in your database.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
          gap: "24px" 
        }}>
          {recordings.map((rec) => {
            return (
              <div 
                key={rec._id} 
                style={{ 
                  background: "#1e293b", 
                  padding: "20px", 
                  borderRadius: "16px", 
                  border: "1px solid #334155",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "6px" }}>
                  <h3 style={{ 
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
                      transition: "all 0.2s"
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
                  justifyContent: "center"
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
                        style={{ display: "block", width: "100%", height: "100%" }} 
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