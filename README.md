# Patient Hub

A modern, full-stack healthcare management system that provides a comprehensive interface for managing patient information, medical records, and visit history.

## Features

- **Patient Dashboard**: View and manage patient profiles and demographic information
- **Medical History Tracking**: Monitor patient medications and treatment plans
- **Visit Management**: Track patient visits, severity levels, and outcomes
- **Secure Database**: Encrypted storage of sensitive patient information
- **Responsive Interface**: Modern, user-friendly design that works across devices

## Tech Stack

- **Frontend**: React.js
  - Modern component-based architecture
  - Responsive design for all screen sizes
  - Interactive data visualization
  
- **Backend**: Python
  - RESTful API design
  - Secure authentication and authorization
  - Efficient data processing and validation
  
- **Database**: PostgreSQL
  - Robust data persistence
  - Complex query support
  - Data integrity and relationships

## Installation

1. Clone the repository:
```bash
git clone https://github.com/zmegahed/Health-Patient-App.git
cd health-timeline
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

4. Set up PostgreSQL database:
```bash
# Create a new database
createdb patient_hub

# Run migrations
python manage.py migrate
```

5. Configure environment variables:
```bash
# Create .env file in backend directory
cp .env.example .env

# Update with your database credentials and other configurations
```

## Running the Application

1. Start the backend server:
```bash
cd backend
python manage.py runserver
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:8000`
