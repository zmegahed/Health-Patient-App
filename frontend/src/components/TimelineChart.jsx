import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

const TimelineChart = ({ events }) => {
  const chartData = events.map(event => ({
    date: new Date(event.event_date).toLocaleDateString(),
    severity: event.severity === 'high' ? 3 : event.severity === 'medium' ? 2 : 1,
    eventType: event.event_type
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Health Events Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value, name) => [
                  value === 3 ? 'High' : value === 2 ? 'Medium' : 'Low',
                  'Severity'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="severity" 
                stroke="#2563eb" 
                name="Event Severity"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;