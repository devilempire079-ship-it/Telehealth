import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Simulate connection
    setIsConnected(true);
    
    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: `Welcome to the chat consultation for Appointment #${appointmentId}`,
      sender: 'system',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);

    // Simulate doctor/patient joining
    setTimeout(() => {
      const joinMessage = {
        id: Date.now() + 1,
        text: `${user?.user_type === 'doctor' ? 'Patient' : 'Doctor'} will join shortly...`,
        sender: 'system',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, joinMessage]);
    }, 2000);

    return () => {
      setIsConnected(false);
    };
  }, [appointmentId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: user?.user_type,
      senderName: user?.full_name,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response from other party (for demo purposes)
    if (user?.user_type === 'patient') {
      setTimeout(() => {
        const doctorResponse = {
          id: Date.now() + 1,
          text: "Thank you for sharing. Let me review your concerns...",
          sender: 'doctor',
          senderName: 'Dr. Smith',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, doctorResponse]);
      }, 2000);
    } else {
      setTimeout(() => {
        const patientResponse = {
          id: Date.now() + 1,
          text: "Thank you, Doctor. I understand.",
          sender: 'patient',
          senderName: 'Patient',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, patientResponse]);
      }, 2000);
    }
  };

  const endChat = () => {
    navigate('/dashboard');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-consultation">
      <div className="chat-header">
        <h2>Chat Consultation - Appointment #{appointmentId}</h2>
        <div className="chat-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
        </div>
        <button onClick={endChat} className="btn btn-danger">
          End Chat
        </button>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === 'system' 
                  ? 'system-message' 
                  : message.sender === user?.user_type 
                    ? 'own-message' 
                    : 'other-message'
              }`}
            >
              {message.sender !== 'system' && (
                <div className="message-header">
                  <span className="sender-name">{message.senderName}</span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              )}
              <div className="message-text">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-form">
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={!isConnected || !newMessage.trim()}
              className="send-button"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      <div className="chat-info">
        <p><strong>Participant:</strong> {user?.full_name} ({user?.user_type})</p>
        <p><strong>Note:</strong> This is a simplified chat implementation. 
           In production, you would use WebSocket or Socket.IO for real-time messaging.</p>
      </div>
    </div>
  );
};

export default Chat;