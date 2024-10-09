import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAudits() {
  const [audits, setAudits] = useState(null); // Initialize with null to handle the loading state
  const [expandedAudits, setExpandedAudits] = useState({}); // Track which audits are expanded

  useEffect(() => {
    axios.get('/api/get_audits')
      .then(response => {
        // console.log('Audit data:', response.data); // Log the raw data for debugging
        setAudits(groupByAuditId(response.data)); // Store the grouped data in state
      })
      .catch(error => {
        console.error('Error fetching audit data:', error);
      });
  }, []);

  // Function to group audits by auditId
  const groupByAuditId = (audits) => {
    return audits.reduce((acc, audit) => {
      if (!acc[audit.auditId]) {
        acc[audit.auditId] = [];
      }
      acc[audit.auditId].push(audit);
      return acc;
    }, {});
  };

  // Function to toggle the expanded state of an audit group
  const toggleAuditGroup = (auditId) => {
    setExpandedAudits((prevState) => ({
      ...prevState,
      [auditId]: !prevState[auditId], // Toggle the expanded state
    }));
  };

  // If audits is null, show a loading message
  if (audits === null) {
    return <div>Loading audits...</div>;
  }

  // If audits is an empty object, show a message indicating no audits were found
  if (Object.keys(audits).length === 0) {
    return <div>No audits found.</div>;
  }

  return (
    <div>
      <h2>Existing Audits</h2>
      {Object.keys(audits).map(auditId => (
        <div key={auditId} className="mb-3">
          <h4>
            <button
              className="btn btn-link"
              onClick={() => toggleAuditGroup(auditId)}
            >
              {expandedAudits[auditId] ? '▼' : '▶'} Audit ID: {auditId}
            </button>
          </h4>

          {expandedAudits[auditId] && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Response</th>
                  <th>Comment</th>
                  <th>Image Path</th>
                </tr>
              </thead>
              <tbody>
                {audits[auditId].map((audit, index) => (
                  <tr key={index}>
                    <td>{audit.question}</td>
                    <td>{audit.response?.response || ''}</td> {/* Handle nested response */}
                    <td>{audit.comment || ''}</td>
                    <td>{audit.image_path || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewAudits;
