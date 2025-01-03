# app/models/models.py
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(50))
    blood_type = Column(String(10))
    contact_number = Column(String(20))
    email = Column(String(255))
    emergency_contact = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MedicalEvent(Base):
    __tablename__ = "medical_events"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    event_type = Column(String(100), nullable=False)
    event_date = Column(Date, nullable=False)
    description = Column(Text)
    severity = Column(String(50))
    status = Column(String(50))
    provider = Column(String(255))
    location = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    name = Column(String(255), nullable=False)
    dosage = Column(String(100))
    frequency = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    prescribing_doctor = Column(String(255))
    reason = Column(Text)
    side_effects = Column(Text)
    status = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    symptom_name = Column(String(255), nullable=False)
    severity = Column(Integer)
    onset_date = Column(Date)
    duration = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint('severity >= 1 AND severity <= 10'),
    )

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    document_type = Column(String(100), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    upload_date = Column(DateTime, server_default=func.now())
    document_date = Column(Date)
    notes = Column(Text)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    appointment_date = Column(DateTime, nullable=False)
    provider = Column(String(255))
    location = Column(String(255))
    reason = Column(Text)
    status = Column(String(50))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())