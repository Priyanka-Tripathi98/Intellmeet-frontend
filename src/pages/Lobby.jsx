import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./lobby.css";

function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);

  // Retrieve the name saved during the first step
  const savedName = localStorage.getItem("userName") || "Participant";

  // 1. Define startPreview out here using useCallback so it's accessible everywhere
  const startPreview = useCallback(async () => {
    try {
      // Respect the user's camera toggle state when requesting media
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isCamOn,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Access denied or no devices found:", err);
    }
  }, [isCamOn]);

  // 2. Safely call it on component mount
  useEffect(() => {
    startPreview();
  }, []);

  // 3. Separate cleanup handler that accurately watches the stream state changes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Socket setup to monitor current active room size
  useEffect(() => {
    const socket = io("http://localhost:3001"); 
    socket.emit("get-participant-count", roomId);
    socket.on("participant-count", (count) => {
      setParticipantCount(count);
    });
    return () => {
      socket.off("participant-count");
      socket.disconnect(); 
    };
  }, [roomId]);

  // --- TOGGLE LOGIC ---

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCamOn;
        setIsCamOn(!isCamOn);
      }
    } else if (!isCamOn) {
      startPreview(); 
      setIsCamOn(true);
    }
  };

  const handleJoin = () => {
    // Stop the local preview tracks so they don't lock up the camera device
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    
    // ✅ NAVIGATE TO THE VIDEO ROOM: Passes the hardware configuration states safely 
    navigate(`/meeting/${roomId}`, { 
      state: { 
        startWithAudio: isMicOn, 
        startWithVideo: isCamOn,
        fromLobby: true // Tells Video.jsx that they already passed your workflow steps!
      } 
    });
  };

  return (
    <div className="lobby-wrapper">
      <div className="lobby-container">
        {/* Left Side: Video Preview */}
        <div className="preview-section">
          <div className="video-window">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`mirror ${!isCamOn ? "hidden-video" : ""}`}
            />
            {!isCamOn && (
              <div className="camera-off-msg">
                <div className="avatar-circle">
                  {savedName.charAt(0).toUpperCase()}
                </div>
                <p>Camera is off</p>
              </div>
            )}
            
            <div className="floating-controls">
              <button 
                className={`control-circle ${!isMicOn ? "red" : ""}`} 
                onClick={toggleAudio}
              >
                {isMicOn ? "🎤" : "🔇"}
              </button>
              <button 
                className={`control-circle ${!isCamOn ? "red" : ""}`} 
                onClick={toggleVideo}
              >
                {isCamOn ? "📷" : "🚫"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Join Actions */}
        <div className="join-section">
          <h2>Ready to join, {savedName}?</h2>
          {participantCount === 0 ? ( 
            <p>No one else is here yet</p>
          ) : (
            <p>{participantCount === 1 ? "1 person is in this call" : `${participantCount} people are in this call`}</p>
          )}
          <button className="join-now-btn" onClick={handleJoin}>
            Join now
          </button>
          <button className="back-btn" onClick={() => navigate("/dashboard")}> 
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lobby;