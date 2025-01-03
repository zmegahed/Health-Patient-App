from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import patient, medical_event, medication
from datetime import datetime
from typing import List

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/", response_model=List[patient.Patient])
async def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(models.Patient).all()
    return patients

@router.post("/", response_model=patient.Patient)
async def create_patient(patient_data: patient.PatientCreate, db: Session = Depends(get_db)):
    db_patient = models.Patient(**patient_data.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/{patient_id}", response_model=patient.Patient)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient_record = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient_record is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_record

@router.delete("/{patient_id}", response_model=dict)
async def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted successfully"}

@router.post("/", response_model=patient.Patient)
async def create_patient(patient_data: patient.PatientCreate, db: Session = Depends(get_db)):
    db_patient = models.Patient(**patient_data.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/{patient_id}/timeline")
async def get_patient_timeline(patient_id: int, db: Session = Depends(get_db)):
    patient_record = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient_record is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    events = db.query(models.MedicalEvent)\
        .filter(models.MedicalEvent.patient_id == patient_id)\
        .order_by(models.MedicalEvent.event_date.desc())\
        .all()
    
    medications = db.query(models.Medication)\
        .filter(models.Medication.patient_id == patient_id)\
        .order_by(models.Medication.start_date.desc())\
        .all()

    return {
        "patient": patient_record,
        "events": events,
        "medications": medications
    }