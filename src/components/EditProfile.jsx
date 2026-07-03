import { useState, useEffect } from "react";
import axios from "axios";
import "./edit.css";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../assets/profile.jpg";

function EditProfile() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Your Backend URL
  const API_URL = "https://intellmeet-backend-vufa.onrender.com";

  // ✅ Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login again");
          return;
        }

        const res = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const user = res.data.user;

        setName(user.name || "");
        setEmail(user.email || "");
        setUsername(user.username || "");

        // ✅ Ensure the path includes the backend URL correctly
        if (user.profilePic) {
          const fullPath = user.profilePic.startsWith("http") 
            ? user.profilePic 
            : `${API_URL}/${user.profilePic}`;
          setAvatar(fullPath);
        } else {
          setAvatar(DefaultProfile);
        }

      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result); // preview data string becomes raw base64 data uri here
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token missing, login again");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("username", username);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await axios.put(`${API_URL}/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPDATED:", res.data);
      alert("Profile updated successfully ✅");

      navigate("/dashboard/profile");

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW INTERCEPTOR HELPER FUNCTION
  // Prevents append modifications from poisoning raw text files or local assets
  const getAvatarSrc = () => {
    if (!avatar) return DefaultProfile;
    
    // If it's a freshly loaded preview (base64 data), do NOT append a timestamp
    if (avatar.startsWith("data:") || avatar.startsWith("blob:") || avatar.startsWith("static/")) {
      return avatar;
    }

    // Only add cache-busting to live network web links
    return `${avatar}${avatar.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;
  };

  return (
    <div className="ig-edit-container">
      <div className="ig-edit-card">

        {/* Profile Header */}
        <div className="ig-profile-header">
          <div className="ig-avatar">
            <img
              /* ✅ FIX IMPLEMENTED HERE */
              src={getAvatarSrc()}
              alt="profile"
            />
          </div>

          <div className="ig-avatar-info">
            <span className="ig-username-display">
              {username || name || "User"}
            </span>

            <button
              type="button"
              className="change-photo-btn"
              onClick={() => document.getElementById("avatar-upload").click()}
            >
              Change profile photo
            </button>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="ig-form">

          <div className="ig-input-row">
            <label>Name</label>
            <div className="ig-input-field">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="ig-input-row">
            <label>Username</label>
            <div className="ig-input-field">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="ig-input-row">
            <label>Email</label>
            <div className="ig-input-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="ig-form-footer">
            <button
              type="submit"
              className="ig-submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="ig-cancel-link"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;