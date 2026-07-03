import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MeetingDetails() {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://intellmeet-backend-vufa.onrender.com/meetings/details/${meetingCode}?t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch meeting details");
        }

        const data = await res.json();

        if (data.success) {
          console.log("Meeting Data:", data.meeting);
          setMeeting(data.meeting);
        } else {
          throw new Error(data.message || "Meeting not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingCode]);

  // Universal styles variable to keep the JSX clean
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#090d16",
      color: "#f1f5f9",
      padding: window.innerWidth > 768 ? "32px" : "16px",
      fontFamily: "system-ui, sans-serif",
    },
    wrapper: {
      maxWidth: "1024px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    backButton: {
      background: "none",
      border: "none",
      color: "#94a3b8",
      cursor: "pointer",
      fontSize: "14px",
      padding: "0",
      alignSelf: "flex-start",
    },
    headerCard: {
      position: "relative",
      overflow: "hidden",
      backgroundColor: "rgba(17, 24, 39, 0.7)",
      backdropFilter: "blur(12px)",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    },
    title: {
      fontSize: "28px",
      fontWeight: "800",
      margin: "0 0 12px 0",
      color: "#ffffff",
      letterSpacing: "-0.025em",
    },
    codeBadge: {
      backgroundColor: "#1e293b",
      padding: "4px 12px",
      borderRadius: "6px",
      border: "1px solid #334155",
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#94a3b8",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: window.innerWidth > 1024 ? "2fr 1fr" : "1fr",
      gap: "24px",
    },
    mainColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    card: {
      backgroundColor: "rgba(17, 24, 39, 0.5)",
      backdropFilter: "blur(8px)",
      border: "1px solid #1e293b",
      borderRadius: "16px",
      padding: "24px",
    },
    cardTitle: {
      margin: "0 0 16px 0",
      fontSize: "18px",
      fontWeight: "700",
      color: "#a78bfa",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    text: {
      color: "#cbd5e1",
      lineHeight: "1.7",
      fontSize: "15px",
      margin: "0",
    },
    list: {
      margin: "0",
      padding: "0",
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    listItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      color: "#cbd5e1",
      fontSize: "15px",
    },
    bullet: {
      marginTop: "8px",
      height: "6px",
      width: "6px",
      borderRadius: "50%",
      backgroundColor: "#a78bfa",
      flexShrink: 0,
    },
    actionCard: {
      padding: "14px",
      borderRadius: "12px",
      backgroundColor: "rgba(2, 6, 23, 0.4)",
      border: "1px solid #1e293b",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      marginBottom: "12px",
    },
    assignee: {
      fontSize: "11px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: "#ddd6fe",
    },
    transcriptBox: {
      backgroundColor: "rgba(2, 6, 23, 0.6)",
      border: "1px solid #0f172a",
      borderRadius: "12px",
      padding: "16px",
    },
    pre: {
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      fontFamily: "inherit",
      fontSize: "14px",
      lineHeight: "1.7",
      color: "#94a3b8",
      maxHeight: "400px",
      overflowY: "auto",
      margin: "0",
    },
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            margin: "0 auto 16px auto",
            width: "32px",
            height: "32px",
            border: "4px solid #a78bfa",
            borderTopColor: "transparent",
            borderRadius: "50%",
          }} />
          <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>
            Loading meeting details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div style={{ ...styles.container, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...styles.card, maxWidth: "400px", width: "100%", textAlign: "center", borderColor: "rgba(239, 68, 68, 0.3)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>Something went wrong</h3>
          <p style={{ ...styles.text, color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>{error || "Meeting parameters are missing"}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 20px",
              backgroundColor: "#1e293b",
              color: "#ffffff",
              border: "1px solid #334155",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Navigation */}
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back to Meetings
        </button>

        {/* Main Header Card */}
        <header style={styles.headerCard}>
          <h1 style={styles.title}>{meeting?.title || meeting?.meetingTitle || "Untitled Meeting"}</h1>
    
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={styles.codeBadge}>Code: {meeting?.meetingCode}</span>
          </div>
        </header>

        {/* Content Layout Grid */}
        <div style={styles.grid}>
          
          {/* Left Column: Notes & Insights */}
          <div style={styles.mainColumn}>
            
            {/* AI Summary */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>✨ AI Summary</h2>
              <p style={styles.text}>
                {meeting?.aiNotes?.summary || "No summary available."}
              </p>
            </section>

            {/* Key Points */}
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>📌 Key Points</h2>
              {meeting?.aiNotes?.keyPoints?.length > 0 ? (
                <ul style={styles.list}>
                  {meeting.aiNotes.keyPoints.map((point, index) => (
                    <li key={index} style={styles.listItem}>
                      <span style={styles.bullet} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ ...styles.text, color: "#64748b", fontStyle: "italic" }}>No key points available.</p>
              )}
            </section>
          </div>

          {/* Right Column: Action Items Container */}
          <div>
            <section style={{ ...styles.card, height: "100%" }}>
              <h2 style={styles.cardTitle}>⚡ Action Items</h2>
              {meeting?.aiNotes?.actionItems?.length > 0 ? (
                <div>
                  {meeting.aiNotes.actionItems.map((item, index) => (
                    <div key={index} style={styles.actionCard}>
                      <span style={styles.assignee}>
                        {item.assigneeName || "Unassigned"}
                      </span>
                      <p style={{ ...styles.text, fontSize: "14px" }}>
                        {item.taskDetail}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ ...styles.text, color: "#64748b", fontStyle: "italic" }}>No action items available.</p>
              )}
            </section>
          </div>
        </div>

        {/* Full Transcript Section */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>📝 Full Transcript</h2>
          <div style={styles.transcriptBox}>
            <pre style={styles.pre}>
              {meeting?.transcript || "Transcript not available."}
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}

export default MeetingDetails;