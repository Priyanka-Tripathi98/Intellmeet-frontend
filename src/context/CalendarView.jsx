import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Video } from "lucide-react";

// Centralized Premium Dark-Theme Inline Styles Config
const styles = {
  container: {
    padding: "clamp(12px, 4vw, 24px)", // Fluid outer layout padding
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    color: "#ffffff",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerTitle: {
    fontSize: "clamp(20px, 5vw, 24px)", // Fluid heading text
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
  // Calendar Card Section
  calendarCard: {
    background: "rgba(15, 23, 42, 0.2)",
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "clamp(12px, 3vw, 20px)", // Dynamic interior padding
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  monthTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f8fafc",
    margin: 0,
  },
  navButtonGroup: {
    display: "flex",
    gap: "4px",
  },
  navButton: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: "8px",
    padding: "8px", // Enlarged slightly for target accuracy on touchscreens
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  weekDaysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
  },
  dayCell: (isCurrentMonth, isSelected, isToday) => ({
    aspectRatio: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: isSelected || isToday ? "600" : "400",
    cursor: isCurrentMonth ? "pointer" : "default",
    border: isToday ? "1px solid #6366f1" : "1px solid transparent",
    background: isSelected 
      ? "#6366f1" 
      : isCurrentMonth 
        ? "rgba(30, 41, 59, 0.2)" 
        : "transparent",
    color: isSelected 
      ? "#ffffff" 
      : isCurrentMonth 
        ? "#e2e8f0" 
        : "#334155",
    position: "relative",
    transition: "all 0.2s ease",
  }),
  meetingDot: (isSelected) => ({
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: isSelected ? "#ffffff" : "#6366f1",
    position: "absolute",
    bottom: "6px",
  }),
  // Sidebar Panel Section
  agendaPanel: {
    background: "rgba(15, 23, 42, 0.2)",
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  agendaTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f8fafc",
    margin: 0,
  },
  meetingItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px",
    background: "rgba(30, 41, 59, 0.3)",
    border: "1px solid #334155",
    borderRadius: "10px",
  },
  meetingTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#f1f5f9",
    margin: 0,
  },
  meetingMeta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#94a3b8",
  },
  emptyAgenda: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "32px 0",
    color: "#64748b",
    fontSize: "13px",
    fontStyle: "italic",
    textAlign: "center",
  }
};

function CalendarView() {
  const [meetings, setMeetings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://intellmeet-backend-vufa.onrender.com/meetings/user-history", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        if (data.success) {
          setMeetings(data.meetings);
        }
      } catch (err) {
        console.error("Failed to fetch calendar schedules:", err);
      }
    };
    fetchMeetings();
  }, []);

  // Calendar Math Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // 1. Fill Prev Month Padding Days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i)
    });
  }

  // 2. Fill Current Month Days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // 3. Fill Next Month Padding Days
  const remainingCells = 42 - calendarCells.length; 
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getMeetingsForDate = (dateObj) => {
    if (!dateObj) return [];
    return meetings.filter(m => {
      const mDate = new Date(m.startTime || m.time);
      return (
        mDate.getFullYear() === dateObj.getFullYear() &&
        mDate.getMonth() === dateObj.getMonth() &&
        mDate.getDate() === dateObj.getDate()
      );
    });
  };

  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  return (
    <div style={styles.container}>
      {/* Inline style sheet to safely configure multi-column grid scaling */}
      <style>{`
        .responsive-dashboard-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .responsive-dashboard-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 440px) {
          .responsive-weekdays-row {
            font-size: 10px !important;
          }
          .responsive-days-matrix {
            gap: 4px !important;
          }
        }
      `}</style>

      {/* View Header */}
      <div>
        <h2 style={styles.headerTitle}>Workspace Calendar</h2>
        <p style={styles.headerSub}>Manage schedules and track upcoming video synchronization timelines.</p>
      </div>

      {/* Two-Column Responsive Grid Layout */}
      <div className="responsive-dashboard-grid">
        
        {/* Main Calendar Card Block */}
        <div style={styles.calendarCard}>
          <div style={styles.calendarHeader}>
            <h3 style={styles.monthTitle}>
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h3>
            <div style={styles.navButtonGroup}>
              <button onClick={handlePrevMonth} style={styles.navButton}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNextMonth} style={styles.navButton}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days of Week String Header Row */}
          <div className="responsive-weekdays-row" style={styles.weekDaysGrid}>
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          {/* Main 7x6 Matrix Block rendering grids */}
          <div className="responsive-days-matrix" style={styles.daysGrid}>
            {calendarCells.map((cell, index) => {
              const dayMeetings = getMeetingsForDate(cell.date);
              const hasMeetings = dayMeetings.length > 0;
              
              const isSelected = 
                selectedDate &&
                cell.date.getFullYear() === selectedDate.getFullYear() &&
                cell.date.getMonth() === selectedDate.getMonth() &&
                cell.date.getDate() === selectedDate.getDate();

              const isToday = 
                cell.date.getFullYear() === new Date().getFullYear() &&
                cell.date.getMonth() === new Date().getMonth() &&
                cell.date.getDate() === new Date().getDate();

              return (
                <div
                  key={index}
                  onClick={() => cell.isCurrentMonth && setSelectedDate(cell.date)}
                  style={styles.dayCell(cell.isCurrentMonth, isSelected, isToday)}
                >
                  {cell.day}
                  {hasMeetings && cell.isCurrentMonth && (
                    <span style={styles.meetingDot(isSelected)} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel Agenda Checklist */}
        <div style={styles.agendaPanel}>
          <h3 style={styles.agendaTitle}>
            Agenda for {selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ""}
          </h3>

          {selectedDateMeetings.length === 0 ? (
            <div style={styles.emptyAgenda}>
              <CalendarIcon size={24} color="#475569" />
              <span>No sync schedules logged on this calendar slot.</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedDateMeetings.map((meeting) => (
                <div key={meeting._id} style={styles.meetingItem}>
                  <h4 style={styles.meetingTitle}>{meeting.title}</h4>
                  <div style={styles.meetingMeta}>
                    <Clock size={12} color="#64748b" />
                    <span>
                      {new Date(meeting.startTime || meeting.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ ...styles.meetingMeta, fontFamily: "monospace", fontSize: "11px" }}>
                    <Video size={12} color="#64748b" />
                    <span>CODE: {meeting.meetingCode}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CalendarView;