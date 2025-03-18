// // // // // import React, { useState, useEffect } from 'react';
// // // // // import axios from 'axios';
// // // // // import LivrableCharts from './LivrableCharts';
// // // // // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // // // // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';
// // // // // import jsPDF from 'jspdf';
// // // // // import html2canvas from 'html2canvas';

// // // // // import './Livrable.css';

// // // // // export const findResponseForQuestion = (responseMap, questionId) => {
// // // // //   if (!(responseMap instanceof Map)) {
// // // // //     console.error("responseMap is not a Map!", responseMap);
// // // // //     return 'No response';
// // // // //   }

// // // // //   const numericQuestionId = parseInt(questionId, 10);
// // // // //   const response = responseMap.get(numericQuestionId);

// // // // //   if (!response) {
// // // // //     console.debug(`No response found for Question ID: ${questionId}`);
// // // // //     return 'No response';
// // // // //   }

// // // // //   return response;
// // // // // };

// // // // // function Livrable() {
// // // // //   const [audits, setAudits] = useState([]);
// // // // //   const [auditDetail, setAuditDetail] = useState({});
// // // // //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
// // // // //   const [filteredAudits, setFilteredAudits] = useState([]);
// // // // //   const [isDataProcessed, setIsDataProcessed] = useState(false);
// // // // //   const [responseMap, setResponseMap] = useState(new Map());
// // // // //   const [loading, setLoading] = useState(true);

// // // // //   // Fetch audits and audit details on mount
// // // // //   useEffect(() => {
// // // // //     async function fetchData() {
// // // // //       try {
// // // // //         setLoading(true);
// // // // //         const [auditsResponse, auditDetailResponse] = await Promise.all([
// // // // //           axios.get('/api/get_audits'),
// // // // //           axios.get('/api/audit_detail'),
// // // // //         ]);

// // // // //         const auditsData = auditsResponse.data || [];
// // // // //         setAudits(auditsData.filter(audit => audit && audit.auditId));
// // // // //         setAuditDetail(auditDetailResponse.data);
// // // // //       } catch (error) {
// // // // //         console.error('Error fetching data:', error);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     }

// // // // //     fetchData();
// // // // //   }, []);

// // // // //   // Preprocess audits into a Map
// // // // //   useEffect(() => {
// // // // //     if (audits.length > 0) {
// // // // //       const map = new Map();
// // // // //       audits.forEach((audit) => {
// // // // //         if (audit.question != null) {
// // // // //           const questionId = parseInt(audit.question, 10);
// // // // //           map.set(questionId, audit.response);
// // // // //         }
// // // // //       });

// // // // //       console.log("Generated responseMap:", map);
// // // // //       setResponseMap(map);
// // // // //     }
// // // // //   }, [audits]);

// // // // //   // Filter audits for the selected Audit Header ID
// // // // //   useEffect(() => {
// // // // //     if (selectedAuditHeaderId && audits.length > 0) {
// // // // //       const uniqueQuestions = {};

// // // // //       audits.forEach(audit => {
// // // // //         if (audit.auditId === selectedAuditHeaderId) {
// // // // //           const questionId = audit.question;
// // // // //           if (
// // // // //             !uniqueQuestions[questionId] ||
// // // // //             uniqueQuestions[questionId].auditDetailId < audit.auditDetailId
// // // // //           ) {
// // // // //             uniqueQuestions[questionId] = audit;
// // // // //           }
// // // // //         }
// // // // //       });

// // // // //       setFilteredAudits(Object.values(uniqueQuestions));
// // // // //       setIsDataProcessed(true);
// // // // //     }
// // // // //   }, [selectedAuditHeaderId, audits]);

// // // // //   const renderChartsAndDetails = () => {
// // // // //     if (!isDataProcessed || !filteredAudits.length) {
// // // // //       return <p>Loading data...</p>; // Ensure data is processed before rendering
// // // // //     }

// // // // //     return (
// // // // //       <>
// // // // //         <LivrableCharts
// // // // //           key={selectedAuditHeaderId}
// // // // //           auditId={selectedAuditHeaderId}
// // // // //           cpcncData={calculateCPCNC(filteredAudits)}
// // // // //           okkoData={calculateOKKO(filteredAudits)}
// // // // //           temperatureData={calculateTemperature(filteredAudits)}
// // // // //           coldtemperatureData={calculateColdTemperature(filteredAudits)}
// // // // //         />
// // // // //         <RenderAuditDetailsWithResponses
// // // // //           auditDetail={auditDetail}
// // // // //           filteredAudits={filteredAudits}
// // // // //           responseMap={responseMap}
// // // // //         />
// // // // //       </>
// // // // //     );
// // // // //   };

// // // // //   const generatePDF = async () => {
// // // // //     const input = document.getElementById('livrable-content'); // The div containing all the content
// // // // //     const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize PDF (A4, portrait)
// // // // //     const pdfWidth = pdf.internal.pageSize.getWidth();
// // // // //     const pdfHeight = pdf.internal.pageSize.getHeight();

// // // // //     // Render the full HTML content as a canvas using html2canvas
// // // // //     const canvas = await html2canvas(input, {
// // // // //       scale: 2, // Higher scale for better resolution
// // // // //       useCORS: true, // Handle cross-origin images
// // // // //     });

// // // // //     const imgData = canvas.toDataURL('image/png'); // Convert the canvas to an image
// // // // //     const contentWidth = canvas.width; // Full width of the rendered content
// // // // //     const contentHeight = canvas.height; // Full height of the rendered content

// // // // //     const imgWidth = pdfWidth; // Scale image to fit the PDF width
// // // // //     const imgHeight = (contentHeight * pdfWidth) / contentWidth; // Scale height proportionally to width

// // // // //     let remainingHeight = imgHeight; // Total height of the image left to render
// // // // //     let position = 0; // Position on the current page

// // // // //     while (remainingHeight > 0) {
// // // // //       // Add the current slice of the content to the PDF
// // // // //       pdf.addImage(
// // // // //         imgData,
// // // // //         'PNG',
// // // // //         0,
// // // // //         position === 0 ? 0 : -position, // Adjust the Y-offset for the current slice
// // // // //         imgWidth,
// // // // //         imgHeight
// // // // //       );

// // // // //       remainingHeight -= pdfHeight; // Decrease the remaining height
// // // // //       position += pdfHeight; // Move down for the next slice

// // // // //       if (remainingHeight > 0) {
// // // // //         pdf.addPage(); // Add a new page if there’s more content
// // // // //       }
// // // // //     }

// // // // //     pdf.save('livrable.pdf'); // Save the PDF
// // // // //   };

// // // // //   const auditId = "12345"; // Replace with dynamic audit ID
// // // // //   const cCount = 50;
// // // // //   const pcCount = 30;
// // // // //   const ncCount = 20;
// // // // //   const greenCount = 100;
// // // // //   const amberCount = 40;
// // // // //   const redCount = 60;

// // // // //   const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
// // // // //     const auditIdStr = String(audit.auditId);
// // // // //     if (!uniqueIds.includes(auditIdStr)) {
// // // // //       uniqueIds.push(auditIdStr);
// // // // //     }
// // // // //     return uniqueIds;
// // // // //   }, []);

// // // // //   return (
// // // // //     <div className="container" id="livrable-content">
// // // // //       <h1>Livrable - Générer un pdf</h1>
// // // // //       {loading ? (
// // // // //         <p>Loading data...</p>
// // // // //       ) : (
// // // // //         <>
// // // // //           <div className="form-group">
// // // // //             <label htmlFor="auditSelect">Choisir Audit:</label>
// // // // //             <select
// // // // //               id="auditSelect"
// // // // //               className="form-control"
// // // // //               value={selectedAuditHeaderId}
// // // // //               onChange={(e) => {
// // // // //                 setSelectedAuditHeaderId(e.target.value);
// // // // //                 setIsDataProcessed(false);
// // // // //               }}
// // // // //             >
// // // // //               <option value="">Veuillez choisir un audit</option>
// // // // //               {uniqueAuditHeaderIds.map((id) => (
// // // // //                 <option key={id} value={id}>
// // // // //                   {id}
// // // // //                 </option>
// // // // //               ))}
// // // // //             </select>
// // // // //           </div>
// // // // //           {selectedAuditHeaderId && renderChartsAndDetails()}
// // // // //           <button className="btn btn-primary mt-3" onClick={generatePDF}>
// // // // //             Save to PDF
// // // // //           </button>

// // // // //           <div>
// // // // //         <h2>Overall Gauge Chart</h2>
// // // // //         <img
// // // // //           src={`/api/chart/gauge/overall/${greenCount}/${amberCount}/${redCount}`}
// // // // //           alt="Overall Gauge Chart"
// // // // //           style={{ width: "100%", maxWidth: "100px" }}
// // // // //         />
// // // // //       </div>
// // // // //         </>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default Livrable;


// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import LivrableCharts from './LivrableCharts';
// // // // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // // // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';
// // // // import jsPDF from 'jspdf';
// // // // import html2canvas from 'html2canvas';

// // // // import './Livrable.css';

// // // // export const findResponseForQuestion = (responseMap, questionId) => {
// // // //   if (!(responseMap instanceof Map)) {
// // // //     console.error("responseMap is not a Map!", responseMap);
// // // //     return 'No response';
// // // //   }

// // // //   const numericQuestionId = parseInt(questionId, 10);
// // // //   const response = responseMap.get(numericQuestionId);

// // // //   if (!response) {
// // // //     console.debug(`No response found for Question ID: ${questionId}`);
// // // //     return 'No response';
// // // //   }

// // // //   return response;
// // // // };

// // // // function Livrable() {
// // // //   const [audits, setAudits] = useState([]);
// // // //   const [auditDetail, setAuditDetail] = useState({});
// // // //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
// // // //   const [filteredAudits, setFilteredAudits] = useState([]);
// // // //   const [auditHeaderDetails, setAuditHeaderDetails] = useState(null);
// // // //   const [isDataProcessed, setIsDataProcessed] = useState(false);
// // // //   const [responseMap, setResponseMap] = useState(new Map());
// // // //   const [loading, setLoading] = useState(true);

// // // //   // Fetch audits and audit details on mount
// // // //   useEffect(() => {
// // // //     async function fetchData() {
// // // //       try {
// // // //         setLoading(true);
// // // //         const [auditsResponse, auditDetailResponse] = await Promise.all([
// // // //           axios.get('/api/get_audits'),
// // // //           axios.get('/api/audit_detail'),
// // // //         ]);

// // // //         const auditsData = auditsResponse.data || [];
// // // //         setAudits(auditsData.filter(audit => audit && audit.auditId));
// // // //         setAuditDetail(auditDetailResponse.data);
// // // //       } catch (error) {
// // // //         console.error('Error fetching data:', error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     }

// // // //     fetchData();
// // // //   }, []);

// // // //   // Preprocess audits into a Map
// // // //   useEffect(() => {
// // // //     if (audits.length > 0) {
// // // //       const map = new Map();
// // // //       audits.forEach((audit) => {
// // // //         if (audit.question != null) {
// // // //           const questionId = parseInt(audit.question, 10);
// // // //           map.set(questionId, audit.response);
// // // //         }
// // // //       });

// // // //       console.log("Generated responseMap:", map);
// // // //       setResponseMap(map);
// // // //     }
// // // //   }, [audits]);

// // // //   // Fetch and display audit header details when an ID is selected
// // // //   // Fetch and display audit header details when an ID is selected
// // // //   useEffect(() => {
// // // //     if (selectedAuditHeaderId) {
// // // //       async function fetchAuditHeaderDetails() {
// // // //         try {
// // // //           const response = await axios.get(
// // // //             `/api/get_audit_header_grouped/${selectedAuditHeaderId}`
// // // //           );

// // // //           console.warn("Response from API for selected audit header ID:", response.data);

// // // //           // Validate the structure
// // // //           if (
// // // //             response.data &&
// // // //             response.data.auditId === selectedAuditHeaderId &&
// // // //             Array.isArray(response.data.questions)
// // // //           ) {
// // // //             setAuditHeaderDetails(response.data);
// // // //             console.warn(response.data)
// // // //           } else {
// // // //             console.warn(
// // // //               `No valid audit header found for ID ${selectedAuditHeaderId}.`
// // // //             );
// // // //             setAuditHeaderDetails(null);
// // // //           }
// // // //         } catch (error) {
// // // //           console.error('Error fetching audit header details:', error);
// // // //           setAuditHeaderDetails(null);
// // // //         }
// // // //       }

// // // //       fetchAuditHeaderDetails();
// // // //     } else {
// // // //       setAuditHeaderDetails(null);
// // // //     }
// // // //   }, [selectedAuditHeaderId]);

// // // //   const renderRawAuditHeaderDetails = () => {
// // // //     if (!auditHeaderDetails) {
// // // //       return <p>No audit header details available.</p>;
// // // //     }

// // // //     return (
// // // //       <div>
// // // //         <h3>Raw Audit Header Details</h3>
// // // //         <pre>{JSON.stringify(auditHeaderDetails, null, 2)}</pre>
// // // //       </div>
// // // //     );
// // // //   };





// // // //   // Filter audits for the selected Audit Header ID
// // // //   useEffect(() => {
// // // //     if (selectedAuditHeaderId && audits.length > 0) {
// // // //       const uniqueQuestions = {};

// // // //       audits.forEach(audit => {
// // // //         if (audit.auditId === selectedAuditHeaderId) {
// // // //           const questionId = audit.question;
// // // //           if (
// // // //             !uniqueQuestions[questionId] ||
// // // //             uniqueQuestions[questionId].auditDetailId < audit.auditDetailId
// // // //           ) {
// // // //             uniqueQuestions[questionId] = audit;
// // // //           }
// // // //         }
// // // //       });

// // // //       setFilteredAudits(Object.values(uniqueQuestions));
// // // //       setIsDataProcessed(true);
// // // //     }
// // // //   }, [selectedAuditHeaderId, audits]);

// // // //   const renderAuditHeaderDetails = () => {
// // // //     if (!auditHeaderDetails || !auditHeaderDetails.questions) {
// // // //       return <p>No audit header details available.</p>;
// // // //     }

// // // //     return (
// // // //       <div className="audit-header-details">
// // // //         <h3>Audit Header Details</h3>
// // // //         <ul>
// // // //           {auditHeaderDetails.questions.map((question, index) => (
// // // //             <li key={index}>
// // // //               <strong>Question {question.question}:</strong> {question.response || 'No response'}
// // // //               {question.comment && <em> (Comment: {question.comment})</em>}
// // // //             </li>
// // // //           ))}
// // // //         </ul>
// // // //       </div>
// // // //     );
// // // //   };




// // // //   const renderChartsAndDetails = () => {
// // // //     if (!isDataProcessed || !filteredAudits.length) {
// // // //       return <p>Loading data...</p>; // Ensure data is processed before rendering
// // // //     }

// // // //     return (
// // // //       <>
// // // //         <LivrableCharts
// // // //           key={selectedAuditHeaderId}
// // // //           auditId={selectedAuditHeaderId}
// // // //           cpcncData={calculateCPCNC(filteredAudits)}
// // // //           okkoData={calculateOKKO(filteredAudits)}
// // // //           temperatureData={calculateTemperature(filteredAudits)}
// // // //           coldtemperatureData={calculateColdTemperature(filteredAudits)}
// // // //         />
// // // //         <RenderAuditDetailsWithResponses
// // // //           auditDetail={auditDetail}
// // // //           filteredAudits={filteredAudits}
// // // //           responseMap={responseMap}
// // // //         />
// // // //       </>
// // // //     );
// // // //   };

// // // //   const generatePDF = async () => {
// // // //     const input = document.getElementById('livrable-content'); // The div containing all the content
// // // //     const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize PDF (A4, portrait)
// // // //     const pdfWidth = pdf.internal.pageSize.getWidth();
// // // //     const pdfHeight = pdf.internal.pageSize.getHeight();

// // // //     const canvas = await html2canvas(input, {
// // // //       scale: 2, // Higher scale for better resolution
// // // //       useCORS: true,
// // // //     });

// // // //     const imgData = canvas.toDataURL('image/png');
// // // //     const contentWidth = canvas.width;
// // // //     const contentHeight = canvas.height;

// // // //     const imgWidth = pdfWidth;
// // // //     const imgHeight = (contentHeight * pdfWidth) / contentWidth;

// // // //     let remainingHeight = imgHeight;
// // // //     let position = 0;

// // // //     while (remainingHeight > 0) {
// // // //       pdf.addImage(
// // // //         imgData,
// // // //         'PNG',
// // // //         0,
// // // //         position === 0 ? 0 : -position,
// // // //         imgWidth,
// // // //         imgHeight
// // // //       );

// // // //       remainingHeight -= pdfHeight;
// // // //       position += pdfHeight;

// // // //       if (remainingHeight > 0) {
// // // //         pdf.addPage();
// // // //       }
// // // //     }

// // // //     pdf.save('livrable.pdf');
// // // //   };

// // // //   const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
// // // //     const auditIdStr = String(audit.auditId);
// // // //     if (!uniqueIds.includes(auditIdStr)) {
// // // //       uniqueIds.push(auditIdStr);
// // // //     }
// // // //     return uniqueIds;
// // // //   }, []);

// // // //   return (
// // // //     <div className="container" id="livrable-content">
// // // //       <h1>Livrable - Générer un pdf</h1>
// // // //       {loading ? (
// // // //         <p>Loading data...</p>
// // // //       ) : (
// // // //         <>
// // // //           <div className="form-group">
// // // //             <label htmlFor="auditSelect">Choisir Audit:</label>
// // // //             <select
// // // //               id="auditSelect"
// // // //               className="form-control"
// // // //               value={selectedAuditHeaderId}
// // // //               onChange={(e) => {
// // // //                 setSelectedAuditHeaderId(e.target.value);
// // // //                 setIsDataProcessed(false);
// // // //               }}
// // // //             >
// // // //               <option value="">Veuillez choisir un audit</option>
// // // //               {uniqueAuditHeaderIds.map((id) => (
// // // //                 <option key={id} value={id}>
// // // //                   {id}
// // // //                 </option>
// // // //               ))}
// // // //             </select>
// // // //           </div>

// // // //           {/* Display raw response data */}
// // // //           {selectedAuditHeaderId && renderRawAuditHeaderDetails()}

// // // //           {/* Existing rendering functions */}
// // // //           {selectedAuditHeaderId && renderAuditHeaderDetails()}
// // // //           {selectedAuditHeaderId && renderChartsAndDetails()}

// // // //           <button className="btn btn-primary mt-3" onClick={generatePDF}>
// // // //             Save to PDF
// // // //           </button>
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );

// // // // }

// // // // export default Livrable;


// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';

// // // function Livrable() {
// // //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
// // //   const [auditHeaderDetails, setAuditHeaderDetails] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState(null);

// // //   // Fetch audit header details when an ID is selected
// // //   useEffect(() => {
// // //     if (selectedAuditHeaderId) {
// // //       async function fetchAuditHeaderDetails() {
// // //         setLoading(true);
// // //         setError(null); // Reset error state
// // //         try {
// // //           const response = await axios.get(
// // //             `/api/get_audit_header_grouped/${selectedAuditHeaderId}`
// // //           );
// // //           console.log('Response from API:', response.data); // Log the response
// // //           setAuditHeaderDetails(response.data);
// // //         } catch (error) {
// // //           console.error('Error fetching audit header details:', error);
// // //           setError('Failed to fetch audit header details.');
// // //           setAuditHeaderDetails(null);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       }

// // //       fetchAuditHeaderDetails();
// // //     } else {
// // //       setAuditHeaderDetails(null); // Reset state when no ID is selected
// // //     }
// // //   }, [selectedAuditHeaderId]);

// // //   return (
// // //     <div className="container">
// // //       <h1>Livrable - Basic Test</h1>

// // //       {/* Dropdown to select an audit header ID */}
// // //       <div className="form-group">
// // //         <label htmlFor="auditSelect">Choisir Audit Header ID:</label>
// // //         <select
// // //           id="auditSelect"
// // //           className="form-control"
// // //           value={selectedAuditHeaderId}
// // //           onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
// // //         >
// // //           <option value="">Veuillez choisir un audit header ID</option>
// // //           <option value="audit_1738079588541">audit_1738079588541</option>
// // //         </select>
// // //       </div>

// // //       {/* Display loading message */}
// // //       {loading && <p>Loading audit header details...</p>}

// // //       {/* Display error message */}
// // //       {error && <p style={{ color: 'red' }}>{error}</p>}

// // //       {/* Display audit header details */}
// // //       {auditHeaderDetails && (
// // //         <div>
// // //           <h3>Audit Header Details</h3>
// // //           <pre>{JSON.stringify(auditHeaderDetails, null, 2)}</pre>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default Livrable;


// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // function Livrable() {
// //   const [auditIds, setAuditIds] = useState([]); // List of audit IDs
// //   const [selectedAuditId, setSelectedAuditId] = useState(''); // Selected audit ID
// //   const [auditHeaderDetails, setAuditHeaderDetails] = useState(null); // Details for the selected audit ID
// //   const [loading, setLoading] = useState(false); // Loading state
// //   const [error, setError] = useState(null); // Error state

// //   // Fetch all audit header IDs on component mount
// //   useEffect(() => {
// //     async function fetchAuditIds() {
// //       try {
// //         setLoading(true);
// //         const response = await axios.get('/api/get_audit_headers');
// //         setAuditIds(response.data.auditIds || []);
// //       } catch (error) {
// //         console.error('Error fetching audit IDs:', error);
// //         setError('Failed to load audit IDs.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchAuditIds();
// //   }, []);

// //   // Fetch audit header details when an ID is selected
// //   useEffect(() => {
// //     if (selectedAuditId) {
// //       async function fetchAuditHeaderDetails() {
// //         try {
// //           setLoading(true);
// //           setError(null); // Reset error state
// //           const response = await axios.get(`/api/get_audit_header/${selectedAuditId}`);
// //           setAuditHeaderDetails(response.data);
// //         } catch (error) {
// //           console.error('Error fetching audit header details:', error);
// //           setError('Failed to fetch audit header details.');
// //           setAuditHeaderDetails(null);
// //         } finally {
// //           setLoading(false);
// //         }
// //       }

// //       fetchAuditHeaderDetails();
// //     } else {
// //       setAuditHeaderDetails(null); // Reset state when no ID is selected
// //     }
// //   }, [selectedAuditId]);

// //   return (
// //     <div className="container">
// //       <h1>Livrable - Audit Headers</h1>

// //       {/* Dropdown to select an audit ID */}
// //       <div className="form-group">
// //         <label htmlFor="auditSelect">Choisir Audit Header ID:</label>
// //         <select
// //           id="auditSelect"
// //           className="form-control"
// //           value={selectedAuditId}
// //           onChange={(e) => setSelectedAuditId(e.target.value)}
// //         >
// //           <option value="">Veuillez choisir un audit header ID</option>
// //           {auditIds.map((id) => (
// //             <option key={id} value={id}>
// //               {id}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Display loading message */}
// //       {loading && <p>Loading...</p>}

// //       {/* Display error message */}
// //       {error && <p style={{ color: 'red' }}>{error}</p>}

// //       {/* Display audit header details */}
// //       {auditHeaderDetails && (
// //         <div>
// //           <h3>Audit Header Details for {auditHeaderDetails.auditId}</h3>
// //           <table className="table">
// //             <thead>
// //               <tr>
// //                 <th>Question ID</th>
// //                 <th>Response</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {auditHeaderDetails.questions.map((q, index) => (
// //                 <tr key={index}>
// //                   <td>{q.questionId}</td>
// //                   <td>{q.response}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Livrable;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// function Livrable() {
//   const [auditIds, setAuditIds] = useState([]);
//   const [selectedAuditId, setSelectedAuditId] = useState('');
//   const [auditHeaderDetails, setAuditHeaderDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [gaugeOverallUrl, setGaugeOverallUrl] = useState(null);

//   // Fetch all audit header IDs on mount
//   useEffect(() => {
//     async function fetchAuditIds() {
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/get_audit_headers');
//       const uniqueAuditIds = [...new Set(response.data.map(item => item.auditId))];

//       console.log("Extracted Unique Audit IDs:", uniqueAuditIds);
//       setAuditIds(uniqueAuditIds);
//       } catch (error) {
//         console.error('Error fetching audit IDs:', error);
//         setError('Failed to load audit IDs.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAuditIds();
//   }, []);

//   // Fetch audit header details when an ID is selected
//   useEffect(() => {
//     if (selectedAuditId) {
//       async function fetchAuditHeaderDetails() {
//         try {
//           setLoading(true);
//           setError(null);
//           const response = await axios.get(`/api/get_audit/${selectedAuditId}`);
//           setAuditHeaderDetails(response.data);
//         } catch (error) {
//           console.error('Error fetching audit header details:', error);
//           setError('Failed to fetch audit header details.');
//           setAuditHeaderDetails(null);
//         } finally {
//           setLoading(false);
//         }
//       }

//       fetchAuditHeaderDetails();
//     } else {
//       setAuditHeaderDetails(null);
//     }
//   }, [selectedAuditId]);

//   // Calculate response counts and generate chart URL
//   const generateGaugeOverallChart = useCallback(() => {
//     if (!auditHeaderDetails || !auditHeaderDetails.questions) return;

//     let C = 0, PC = 0, NC = 0, OK = 0, KO = 0, over63 = 0, under63 = 0;

//     auditHeaderDetails.questions.forEach((q) => {
//       const response = q.response;

//       if (response === 'C') C++;
//       if (response === 'PC') PC++;
//       if (response === 'NC') NC++;
//       if (response === 'OK') OK++;
//       if (response === 'KO') KO++;

//       const temperature = parseFloat(response);
//       if (!isNaN(temperature)) {
//         if (temperature >= 63) {
//           over63++;
//         } else {
//           under63++;
//         }
//       }
//     });

//     // Calculate chart URL
//     const greenCount = C + OK + over63;
//     const amberCount = PC;
//     const redCount = NC + KO + under63;

//     const gaugeUrl = `/api/chart/gauge/overall/${greenCount}/${amberCount}/${redCount}?t=${Date.now()}`;
//     setGaugeOverallUrl(gaugeUrl);
//   }, [auditHeaderDetails]);

//   // Recalculate chart whenever audit details change
//   useEffect(() => {
//     if (auditHeaderDetails) {
//       console.log("Audit header details:", auditHeaderDetails)
//       generateGaugeOverallChart();
//     }
//   }, [auditHeaderDetails, generateGaugeOverallChart]);

//   return (
//     <div className="container">
//       <h1>Livrable - Audit Headers</h1>

//       {/* Dropdown to select an audit ID */}
//       <div className="form-group">
//         <label htmlFor="auditSelect">Choisir Audit Header ID:</label>
//         <select
//           id="auditSelect"
//           className="form-control"
//           value={selectedAuditId}
//           onChange={(e) => setSelectedAuditId(e.target.value)}
//         >
//           <option value="">Veuillez choisir un audit header ID</option>
//           {auditIds.map((id) => (
//             <option key={id} value={id}>
//               {id}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Display loading message */}
//       {loading && <p>Loading...</p>}

//       {/* Display error message */}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {/* Display audit header details */}
//       {auditHeaderDetails && (
//         <div>
//           <h3>Audit Header Details for {auditHeaderDetails.auditId}</h3>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Question ID</th>
//                 <th>Response</th>
//               </tr>
//             </thead>
//             <tbody>
//               print(auditHeaderDetails)
//               {auditHeaderDetails.questions.map((q, index) => (
//                 <tr key={index}>
//                   <td>{q.questionId}</td>
//                   <td>{q.response}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Summary Chart */}
//           <h3>Summary Chart</h3>
//           {gaugeOverallUrl ? (
//             <img
//               src={gaugeOverallUrl}
//               alt="Overall Gauge Chart"
//               className="chart-image"
//               style={{ maxWidth: '50%', height: 'auto' }}
//               onLoad={() => console.log(`Overall gauge chart loaded`)}
//               onError={() => console.error(`Error loading overall gauge chart`)}
//             />
//           ) : (
//             <p>Loading overall summary chart...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Livrable;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Livrable() {
  const [auditHeaderIds, setAuditHeaderIds] = useState([]);
  const [selectedHeaderId, setSelectedHeaderId] = useState('');
  const [headerDetails, setHeaderDetails] = useState(null);
  const [associatedAuditIds, setAssociatedAuditIds] = useState([]);
  const [selectedAuditIds, setSelectedAuditIds] = useState([]);
  const [summaryResponses, setSummaryResponses] = useState(null);

  // Step 1: Load Audit Header IDs
  useEffect(() => {
    axios.get('/api/get_audit_headers').then(res => {
      const uniqueIds = [...new Set(res.data.map(audit => audit.auditId))];
      setAuditHeaderIds(uniqueIds);
    });
  }, []);

  // Step 2: Fetch Audit Header Details and associated Audit IDs
  useEffect(() => {
    if (selectedHeaderId) {
      axios.get(`/api/get_audit/${selectedHeaderId}`).then(res => {
        setHeaderDetails(res.data);
      });
      axios.get(`/api/get_audit_ids_by_header/${selectedHeaderId}`).then(res => {
        setAssociatedAuditIds(res.data.auditIds || []);
      });
    }
  }, [selectedHeaderId]);

  // Step 3: Fetch Summary Responses based on selected audits
  const fetchSummaryResponses = useCallback(() => {
    axios
      .post('/api/get_summary_responses', { auditIds: selectedAuditIds })
      .then(res => setSummaryResponses(res.data))
      .catch(err => console.error(err));
  }, [selectedAuditIds]);

  const toggleAuditSelection = auditId => {
    setSelectedAuditIds(prev =>
      prev.includes(auditId) ? prev.filter(id => id !== auditId) : [...prev, auditId]
    );
  };

  return (
    <div className="container">
      <h1>Livrable - Audit Summaries</h1>

      <div className="form-group">
        <label>Select Audit Header ID:</label>
        <select
          className="form-control"
          value={selectedHeaderId}
          onChange={e => setSelectedHeaderId(e.target.value)}
        >
          <option value="">Select Header</option>
          {auditHeaderIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      {headerDetails && (
        <div>
          <h3>Audit Header Details</h3>
          <table className="table table-bordered">
            <tbody>
              {headerDetails.questions.map(q => (
                <tr key={q.questionId}>
                  <td><strong>{q.questionId}</strong></td>
                  <td>{q.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {associatedAuditIds.length > 0 && (
        <div>
          <h4>Select Audit IDs for Summary:</h4>
          {associatedAuditIds.map(id => (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                checked={selectedAuditIds.includes(id)}
                onChange={() => toggleAuditSelection(id)}
              />
              <label htmlFor={id} style={{ marginLeft: '5px' }}>{id}</label>
            </div>
          ))}
          <button className="btn btn-primary mt-2" onClick={fetchSummaryResponses}>
            Generate Summary
          </button>
        </div>
      )}

      {summaryResponses && (
        <div>
          <h3>Summary of Selected Audits</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Type</th>
                <th>Good (Green)</th>
                <th>Moderate (Amber)</th>
                <th>Poor (Red)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>C/PC/NC</td>
                <td>{summaryResponses.C}</td>
                <td>{summaryResponses.PC}</td>
                <td>{summaryResponses.NC}</td>
              </tr>
              <tr>
                <td>OK/KO</td>
                <td>{summaryResponses.OK}</td>
                <td>-</td>
                <td>{summaryResponses.KO}</td>
              </tr>
              <tr>
                <td>Temperature (&gt;63°C/&lt;63°C)</td>
                <td>{summaryResponses.over63}</td>
                <td>-</td>
                <td>{summaryResponses.under63}</td>
              </tr>
              <tr>
                <td>Cold Temperature (&lt;10°C/&gt;10°C)</td>
                <td>{summaryResponses.under10}</td>
                <td>-</td>
                <td>{summaryResponses.over10}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Livrable;
