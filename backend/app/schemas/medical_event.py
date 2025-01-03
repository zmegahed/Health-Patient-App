from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class MedicalEventBase(BaseModel):
    event_type: str
    event_date: date
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    provider: Optional[str] = None
    location: Optional[str] = None

class MedicalEventCreate(MedicalEventBase):
    patient_id: int

class MedicalEvent(MedicalEventBase):
    id: int
    patient_id: int
    created_at: datetime

    class Config:
        from_attributes = True