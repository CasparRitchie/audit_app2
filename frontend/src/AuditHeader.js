import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditHeader() {
  const [headerData, setHeaderData] = useState([]);
  const [headerResponses, setHeaderResponses] = useState({});
  const [calculatedFields, setCalculatedFields] = useState({});

  useEffect(() => {
    axios.get('/api/audit_header')
      .then(response => {
        console.log('Header data fetched:', response.data);
        if (Array.isArray(response.data)) {
          setHeaderData(response.data);
        } else {
          console.error('Invalid header data format:', response.data);
        }
      })
      .catch(error => console.error('Error fetching header data:', error));
  }, []);

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    setHeaderResponses({
      ...headerResponses,
      [questionId]: value
    });

    // Handle Calculations for specific fields
    if (questionId === 7 || questionId === 8) { // Assumes these are for Taux de rotation global
      const repasJour = parseInt(headerResponses[7] || 0, 10);
      const placesAssises = parseInt(headerResponses[8] || 0, 10);
      const globalRate = (repasJour / placesAssises) * 0.8;
      setCalculatedFields({
        ...calculatedFields,
        9: globalRate.toFixed(2) // Assuming 9 is the question ID for Taux de rotation global
      });
    }

    if (questionId === 10 || questionId === 8) { // Assumes these are for Taux de rotation du jour
      const repasJourServis = parseInt(headerResponses[10] || 0, 10);
      const placesAssises = parseInt(headerResponses[8] || 0, 10);
      const jourRate = (repasJourServis / placesAssises) * 0.8;
      setCalculatedFields({
        ...calculatedFields,
        11: jourRate.toFixed(2) // Assuming 11 is the question ID for Taux de rotation du jour
      });
    }
  };

  if (!headerData || headerData.length === 0) {
    return <div>Loading audit header data...</div>;
  }

  return (
    <div>
      <h2>Audit Header</h2>
      {headerData.map((question) => (
        <div key={question.id}>
          <label>{question.question}</label>

          {question.type === 'Text' && (
            <input
              type="text"
              name={question.id}
              value={headerResponses[question.id] || ''}
              onChange={(event) => handleInputChange(event, question.id)}
            />
          )}

          {question.type === 'Integer' && (
            <input
              type="number"
              name={question.id}
              value={headerResponses[question.id] || ''}
              onChange={(event) => handleInputChange(event, question.id)}
            />
          )}

          {question.type === 'Date' && (
            <input
              type="date"
              name={question.id}
              value={headerResponses[question.id] || ''}
              onChange={(event) => handleInputChange(event, question.id)}
            />
          )}

          {question.type === 'Time' && (
            <input
              type="time"
              name={question.id}
              value={headerResponses[question.id] || question.default_value || ''}
              onChange={(event) => handleInputChange(event, question.id)}
            />
          )}

          {question.type === 'Calculated' && (
            <input
              type="text"
              name={question.id}
              value={calculatedFields[question.id] || ''}
              readOnly
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default AuditHeader;
