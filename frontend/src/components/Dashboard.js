import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const joinConsultation = (appointment) => {
    if (appointment.consultation_type === 'video') {
      navigate(`/video-call/${appointment.id}`);
    } else {
      navigate(`/chat/${appointment.id}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Telehealth Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.full_name} ({user?.user_type})</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="actions">
          {user?.user_type === 'patient' && (
            <Link to="/book-appointment" className="btn btn-primary">
              Book New Appointment
            </Link>
          )}
        </div>

        <div className="appointments-section">
          <h2>Your Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>Appointment #{appointment.id}</h3>
                    <p><strong>Date:</strong> {formatDate(appointment.appointment_time)}</p>
                    <p><strong>Type:</strong> {appointment.consultation_type}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                    {user?.user_type === 'patient' && (
                      <p><strong>Doctor ID:</strong> {appointment.doctor_id}</p>
                    )}
                    {user?.user_type === 'doctor' && (
                      <p><strong>Patient ID:</strong> {appointment.patient_id}</p>
                    )}
                  </div>
                  <div className="appointment-actions">
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => joinConsultation(appointment)}
                        className="btn btn-success"
                      >
                        Join Consultation
                      </button>
                    )}
                    {user?.user_type === 'doctor' && appointment.status === 'scheduled' && (
                      <Link
                        to={`/prescription/${appointment.id}`}
                        className="btn btn-secondary"
                      >
                        Create Prescription
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;