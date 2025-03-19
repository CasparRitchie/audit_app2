import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Livrable() {
  const [auditHeaderIds, setAuditHeaderIds] = useState([]);
  const [selectedHeaderId, setSelectedHeaderId] = useState('');
  const [headerDetails, setHeaderDetails] = useState([]);
  const [questionsMap, setQuestionsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAuditHeaders() {
      try {
        console.log("Fetching audit headers...");
        const res = await axios.get('/api/get_audit_headers');
        console.log("Audit Headers Response:", res.data);
        const uniqueIds = [...new Set(res.data.map(audit => audit.auditId))];
        setAuditHeaderIds(uniqueIds);
      } catch (err) {
        console.error("Error fetching audit headers:", err);
        setError("Failed to load audit headers.");
      }
    }
    fetchAuditHeaders();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching questions...");
        const res = await axios.get('/api/audit_header');
        console.log("Questions Response:", res.data);
        const questionsMap = res.data.reduce((acc, question) => {
          acc[question.id] = question.question;
          return acc;
        }, {});
        setQuestionsMap(questionsMap);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions.");
      }
    }
    fetchQuestions();
  }, []);

  const fetchHeaderDetails = async (auditId) => {
    setSelectedHeaderId(auditId);
    setHeaderDetails([]);

    try {
      console.log(`Fetching audit header details for ID: ${auditId}`);
      const res = await axios.get(`/api/get_audit_header_detail/${auditId}`);
      console.log("Audit Header Details Response:", res.data);
      setHeaderDetails(res.data);
    } catch (err) {
      console.error("Error fetching audit header details:", err);
      setHeaderDetails([]);
    }
  };

  return (
    <div className="container">
      <h1>Livrable - Debug Mode</h1>

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

      {headerDetails.length > 0 && (
        <div>
          <h3>Audit Header Details for {selectedHeaderId}</h3>
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
                  <td>{questionsMap[detail.questionId] || detail.questionId}</td>
                  <td>{detail.response || 'No response'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Livrable;
