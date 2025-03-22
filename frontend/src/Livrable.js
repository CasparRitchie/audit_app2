import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Livrable() {
  const [auditHeaderIds, setAuditHeaderIds] = useState([]);
  const [selectedHeaderId, setSelectedHeaderId] = useState('');
  const [headerDetails, setHeaderDetails] = useState([]);
  const [headerQuestionsMap, setHeaderQuestionsMap] = useState({});
  const [detailQuestionsMap, setDetailQuestionsMap] = useState({});
  const [auditDetailIds, setAuditDetailIds] = useState([]);
  const [selectedDetailIds, setSelectedDetailIds] = useState([]);
  const [auditResponses, setAuditResponses] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Fetch available audit headers
  useEffect(() => {
    async function fetchAuditHeaders() {
      try {
        const res = await axios.get('/api/get_audit_headers');
        const uniqueIds = [...new Set(res.data.map(audit => audit.auditId))];
        setAuditHeaderIds(uniqueIds);
      } catch (err) {
        console.error("Error fetching audit headers:", err);
        setError("Failed to load audit headers.");
      }
    }
    fetchAuditHeaders();
  }, []);

  // ✅ Fetch audit HEADER questions
  useEffect(() => {
    async function fetchHeaderQuestions() {
      try {
        const res = await axios.get('/api/audit_header');
        const questionsMap = res.data.reduce((acc, question) => {
          acc[question.id] = question.question;
          return acc;
        }, {});
        setHeaderQuestionsMap(questionsMap);
      } catch (err) {
        console.error("Error fetching audit header questions:", err);
        setError("Failed to load audit header questions.");
      }
    }
    fetchHeaderQuestions();
  }, []);

  // ✅ Fetch audit DETAIL questions (from `questions.csv`)
  useEffect(() => {
    async function fetchDetailQuestions() {
      try {
        const res = await axios.get('/api/audit_detail');

        // Flatten hierarchical structure & map questions by ID
        const questionsMap = {};
        Object.values(res.data).forEach(chapitre => {
          Object.values(chapitre).forEach(sousChapitre => {
            Object.values(sousChapitre).forEach(paragraphe => {
              Object.values(paragraphe).forEach(sousParagraphe => {
                sousParagraphe.forEach(question => {
                  questionsMap[question.id] = question.question;
                });
              });
            });
          });
        });

        setDetailQuestionsMap(questionsMap);
      } catch (err) {
        console.error("Error fetching audit detail questions:", err);
        setError("Failed to load audit detail questions.");
      }
    }
    fetchDetailQuestions();
  }, []);

  // ✅ Fetch Audit Header & Responses
  const fetchHeaderDetails = async (auditId) => {
    setSelectedHeaderId(auditId);
    setHeaderDetails([]);
    setAuditDetailIds([]);
    setSelectedDetailIds([]);
    setAuditResponses([]);

    try {
      const resHeader = await axios.get(`/api/get_audit_header_detail/${auditId}`);
      setHeaderDetails(resHeader.data);

      const resDetail = await axios.get(`/api/get_audit/${auditId}`);
      setAuditResponses(resDetail.data);

      // ✅ Collect Unique Audit Detail IDs
      const uniqueDetailIds = [...new Set(resDetail.data.map(detail => detail.auditDetailId))];
      setAuditDetailIds(uniqueDetailIds);
    } catch (err) {
      console.error("Error fetching audit details:", err);
      setAuditResponses([]);
    }
  };

  // ✅ Handle checkbox selection of audit detail IDs
  const handleDetailSelection = (auditDetailId) => {
    setSelectedDetailIds((prevSelected) =>
      prevSelected.includes(auditDetailId)
        ? prevSelected.filter(id => id !== auditDetailId)
        : [...prevSelected, auditDetailId]
    );
  };

  return (
    <div className="container">
      <h1>Livrable - Debug Mode</h1>

      {/* Select Audit Header */}
      <div className="form-group">
        <label>Select Audit Header ID:</label>
        <select
          className="form-control"
          value={selectedHeaderId}
          onChange={(e) => fetchHeaderDetails(e.target.value)}
        >
          <option value="">Select Header</option>
          {auditHeaderIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      {/* Display Audit Header Responses */}
      {headerDetails.length > 0 && (
        <div>
          <h3>Audit Header Responses for {selectedHeaderId}</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Question</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {headerDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{headerQuestionsMap[detail.questionId] || `Unknown (${detail.questionId})`}</td>
                  <td>{detail.response || 'No response'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {auditResponses.length > 0 && (
        <div>
          <h3>Select Audit Details to View</h3>
          <div className="form-group">
            {auditDetailIds.map((auditDetailId) => (
              <div key={auditDetailId} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={auditDetailId}
                  checked={selectedDetailIds.includes(auditDetailId)}
                  onChange={() => handleDetailSelection(auditDetailId)}
                />
                <label className="form-check-label" htmlFor={auditDetailId}>{auditDetailId}</label>
              </div>
            ))}
          </div>

          {selectedDetailIds.length > 0 && (
            <div>
              <h3>Audit Responses</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Response</th>
                    <th>Comment</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {auditResponses
                    .filter(detail => selectedDetailIds.includes(detail.auditDetailId) && detail.response) // ✅ Only show questions with responses
                    .map((detail, index) => (
                      <tr key={index}>
                        <td>{detailQuestionsMap[detail.question] || `Unknown (${detail.question})`}</td>
                        <td>{detail.response || 'No response'}</td>
                        <td>{detail.comment || 'No comment'}</td>
                        <td>
                          {detail.image_path && detail.image_path.length > 0 ? (
                            <img src={detail.image_path} alt="Response Image" style={{ width: '50px', height: '50px' }} />
                          ) : (
                            'No Image'
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Livrable;
