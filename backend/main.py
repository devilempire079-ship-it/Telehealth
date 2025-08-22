"""Telehealth MVP Backend API

A FastAPI-based backend for a minimal telehealth application featuring:
- JWT-based authentication for patients and doctors
- Appointment booking system
- PDF prescription generation
- SQLite database integration
"""

import os
import io
from datetime import datetime, timedelta, timezone
from typing import List

import jwt
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from passlib.context import CryptContext
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from sqlalchemy.orm import Session

from database import get_db, engine
from models import User, Appointment, Prescription, Base
from schemas import (
    UserCreate, UserLogin, UserResponse,
    AppointmentCreate, AppointmentResponse,
    PrescriptionCreate, PrescriptionResponse
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Telehealth MVP API",
    description="A minimal telehealth application backend",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configuration
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)


def create_access_token(data: dict) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token."""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

def generate_prescription_pdf(prescription: PrescriptionCreate, doctor_name: str) -> bytes:
    """Generate PDF prescription document."""
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Add content to PDF
    p.drawString(100, 750, "PRESCRIPTION")
    p.drawString(100, 720, f"Doctor: {doctor_name}")
    p.drawString(100, 700, f"Patient ID: {prescription.patient_id}")
    p.drawString(100, 680, f"Date: {datetime.now().strftime('%Y-%m-%d')}")
    p.drawString(100, 650, f"Medication: {prescription.medication}")
    p.drawString(100, 630, f"Dosage: {prescription.dosage}")
    p.drawString(100, 610, f"Instructions: {prescription.instructions or 'N/A'}")
    
    p.save()
    buffer.seek(0)
    return buffer.getvalue()


# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (patient or doctor)."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate user type
    if user.user_type not in ["patient", "doctor"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User type must be 'patient' or 'doctor'"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        user_type=user.user_type
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        full_name=db_user.full_name,
        user_type=db_user.user_type
    )

@app.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token(data={"sub": db_user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            user_type=db_user.user_type
        )
    }

# Doctor endpoints
@app.get("/doctors", response_model=List[UserResponse])
def get_doctors(db: Session = Depends(get_db)):
    """Get list of all doctors."""
    doctors = db.query(User).filter(User.user_type == "doctor").all()
    return [
        UserResponse(
            id=doctor.id,
            email=doctor.email,
            full_name=doctor.full_name,
            user_type=doctor.user_type
        )
        for doctor in doctors
    ]

# Appointment endpoints
@app.post("/appointments", response_model=AppointmentResponse)
def book_appointment(
    appointment: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Book a new appointment."""
    # Validate consultation type
    if appointment.consultation_type not in ["video", "chat"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultation type must be 'video' or 'chat'"
        )
    
    # Verify doctor exists
    doctor = db.query(User).filter(
        User.id == appointment.doctor_id,
        User.user_type == "doctor"
    ).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    db_appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        consultation_type=appointment.consultation_type,
        status="scheduled"
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    
    return AppointmentResponse(
        id=db_appointment.id,
        patient_id=db_appointment.patient_id,
        doctor_id=db_appointment.doctor_id,
        appointment_time=db_appointment.appointment_time,
        consultation_type=db_appointment.consultation_type,
        status=db_appointment.status
    )

@app.get("/appointments", response_model=List[AppointmentResponse])
def get_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get appointments for current user."""
    if current_user.user_type == "patient":
        appointments = db.query(Appointment).filter(
            Appointment.patient_id == current_user.id
        ).all()
    else:  # doctor
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == current_user.id
        ).all()
    
    return [
        AppointmentResponse(
            id=apt.id,
            patient_id=apt.patient_id,
            doctor_id=apt.doctor_id,
            appointment_time=apt.appointment_time,
            consultation_type=apt.consultation_type,
            status=apt.status
        )
        for apt in appointments
    ]

# Prescription endpoints
@app.post("/prescriptions", response_model=PrescriptionResponse)
def create_prescription(
    prescription: PrescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new prescription (doctors only)."""
    if current_user.user_type != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can create prescriptions"
        )
    
    # Verify patient exists
    patient = db.query(User).filter(
        User.id == prescription.patient_id,
        User.user_type == "patient"
    ).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    
    # Generate PDF prescription
    pdf_content = generate_prescription_pdf(prescription, current_user.full_name)
    
    # Save prescription to database
    db_prescription = Prescription(
        patient_id=prescription.patient_id,
        doctor_id=current_user.id,
        medication=prescription.medication,
        dosage=prescription.dosage,
        instructions=prescription.instructions
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    
    # Save PDF file
    os.makedirs("prescriptions", exist_ok=True)
    filename = f"prescription_{db_prescription.id}.pdf"
    filepath = f"prescriptions/{filename}"
    
    with open(filepath, "wb") as f:
        f.write(pdf_content)
    
    return PrescriptionResponse(
        id=db_prescription.id,
        patient_id=db_prescription.patient_id,
        doctor_id=db_prescription.doctor_id,
        medication=db_prescription.medication,
        dosage=db_prescription.dosage,
        instructions=db_prescription.instructions,
        created_at=db_prescription.created_at
    )

@app.get("/prescriptions/{filename}")
def download_prescription(filename: str):
    """Download prescription PDF file."""
    filepath = f"prescriptions/{filename}"
    if os.path.exists(filepath):
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=filename
        )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Prescription not found"
    )


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)