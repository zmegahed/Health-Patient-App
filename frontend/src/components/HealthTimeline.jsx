import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Calendar, Activity, PlusCircle, User, Phone, Mail, Heart, UserPlus } from 'lucide-react';
import { useParams } from 'react-router-dom';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const HealthTimeline = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [medications, setMedications] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribing_doctor: '',
    reason: '',
    patient_id: parseInt(id),
    status: 'active'
  });
  
  const PatientInfoCard = () => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-2 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {patientData.first_name} {patientData.last_name}
            </h2>
            <p className="text-sm opacity-90">Patient ID: {id}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
            label="Date of Birth"
            value={new Date(patientData.date_of_birth).toLocaleDateString()}
          />
          <InfoItem
            icon={<Heart className="h-5 w-5 text-red-500" />}
            label="Blood Type"
            value={patientData.blood_type || 'Not specified'}
          />
          <InfoItem
            icon={<Phone className="h-5 w-5 text-green-500" />}
            label="Contact"
            value={patientData.contact_number || 'Not specified'}
          />
          <InfoItem
            icon={<Mail className="h-5 w-5 text-purple-500" />}
            label="Email"
            value={patientData.email || 'Not specified'}
          />
          <InfoItem
            icon={<UserPlus className="h-5 w-5 text-orange-500" />}
            label="Emergency Contact"
            value={patientData.emergency_contact || 'Not specified'}
          />
        </div>
      </div>
    </div>
  );

  const fetchMedications = async () => {
    try {
      const response = await fetch(`http://localhost:8001/medications/patient/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      const data = await response.json();
      setMedications(data);
    } catch (err) {
      console.error('Error fetching medications:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineResponse = await fetch(`http://localhost:8001/patients/${id}/timeline`);
        const timelineData = await timelineResponse.json();
        setPatientData(timelineData.patient);
        setEvents(timelineData.events);
        await fetchMedications();
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8001/medications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedication),
      });

      if (!response.ok) {
        throw new Error('Failed to add medication');
      }

      await fetchMedications();
      setShowAddDialog(false);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        prescribing_doctor: '',
        reason: '',
        patient_id: parseInt(id),
        status: 'active'
      });
    } catch (err) {
      console.error('Error adding medication:', err);
    }
  };

  const handleDeleteMedication = async (medicationId) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        const response = await fetch(`http://localhost:8001/medications/${medicationId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete medication');
        }

        await fetchMedications();
      } catch (err) {
        console.error('Error deleting medication:', err);
      }
    }
  };

  const handleUpdateStatus = async (medicationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8001/medications/${medicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update medication status');
      }

      await fetchMedications();
    } catch (err) {
      console.error('Error updating medication status:', err);
    }
  };
  

  const AddMedicationForm = () => (
    showAddDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Medication</h2>
            <button 
              onClick={() => setShowAddDialog(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleAddMedication} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Medication Name</label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <input
                type="text"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prescribing Doctor</label>
              <input
                type="text"
                value={newMedication.prescribing_doctor}
                onChange={(e) => setNewMedication({...newMedication, prescribing_doctor: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                value={newMedication.reason}
                onChange={(e) => setNewMedication({...newMedication, reason: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Medication
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const TimelineEvent = ({ event }) => (
    <div className="relative pl-8 pb-8">
      <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>
      <div className="absolute left-[-4px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-white"></div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium text-blue-600">{event.event_type}</h3>
          <span className="text-sm text-gray-500">
            {new Date(event.event_date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-600">{event.description}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading patient data: {error}</p>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600">No patient data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <PatientInfoCard />

      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'timeline'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('medications')}
          className={`px-4 py-2 border-b-2 ${
            activeTab === 'medications'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Medications
        </button>
      </div>

      <div>
        {activeTab === 'timeline' ? (
          <div className="space-y-4">
            {events.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Current Medications</h2>
              <button
                onClick={() => setShowAddDialog(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Medication
              </button>
            </div>
            <div>
              {medications.length === 0 ? (
                <div className="p-4 text-gray-500">No medications found</div>
              ) : (
                medications.map((med) => (
                  <div key={med.id} className="p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{med.name}</h4>
                        {med.dosage && <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>}
                        {med.frequency && <p className="text-sm text-gray-500">Frequency: {med.frequency}</p>}
                        {med.reason && <p className="text-sm text-gray-500">Reason: {med.reason}</p>}
                        {med.prescribing_doctor && (
                          <p className="text-sm text-gray-500">Dr. {med.prescribing_doctor}</p>
                        )}
                        {med.start_date && (
                          <p className="text-sm text-gray-500">
                            Started: {new Date(med.start_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-start space-x-2">
                        <select
                          value={med.status}
                          onChange={(e) => handleUpdateStatus(med.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="active">Active</option>
                          <option value="discontinued">Discontinued</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteMedication(med.id)}
                          className="text-red-500 hover:text-red-700 px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <AddMedicationForm />
    </div>
  );
};

export default HealthTimeline;