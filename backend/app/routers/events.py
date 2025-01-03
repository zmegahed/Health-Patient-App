from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import medical_event

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/", response_model=medical_event.MedicalEvent)
async def create_event(event_data: medical_event.MedicalEventCreate, db: Session = Depends(get_db)):
    db_event = models.MedicalEvent(**event_data.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/{event_id}", response_model=medical_event.MedicalEvent)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.MedicalEvent).filter(models.MedicalEvent.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/patient/{patient_id}", response_model=List[medical_event.MedicalEvent])
async def get_patient_events(patient_id: int, db: Session = Depends(get_db)):
    events = db.query(models.MedicalEvent)\
        .filter(models.MedicalEvent.patient_id == patient_id)\
        .order_by(models.MedicalEvent.event_date.desc())\
        .all()
    return events