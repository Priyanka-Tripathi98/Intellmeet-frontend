// src/hooks/useSpeechToText.js
import { useEffect, useRef, useState } from 'react';

export function useSpeechToText(isMicOn, socketRef, roomId, existingStream) {
  const mediaRecorderRef = useRef(null);
  const [liveTranscript, setLiveTranscript] = useState("");

  // ============================================================================
  // LISTEN FOR THE BACKEND'S AGGREGATED TEXT SENTENCES
  // ============================================================================
  useEffect(() => {
    if (!socketRef.current) return;

    const handleTranscriptUpdate = (data) => {
      if (data && data.text) {
        // Appends new sentences with clean spacing
        setLiveTranscript((prev) => prev + " " + data.text.trim());
      }
    };

    socketRef.current.on("live-transcript-update", handleTranscriptUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("live-transcript-update", handleTranscriptUpdate);
      }
    };
  }, [socketRef.current]);

  // ============================================================================
  // CAPTURE AUDIO TRACKS & STREAM RAW SEGMENTS
  // ============================================================================
  useEffect(() => {
    if (isMicOn && socketRef.current && existingStream) {
      try {
        const audioTrack = existingStream.getAudioTracks()[0];
        if (!audioTrack) return;

        const audioStream = new MediaStream([audioTrack]);
        const mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          // Dropped size check slightly to ensure shorter vocal elements aren't cut out
          if (event.data && event.data.size > 500 && socketRef.current) { 
            const arrayBuffer = await event.data.arrayBuffer();
            
            if (socketRef.current.connected) {
              console.log("📤 Sending audio chunk to backend processing buffer...");
              socketRef.current.emit("audio-chunk", {
                roomId,
                audioBuffer: arrayBuffer
              });
            }
          }
        };

        // 👇 OPTIMIZATION VALUE: Slice every 400ms. 
        // 45 chunks * 400ms = 18 seconds of aggregated audio per Gemini API request cycle!
        mediaRecorder.start(400); 
      } catch (err) {
        console.error("MediaRecorder startup failure:", err);
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch(e) {}
      }
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch(e) {}
      }
    };
  }, [isMicOn, roomId, existingStream, socketRef.current]);

  // Returns exact matching variable key referenced in Video.jsx destructuring
  return { transcript: liveTranscript };
}