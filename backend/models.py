"""Database models for the Telehealth MVP application.

Contains SQLAlchemy ORM models for users, appointments, and prescriptions.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    """User model for patients and doctors."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    user_type = Column(String, nullable=False)  # "patient" or "doctor"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    patient_appointments = relationship(
        "Appointment",
        foreign_keys="[Appointment.patient_id]",
        back_populates="patient"
    )
    doctor_appointments = relationship(
        "Appointment",
        foreign_keys="[Appointment.doctor_id]",
        back_populates="doctor"
    )
    prescriptions_given = relationship(
        "Prescription",
        foreign_keys="[Prescription.doctor_id]",
        back_populates="doctor"
    )
    prescriptions_received = relationship(
        "Prescription",
        foreign_keys="[Prescription.patient_id]",
        back_populates="patient"
    )

class Appointment(Base):
    """Appointment model for booking consultations."""
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    appointment_time = Column(DateTime, nullable=False)
    consultation_type = Column(String, nullable=False)  # "video" or "chat"
    status = Column(String, default="scheduled")  # "scheduled", "completed", "cancelled"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], back_populates="patient_appointments")
    doctor = relationship("User", foreign_keys=[doctor_id], back_populates="doctor_appointments")

class Prescription(Base):
    """Prescription model for storing medication prescriptions."""
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    medication = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    instructions = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], back_populates="prescriptions_received")
    doctor = relationship("User", foreign_keys=[doctor_id], back_populates="prescriptions_given")