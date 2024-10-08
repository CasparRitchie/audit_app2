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
      return responseObj.response.response;
    } else {
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

  // // Render the audit details, including questions and responses
  // const renderAuditDetailsWithResponses = () => {
  //   return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
  //     <div key={chapitreIndex}>
  //       <h3>{chapitre}</h3>
  //       {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
  //         <div key={sousChapitreIndex}>
  //           <h4>{sousChapitre}</h4>
  //           {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
  //             <div key={paragrapheIndex}>
  //               <h5>{paragraphe}</h5>
  //               {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map((sousParagraphe, sousParagrapheIndex) => (
  //                 <div key={sousParagrapheIndex}>
  //                   <h6>{sousParagraphe}</h6>
  //                   {Array.isArray(auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe]) ? (
  //                     auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe].map((questionObj) => {
  //                       const response = findResponseForQuestion(questionObj.id);
  //                       const responseClass = getResponseStyle(response, questionObj.response_type);

  //                       return (
  //                         <div key={questionObj.id}>
  //                           <strong>Question:</strong> {questionObj.question}
  //                           <br />
  //                           <strong>Response:</strong> <span className={`response-btn ${responseClass}`}>{response}</span>
  //                           <hr />
  //                         </div>
  //                       );
  //                     })
  //                   ) : (
  //                     <p>No questions available</p>
  //                   )}
  //                 </div>
  //               ))}
  //             </div>
  //           ))}
  //         </div>
  //       ))}
  //     </div>
  //   ));
  // };

  // Render the audit details, including questions and responses
  // const renderAuditDetailsWithResponses = () => {
  //   return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
  //     <div key={chapitreIndex}>
  //       <h3>{chapitre}</h3>
  //       {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
  //         <div key={sousChapitreIndex}>
  //           <h4>{sousChapitre}</h4>
  //           {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
  //             <div key={paragrapheIndex}>
  //               <h5>{paragraphe}</h5>
  //               {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map((sousParagraphe, sousParagrapheIndex) => {
  //                 const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];

  //                 // Count the different responses for this sousParagraphe
  //                 const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

  //                 if (Array.isArray(sectionQuestions)) {
  //                   sectionQuestions.forEach((questionObj) => {
  //                     const response = findResponseForQuestion(questionObj.id);

  //                     // Categorize responses based on response type
  //                     if (response === 'C') responseCounts.C++;
  //                     if (response === 'PC') responseCounts.PC++;
  //                     if (response === 'NC') responseCounts.NC++;
  //                     if (response === 'OK') responseCounts.OK++;
  //                     if (response === 'KO') responseCounts.KO++;

  //                     const temperature = parseFloat(response);
  //                     if (!isNaN(temperature)) {
  //                       if (temperature >= 63) {
  //                         responseCounts.over63++;
  //                       } else {
  //                         responseCounts.under63++;
  //                       }
  //                     }
  //                   });
  //                 }

  //                 return (
  //                   <div key={sousParagrapheIndex}>
  //                     <h6>{sousParagraphe}</h6>
  //                     {Array.isArray(sectionQuestions) ? (
  //                       sectionQuestions.map((questionObj) => {
  //                         const response = findResponseForQuestion(questionObj.id);
  //                         const responseClass = getResponseStyle(response, questionObj.response_type);

  //                         return (
  //                           <div key={questionObj.id}>
  //                             <strong>Question:</strong> {questionObj.question}
  //                             <br />
  //                             <strong>Response:</strong> <span className={`response-btn ${responseClass}`}>{response}</span>
  //                             <hr />
  //                           </div>
  //                         );
  //                       })
  //                     ) : (
  //                       <p>No questions available</p>
  //                     )}

  //                     {/* Summary Table */}
  //                     <div>
  //                       <h6>Response Summary for {sousParagraphe}</h6>
  //                       <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
  //                         <thead>
  //                           <tr>
  //                             <th style={{ border: '1px solid black', padding: '5px' }}>Type</th>
  //                             <th style={{ border: '1px solid black', padding: '5px' }}>Count</th>
  //                           </tr>
  //                         </thead>
  //                         <tbody>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>C</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.C}</td>
  //                           </tr>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>PC</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.PC}</td>
  //                           </tr>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>NC</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.NC}</td>
  //                           </tr>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>OK</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.OK}</td>
  //                           </tr>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>KO</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.KO}</td>
  //                           </tr>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>&ge; 63°C</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.over63}</td>
  //                           </tr>
  //                           <tr>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>&lt; 63°C</td>
  //                             <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.under63}</td>
  //                           </tr>
  //                         </tbody>
  //                       </table>
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           ))}
  //         </div>
  //       ))}
  //     </div>
  //   ));
  // };
//   import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SummaryCharts from './SummaryCharts';

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
              {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map((sousParagraphe, sousParagrapheIndex) => {
                const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];

                // Count the different responses for this sousParagraphe
                const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

                if (Array.isArray(sectionQuestions)) {
                  sectionQuestions.forEach((questionObj) => {
                    const response = findResponseForQuestion(questionObj.id);

                    // Categorize responses based on response type
                    if (response === 'C') responseCounts.C++;
                    if (response === 'PC') responseCounts.PC++;
                    if (response === 'NC') responseCounts.NC++;
                    if (response === 'OK') responseCounts.OK++;
                    if (response === 'KO') responseCounts.KO++;

                    const temperature = parseFloat(response);
                    if (!isNaN(temperature)) {
                      if (temperature >= 63) {
                        responseCounts.over63++;
                      } else {
                        responseCounts.under63++;
                      }
                    }
                  });

                  // Send summary data to the backend for chart generation
                  sendChartDataToBackend(sousParagraphe, {
                    C: responseCounts.C,
                    PC: responseCounts.PC,
                    NC: responseCounts.NC,
                    OK: responseCounts.OK,
                    KO: responseCounts.KO,
                    over63: responseCounts.over63,
                    under63: responseCounts.under63,
                  });
                }

                return (
                  <div key={sousParagrapheIndex}>
                    <h6>{sousParagraphe}</h6>
                    {Array.isArray(sectionQuestions) ? (
                      sectionQuestions.map((questionObj) => {
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

                    {/* Summary Table */}
                    <div>
                      <h6>Response Summary for {sousParagraphe}</h6>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid black', padding: '5px' }}>Type</th>
                            <th style={{ border: '1px solid black', padding: '5px' }}>Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>C</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.C}</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>PC</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.PC}</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>NC</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.NC}</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>OK</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.OK}</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>KO</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.KO}</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>&ge; 63°C</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.over63}</td>
                          </tr>
                          <tr>
                            <td style={{ border: '1px solid black', padding: '5px' }}>&lt; 63°C</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.under63}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  ));
};

// Function to send the chart data to the backend
const sendChartDataToBackend = (sousParagraphe, responseCounts) => {
  // Generate the CPCNC chart
  axios
    .get(`http://localhost:3000/api/chart/cpcnc/${responseCounts.C}/${responseCounts.PC}/${responseCounts.NC}`)
    .then((response) => {
      console.log(`CPCNC chart generated for ${sousParagraphe}`);
    })
    .catch((error) => {
      console.error(`Error generating CPCNC chart for ${sousParagraphe}:`, error);
    });

  // Generate the OKKO chart
  axios
    .get(`http://localhost:3000/api/chart/okko/${responseCounts.OK}/${responseCounts.KO}`)
    .then((response) => {
      console.log(`OKKO chart generated for ${sousParagraphe}`);
    })
    .catch((error) => {
      console.error(`Error generating OKKO chart for ${sousParagraphe}:`, error);
    });

  // Generate the Temperature chart
  axios
    .get(`http://localhost:3000/api/chart/temperature/${responseCounts.over63}/${responseCounts.under63}`)
    .then((response) => {
      console.log(`Temperature chart generated for ${sousParagraphe}`);
    })
    .catch((error) => {
      console.error(`Error generating Temperature chart for ${sousParagraphe}:`, error);
    });
};

  // Helper function to calculate C/PC/NC proportions
  const calculateCPCNC = (questions) => {
    const counts = { C: 0, PC: 0, NC: 0 };
    questions.forEach((q) => {
      const response = q.response && q.response.response;  // Safely access response
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
      const response = q.response && q.response.response;  // Safely access response
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
      const response = q.response && parseFloat(q.response.response);  // Safely access and parse response
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
  let cpcncData, okkoData, temperatureData;
  if (selectedAuditId) {
    // Calculate data for charts
    cpcncData = calculateCPCNC(filteredAudits);
    okkoData = calculateOKKO(filteredAudits);
    temperatureData = calculateTemperature(filteredAudits);

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
            cpcncData={cpcncData}
            okkoData={okkoData}
            temperatureData={temperatureData}
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
