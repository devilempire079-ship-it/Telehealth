# Telehealth MVP

A minimal but working telehealth application built with React (frontend) and FastAPI (backend) with PostgreSQL database.

## Features

### Core Features
- **Patient & Doctor Authentication**: JWT-based login system
- **Appointment Booking**: Patients can book video or chat consultations with doctors
- **Video Consultation**: WebRTC-based video calls between patients and doctors
- **Chat Consultation**: Text-based consultation for low bandwidth scenarios
- **PDF Prescription Generation**: Doctors can create and download PDF prescriptions

### Technical Features
- **Frontend**: React with modern hooks and context API
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL for data persistence
- **Authentication**: JWT tokens for secure access
- **Privacy**: Basic encryption and minimal data storage
- **Containerization**: Docker support for easy deployment

## Project Structure

```
telehealth/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main application file
│   ├── database.py         # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker configuration
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── App.js          # Main App component
│   │   ├── App.css         # Application styles
│   │   └── index.js        # Entry point
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml      # Docker orchestration
└── README.md              # This file
```

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your system
- Git (to clone the repository)

### 1. Clone and Start the Application

```bash
# Navigate to the project directory
cd telehealth

# Start all services with Docker Compose
docker-compose up --build
```

This command will:
- Build the backend and frontend Docker images
- Start PostgreSQL database
- Start the FastAPI backend on port 8000
- Start the React frontend on port 3000

### 2. Access the Application

- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: Available at http://localhost:8000
- **API Documentation**: Visit http://localhost:8000/docs for interactive API docs

### 3. Create Test Accounts

1. Navigate to http://localhost:3000
2. Click "Register here" to create accounts
3. Create at least one doctor account and one patient account

**Example accounts to create:**
- Doctor: email=`doctor@test.com`, password=`password123`, type=`doctor`
- Patient: email=`patient@test.com`, password=`password123`, type=`patient`

## Manual Setup (Alternative)

If you prefer to run without Docker:

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL database
# Create database named 'telehealth' with user 'postgres' and password 'password'

# Run the backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Database Setup

Ensure PostgreSQL is running with:
- Database: `telehealth`
- User: `postgres`
- Password: `password`
- Host: `localhost`
- Port: `5432`

## Usage Guide

### 1. Registration and Login
- Visit the application at http://localhost:3000
- Register as either a `patient` or `doctor`
- Login with your credentials

### 2. For Patients

#### Book an Appointment
1. Login and go to Dashboard
2. Click "Book New Appointment"
3. Select a doctor, date/time, and consultation type (video/chat)
4. Submit the appointment

#### Join a Consultation
1. Go to Dashboard and find your scheduled appointment
2. Click "Join Consultation" when ready
3. For video calls: Allow camera/microphone access
4. For chat: Start typing messages

### 3. For Doctors

#### View Appointments
1. Login and go to Dashboard
2. See all scheduled appointments with patients

#### Join Consultations
1. Click "Join Consultation" for scheduled appointments
2. Conduct video call or chat session

#### Create Prescriptions
1. During or after a consultation, click "Create Prescription"
2. Fill in patient ID, medication, dosage, and instructions
3. Submit to generate and download PDF prescription

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Appointments
- `GET /appointments` - Get user's appointments
- `POST /appointments` - Book new appointment
- `GET /doctors` - Get list of doctors

### Prescriptions
- `POST /prescriptions` - Create prescription (doctors only)
- `GET /prescriptions/{filename}` - Download prescription PDF

## Architecture

### Backend (FastAPI)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: SQLAlchemy ORM with PostgreSQL
- **API**: RESTful endpoints with automatic OpenAPI documentation
- **File Handling**: PDF generation using ReportLab

### Frontend (React)
- **State Management**: React Context API for authentication
- **Routing**: React Router for navigation
- **HTTP Client**: Axios for API communication
- **Video**: WebRTC for peer-to-peer video calls
- **Styling**: CSS with responsive design

### Database Schema
- **Users**: Store patient and doctor information
- **Appointments**: Track consultation bookings
- **Prescriptions**: Store prescription details

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Input Validation**: Pydantic schemas for request validation

## Development Notes

### WebRTC Implementation
The video call feature uses WebRTC for peer-to-peer communication. In this MVP:
- Basic WebRTC setup with STUN servers
- Local and remote video streams
- Audio/video controls
- For production, consider implementing a signaling server

### Chat System
The chat feature is simplified for demonstration:
- Local state management for messages
- Simulated responses for demo purposes
- For production, implement WebSocket or Socket.IO for real-time messaging

### PDF Generation
Prescriptions are generated as PDF files using ReportLab:
- Basic prescription format
- Stored in `/prescriptions` directory
- Downloadable via API endpoint

## Production Considerations

For production deployment, consider:

1. **Security**:
   - Change JWT secret key
   - Use environment variables for sensitive data
   - Implement HTTPS
   - Add rate limiting

2. **Database**:
   - Use managed PostgreSQL service
   - Implement database migrations
   - Add backup strategy

3. **Video/Chat**:
   - Implement proper signaling server for WebRTC
   - Use WebSocket for real-time chat
   - Consider using services like Twilio Video

4. **File Storage**:
   - Use cloud storage for prescriptions
   - Implement file encryption

5. **Monitoring**:
   - Add logging and monitoring
   - Health checks
   - Error tracking

## Troubleshooting

### Common Issues

1. **Docker build fails**:
   ```bash
   docker-compose down
   docker-compose up --build --force-recreate
   ```

2. **Database connection issues**:
   - Ensure PostgreSQL is running
   - Check database credentials in docker-compose.yml

3. **Frontend not loading**:
   - Check if backend is running on port 8000
   - Verify CORS settings in backend

4. **Video call not working**:
   - Ensure HTTPS in production (WebRTC requirement)
   - Allow camera/microphone permissions

### Logs

View logs for debugging:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and demonstration purposes.

## Support

For issues and questions, please check:
1. This README file
2. Docker Compose logs
3. Browser developer console
4. FastAPI automatic documentation at http://localhost:8000/docs