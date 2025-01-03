from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[str] = None
    emergency_contact: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True