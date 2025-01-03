import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Search } from 'lucide-react';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/patients/');
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`http://localhost:8001/patients/${patientId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPatients();
        } else {
          alert('Error deleting patient');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting patient');
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAgeFromDOB = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
              <p className="text-gray-600 mt-2">Manage and track your patients' information</p>
            </div>
            <a 
              href="/patients/new" 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add New Patient
            </a>
          </div>

          {/* Search Section */}
          <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Patient Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(patient => (
              <Card key={patient.id} className="overflow-hidden hover:shadow-lg">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <h3 className="text-xl font-semibold text-white">
                      {patient.first_name} {patient.last_name}
                    </h3>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="text-gray-600">
                      Age: {getAgeFromDOB(patient.date_of_birth)} years
                    </div>
                    <div className="text-gray-600">
                      DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <a 
                        href={`/patient/${patient.id}/timeline`}
                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 text-center"
                      >
                        View Timeline
                      </a>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;