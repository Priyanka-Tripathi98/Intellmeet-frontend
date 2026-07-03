import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Shield, ChevronRight } from "lucide-react";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: ""
  });
  const [loading, setLoading] = useState(false);

  const API_URL = "https://intellmeet-backend-vufa.onrender.com";
  const navigate = useNavigate();
  const location = useLocation(); // Used to accurately highlight active sidebar states

  // ✅ Fetch Profile Data safely on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Session expired. Please login again.");
          return navigate("/login");
        }

        const res = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Cleaned up text update handling to match your backend structure perfectly
  const handleSave = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem("token");
      
      // Using FormData ensures it interfaces safely with your backend Multer middleware
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("username", user.username || ""); // Pass username if it exists on user state

      const res = await axios.put(
        `${API_URL}/profile/update`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
          },
        }
      );

      if (res.data?.success) {
        setUser(res.data.user);
        alert("Profile Updated Successfully ✅");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Profile update patch submission error:", error);
      alert("Failed To Update Profile Settings ❌");
    } finally {
      // Clean up local loading states
      setLoading(false);
    }
  };
  // ✅ Extracted Image String Resolver Logic
  const getAvatarSrc = () => {
    if (!user?.profilePic) return null;
    
    const baseUri = user.profilePic.startsWith("http")
      ? user.profilePic
      : `${API_URL}/${user.profilePic}`;

    return `${baseUri}?t=${new Date().getTime()}`;
  };

  return (
    <div className="profile-wrapper">
      <div className="settings-layout">
        
        {/* ================= SIDEBAR SECTION ================= */}
        <div className="settings-sidebar">
          <div className="sidebar-header-title">
            <h3>Account Settings</h3>
          </div>
          <div className="settings-menu">
            
            {/* Profile Row Button */}
            <button 
              onClick={() => navigate("/dashboard/profile")}
              className={`settings-item ${location.pathname === "/dashboard/profile" ? "active" : ""}`}
            >
              <div className="settings-item-left">
                <User className="sidebar-icon" size={18} /> 
                <span>My Profile</span>
              </div>
              <ChevronRight className="sidebar-arrow" size={16} />
            </button>

            {/* Security Row Link Button */}
            <button 
              onClick={() => navigate("/dashboard/profile/change-password")}
              className={`settings-item ${location.pathname.includes("change-password") ? "active" : ""}`}
            >
              <div className="settings-item-left">
                <Shield className="sidebar-icon" size={18} />
                <span>Security & Password</span>
              </div>
              <ChevronRight className="sidebar-arrow" size={16} />
            </button>

          </div>
        </div>
        {/* ================================================== */}

        {/* Right Hand Settings Customization panel card wrapper */}
        <div className="profile-card">
          <h1 className="profile-title">Profile</h1>

          {/* User Account Sub-Header Details Grid Block */}
          <div className="profile-header">
            <div className="avatar">
              {user?.profilePic ? (
                <img src={getAvatarSrc()} alt="Profile" />
              ) : (
                <span className="avatar-initial">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>

            <div className="profile-meta-details">
              <h2>{user?.name || "Loading..."}</h2>
              <p>{user?.email || ""}</p>
              <div className="change-photo">
                <Link to="/dashboard/profile/edit">Change Photo</Link>
              </div>
            </div>
          </div>

          {/* Interactive Core Payload Text Input Form Fields */}
          <div className="profile-info">
            <div className="info-group">
              <label>Full Name</label>
              <input
                type="text"
                value={user?.name || ""}
                onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="info-group">
              <label>Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Persistent Save Operation Execution CTA */}
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default Profile;