import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAudits() {
  const [audits, setAudits] = useState(null); // Initialize with null to handle the loading state
  const [expandedAudits, setExpandedAudits] = useState({}); // Track which audits are expanded

  useEffect(() => {
    axios.get('/api/get_audits')
      .then(response => {
        const data = response.data;

        // Ensure data is an array before applying `reduce`
        if (Array.isArray(data)) {
          setAudits(groupByAuditId(data)); // Store the grouped data in state
        } else {
          console.error('Expected an array but received:', data);
        }
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
                    <td>{audit.response || ''}</td> {/* Now directly accessing response */}
                    <td>{audit.comment || ''}</td>
                    <td>{audit.image_path || ''}</td>
                    <td>{audit.auditHeaderID || 'No Header'}</td>
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
