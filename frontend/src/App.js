import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import HealthTimeline from './components/HealthTimeline';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patient/:id/timeline" element={<HealthTimeline />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;