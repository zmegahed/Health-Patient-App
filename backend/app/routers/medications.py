from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import medication

router = APIRouter(prefix="/medications", tags=["medications"])

@router.post("/", response_model=medication.Medication)
async def create_medication(med_data: medication.MedicationCreate, db: Session = Depends(get_db)):
    db_medication = models.Medication(**med_data.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

@router.get("/{medication_id}", response_model=medication.Medication)
async def get_medication(medication_id: int, db: Session = Depends(get_db)):
    med = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if med is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    return med

@router.get("/patient/{patient_id}", response_model=List[medication.Medication])
async def get_patient_medications(patient_id: int, db: Session = Depends(get_db)):
    medications = db.query(models.Medication)\
        .filter(models.Medication.patient_id == patient_id)\
        .order_by(models.Medication.start_date.desc())\
        .all()
    return medications

@router.put("/{medication_id}/status", response_model=medication.Medication)
async def update_medication_status(
    medication_id: int, 
    status: str, 
    db: Session = Depends(get_db)
):
    medication_record = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if medication_record is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    medication_record.status = status
    db.commit()
    db.refresh(medication_record)
    return medication_record

@router.delete("/{medication_id}")
async def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    db.delete(medication)
    db.commit()
    return {"message": "Medication deleted successfully"}