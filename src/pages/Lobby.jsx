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

  // Retrieve the name saved during the name form step
  const savedName = localStorage.getItem("userName") || "Participant";

  // 1. Unified function to acquire or re-acquire the stream based on hardware state
  const startPreview = useCallback(async () => {
    try {
      // If a track is already active, kill it cleanly before requesting a new config
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isCamOn,
        audio: isMicOn,
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Access denied or no devices found:", err);
    }
  }, [isCamOn, isMicOn]);

  // 2. React to hardware toggles safely without creating infinite mounting loops
  useEffect(() => {
    startPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCamOn]); 

  // 3. Separate cleanup handler when components unmount completely
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Socket setup to monitor current active room size
  useEffect(() => {
    const socket = io("https://intellmeet-backend-vufa.onrender.com"); 
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
    if (isCamOn) {
      // Turning off track
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
      }
      setStream(null);
      setIsCamOn(false);
    } else {
      // Turning on track
      setIsCamOn(true);
    }
  };

  const handleJoin = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    
    navigate(`/meeting/${roomId}/room`, { 
      state: { 
        startWithAudio: isMicOn, 
        startWithVideo: isCamOn,
        fromLobby: true 
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