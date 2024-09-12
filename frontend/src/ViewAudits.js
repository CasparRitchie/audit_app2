import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAudits() {
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    axios.get('/api/get_audits')
      .then(response => {
        setAudits(response.data);
      })
      .catch(error => {
        console.error('Error fetching audit data:', error);
      });
  }, []);

  if (!audits || audits.length === 0) {
    return <div>No audits found.</div>;
  }

  return (
    <div>
      <h2>Existing Audits</h2>
      <table>
        <thead>
          <tr>
            <th>Audit ID</th>
            <th>Date</th>
            <th>Restaurant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audits.map(audit => (
            <tr key={audit.auditId}>
              <td>{audit.auditId}</td>
              <td>{audit.date}</td>
              <td>{audit.restaurant}</td>
              <td>
                <button>Edit</button> {/* Will link to edit page */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAudits;
