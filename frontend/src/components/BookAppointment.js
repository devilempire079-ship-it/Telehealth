import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_time: '',
    consultation_type: 'video'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8000/doctors');
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to fetch doctors');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        ...formData,
        doctor_id: parseInt(formData.doctor_id),
        appointment_time: new Date(formData.appointment_time).toISOString()
      };

      await axios.post('http://localhost:8000/appointments', appointmentData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get current date-time for minimum datetime input
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="book-appointment">
      <div className="form-container">
        <h2>Book New Appointment</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="doctor_id">Select Doctor:</label>
            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.full_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="appointment_time">Appointment Date & Time:</label>
            <input
              type="datetime-local"
              id="appointment_time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              min={getCurrentDateTime()}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="consultation_type">Consultation Type:</label>
            <select
              id="consultation_type"
              name="consultation_type"
              value={formData.consultation_type}
              onChange={handleChange}
              required
            >
              <option value="video">Video Call</option>
              <option value="chat">Text Chat</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;