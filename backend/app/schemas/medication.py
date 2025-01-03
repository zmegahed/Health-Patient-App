from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class MedicationBase(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    prescribing_doctor: Optional[str] = None
    reason: Optional[str] = None
    side_effects: Optional[str] = None
    status: str = "active"

class MedicationCreate(MedicationBase):
    patient_id: int

class Medication(MedicationBase):
    id: int
    patient_id: int
    created_at: datetime

    class Config:
        from_attributes = True