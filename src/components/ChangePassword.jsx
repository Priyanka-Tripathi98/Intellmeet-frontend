import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./changePassword.css";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "https://intellmeet-backend-vufa.onrender.com/profile/change-password",
        { oldPassword: currentPassword.trim(),
          newPassword: newPassword.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password changed successfully.");
      navigate("/dashboard/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
      <div className="change-password-card-title">
      <h2>🔐 Security & Password</h2>

        <form onSubmit={handleChangePassword} className="change-form">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;