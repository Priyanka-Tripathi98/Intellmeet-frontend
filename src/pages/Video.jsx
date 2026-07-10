import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios"; 
import { useSpeechToText } from "../hooks/useSpeechToText";
import AICompanion from "./AICompanion";
import EmojiPicker from 'emoji-picker-react';
import { Link, Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, Square, Circle, MessageSquare, PhoneOff, Send, Sparkles, Users, Copy, User } from "lucide-react";

// =========================
// VIDEO PLAYER COMPONENT
// =========================
const VideoPlayer = ({ stream, userName, isVideoActive }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  const showVideo = stream && (isVideoActive !== false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {showVideo ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#000000"
          }}
        />
      ) : (
        /* Sleek Glassmorphic Fallback Avatar */
        <div style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at center, #1e1b4b 0%, #060816 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 102, 241, 0.2))",
            border: "1px solid rgba(124, 58, 237, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            backdropFilter: "blur(4px)"
          }}>
            <span style={{ fontSize: "24px", fontWeight: "600", color: "#a78bfa", textTransform: "uppercase" }}>
              {userName ? userName.charAt(0) : "?"}
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "#4b5563", display: "flex", alignItems: "center", gap: "4px" }}>
            <VideoOff size={14} /> Camera Off
          </span>
        </div>
      )}
    </div>
  );
};

// =========================
// MAIN VIDEO COMPONENT
// =========================
function Video() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromLobby = location.state?.fromLobby || false;
  const [joined, setJoined] = useState(fromLobby);
  const [nameInput, setNameInput] = useState("");

  const startWithAudio = location.state?.startWithAudio ?? true;
  const startWithVideo = location.state?.startWithVideo ?? true;

  const socketRef = useRef();
  const userVideo = useRef();
  const streamRef = useRef();
  const peersRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const chatEndRef = useRef(null); 

  const [peers, setPeers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [isMicOn, setIsMicOn] = useState(startWithAudio);
  const [isCamOn, setIsCamOn] = useState(startWithVideo);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false); 
  const [currentUserName, setCurrentUserName] = useState("Guest");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [recordingAlert, setRecordingAlert] = useState("");
  const [aiLiveState, setAiLiveState] = useState({ status: "Listening", message: "AI is listening & collecting audio streams..." });

  const canvasRef = useRef(null);
  const [isAnnotationEnabled, setIsAnnotationEnabled] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [presenterSocketId, setPresenterSocketId] = useState(false);

  const lastPos = useRef({ x: 0, y: 0 });

  const { transcript } = useSpeechToText(isMicOn, socketRef, roomId, streamRef.current);

  const inviteLink = `${window.location.origin}/meeting/${roomId}`;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const createPeer = (userToSignal, callerId, stream, myName) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerId,
        signal,
        userName: myName,
      });
    });

    peer.on("stream", (remoteStream) => {
      setPeers((prevPeers) =>
        prevPeers.map((p) => {
          if (p.peerID === userToSignal) {
            return { ...p, stream: remoteStream };
          }
          return p;
        })
      );
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerId });
    });

    peer.on("stream", (remoteStream) => {
      setPeers((prevPeers) =>
        prevPeers.map((p) => {
          if (p.peerID === callerId) {
            return { ...p, stream: remoteStream };
          }
          return p;
        })
      );
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      alert("Please enter a name to join the meeting!");
      return;
    }
    localStorage.setItem("userName", nameInput.trim());
    setJoined(true);
  };

  useEffect(() => {
    if (!joined) return;

    let localStream = null;
    let socketTimeout;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        localStream = stream; 
        
        stream.getAudioTracks().forEach(track => track.enabled = startWithAudio);
        stream.getVideoTracks().forEach(track => track.enabled = startWithVideo);

        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        setIsCamOn(startWithVideo);
        setIsMicOn(startWithAudio);
        setCurrentUserName(localStorage.getItem("userName") || "Guest");

        socketTimeout = setTimeout(() => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }

          socketRef.current = io("https://intellmeet-backend-vufa.onrender.com", {
            transports: ["websocket"],
            forceNew: true,
            auth: {
              token: localStorage.getItem("userToken"),
              userId: localStorage.getItem("userId")
            }
          });

          socketRef.current.on("connect", () => {
            const storedName = localStorage.getItem("userName") || "Guest";
            
            socketRef.current.emit("joinRoom", {
              roomId,
              userName: storedName,
              userId: localStorage.getItem("userId"),
              isVideoActive: startWithVideo,
            });
          });

          socketRef.current.on("receive-message", (data) => {
            setMessages((prev) => [...prev, data]);
          });

          socketRef.current.on("toggle-video-track", ({ socketId, isVideoActive }) => {
            setPeers((prevPeers) =>
              prevPeers.map((p) => {
                if (p.peerID === socketId) {
                  return { ...p, isVideoActive };
                }
                return p;
              })
            );
          });

          socketRef.current.on("receive-ai-message", (data) => {
            setMessages((prev) => [...prev, {
              sender: "AI",
              message: data.text, 
              createdAt: data.createdAt
            }]);
            setAiLiveState({ status: "Speaking", message: data.text });
          });

          socketRef.current.on("live-transcript-update", (data) => {
            setLiveTranscript((prev) => prev + " " + data.text);
          });

          socketRef.current.on("meeting-notes-update", (data) => {
            setMeetingNotes(data);
          });

          socketRef.current.on("ai-status", (data) => {
            setAiLiveState({ status: data.status, message: data.message });
          });

          socketRef.current.on("recording-status-changed", (status) => {
            setIsRecording(status);
          });

          socketRef.current.on("recording-notification", (data) => {
            setRecordingAlert(data.message);
            setTimeout(() => setRecordingAlert(""), 4000);
          });

          socketRef.current.on("show-typing", ({ userName }) => {
            setTypingUser(`${userName} is typing...`);
            setTimeout(() => setTypingUser(""), 2000);
          });

          socketRef.current.on("user-current-update", () => {
            window.location.reload();
          });

          socketRef.current.on("presentation-started", ({ presenterId }) => {
            setPresenterSocketId(presenterId);
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          });

          socketRef.current.on("presentation-stopped", () => {
            setPresenterSocketId(null);
            setIsAnnotationEnabled(false);
          });

          socketRef.current.on("draw-coordinates", ({ x, y, lastX, lastY, color, isMoving }) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");

            const currentX = x * canvas.width;
            const currentY = y * canvas.height;
            const prevX = lastX * canvas.width;
            const prevY = lastY * canvas.height;

            ctx.strokeStyle = color || "#ff0055";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            if (isMoving && lastX !== undefined) {
              ctx.moveTo(prevX, prevY);
              ctx.lineTo(currentX, currentY);
              ctx.stroke();
            } else {
              ctx.arc(currentX, currentY, 2, 0, 2 * Math.PI);
              ctx.fillStyle = color || "#ff0055";
              ctx.fill();
            }
          });

          socketRef.current.on("clear-annotations", () => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          });

          socketRef.current.on("all users", (users) => {
            const peersArray = [];
            users.forEach((user) => {
              const exists = peersRef.current.find((p) => p.peerID === user.socketId);
              if (exists) return;

              const myName = localStorage.getItem("userName") || "Guest";
              
              const peer = createPeer(user.socketId, socketRef.current.id, localStream, myName);
              const peerData = {
                peerID: user.socketId,
                userName: user.userName, 
                peer,
                stream: null,
                isVideoActive: user.isVideoActive
              };

              peer.on("stream", (remoteStream) => {
                peerData.stream = remoteStream; 
                setPeers((prevPeers) =>
                  prevPeers.map((p) => (p.peerID === user.socketId ? { ...p, stream: remoteStream } : p))
                );
              });
              peersRef.current.push(peerData);
              peersArray.push(peerData);
            });
            setPeers(peersArray);
          });

          socketRef.current.on("user joined", (payload) => {
            const exists = peersRef.current.find((p) => p.peerID === payload.callerId);
            if (exists) return;

            const peer = addPeer(payload.signal, payload.callerId, localStream);
            const peerData = {
              peerID: payload.callerId,
              userName: payload.userName, 
              peer,
              stream: null,
              isVideoActive: payload.isVideoActive
            };
            
            peer.on("stream", (remoteStream) => {
              peerData.stream = remoteStream; 
              setPeers((prevPeers) =>
                prevPeers.map((p) => (p.peerID === payload.callerId ? { ...p, stream: remoteStream } : p))
              );
            });
            peersRef.current.push(peerData);
            setPeers((prev) => [...prev, peerData]);
          });

          socketRef.current.on("receiving returned signal", (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (item) item.peer.signal(payload.signal);
          });

          socketRef.current.on("user-disconnected", (id) => {
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) peerObj.peer.destroy();
            peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
            setPeers([...peersRef.current]);
          });
        }, 150);

      })
      .catch((err) => {
        console.error("Camera access error:", err);
        alert("Camera/Microphone permission denied or device in use by another app.");
        setJoined(false);
      });

    return () => {
      clearTimeout(socketTimeout);
      peersRef.current.forEach((p) => p.peer.destroy());
      peersRef.current = [];
      setPeers([]);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [joined, roomId]);
      
  const sendMessage = () => {
    if (!message.trim()) return;
    socketRef.current.emit("send-message", {
      roomId,
      message: message.trim(),
      sender: currentUserName, 
    });
    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit("typing", { roomId, userName: currentUserName });
    }
  };

  const toggleMute = () => {
    if (!streamRef.current) return;
    const nextMicState = !isMicOn; 
    streamRef.current.getAudioTracks().forEach((track) => { track.enabled = nextMicState; });
    setIsMicOn(nextMicState);
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);

        if (socketRef.current) {
          socketRef.current.emit("toggle-video-track", {
            roomId,
            isVideoActive: videoTrack.enabled
          });
        }
      }
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (userVideo.current) userVideo.current.srcObject = stream;
          setIsCamOn(true);
        })
        .catch((err) => console.error("Error restarting video stream:", err));
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) return;
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      peersRef.current.forEach(({ peer }) => {
        const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);
      });

      if (userVideo.current) userVideo.current.srcObject = screenStream;
      setIsSharingScreen(true);
    
      socketRef.current.emit("start-presentation", {roomId});
      setPresenterSocketId(socketRef.current.id);

      screenTrack.onended = async () => {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoTrack = cameraStream.getVideoTracks()[0];

        peersRef.current.forEach(({ peer }) => {
          const sender = peer._pc.getSenders().find((s) => s.track && s.track.kind === "video");
          if (sender) sender.replaceTrack(videoTrack);
        });

        streamRef.current = cameraStream;
        if (userVideo.current) userVideo.current.srcObject = cameraStream;
        setIsSharingScreen(false);

        socketRef.current.emit("stop-presentation", { roomId });
        setPresenterSocketId(null);
      };
    } catch (err) {
      console.log(err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Meeting link copied!");
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  const endCall = async () => {
    try {
      await axios.post("https://intellmeet-backend-vufa.onrender.com/meetings/end", { roomId });
      try {
        await axios.post("https://intellmeet-backend-vufa.onrender.com/api/ai-summary", {
          text: liveTranscript || "",
          roomId
        });
      } catch (e) {
        console.log("AI summary failed but meeting still ended");
      }
      socketRef.current?.emit("leaveRoom", roomId);
    } finally {
      navigate("/dashboard");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    let options = {};
    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
      options = { mimeType: "video/webm;codecs=vp9" };
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      options = { mimeType: "video/webm" };
    }

    const combinedStream = new MediaStream();
    streamRef.current.getTracks().forEach(track => {
      combinedStream.addTrack(track);
    });

    const mediaRecorder = new MediaRecorder(combinedStream, options);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const file = new File([videoBlob], `meeting-${roomId}.webm`, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", file);
      formData.append("meetingCode", roomId);

      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("token");
        await axios.post(
          "https://intellmeet-backend-vufa.onrender.com/meetings/upload-recording",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        alert("Recording uploaded successfully!");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to upload recording");
      }
    };

    mediaRecorder.start(1000);
    setIsRecording(true);

    if (socketRef.current) {
      socketRef.current.emit("toggle-recording-state", {
        roomId,
        status: true,
        userName: currentUserName,
      });
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }

  const getRelativeCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  };

  const startDrawing = (e) => {
    if (!isAnnotationEnabled) return;
    const coords = getRelativeCoords(e);
    lastPos.current = coords;
    setIsDrawing(true);

    socketRef.current.emit("draw", {
      roomId,
      ...coords,
      isMoving: false,
      color: "#ff0055"
    });
  };

  const draw = (e) => {
    if (!isDrawing || !isAnnotationEnabled) return;
    const coords = getRelativeCoords(e);

    socketRef.current.emit("draw", {
      roomId,
      ...coords,
      lastX: lastPos.current.x,
      lastY: lastPos.current.y,
      isMoving: true,
      color: "#ff0055"
    });

    lastPos.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  if (!joined) {
    return (
      <div
        className="lobby-contain"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          backgroundColor: "#060816",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <form
          onSubmit={handleJoinMeeting}
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: " 0 0 40px rgba(124, 58, 237, 0.15)",
            textAlign: "center",
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "25px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #7c3aed, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", margin: 0, color: "#ffffff" }}>
              Intell<span style={{ color: "#9ca3af" }}>Meet</span>
            </h1>
          </div>
          <h3>Join Video Call</h3>
          <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "25px" }}>Room ID: {roomId}</p>
          <input
            type="text"
            value={nameInput}
            placeholder="Enter your name..."
            required
            onChange={(e) => setNameInput(e.target.value)}
            style={{ width: "100%", padding: "12px 15px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#060816", color: "#fff", fontSize: "16px" }}
          />
          <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#007fff", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "20px" }}>
            Continue
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", backgroundColor: "#f2f1f1", color: "#007fff", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        background: "#060816",
        color: "#f3f4f6",
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* LEFT SIDE: MAIN STAGE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          background: "radial-gradient(circle at top left, rgba(17, 24, 39, 0.6), #060816)",
          overflow: "hidden",
        }}
      >
        {/* TOP COMPACT BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,.05)",
            backgroundColor: "rgba(6, 8, 22, 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600", letterSpacing: "-0.3px" }}>
              Room ID: <span style={{ color: "#a78bfa", fontFamily: "monospace" }}>{roomId}</span>
            </h2>
            <button 
              onClick={copyLink}
              style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: "6px", color: "#9ca3af", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", cursor: "pointer" }}
            >
              <Copy size={13} /> Copy Link
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: isRecording ? "rgba(239,68,68,.12)" : "rgba(255,255,255,.04)", border: isRecording ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", color: isRecording ? "#ef4444" : "#9ca3af" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isRecording ? "#ef4444" : "#9ca3af", boxShadow: isRecording ? "0 0 8px #ef4444" : "none" }} />
              {isRecording ? "REC ON" : "REC OFF"}
            </div>
            {recordingAlert && (
              <div className="recording-modal" style={{
                position: 'fixed',
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                backgroundColor: 'rgba(30, 30, 40, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                padding: '16px 24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                minWidth: '280px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: 0, color: '#ef4444', fontSize: '1.05rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                  Recording Started
                </h3>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '400', lineHeight: '1.4' }}>
                  {recordingAlert}
                </p>
                <button 
                  onClick={() => setRecordingAlert("")}
                  style={{ marginTop: '4px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '5px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }}
                >
                  OK
                </button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#9ca3af", background: "rgba(255,255,255,0.04)", padding: "6px 12px", borderRadius: "20px" }}>
              <Users size={14} />
              <span>{peers.length + 1} Connected</span>
            </div>
          </div>
        </div>

        {/* COMPACT TYPING BANNER */}
        {typingUser && (
          <div style={{ position: "absolute", top: "75px", left: "24px", zIndex: 10, background: "rgba(124, 58, 237, 0.2)", backdropFilter: "blur(4px)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
            {typingUser}
          </div>
        )}

        {/* DYNAMIC FLEX WRAPPER FOR STREAMS */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
          }}
        >
          {/* MY CALL WINDOW */}
          <div
            style={{
              position: "relative",
              background: "#000000",
              borderRadius: "16px",
              border: isCamOn ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(124, 58, 237, 0.25)",
              overflow: "hidden",
              boxShadow: isCamOn ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(124, 58, 237, 0.1)",
              aspectRatio: "16 / 9",
              flex: "1 1 400px",
              maxWidth: "800px",
              minHeight: "240px"
            }}
          >
            <video
              ref={userVideo}
              autoPlay
              playsInline
              muted
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: isCamOn ? "block" : "none"
              }}
            />
            {(isSharingScreen || presenterSocketId) && (
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
                width={1280}
                height={720}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  cursor: isAnnotationEnabled ? "crosshair" : "default",
                  pointerEvents: isAnnotationEnabled ? "auto" : "none"
                }}
              />
            )}
            {!isCamOn && (
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "radial-gradient(circle at center, #111827 0%, #060816 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
                zIndex: 1,
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
                }}>
                  <span style={{ fontSize: "28px", fontWeight: "600", color: "#c084fc", textTransform: "uppercase" }}>
                    {currentUserName ? currentUserName.charAt(0) : "U"}
                  </span>
                </div>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>Your camera is off</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", zIndex: 5 }}>
              {currentUserName} (You)
            </div>
          </div>

          {/* REMOTE PARTICIPANT WINDOWS */}
          {peers.map((peerObj) => (
            <div
              key={peerObj.peerID}
              style={{
                position: "relative",
                background: "#000000",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                aspectRatio: "16 / 9",
                flex: "1 1 400px",
                maxWidth: "800px",
                minHeight: "240px"
              }}
            >
              <VideoPlayer 
                stream={peerObj.stream} 
                userName={peerObj.userName} 
                isVideoActive={peerObj.isVideoActive} 
              />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.6)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", zIndex: 5 }}>
                {peerObj.userName || "Participant"}
              </div>
            </div>
          ))}
        </div>

        {/* FLOATING ACTION BOTTOM BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            padding: "20px",
            backgroundColor: "rgba(6, 8, 22, 0.85)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button onClick={toggleMute} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: isMicOn ? "rgba(255,255,255,0.08)" : "#ef4444", color: "#ffffff", display: "flex", alignItems: "center", justifyConent: "center", cursor: "pointer", transition: "0.2s" }}>
            {isMicOn ? <Mic size={20} style={{ margin: "auto" }} /> : <MicOff size={20} style={{ margin: "auto" }} />}
          </button>

          <button onClick={toggleCamera} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: isCamOn ? "rgba(255,255,255,0.08)" : "#ef4444", color: "#ffffff", display: "flex", alignItems: "center", justifyConent: "center", cursor: "pointer", transition: "0.2s" }}>
            {isCamOn ? <VideoIcon size={20} style={{ margin: "auto" }} /> : <VideoOff size={20} style={{ margin: "auto" }} />}
          </button>

          <button onClick={toggleScreenShare} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: isSharingScreen ? "#10b981" : "rgba(255,255,255,0.08)", color: "#ffffff", display: "flex", alignItems: "center", justifyConent: "center", cursor: "pointer", transition: "0.2s" }}>
            <Monitor size={20} style={{ margin: "auto" }} />
          </button>

          {isSharingScreen && (
            <button onClick={() => setIsAnnotationEnabled(!isAnnotationEnabled)} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: isAnnotationEnabled ? "#7c3aed" : "rgba(255,255,255,0.08)", color: "#ffffff", display: "flex", alignItems: "center", justifyConent: "center", cursor: "pointer", transition: "0.2s" }}>
              <Sparkles size={20} style={{ margin: "auto" }} />
            </button>
          )}

          <button onClick={isRecording ? stopRecording : startRecording} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: isRecording ? "#ef4444" : "rgba(255,255,255,0.08)", color: "#ffffff", display: "flex", alignItems: "center", justifyConent: "center", cursor: "pointer", transition: "0.2s" }}>
            {isRecording ? <Square size={18} style={{ margin: "auto" }} /> : <Circle size={18} style={{ fill: "#ef4444", stroke: "#ef4444", margin: "auto" }} />}
          </button>

          <button onClick={() => setIsChatOpen(!isChatOpen)} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "none", backgroundColor: isChatOpen ? "#7c3aed" : "rgba(255,255,255,0.08)", color: "#ffffff", display: "flex", alignItems: "center", justifyConent: "center", cursor: "pointer", transition: "0.2s" }}>
            <MessageSquare size={20} style={{ margin: "auto" }} />
          </button>

          <button onClick={endCall} style={{ padding: "0 24px", height: "48px", borderRadius: "24px", border: "none", backgroundColor: "#ef4444", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", cursor: "pointer", transition: "0.2s" }}>
            <PhoneOff size={18} /> End Call
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR: INTELLIGENT COMPANION & CHATPANEL */}
      {isChatOpen && (
        <div
          style={{
            width: "380px",
            background: "#0b0f19",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER CHAT SELECTIONS */}
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Room Dashboard</h3>
          </div>

          {/* TRANSCRIPT & NOTES BOX (AI SUMMARY VIEWPORT)
          <AICompanion 
            aiState={aiLiveState} 
            meetingNotes={meetingNotes} 
            liveTranscript={liveTranscript} 
          /> */}

          {/* CHAT MESSAGES DISPLAY STAGE */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  alignSelf: msg.sender === currentUserName ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: msg.sender === "AI" ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.2))" : msg.sender === currentUserName ? "#7c3aed" : "rgba(255,255,255,0.06)",
                  border: msg.sender === "AI" ? "1px solid rgba(124,58,237,0.3)" : "none",
                  padding: "10px 14px",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "11px", color: msg.sender === "AI" ? "#c084fc" : "rgba(255,255,255,0.5)", marginBottom: "4px", fontWeight: "600" }}>
                  {msg.sender}
                </div>
                <div style={{ fontSize: "14px", wordBreak: "break-word" }}>{msg.message}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
  
  {/* Render the floating Emoji Picker above the input if toggle is active */}
  {showEmojiPicker && (
    <div style={{ position: 'absolute', bottom: '70px', right: '10px', zIndex: 1000 }}>
      <EmojiPicker 
        theme="dark"
        onEmojiClick={(emojiData) => {
          // Appends the chosen emoji character to your current message string text
          setMessage((prev) => prev + emojiData.emoji);
          setShowEmojiPicker(false); // Auto-close picker window after selecting
        }} 
      />
    </div>
  )}

  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
    
    {/* Sleek Smile Button to Toggle Picker Window */}
    <button 
      type="button"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      style={{ background: 'none', border: 'none', color: showEmojiPicker ? '#a78bfa' : '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
    >
      😊
    </button>

    <input
      type="text"
      value={message}
      onChange={handleInputChange}
      placeholder="Type a message..."
      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      style={{ flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '14px' }}
    />

    <button 
      onClick={sendMessage}
      style={{ background: '#7c3aed', border: 'none', borderRadius: '6px', color: '#fff', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Send size={14} />
    </button>
  </div>
</div>

          {/* INPUT BAR SYSTEM */}
          <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Message clean room sync..."
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "14px" }}
              />
              <button onClick={sendMessage} style={{ backgroundColor: "#7c3aed", color: "#ffffff", border: "none", borderRadius: "8px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Video;