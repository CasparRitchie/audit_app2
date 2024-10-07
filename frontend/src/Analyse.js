import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCharts from './SummaryCharts';
import './Analyse.css'; // Import a separate CSS file for custom styles

function Analyse() {
  const [audits, setAudits] = useState([]);
  const [auditDetail, setAuditDetail] = useState({});
  const [selectedAuditId, setSelectedAuditId] = useState('');

  // Fetch audits and auditDetail from the backend
  useEffect(() => {
    axios
      .get('/api/get_audits')
      .then((response) => {
        setAudits(response.data);
      })
      .catch((error) => {
        console.error('Error fetching audits:', error);
      });

    axios
      .get('/api/audit_detail')
      .then((response) => {
        setAuditDetail(response.data); // Store raw auditDetail
      })
      .catch((error) => {
        console.error('Error fetching audit detail:', error);
      });
  }, []);

  // Get unique audit IDs
  const uniqueAuditIds = [...new Set(audits.map((audit) => audit.auditId))];

  // Filter the audits based on the selected auditId
  const filteredAudits = selectedAuditId
    ? audits.filter((audit) => audit.auditId === parseInt(selectedAuditId))
    : [];

  // Helper function to find the corresponding response for a question ID
  const findResponseForQuestion = (questionId) => {
    const responseObj = filteredAudits.find((audit) => audit.question === String(questionId));

    if (responseObj && responseObj.response) {
      // console.log(`Found response for question ${questionId}:`, responseObj.response.response);
      return responseObj.response.response;
    } else {
      // console.log(`No response found for question ${questionId}`);
      return 'No response';
    }
  };

  // Helper function to style the responses with button-like backgrounds
  const getResponseStyle = (response, responseType) => {
    if (responseType === 'C/PC/NC') {
      if (response === 'C') return 'btn btn-success'; // Green for 'C'
      if (response === 'PC') return 'btn btn-warning'; // Amber for 'PC'
      if (response === 'NC') return 'btn btn-danger'; // Red for 'NC'
    } else if (responseType === 'OK/KO') {
      if (response === 'OK') return 'btn btn-success'; // Green for 'OK'
      if (response === 'KO') return 'btn btn-danger'; // Red for 'KO'
    } else if (responseType === 'Temperature') {
      if (parseFloat(response) >= 63) return 'btn btn-success'; // Green if temperature >= 63
      return 'btn btn-danger'; // Red if temperature < 63
    }
    return ''; // Default for other types
  };

  // Render the audit details, including questions and responses
  const renderAuditDetailsWithResponses = () => {
    return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
      <div key={chapitreIndex}>
        <h3>{chapitre}</h3>
        {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
          <div key={sousChapitreIndex}>
            <h4>{sousChapitre}</h4>
            {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
              <div key={paragrapheIndex}>
                <h5>{paragraphe}</h5>
                {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map((sousParagraphe, sousParagrapheIndex) => (
                  <div key={sousParagrapheIndex}>
                    <h6>{sousParagraphe}</h6>
                    {Array.isArray(auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe]) ? (
                      auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe].map((questionObj) => {
                        const response = findResponseForQuestion(questionObj.id);
                        const responseClass = getResponseStyle(response, questionObj.response_type);

                        return (
                          <div key={questionObj.id}>
                            <strong>Question:</strong> {questionObj.question}
                            <br />
                            <strong>Response:</strong> <span className={`response-btn ${responseClass}`}>{response}</span>
                            <hr />
                          </div>
                        );
                      })
                    ) : (
                      <p>No questions available</p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    ));
  };

  // Helper function to calculate C/PC/NC proportions
  const calculateCPCNC = (questions) => {
    const counts = { C: 0, PC: 0, NC: 0 };
    questions.forEach((q) => {
      const response = q.response.response;
      if (response === 'C' || response === 'PC' || response === 'NC') {
        counts[response]++;
      }
    });
    return counts;
  };

  // Helper function to calculate OK/KO proportions
  const calculateOKKO = (questions) => {
    const counts = { OK: 0, KO: 0 };
    questions.forEach((q) => {
      const response = q.response.response;
      if (response === 'OK' || response === 'KO') {
        counts[response]++;
      }
    });
    return counts;
  };

  // Helper function to calculate temperatures
  const calculateTemperature = (questions) => {
    const counts = { over63: 0, under63: 0 };
    questions.forEach((q) => {
      const response = parseFloat(q.response.response);
      if (!isNaN(response)) {
        if (response >= 63) {
          counts.over63++;
        } else {
          counts.under63++;
        }
      }
    });
    return counts;
  };

  // Inside your Analyse component
  if (selectedAuditId) {
    // Calculate data for charts
    const cpcncData = calculateCPCNC(filteredAudits);
    const okkoData = calculateOKKO(filteredAudits);
    const temperatureData = calculateTemperature(filteredAudits);

    // Log data for debugging
    console.log("CPCNC Data:", cpcncData);
    console.log("OKKO Data:", okkoData);
    console.log("Temperature Data:", temperatureData);
  }

  return (
    <div className="container">
      <h1>Analyse Data</h1>

      {/* Dropdown to select an auditId */}
      <div className="form-group">
        <label htmlFor="auditSelect">Select Audit ID:</label>
        <select
          id="auditSelect"
          className="form-control"
          value={selectedAuditId}
          onChange={(e) => setSelectedAuditId(e.target.value)}
        >
          <option value="">Select an Audit</option>
          {uniqueAuditIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {/* Only render the charts when an audit ID is selected */}
      {selectedAuditId && (
        <>
          <SummaryCharts
            key={selectedAuditId} // Add key to force re-rendering
            auditId={selectedAuditId}
            cpcncData={calculateCPCNC(filteredAudits)}
            okkoData={calculateOKKO(filteredAudits)}
            temperatureData={calculateTemperature(filteredAudits)}
          />
        </>
      )}

      {/* Display audit details and corresponding responses */}
      {selectedAuditId && (
        <div>
          <h2>Audit Responses and Questions</h2>
          {renderAuditDetailsWithResponses()}
        </div>
      )}

      {/* Display the raw filtered audits response data */}
      {selectedAuditId && (
        <div>
          <h2>Raw Audit Responses</h2>
          <pre>{JSON.stringify(filteredAudits, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Analyse;

