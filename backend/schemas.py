from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: str  # "patient" or "doctor"
    
    @validator('user_type')
    def validate_user_type(cls, v):
        if v not in ['patient', 'doctor']:
            raise ValueError('User type must be either patient or doctor')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    user_type: str
    
    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_time: datetime
    consultation_type: str  # "video" or "chat"
    
    @validator('consultation_type')
    def validate_consultation_type(cls, v):
        if v not in ['video', 'chat']:
            raise ValueError('Consultation type must be either video or chat')
        return v

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_time: datetime
    consultation_type: str
    status: str
    
    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    patient_id: int
    medication: str
    dosage: str
    instructions: Optional[str] = None

class PrescriptionResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    medication: str
    dosage: str
    instructions: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True