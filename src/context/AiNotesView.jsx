import React, { useState, useEffect } from "react";
import { Sparkles, ChevronDown, ChevronUp, FileText } from "lucide-react";

const styles = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    color: "#ffffff",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "600",
    letterSpacing: "-0.02em",
    margin: 0,
  },
  headerSub: {
    fontSize: "14px",
    color: "#94a3b8",
    marginTop: "4px",
    marginBottom: 0,
  },
  // Main Expandable Card Wrapper
  meetingCard: {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    background: "rgba(15, 23, 42, 0.2)",
    border: "1px solid #334155",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f8fafc",
    margin: "0 0 4px 0",
  },
  cardMeta: {
    fontSize: "12px",
    color: "#64748b",
    margin: 0,
  },
  iconContainer: {
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
  },
  // Collapsible Content Drawer
  drawerContent: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #334155",
  },
  // Premium AI Feature Callout Box
  aiCallout: {
    padding: "14px",
    background: "rgba(99, 102, 241, 0.06)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  aiCalloutTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#818cf8",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: "0 0 8px 0",
  },
  aiSummaryText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#cbd5e1",
    margin: 0,
    whiteSpace: "pre-line",
  },
  // Key Takeaways Section
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#6366f1",
    letterSpacing: "0.05em",
    marginBottom: "10px",
    margin: 0,
  },
  listContainer: {
    fontSize: "13px",
    color: "#cbd5e1",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    margin: 0,
  },
  listItem: {
    lineHeight: "1.5",
  },
  // Empty State Layout
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "48px 0",
    border: "1px dashed #334155",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.1)",
  },
  emptyText: {
    fontSize: "14px",
    color: "#64748b",
    fontStyle: "italic",
    margin: 0,
    textAlign: "center",
  },
};

function AiNotesView() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://intellmeet-backend-vufa.onrender.com/meetings/user-history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          const notesOnly = data.meetings.filter((m) => m.aiNotes && m.aiNotes.summary);
          setMeetings(notesOnly);
        }
      } catch (err) {
        console.error("Failed to load historical summaries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", fontSize: "14px", color: "#94a3b8", opacity: 0.6 }}>
        Analyzing your notes library...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Section Header */}
      <div>
        <h2 style={styles.headerTitle}>Saved AI Notes</h2>
        <p style={styles.headerSub}>
          Review your automated summaries and key takeaways from past workspace syncs.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div style={styles.emptyState}>
          <FileText size={28} color="#475569" />
          <p style={styles.emptyText}>
            No archived meeting summaries found.<br />
            Finish a meeting with insights to see logs here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {meetings.map((meeting) => {
            const isExpanded = expandedNote === meeting._id;
            return (
              <div
                key={meeting._id}
                onClick={() => toggleExpand(meeting._id)}
                style={{
                  ...styles.meetingCard,
                  borderColor: isExpanded ? "#6366f1" : "#334155",
                  background: isExpanded ? "rgba(30, 41, 59, 0.3)" : "rgba(15, 23, 42, 0.2)",
                }}
              >
                {/* Header Drawer Control */}
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{meeting.title}</h3>
                    <p style={styles.cardMeta}>
                      Concluded on: {new Date(meeting.endTime || meeting.time).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div style={styles.iconContainer}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Collapsible Content Drawer Area */}
                {isExpanded && (
                  <div 
                    style={styles.drawerContent}
                    onClick={(e) => e.stopPropagation()} // Prevents collapsing card when clicking internal notes text
                  >
                    {/* Executive Summary Callout Box */}
                    <div style={styles.aiCallout}>
                      <h4 style={styles.aiCalloutTitle}>
                        <Sparkles size={14} />
                        Executive Summary
                      </h4>
                      <p style={styles.aiSummaryText}>
                        {meeting.aiNotes.summary}
                      </p>
                    </div>

                    {/* Bulleted Key Takeaways Container */}
                    {meeting.aiNotes.keyPoints?.length > 0 && (
                      <div>
                        <h4 style={styles.sectionTitle}>Key Takeaways</h4>
                        <ul style={styles.listContainer}>
                          {meeting.aiNotes.keyPoints.map((point, idx) => (
                            <li key={idx} style={styles.listItem}>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AiNotesView;