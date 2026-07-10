import React, { useState } from "react";
import {
  Calendar,
  ArrowRight,
  VideoOff,
  StickyNote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function MeetingsView({ meetings = [] }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");

  const currentTime = Date.now();

    const upcomingMeetings = meetings.filter((meeting) => {
    const status = meeting.status?.toLowerCase();
    
    if (status === "completed" || status === "ended") return false;
    if (status === "scheduled" || status === "active") return true; 

    const meetingTime = new Date(meeting.time || meeting.startTime).getTime();
    return meetingTime > currentTime;
  });


    const pastMeetings = meetings.filter((meeting) => {
    const status = meeting.status?.toLowerCase();
    
    if (status === "active" || status === "scheduled") return false;
    if (status === "completed" || status === "ended") return true;

    const meetingTime = new Date(meeting.time || meeting.startTime).getTime();
    return meetingTime <= currentTime;
  });

  const currentDisplayList =
    activeTab === "upcoming"
      ? upcomingMeetings
      : pastMeetings;

  return (
    <div style={{ padding: "24px", color: "white" }}>
      <h2>My Meetings</h2>
      <p>Track your meetings and history.</p>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("upcoming")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background:
              activeTab === "upcoming"
                ? "#6366f1"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
          }}
        >
          Upcoming ({upcomingMeetings.length})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background:
              activeTab === "history"
                ? "#6366f1"
                : "#1e293b",
            color: "white",
            cursor: "pointer",
          }}
        >
          History ({pastMeetings.length})
        </button>
      </div>

      {/* Empty State */}
      {currentDisplayList.length === 0 ? (
        <div style={{ marginTop: "40px" }}>
          <VideoOff size={40} />
          <p>No meetings found.</p>
        </div>
      ) : (
        currentDisplayList.map((meeting) => (
          <div
            key={meeting._id}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>{meeting.title || meeting.meetingTitle || "Untitled Meeting"}</h3>

              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "#94a3b8",
                }}
              >
                <Calendar size={14} />
                {meeting.time || meeting.startTime
                  ? new Date(meeting.time || meeting.startTime).toLocaleString()
                  : "No Date"}
              </p>

              <p style={{ margin: "4px 0" }}>
                <strong>Code:</strong> {meeting.meetingCode}
              </p>

              <p style={{ margin: "4px 0" }}>
                <strong>Status:</strong>{" "}
                <span style={{ 
                  color: meeting.status === "completed" ? "#4ade80" : "#6366f1",
                  textTransform: "capitalize"
                }}>
                  {meeting.status}
                </span>
              </p>
            </div>

            {/* Render actions contextually based on the actual tab view state */}
            {activeTab === "upcoming" ? (
              <button
                onClick={() =>
                  navigate(`/meeting/${meeting.meetingCode}`)
                }
                style={{
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                Join
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() =>
                  navigate(
                    `/meeting-details/${meeting.meetingCode}`
                  )
                }
                style={{
                  background: "#334155",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <StickyNote size={16} />
                View Notes
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MeetingsView;