import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { PlusCircle } from 'lucide-react';

const MedicationList = ({ medications }) => {
  const activeMedications = medications?.filter(med => med.status === 'active') || [];
  const pastMedications = medications?.filter(med => med.status !== 'active') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Medications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Active Medications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMedications.map(medication => (
              <div key={medication.id} className="p-4 bg-gray-50 rounded">
                <h4 className="font-medium">{medication.name}</h4>
                <p className="text-sm text-gray-600">
                  {medication.dosage} - {medication.frequency}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Prescribed by: {medication.prescribing_doctor}
                </p>
                {medication.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Notes: {medication.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {pastMedications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Past Medications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastMedications.map(medication => (
                <div key={medication.id} className="p-4 bg-gray-50 rounded opacity-75">
                  <h4 className="font-medium">{medication.name}</h4>
                  <p className="text-sm text-gray-600">
                    {medication.dosage} - {medication.frequency}
                  </p>
                  <p className="text-sm text-gray-500">
                    End date: {new Date(medication.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationList;