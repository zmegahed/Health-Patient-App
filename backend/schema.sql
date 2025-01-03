-- Create patient table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50),
    blood_type VARCHAR(10),
    contact_number VARCHAR(20),
    email VARCHAR(255),
    emergency_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_events table
CREATE TABLE medical_events (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    event_type VARCHAR(100) NOT NULL, -- diagnosis, procedure, medication, lab_result, etc.
    event_date DATE NOT NULL,
    description TEXT,
    severity VARCHAR(50), -- mild, moderate, severe
    status VARCHAR(50), -- active, resolved, ongoing
    provider VARCHAR(255), -- doctor or healthcare provider name
    location VARCHAR(255), -- hospital or clinic name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medications table
CREATE TABLE medications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    prescribing_doctor VARCHAR(255),
    reason TEXT,
    side_effects TEXT,
    status VARCHAR(50), -- active, discontinued, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create symptoms table
CREATE TABLE symptoms (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    symptom_name VARCHAR(255) NOT NULL,
    severity INTEGER CHECK (severity >= 1 AND severity <= 10),
    onset_date DATE,
    duration VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    document_type VARCHAR(100) NOT NULL, -- lab_report, imaging, prescription, etc.
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    document_date DATE,
    notes TEXT
);

-- Create appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    appointment_date TIMESTAMP NOT NULL,
    provider VARCHAR(255),
    location VARCHAR(255),
    reason TEXT,
    status VARCHAR(50), -- scheduled, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_medical_events_patient_id ON medical_events(patient_id);
CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_symptoms_patient_id ON symptoms(patient_id);
CREATE INDEX idx_documents_patient_id ON documents(patient_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);