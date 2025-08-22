import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState('Connecting...');
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    initializeMedia();
    return () => {
      cleanupCall();
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setCallStatus('Ready to connect');
      setIsCallActive(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setCallStatus('Failed to access camera/microphone');
    }
  };

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      setCallStatus(`Connection: ${peerConnection.iceConnectionState}`);
    };

    return peerConnection;
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanupCall();
    navigate('/dashboard');
  };

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setIsCallActive(false);
  };

  return (
    <div className="video-call">
      <div className="video-call-header">
        <h2>Video Consultation - Appointment #{appointmentId}</h2>
        <div className="call-status">{callStatus}</div>
      </div>

      <div className="video-container">
        <div className="remote-video">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            className="remote-video-element"
          />
          <div className="video-label">Remote</div>
        </div>

        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="local-video-element"
          />
          <div className="video-label">You</div>
        </div>
      </div>

      <div className="call-controls">
        <button
          onClick={toggleVideo}
          className={`control-btn ${isVideoEnabled ? 'active' : 'inactive'}`}
        >
          {isVideoEnabled ? '📹' : '📹❌'} Video
        </button>
        
        <button
          onClick={toggleAudio}
          className={`control-btn ${isAudioEnabled ? 'active' : 'inactive'}`}
        >
          {isAudioEnabled ? '🎤' : '🎤❌'} Audio
        </button>
        
        <button onClick={endCall} className="control-btn end-call">
          📞❌ End Call
        </button>
      </div>

      <div className="call-info">
        <p><strong>Participant:</strong> {user?.full_name} ({user?.user_type})</p>
        <p><strong>Note:</strong> This is a simplified WebRTC implementation. 
           In production, you would need a signaling server for peer discovery.</p>
      </div>
    </div>
  );
};

export default VideoCall;