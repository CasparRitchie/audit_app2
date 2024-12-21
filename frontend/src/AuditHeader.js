import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditHeader() {
  const [headerData, setHeaderData] = useState([]);
  const [headerResponses, setHeaderResponses] = useState({});
  const [calculatedFields, setCalculatedFields] = useState({});
  const [isExpanded, setIsExpanded] = useState(false); // State for collapse/expand

  const saveToLocalStorage = (key, value) => {
    const existingData = JSON.parse(localStorage.getItem("auditHeader")) || {};
    existingData[key] = value;
    localStorage.setItem("auditHeader", JSON.stringify(existingData));
  };

  useEffect(() => {
    axios.get('/api/audit_header')
      .then(response => {
        setHeaderData(response.data);
        const storedHeaderResponses = JSON.parse(localStorage.getItem("auditHeader"));
        if (storedHeaderResponses) {
          setHeaderResponses(storedHeaderResponses);
        }
      })
      .catch(error => console.error('Error fetching header data:', error));
  }, []);

  const calculateRates = (repasJour, placesAssises, repasJourServis) => {
    if (repasJour && placesAssises) {
      setCalculatedFields(prevFields => ({
        ...prevFields,
        9: ((repasJour / (placesAssises * 0.8)).toFixed(2))
      }));
    }
    if (repasJourServis && placesAssises) {
      setCalculatedFields(prevFields => ({
        ...prevFields,
        11: ((repasJourServis / (placesAssises * 0.8)).toFixed(2))
      }));
    }
  };

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...headerResponses,
      [questionId]: value,
    };
    setHeaderResponses(updatedResponses);
    saveToLocalStorage(questionId, value);

    const repasJour = parseFloat(updatedResponses[7] || 0);
    const placesAssises = parseFloat(updatedResponses[8] || 0);
    const repasJourServis = parseFloat(updatedResponses[10] || 0);
    if (repasJour && placesAssises) {
      calculateRates(repasJour, placesAssises, repasJourServis);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Always generate a new unique audit header ID
    const auditId = 'audit_' + Date.now();

    const formData = new FormData();
    formData.append('auditId', auditId);

    Object.entries(headerResponses).forEach(([questionId, response]) => {
      formData.append(`header[${questionId}]`, response);
    });

    axios.post('/api/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
      alert(`Audit header submitted successfully! New ID: ${auditId}`);
    })
    .catch(error => console.error('Error submitting audit header:', error));
  };

  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState); // Toggle collapse/expand state
  };

  if (!headerData.length) {
    return <div>Loading audit header data...</div>;
  }

  return (
    <div>
      <h2 style={{ cursor: 'pointer' }} onClick={toggleExpand}>
      {isExpanded ? '▼' : '▶'} Informations générales
      </h2>
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mb-4">
          {headerData.map(question => (
            <div key={question.id} className="form-group d-flex align-items-center border-bottom mb-3 pb-2">
              {/* Question Label */}
              <label style={{ flexBasis: '30%', marginBottom: 0 }}>{question.question}</label>

              {/* Response Area */}
              {question.type === 'Text' && (
                <input
                  type="text"
                  className="form-control"
                  style={{ backgroundColor: '#f8f9fa', flexBasis: '70%' }} // Grey background for response
                  value={headerResponses[question.id] || ''}
                  onChange={e => handleInputChange(e, question.id)}
                />
              )}
              {question.type === 'Integer' && (
                <input
                  type="number"
                  className="form-control"
                  style={{ backgroundColor: '#f8f9fa', flexBasis: '70%' }} // Grey background for response
                  value={headerResponses[question.id] || ''}
                  onChange={e => handleInputChange(e, question.id)}
                />
              )}
              {question.type === 'Date' && (
                <input
                  type="date"
                  className="form-control"
                  style={{ backgroundColor: '#f8f9fa', flexBasis: '70%' }} // Grey background for response
                  value={headerResponses[question.id] || ''}
                  onChange={e => handleInputChange(e, question.id)}
                />
              )}
              {question.type === 'Time' && (
                <input
                  type="time"
                  className="form-control"
                  style={{ backgroundColor: '#f8f9fa', flexBasis: '70%' }} // Grey background for response
                  value={headerResponses[question.id] || question.default_value || ''}
                  onChange={e => handleInputChange(e, question.id)}
                />
              )}
              {question.type === 'Calculated' && (
                <input
                  type="text"
                  className="form-control"
                  style={{ backgroundColor: '#f8f9fa', flexBasis: '70%' }} // Grey background for response
                  value={calculatedFields[question.id] || ''}
                  readOnly
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-primary">Envoyer</button>
        </form>
      )}
    </div>
  );
}

export default AuditHeader;
