import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const PrescriptionForm = () => {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    patient_id: '',
    medication: '',
    dosage: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    try {
      const prescriptionData = {
        ...formData,
        patient_id: parseInt(formData.patient_id)
      };

      const response = await axios.post('http://localhost:8000/prescriptions', prescriptionData);
      setSuccess(`Prescription created successfully! ${response.data.message}`);
      
      // Optionally download the PDF
      if (response.data.download_url) {
        window.open(`http://localhost:8000${response.data.download_url}`, '_blank');
      }

      // Clear form
      setFormData({
        patient_id: '',
        medication: '',
        dosage: '',
        instructions: ''
      });

    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  // Only doctors can access this component
  if (user?.user_type !== 'doctor') {
    return (
      <div className="prescription-form">
        <div className="error-message">
          Only doctors can create prescriptions.
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="prescription-form">
      <div className="form-container">
        <h2>Create Prescription - Appointment #{appointmentId}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patient_id">Patient ID:</label>
            <input
              type="number"
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              placeholder="Enter patient ID"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="medication">Medication:</label>
            <input
              type="text"
              id="medication"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              placeholder="e.g., Amoxicillin 500mg"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dosage">Dosage:</label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 1 tablet twice daily"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="instructions">Instructions:</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Additional instructions for the patient..."
              rows="4"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating Prescription...' : 'Create Prescription'}
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

export default PrescriptionForm;