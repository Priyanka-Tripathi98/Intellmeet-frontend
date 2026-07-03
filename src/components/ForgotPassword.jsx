import { useState } from "react";
import axios from "axios";
import "./forgotPassword.css";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:3001/forgot-password",
        { email }
      );

      alert(res.data.message);

    } catch (error) {

      alert("Something went wrong");

    }

  };

  return (

    <div className="forgot-wrapper">

      <form
        onSubmit={handleSubmit}
        className="forgot-card"
      >

        <div className="forgot-icon">
          <Mail size={32} />
        </div>

        <h2 className="forgot-title">
          Forgot Password
        </h2>

        <p className="forgot-subtitle">
          Enter your registered email address and
          we’ll send you a reset password link.
        </p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        </div>

        <button
          type="submit"
          className="reset-btn"
        >
          Send Reset Link
        </button>

        <div className="back-login">

          <Link to="/login">
            <ArrowLeft size={16} />
            Back to Login
          </Link>

        </div>

      </form>

    </div>

  );

}

export default ForgotPassword;