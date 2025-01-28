// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import LivrableCharts from './LivrableCharts';
// // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';
// // import jsPDF from 'jspdf';
// // import html2canvas from 'html2canvas';

// // import './Livrable.css';

// // export const findResponseForQuestion = (responseMap, questionId) => {
// //   if (!(responseMap instanceof Map)) {
// //     console.error("responseMap is not a Map!", responseMap);
// //     return 'No response';
// //   }

// //   const numericQuestionId = parseInt(questionId, 10);
// //   const response = responseMap.get(numericQuestionId);

// //   if (!response) {
// //     console.debug(`No response found for Question ID: ${questionId}`);
// //     return 'No response';
// //   }

// //   return response;
// // };

// // function Livrable() {
// //   const [audits, setAudits] = useState([]);
// //   const [auditDetail, setAuditDetail] = useState({});
// //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
// //   const [filteredAudits, setFilteredAudits] = useState([]);
// //   const [isDataProcessed, setIsDataProcessed] = useState(false);
// //   const [responseMap, setResponseMap] = useState(new Map());
// //   const [loading, setLoading] = useState(true);

// //   // Fetch audits and audit details on mount
// //   useEffect(() => {
// //     async function fetchData() {
// //       try {
// //         setLoading(true);
// //         const [auditsResponse, auditDetailResponse] = await Promise.all([
// //           axios.get('/api/get_audits'),
// //           axios.get('/api/audit_detail'),
// //         ]);

// //         const auditsData = auditsResponse.data || [];
// //         setAudits(auditsData.filter(audit => audit && audit.auditId));
// //         setAuditDetail(auditDetailResponse.data);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchData();
// //   }, []);

// //   // Preprocess audits into a Map
// //   useEffect(() => {
// //     if (audits.length > 0) {
// //       const map = new Map();
// //       audits.forEach((audit) => {
// //         if (audit.question != null) {
// //           const questionId = parseInt(audit.question, 10);
// //           map.set(questionId, audit.response);
// //         }
// //       });

// //       console.log("Generated responseMap:", map);
// //       setResponseMap(map);
// //     }
// //   }, [audits]);

// //   // Filter audits for the selected Audit Header ID
// //   useEffect(() => {
// //     if (selectedAuditHeaderId && audits.length > 0) {
// //       const uniqueQuestions = {};

// //       audits.forEach(audit => {
// //         if (audit.auditId === selectedAuditHeaderId) {
// //           const questionId = audit.question;
// //           if (
// //             !uniqueQuestions[questionId] ||
// //             uniqueQuestions[questionId].auditDetailId < audit.auditDetailId
// //           ) {
// //             uniqueQuestions[questionId] = audit;
// //           }
// //         }
// //       });

// //       setFilteredAudits(Object.values(uniqueQuestions));
// //       setIsDataProcessed(true);
// //     }
// //   }, [selectedAuditHeaderId, audits]);

// //   const renderChartsAndDetails = () => {
// //     if (!isDataProcessed || !filteredAudits.length) {
// //       return <p>Loading data...</p>; // Ensure data is processed before rendering
// //     }

// //     return (
// //       <>
// //         <LivrableCharts
// //           key={selectedAuditHeaderId}
// //           auditId={selectedAuditHeaderId}
// //           cpcncData={calculateCPCNC(filteredAudits)}
// //           okkoData={calculateOKKO(filteredAudits)}
// //           temperatureData={calculateTemperature(filteredAudits)}
// //           coldtemperatureData={calculateColdTemperature(filteredAudits)}
// //         />
// //         <RenderAuditDetailsWithResponses
// //           auditDetail={auditDetail}
// //           filteredAudits={filteredAudits}
// //           responseMap={responseMap}
// //         />
// //       </>
// //     );
// //   };

// //   const generatePDF = async () => {
// //     const input = document.getElementById('livrable-content'); // The div containing all the content
// //     const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize PDF (A4, portrait)
// //     const pdfWidth = pdf.internal.pageSize.getWidth();
// //     const pdfHeight = pdf.internal.pageSize.getHeight();

// //     // Render the full HTML content as a canvas using html2canvas
// //     const canvas = await html2canvas(input, {
// //       scale: 2, // Higher scale for better resolution
// //       useCORS: true, // Handle cross-origin images
// //     });

// //     const imgData = canvas.toDataURL('image/png'); // Convert the canvas to an image
// //     const contentWidth = canvas.width; // Full width of the rendered content
// //     const contentHeight = canvas.height; // Full height of the rendered content

// //     const imgWidth = pdfWidth; // Scale image to fit the PDF width
// //     const imgHeight = (contentHeight * pdfWidth) / contentWidth; // Scale height proportionally to width

// //     let remainingHeight = imgHeight; // Total height of the image left to render
// //     let position = 0; // Position on the current page

// //     while (remainingHeight > 0) {
// //       // Add the current slice of the content to the PDF
// //       pdf.addImage(
// //         imgData,
// //         'PNG',
// //         0,
// //         position === 0 ? 0 : -position, // Adjust the Y-offset for the current slice
// //         imgWidth,
// //         imgHeight
// //       );

// //       remainingHeight -= pdfHeight; // Decrease the remaining height
// //       position += pdfHeight; // Move down for the next slice

// //       if (remainingHeight > 0) {
// //         pdf.addPage(); // Add a new page if there’s more content
// //       }
// //     }

// //     pdf.save('livrable.pdf'); // Save the PDF
// //   };

// //   const auditId = "12345"; // Replace with dynamic audit ID
// //   const cCount = 50;
// //   const pcCount = 30;
// //   const ncCount = 20;
// //   const greenCount = 100;
// //   const amberCount = 40;
// //   const redCount = 60;

// //   const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
// //     const auditIdStr = String(audit.auditId);
// //     if (!uniqueIds.includes(auditIdStr)) {
// //       uniqueIds.push(auditIdStr);
// //     }
// //     return uniqueIds;
// //   }, []);

// //   return (
// //     <div className="container" id="livrable-content">
// //       <h1>Livrable - Générer un pdf</h1>
// //       {loading ? (
// //         <p>Loading data...</p>
// //       ) : (
// //         <>
// //           <div className="form-group">
// //             <label htmlFor="auditSelect">Choisir Audit:</label>
// //             <select
// //               id="auditSelect"
// //               className="form-control"
// //               value={selectedAuditHeaderId}
// //               onChange={(e) => {
// //                 setSelectedAuditHeaderId(e.target.value);
// //                 setIsDataProcessed(false);
// //               }}
// //             >
// //               <option value="">Veuillez choisir un audit</option>
// //               {uniqueAuditHeaderIds.map((id) => (
// //                 <option key={id} value={id}>
// //                   {id}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>
// //           {selectedAuditHeaderId && renderChartsAndDetails()}
// //           <button className="btn btn-primary mt-3" onClick={generatePDF}>
// //             Save to PDF
// //           </button>

// //           <div>
// //         <h2>Overall Gauge Chart</h2>
// //         <img
// //           src={`/api/chart/gauge/overall/${greenCount}/${amberCount}/${redCount}`}
// //           alt="Overall Gauge Chart"
// //           style={{ width: "100%", maxWidth: "100px" }}
// //         />
// //       </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // export default Livrable;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import LivrableCharts from './LivrableCharts';
// import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// import './Livrable.css';

// export const findResponseForQuestion = (responseMap, questionId) => {
//   if (!(responseMap instanceof Map)) {
//     console.error("responseMap is not a Map!", responseMap);
//     return 'No response';
//   }

//   const numericQuestionId = parseInt(questionId, 10);
//   const response = responseMap.get(numericQuestionId);

//   if (!response) {
//     console.debug(`No response found for Question ID: ${questionId}`);
//     return 'No response';
//   }

//   return response;
// };

// function Livrable() {
//   const [audits, setAudits] = useState([]);
//   const [auditDetail, setAuditDetail] = useState({});
//   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
//   const [filteredAudits, setFilteredAudits] = useState([]);
//   const [auditHeaderDetails, setAuditHeaderDetails] = useState(null);
//   const [isDataProcessed, setIsDataProcessed] = useState(false);
//   const [responseMap, setResponseMap] = useState(new Map());
//   const [loading, setLoading] = useState(true);

//   // Fetch audits and audit details on mount
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         const [auditsResponse, auditDetailResponse] = await Promise.all([
//           axios.get('/api/get_audits'),
//           axios.get('/api/audit_detail'),
//         ]);

//         const auditsData = auditsResponse.data || [];
//         setAudits(auditsData.filter(audit => audit && audit.auditId));
//         setAuditDetail(auditDetailResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   // Preprocess audits into a Map
//   useEffect(() => {
//     if (audits.length > 0) {
//       const map = new Map();
//       audits.forEach((audit) => {
//         if (audit.question != null) {
//           const questionId = parseInt(audit.question, 10);
//           map.set(questionId, audit.response);
//         }
//       });

//       console.log("Generated responseMap:", map);
//       setResponseMap(map);
//     }
//   }, [audits]);

//   // Fetch and display audit header details when an ID is selected
//   // Fetch and display audit header details when an ID is selected
//   useEffect(() => {
//     if (selectedAuditHeaderId) {
//       async function fetchAuditHeaderDetails() {
//         try {
//           const response = await axios.get(
//             `/api/get_audit_header_grouped/${selectedAuditHeaderId}`
//           );

//           console.warn("Response from API for selected audit header ID:", response.data);

//           // Validate the structure
//           if (
//             response.data &&
//             response.data.auditId === selectedAuditHeaderId &&
//             Array.isArray(response.data.questions)
//           ) {
//             setAuditHeaderDetails(response.data);
//             console.warn(response.data)
//           } else {
//             console.warn(
//               `No valid audit header found for ID ${selectedAuditHeaderId}.`
//             );
//             setAuditHeaderDetails(null);
//           }
//         } catch (error) {
//           console.error('Error fetching audit header details:', error);
//           setAuditHeaderDetails(null);
//         }
//       }

//       fetchAuditHeaderDetails();
//     } else {
//       setAuditHeaderDetails(null);
//     }
//   }, [selectedAuditHeaderId]);

//   const renderRawAuditHeaderDetails = () => {
//     if (!auditHeaderDetails) {
//       return <p>No audit header details available.</p>;
//     }

//     return (
//       <div>
//         <h3>Raw Audit Header Details</h3>
//         <pre>{JSON.stringify(auditHeaderDetails, null, 2)}</pre>
//       </div>
//     );
//   };





//   // Filter audits for the selected Audit Header ID
//   useEffect(() => {
//     if (selectedAuditHeaderId && audits.length > 0) {
//       const uniqueQuestions = {};

//       audits.forEach(audit => {
//         if (audit.auditId === selectedAuditHeaderId) {
//           const questionId = audit.question;
//           if (
//             !uniqueQuestions[questionId] ||
//             uniqueQuestions[questionId].auditDetailId < audit.auditDetailId
//           ) {
//             uniqueQuestions[questionId] = audit;
//           }
//         }
//       });

//       setFilteredAudits(Object.values(uniqueQuestions));
//       setIsDataProcessed(true);
//     }
//   }, [selectedAuditHeaderId, audits]);

//   const renderAuditHeaderDetails = () => {
//     if (!auditHeaderDetails || !auditHeaderDetails.questions) {
//       return <p>No audit header details available.</p>;
//     }

//     return (
//       <div className="audit-header-details">
//         <h3>Audit Header Details</h3>
//         <ul>
//           {auditHeaderDetails.questions.map((question, index) => (
//             <li key={index}>
//               <strong>Question {question.question}:</strong> {question.response || 'No response'}
//               {question.comment && <em> (Comment: {question.comment})</em>}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };




//   const renderChartsAndDetails = () => {
//     if (!isDataProcessed || !filteredAudits.length) {
//       return <p>Loading data...</p>; // Ensure data is processed before rendering
//     }

//     return (
//       <>
//         <LivrableCharts
//           key={selectedAuditHeaderId}
//           auditId={selectedAuditHeaderId}
//           cpcncData={calculateCPCNC(filteredAudits)}
//           okkoData={calculateOKKO(filteredAudits)}
//           temperatureData={calculateTemperature(filteredAudits)}
//           coldtemperatureData={calculateColdTemperature(filteredAudits)}
//         />
//         <RenderAuditDetailsWithResponses
//           auditDetail={auditDetail}
//           filteredAudits={filteredAudits}
//           responseMap={responseMap}
//         />
//       </>
//     );
//   };

//   const generatePDF = async () => {
//     const input = document.getElementById('livrable-content'); // The div containing all the content
//     const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize PDF (A4, portrait)
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const canvas = await html2canvas(input, {
//       scale: 2, // Higher scale for better resolution
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL('image/png');
//     const contentWidth = canvas.width;
//     const contentHeight = canvas.height;

//     const imgWidth = pdfWidth;
//     const imgHeight = (contentHeight * pdfWidth) / contentWidth;

//     let remainingHeight = imgHeight;
//     let position = 0;

//     while (remainingHeight > 0) {
//       pdf.addImage(
//         imgData,
//         'PNG',
//         0,
//         position === 0 ? 0 : -position,
//         imgWidth,
//         imgHeight
//       );

//       remainingHeight -= pdfHeight;
//       position += pdfHeight;

//       if (remainingHeight > 0) {
//         pdf.addPage();
//       }
//     }

//     pdf.save('livrable.pdf');
//   };

//   const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
//     const auditIdStr = String(audit.auditId);
//     if (!uniqueIds.includes(auditIdStr)) {
//       uniqueIds.push(auditIdStr);
//     }
//     return uniqueIds;
//   }, []);

//   return (
//     <div className="container" id="livrable-content">
//       <h1>Livrable - Générer un pdf</h1>
//       {loading ? (
//         <p>Loading data...</p>
//       ) : (
//         <>
//           <div className="form-group">
//             <label htmlFor="auditSelect">Choisir Audit:</label>
//             <select
//               id="auditSelect"
//               className="form-control"
//               value={selectedAuditHeaderId}
//               onChange={(e) => {
//                 setSelectedAuditHeaderId(e.target.value);
//                 setIsDataProcessed(false);
//               }}
//             >
//               <option value="">Veuillez choisir un audit</option>
//               {uniqueAuditHeaderIds.map((id) => (
//                 <option key={id} value={id}>
//                   {id}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Display raw response data */}
//           {selectedAuditHeaderId && renderRawAuditHeaderDetails()}

//           {/* Existing rendering functions */}
//           {selectedAuditHeaderId && renderAuditHeaderDetails()}
//           {selectedAuditHeaderId && renderChartsAndDetails()}

//           <button className="btn btn-primary mt-3" onClick={generatePDF}>
//             Save to PDF
//           </button>
//         </>
//       )}
//     </div>
//   );

// }

// export default Livrable;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Livrable() {
  const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
  const [auditHeaderDetails, setAuditHeaderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch audit header details when an ID is selected
  useEffect(() => {
    if (selectedAuditHeaderId) {
      async function fetchAuditHeaderDetails() {
        setLoading(true);
        setError(null); // Reset error state
        try {
          const response = await axios.get(
            `/api/get_audit_header_grouped/${selectedAuditHeaderId}`
          );
          console.log('Response from API:', response.data); // Log the response
          setAuditHeaderDetails(response.data);
        } catch (error) {
          console.error('Error fetching audit header details:', error);
          setError('Failed to fetch audit header details.');
          setAuditHeaderDetails(null);
        } finally {
          setLoading(false);
        }
      }

      fetchAuditHeaderDetails();
    } else {
      setAuditHeaderDetails(null); // Reset state when no ID is selected
    }
  }, [selectedAuditHeaderId]);

  return (
    <div className="container">
      <h1>Livrable - Basic Test</h1>

      {/* Dropdown to select an audit header ID */}
      <div className="form-group">
        <label htmlFor="auditSelect">Choisir Audit Header ID:</label>
        <select
          id="auditSelect"
          className="form-control"
          value={selectedAuditHeaderId}
          onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
        >
          <option value="">Veuillez choisir un audit header ID</option>
          <option value="audit_1730383065779">audit_1730383065779</option>
          <option value="audit_1733142988272">audit_1733142988272</option>
          <option value="audit_1734865473061">audit_1734865473061</option>
        </select>
      </div>

      {/* Display loading message */}
      {loading && <p>Loading audit header details...</p>}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display audit header details */}
      {auditHeaderDetails && (
        <div>
          <h3>Audit Header Details</h3>
          <pre>{JSON.stringify(auditHeaderDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Livrable;
