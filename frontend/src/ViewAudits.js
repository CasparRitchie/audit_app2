// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function ViewAudits() {
//   const [audits, setAudits] = useState(null); // Initialize with null to handle the loading state

//   useEffect(() => {
//     axios.get('/api/get_audits')
//       .then(response => {
//         console.log('Audit data:', response.data); // Log the raw data for debugging
//         setAudits(response.data); // Store the data in state
//       })
//       .catch(error => {
//         console.error('Error fetching audit data:', error);
//       });
//   }, []);

//   // If audits is null, show a loading message
//   if (audits === null) {
//     return <div>Loading audits...</div>;
//   }

//   // If audits is an empty array, show a message indicating no audits were found
//   if (audits.length === 0) {
//     return <div>No audits found.</div>;
//   }

//   return (
//     <div>
//       <h2>Existing Audits</h2>
//       <pre>{JSON.stringify(audits, null, 2)}</pre> {/* Display raw JSON data */}
//     </div>
//   );
// }

// export default ViewAudits;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAudits() {
  const [audits, setAudits] = useState(null); // Initialize with null to handle the loading state

  useEffect(() => {
    axios.get('/api/get_audits')
      .then(response => {
        console.log('Audit data:', response.data); // Log the raw data for debugging
        setAudits(response.data); // Store the data in state
      })
      .catch(error => {
        console.error('Error fetching audit data:', error);
      });
  }, []);

  // If audits is null, show a loading message
  if (audits === null) {
    return <div>Loading audits...</div>;
  }

  // If audits is an empty array, show a message indicating no audits were found
  if (audits.length === 0) {
    return <div>No audits found.</div>;
  }

  return (
    <div>
      <h2>Existing Audits</h2>
      <table>
        <thead>
          <tr>
            <th>Audit ID</th>
            <th>Question</th>
            <th>Response</th>
            <th>Comment</th>
            <th>Image Path</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit, index) => (
            <tr key={index}>
              <td>{audit.auditId}</td>
              <td>{audit.question}</td>
              {/* Render the response. If it's an object, extract the 'response' field */}
              <td>{typeof audit.response === 'object' ? audit.response.response : audit.response}</td>
              <td>{audit.comment || ''}</td>
              <td>{audit.image_path || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAudits;
