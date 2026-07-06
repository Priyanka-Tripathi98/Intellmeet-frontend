import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./dashboard.css";
import MeetingsView from "../context/MeetingsView";
import AiNotesView from "../context/AiNotesView";
import CalendarView from "../context/CalendarView"; 
import WorkspaceView from "../context/WorkspaceView";
import RecordingsView from "../context/RecordingView";
import { 
  LayoutDashboard, Video, PlayCircle, FileText, 
  Calendar, LogOut, Briefcase, X, Loader2, Menu
} from "lucide-react";

export function Dashboard() {
  const [username, setUsername] = useState("User");
  const [roomId, setRoomId] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile sidebar state
  
  const API_URL = "https://intellmeet-backend-vufa.onrender.com";
  const [userProfile, setUserProfile] = useState(null);
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    completedMeetings: 0,
    aiUsage: 0,
  });
  const navigate = useNavigate();

  // ✅ Fixed Avatar Path Sanitizer
  const getAvatarSrc = () => {
    if (!userProfile?.profilePic) return null;
    
    if (userProfile.profilePic.startsWith("http") && !userProfile.profilePic.includes("localhost")) {
      return `${userProfile.profilePic}?t=${new Date().getTime()}`;
    }

    let cleanPath = userProfile.profilePic;
    if (cleanPath.includes("uploads/")) {
      cleanPath = "uploads/" + cleanPath.split("uploads/")[1];
    } else if (!cleanPath.startsWith("uploads/")) {
      cleanPath = `uploads/${cleanPath}`;
    }

    return `${API_URL}/${cleanPath}?t=${new Date().getTime()}`;
  };

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleEditClick = (meeting) => {
    setEditingMeetingId(meeting._id);
    setScheduleTitle(meeting.title || meeting.meetingTitle);
    
    const dateObj = new Date(meeting.time || meeting.startTime);
    const formattedTime = dateObj.toISOString().slice(0, 16);
    
    setScheduleTime(formattedTime);
    setShowScheduleModal(true);
  };

  const createMeeting = async () => {
    const newRoomId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API_URL}/meetings/create`,
        {
          meetingCode: newRoomId,
          title: `Meeting Room ${newRoomId}`,
          meetingTitle: `Meeting Room ${newRoomId}`,
          time: new Date().toISOString(),
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate(`/meeting/${newRoomId}`);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create meeting");
    }
  };

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `${API_URL}/meetings/user-history?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const meetingData = Array.isArray(response.data)
        ? response.data
        : response.data.meetings || [];

      setMeetings(meetingData);

      const savedRecordings = meetingData.filter(
        (meeting) => meeting.recordingUrl || meeting.recordingURL || meeting.videoUrl
      );

      setRecordings(savedRecordings);

      setStats({
        totalMeetings: meetingData.length,
        completedMeetings: meetingData.filter(
          (m) => m.status === "completed" || m.status === "ended"
        ).length,
        aiUsage: meetingData.filter(
          (m) => m.aiNotes?.summary
        ).length,
      });
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!scheduleTitle.trim() || !scheduleTime) {
      alert("Please fill in all fields!");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      if (editingMeetingId) {
        const response = await axios.put(
          `${API_URL}/meetings/update/${editingMeetingId}`,
          {
            title: scheduleTitle,
            meetingTitle: scheduleTitle,
            time: new Date(scheduleTime).toISOString(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success || response.status === 200) {
          alert("Meeting updated successfully!");
        }
      } else {
        const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const response = await axios.post(
          `${API_URL}/meetings/create`, 
          { 
            meetingCode: generatedCode,
            title: scheduleTitle,
            meetingTitle: scheduleTitle,
            time: new Date(scheduleTime).toISOString(),
            status: "scheduled"
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success || response.status === 200) {
          alert(`Meeting scheduled successfully! Code: ${generatedCode}`);
        }
      }

      setScheduleTitle("");
      setScheduleTime("");
      setEditingMeetingId(null);
      setShowScheduleModal(false);
      
      await fetchMeetings(); 

    } catch (error) {
      console.error("Error saving meeting:", error);
      alert("Failed to save meeting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`https://intellmeet-backend-vufa.onrender.com/profile?t=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.data) {
          setUserProfile(response.data.user || response.data);
          
          const clearUsername = response.data.user?.username || response.data.username || "User";
          setUsername(clearUsername);
          localStorage.setItem("userName", clearUsername);
        }
        
        await fetchMeetings();

      } catch (error) {
        console.error("Error fetching profile details:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userToken");
          navigate("/login");
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  const getMeetingTime = (meeting) => {
    const dateStr = meeting.time || meeting.startTime || meeting.createdAt;
    if (!dateStr) return 0;
    
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  };
  
  const currentTimestamp = Date.now();

  const upcomingMeetings = meetings.filter((meeting) => {
    const status = meeting.status?.toLowerCase();
    if (status === "completed" || status === "ended") return false;
    if (status === "active") return true;

    const meetingTime = getMeetingTime(meeting);
    return meetingTime > currentTimestamp;
  });

  const recentMeetings = meetings.filter((meeting) => {
    const status = meeting.status?.toLowerCase();
    
    if (status === "completed" || status === "ended") return true;
    if (status === "scheduled" || status === "active") return false;

    const meetingTime = getMeetingTime(meeting);
    return meetingTime > 0 && meetingTime <= currentTimestamp;
  });

  const renderMainContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <>
            <div className="meeting-sections" style={{ marginTop: "20px" }}>
              <div className="meeting-panel">
                <h2>Upcoming Meetings</h2>
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((meeting) => {
                    const validDate = new Date(meeting.time || meeting.startTime);
                    const isInvalid = isNaN(validDate.getTime());
                    return (
                      <div className="meeting-item" key={meeting._id}>
                        <h4>{meeting.title || meeting.meetingTitle || "Untitled Meeting"}</h4>
                        <p>{isInvalid ? "No date specified" : validDate.toLocaleString([], {dateStyle: 'short', timeStyle: 'short' })}</p>
                        <span className="meeting-code-badge">{meeting.meetingCode}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="empty-text">No upcoming meetings</p>
                )}
                <button className="schedule-trigger-btn" onClick={() => { setEditingMeetingId(null); setScheduleTitle(""); setScheduleTime(""); setShowScheduleModal(true); }}>
                  Schedule Meeting
                </button>
              </div>

              <div className="meeting-panel">
                <h2>Recent Meetings</h2>
                {recentMeetings.length > 0 ? (
                  recentMeetings.map((meeting) => (
                    <div className="meeting-item" key={meeting._id}>
                      <h4>{meeting.title || meeting.meetingTitle || "Untitled Meeting"}</h4>
                      <p>Code: {meeting.meetingCode}</p>
                      <span className={`status-tag ${meeting.status || "ended"}`}>{meeting.status || "ended"}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No recent meetings</p>
                )}
              </div>
            </div>
          </>
        );
      case "meetings":
        return <MeetingsView meetings={meetings} refreshMeetings={fetchMeetings} />;
      case "ainotes":
        return <AiNotesView meetings={meetings} />;
      case "calendar":
        return <CalendarView meetings={meetings} />; 
      case "workspace":
        return <WorkspaceView />;
      case "recordings":
        return <RecordingsView recordings={recordings} meetings={meetings} />;
      default:
        return null;
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setMobileMenuOpen(false); // Auto-close drawer sidebar layout on choice
  };

  return (
    <div className={`dashboard ${theme}-theme`}>
      {/* Mobile Top Header Bar */}
      <div className="mobile-header-bar" style={{ display: 'none', padding: '10px 16px', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
            </svg>
          </div>
          <h2 className="logo" style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>IntellMeet</h2>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - responsive conditional visibility via class string mapping */}
      <div className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand-wrapper">
          <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0 20px 0' }}>
            <div className="logo-icon" style={{ 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
              padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
              </svg>
            </div>
            <h2 className="logo" style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', color: '#ffffff' }}>
              Intell<span style={{ fontWeight: '500', color: '#94a3b8' }}>Meet</span>
            </h2>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className={activeMenu === "dashboard" ? "active" : ""} onClick={() => handleMenuClick("dashboard")}>
            <LayoutDashboard className="sidebar-icon" size={18} /> <span>Dashboard</span>
          </li>
          <li className={activeMenu === "meetings" ? "active" : ""} onClick={() => handleMenuClick("meetings")}>
            <Video className="sidebar-icon" size={18} /> <span>Meetings</span>
          </li>
          <li className={activeMenu === "recordings" ? "active" : ""} onClick={() => handleMenuClick("recordings")}>
            <PlayCircle className="sidebar-icon" size={18} /> <span>Recordings</span>
          </li>
          <li className={activeMenu === "ainotes" ? "active" : ""} onClick={() => handleMenuClick("ainotes")}>
            <FileText className="sidebar-icon" size={18} /> <span>AI Notes</span>
          </li>
          <li className={activeMenu === "workspace" ? "active" : ""} onClick={() => handleMenuClick("workspace")}>
            <Briefcase className="sidebar-icon" size={18} /> <span>Workspace</span>
          </li>
          <li className={activeMenu === "calendar" ? "active" : ""} onClick={() => handleMenuClick("calendar")}>
            <Calendar className="sidebar-icon" size={18} /> <span>Calendar</span>
          </li>
          
          <li className={`profile-sidebar-item ${activeMenu === "profile" ? "active" : ""}`} onClick={() => handleMenuClick("profile")}>
            <Link to="/dashboard/profile" className="dash-avatar-link">
              <div className="dash-avatar">
                {userProfile?.profilePic ? (
                  <img src={getAvatarSrc()} alt="User Profile" />
                ) : (
                  <span className="dash-avatar-initial">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <span className="profile-label">Profile</span>
            </Link>
          </li>
        </ul>

        <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="main" style={{ width: '100%', boxSizing: 'border-box' }}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-welcome-text">
            <h2> Welcome back, {username} 👋 </h2>
            <p>Here's what happening today.</p>
          </div>
          <div className="topbar-actions">
            <label className="theme-switch">
              <span className="sun">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r={5} cy={12} cx={12} /><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z" /></g></svg>
              </span>
              <span className="moon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" /></svg>
              </span>   
              <input type="checkbox" className="theme-input" checked={theme === "light"} onChange={handleThemeChange} />
              <span className="theme-slider" />
            </label>
            <div className="meeting-box">
              <button onClick={createMeeting}>+ Create Instant Meeting</button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="cards">
          <div className="card"><h3>Total Meetings</h3><p>{stats.totalMeetings}</p></div>
          <div className="card"><h3>Completed</h3><p>{stats.completedMeetings}</p></div>
          <div className="card"><h3>AI Summaries</h3><p>{stats.aiUsage}</p></div>
        </div>
        
        {/* Main Panel View Wrapper */}
        {renderMainContent()}
      </div>
      

      {/* Schedule Modal Overlay */}
      {showScheduleModal && (
        <div className="modal-overlay" style={{ padding: '10px' }}>
          <div className="schedule-modal" style={{ width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}>
            <div className="modal-header">
              <h3>{editingMeetingId ? "Edit Scheduled Meeting" : "Schedule New Meeting"}</h3>
              <button className="close-btn" onClick={() => setShowScheduleModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleScheduleMeeting}>
              <div className="form-group">
                <label>Meeting Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Q3 Project Sync" 
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div className="modal-actions" style={{ flexWrap: 'wrap', gap: '10px' }}>
                <button type="button" className="cancel-btn" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="spinner" size={16} /> : "Confirm & Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;