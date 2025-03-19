// // import React, { useState, useEffect, useCallback } from 'react';
// // import axios from 'axios';
// // import jsPDF from 'jspdf';
// // import html2canvas from 'html2canvas';

// // function Livrable() {
// //   const [auditHeaderIds, setAuditHeaderIds] = useState([]);
// //   const [selectedHeaderId, setSelectedHeaderId] = useState('');
// //   const [headerDetails, setHeaderDetails] = useState(null);
// //   const [associatedAuditIds, setAssociatedAuditIds] = useState([]);
// //   const [selectedAuditIds, setSelectedAuditIds] = useState([]);
// //   const [summaryResponses, setSummaryResponses] = useState(null);

// //   // Step 1: Load Audit Header IDs
// //   useEffect(() => {
// //     axios.get('/api/get_audit_headers').then(res => {
// //       const uniqueIds = [...new Set(res.data.map(audit => audit.auditId))];
// //       setAuditHeaderIds(uniqueIds);
// //     });
// //   }, []);

// //   // Step 2: Fetch Audit Header Details and associated Audit IDs
// //   useEffect(() => {
// //     if (selectedHeaderId) {
// //       axios.get('/api/get_audit/${selectedHeaderId}').then(res => {
// //         setHeaderDetails(res.data);
// //       });
// //       axios.get('/api/get_audit_ids_by_header/${selectedHeaderId}').then(res => {
// //         setAssociatedAuditIds(res.data.auditIds || []);
// //       });
// //     }
// //   }, [selectedHeaderId]);

// //   // Step 3: Fetch Summary Responses based on selected audits
// //   const fetchSummaryResponses = useCallback(() => {
// //     axios
// //       .post('/api/get_summary_responses', { auditIds: selectedAuditIds })
// //       .then(res => setSummaryResponses(res.data))
// //       .catch(err => console.error(err));
// //   }, [selectedAuditIds]);

// //   const toggleAuditSelection = auditId => {
// //     setSelectedAuditIds(prev =>
// //       prev.includes(auditId) ? prev.filter(id => id !== auditId) : [...prev, auditId]
// //     );
// //   };

// //   // **Export to PDF function**
// //   const generatePDF = async () => {
// //     const input = document.getElementById('livrable-content'); // Select the div containing all content

// //     if (!input) {
// //       console.error("Element 'livrable-content' not found!");
// //       return;
// //     }

// //     const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait mode, A4 size
// //     const pdfWidth = pdf.internal.pageSize.getWidth();
// //     const pdfHeight = pdf.internal.pageSize.getHeight();

// //     try {
// //       const canvas = await html2canvas(input, {
// //         scale: 2, // Higher scale for better resolution
// //         useCORS: true, // Handle cross-origin images
// //       });

// //       const imgData = canvas.toDataURL('image/png');
// //       const contentWidth = canvas.width;
// //       const contentHeight = canvas.height;

// //       const imgWidth = pdfWidth;
// //       const imgHeight = (contentHeight * pdfWidth) / contentWidth;

// //       let remainingHeight = imgHeight;
// //       let position = 0;

// //       while (remainingHeight > 0) {
// //         pdf.addImage(imgData, 'PNG', 0, position === 0 ? 0 : -position, imgWidth, imgHeight);
// //         remainingHeight -= pdfHeight;
// //         position += pdfHeight;

// //         if (remainingHeight > 0) pdf.addPage();
// //       }

// //       pdf.save('livrable.pdf'); // Save the generated PDF
// //     } catch (error) {
// //       console.error('Error generating PDF:', error);
// //     }
// //   };

// //   return (
// //     <div className="container">
// //       <h1>Livrable - Audit Summaries</h1>

// //       <div className="form-group">
// //         <label>Select Audit Header ID:</label>
// //         <select
// //           className="form-control"
// //           value={selectedHeaderId}
// //           onChange={e => setSelectedHeaderId(e.target.value)}
// //         >
// //           <option value="">Select Header</option>
// //           {auditHeaderIds.map(id => (
// //             <option key={id} value={id}>{id}</option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Wrap the content in a div for PDF export */}
// //       <div id="livrable-content">
// //         {headerDetails && (
// //           <div>
// //             <h3>Audit Header Details</h3>
// //             <table className="table table-bordered">
// //               <tbody>
// //                 {headerDetails.questions.map(q => (
// //                   <tr key={q.questionId}>
// //                     <td><strong>{q.questionId}</strong></td>
// //                     <td>{q.response}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         {associatedAuditIds.length > 0 && (
// //           <div>
// //             <h4>Select Audit IDs for Summary:</h4>
// //             {associatedAuditIds.map(id => (
// //               <div key={id}>
// //                 <input
// //                   type="checkbox"
// //                   id={id}
// //                   checked={selectedAuditIds.includes(id)}
// //                   onChange={() => toggleAuditSelection(id)}
// //                 />
// //                 <label htmlFor={id} style={{ marginLeft: '5px' }}>{id}</label>
// //               </div>
// //             ))}
// //             <button className="btn btn-primary mt-2" onClick={fetchSummaryResponses}>
// //               Generate Summary
// //             </button>
// //           </div>
// //         )}

// //         {summaryResponses && (
// //           <div>
// //             <h3>Summary of Selected Audits</h3>
// //             <table className="table table-striped">
// //               <thead>
// //                 <tr>
// //                   <th>Type</th>
// //                   <th>Good (Green)</th>
// //                   <th>Moderate (Amber)</th>
// //                   <th>Poor (Red)</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 <tr>
// //                   <td>C/PC/NC</td>
// //                   <td>{summaryResponses.C}</td>
// //                   <td>{summaryResponses.PC}</td>
// //                   <td>{summaryResponses.NC}</td>
// //                 </tr>
// //                 <tr>
// //                   <td>OK/KO</td>
// //                   <td>{summaryResponses.OK}</td>
// //                   <td>-</td>
// //                   <td>{summaryResponses.KO}</td>
// //                 </tr>
// //                 <tr>
// //                   <td>Temperature (&gt;63°C/&lt;63°C)</td>
// //                   <td>{summaryResponses.over63}</td>
// //                   <td>-</td>
// //                   <td>{summaryResponses.under63}</td>
// //                 </tr>
// //                 <tr>
// //                   <td>Cold Temperature (&lt;10°C/&gt;10°C)</td>
// //                   <td>{summaryResponses.under10}</td>
// //                   <td>-</td>
// //                   <td>{summaryResponses.over10}</td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       {/* PDF Export Button */}
// //       <button className="btn btn-primary mt-3" onClick={generatePDF}>
// //         Export to PDF
// //       </button>
// //     </div>
// //   );
// // }

// // export default Livrable;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function Livrable() {
//   const [auditHeaderIds, setAuditHeaderIds] = useState([]); // List of available Audit Header IDs
//   const [selectedHeaderId, setSelectedHeaderId] = useState('');
//   const [responseExists, setResponseExists] = useState(null); // Track if responses exist
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Step 1: Load Audit Header IDs from API
//   useEffect(() => {
//     async function fetchAuditHeaders() {
//       try {
//         const res = await axios.get('http://127.0.0.1:5000/api/get_audit_headers');
//         const uniqueIds = [...new Set(res.data.map(audit => audit.auditId))];
//         setAuditHeaderIds(uniqueIds);
//       } catch (err) {
//         console.error("Error fetching audit headers:", err);
//         setError("Failed to load audit headers.");
//       }
//     }
//     fetchAuditHeaders();
//   }, []);

//   // Step 2: When user selects an ID, check if responses exist
//   const checkResponses = async (auditId) => {
//     setSelectedHeaderId(auditId);
//     setLoading(true);
//     setResponseExists(null); // Reset state

//     try {
//       const res = await axios.get(`http://127.0.0.1:5000/api/get_audit/${auditId}`);
//       if (res.data && res.data.length > 0) {
//         setResponseExists(true); // Responses found
//       } else {
//         setResponseExists(false); // No responses found
//       }
//     } catch (err) {
//       console.error("Error checking responses:", err);
//       setResponseExists(false); // Treat as not found if error occurs
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="container">
//       <h1>Livrable - Debug Mode</h1>

//       {/* Step 1: Select an Audit Header ID */}
//       <div className="form-group">
//         <label>Select Audit Header ID:</label>
//         <select
//           className="form-control"
//           value={selectedHeaderId}
//           onChange={(e) => checkResponses(e.target.value)}
//         >
//           <option value="">Select Header</option>
//           {auditHeaderIds.map((id) => (
//             <option key={id} value={id}>{id}</option>
//           ))}
//         </select>
//       </div>

//       {/* Step 2: Show loading or response status */}
//       {loading && <p>Checking responses...</p>}
//       {responseExists === true && <p style={{ color: 'green' }}>✅ Responses found for this Audit ID!</p>}
//       {responseExists === false && <p style={{ color: 'red' }}>❌ No responses found in responses.csv.</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//     </div>
//   );
// }

// export default Livrable;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Livrable() {
  const [auditHeaderIds, setAuditHeaderIds] = useState([]); // List of available Audit Header IDs
  const [selectedHeaderId, setSelectedHeaderId] = useState('');
  const [responseExists, setResponseExists] = useState(null); // Track if responses exist
  const [responses, setResponses] = useState([]); // Store fetched responses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Load Audit Header IDs from API
  useEffect(() => {
    async function fetchAuditHeaders() {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/get_audit_headers');
        const uniqueIds = [...new Set(res.data.map(audit => audit.auditId))];
        setAuditHeaderIds(uniqueIds);
      } catch (err) {
        console.error("Error fetching audit headers:", err);
        setError("Failed to load audit headers.");
      }
    }
    fetchAuditHeaders();
  }, []);

  // Step 2: When user selects an ID, check if responses exist
  const checkResponses = async (auditId) => {
    setLoading(true);
    setResponseExists(null);
    setResponses([]); // Reset responses

    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/get_audit/${auditId}`);
      console.log("API Response:", res.data);

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // ✅ Replace NaN values in 'comment' and other fields
        const sanitizedResponses = res.data.map(response => ({
          ...response,
          comment: (typeof response.comment === "number" && isNaN(response.comment)) ? "" : response.comment,
          image_path: response.image_path === "[]" ? [] : response.image_path
        }));

        console.log("✅ Cleaned Responses:", sanitizedResponses);
        setResponses(sanitizedResponses);
        setResponseExists(true);
      } else {
        console.warn("❌ No responses found in API response.");
        setResponseExists(false);
      }
    } catch (err) {
      console.error("Error fetching responses:", err);
      setResponseExists(false);
    }

    setLoading(false);
  };






  return (
    <div className="container">
      <h1>Livrable - Debug Mode</h1>

      {/* Step 1: Select an Audit Header ID */}
      <div className="form-group">
        <label>Select Audit Header ID:</label>
        <select
          className="form-control"
          value={selectedHeaderId}
          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedHeaderId(selectedId); // ✅ First, update the selected ID
            checkResponses(selectedId);      // ✅ Then, fetch responses
          }}
        >
          <option value="">Select Header</option>
          {auditHeaderIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>

      </div>

      {/* Step 2: Show loading or response status */}
      {loading && <p>Checking responses...</p>}
      {responseExists === true && <p style={{ color: 'green' }}>✅ Responses found for this Audit ID!</p>}
      {responseExists === false && <p style={{ color: 'red' }}>❌ No responses found in responses.csv.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Step 3: If responses exist, display them in a table */}
      {responseExists && responses.length > 0 && (
        <div>
          <h3>Responses for {selectedHeaderId}</h3>
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
              {responses.map((response, index) => (
                <tr key={index}>
                  <td>{response.question}</td>
                  <td>{response.response || 'No response'}</td>
                  <td>{response.comment || 'No comment'}</td>
                  <td>
                    {response.image_path && response.image_path !== "No image" && response.image_path.length > 0 ? (
                      <img src={response.image_path} alt="Response Image" style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No image'
                    )}
                  </td>
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
