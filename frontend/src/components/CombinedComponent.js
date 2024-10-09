// // // import React, { useState, useEffect } from 'react';
// // // import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
// // // import ResponsesTable from './ResponsesTable';
// // // import axios from 'axios';

// // // const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
// // //   const [charts, setCharts] = useState({}); // Store charts for each unique section
// // //   const [responseCountsMap, setResponseCountsMap] = useState({}); // Store response counts for each section

// // //   const fetchChart = async (responseCounts, sousParagrapheKey, chartType) => {
// // //     let url;
// // //     const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;

// // //     if (chartType === "CPCNC") {
// // //       url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
// // //     } else if (chartType === "OKKO") {
// // //       url = `/api/chart/okko/${OK}/${KO}`;
// // //     } else if (chartType === "Temperature") {
// // //       url = `/api/chart/temperature/${over63}/${under63}`;
// // //     }

// // //     try {
// // //       const res = await axios.get(url, { responseType: "blob" });
// // //       const imageUrl = URL.createObjectURL(res.data);
// // //       setCharts((prev) => ({
// // //         ...prev,
// // //         [`${sousParagrapheKey}-${chartType}`]: imageUrl, // Unique key per chart type
// // //       }));
// // //     } catch (error) {
// // //       console.error(`Failed to load ${chartType} chart for ${sousParagrapheKey}:`, error);
// // //     }
// // //   };

// // //   const calculateAndFetchCharts = (sectionQuestions, sousParagrapheKey) => {
// // //     const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

// // //     if (Array.isArray(sectionQuestions)) {
// // //       sectionQuestions.forEach((questionObj) => {
// // //         const response = findResponseForQuestion(filteredAudits, questionObj.id);
// // //         if (response === "C") responseCounts.C++;
// // //         if (response === "PC") responseCounts.PC++;
// // //         if (response === "NC") responseCounts.NC++;
// // //         if (response === "OK") responseCounts.OK++;
// // //         if (response === "KO") responseCounts.KO++;

// // //         const temperature = parseFloat(response);
// // //         if (!isNaN(temperature)) {
// // //           if (temperature >= 63) {
// // //             responseCounts.over63++;
// // //           } else {
// // //             responseCounts.under63++;
// // //           }
// // //         }
// // //       });
// // //     }

// // //     // Fetch charts if counts are non-zero
// // //     if (responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0) {
// // //       fetchChart(responseCounts, sousParagrapheKey, "CPCNC");
// // //     }
// // //     if (responseCounts.OK > 0 || responseCounts.KO > 0) {
// // //       fetchChart(responseCounts, sousParagrapheKey, "OKKO");
// // //     }
// // //     if (responseCounts.over63 > 0 || responseCounts.under63 > 0) {
// // //       fetchChart(responseCounts, sousParagrapheKey, "Temperature");
// // //     }

// // //     // Save responseCounts for this section
// // //     setResponseCountsMap((prev) => ({
// // //       ...prev,
// // //       [sousParagrapheKey]: responseCounts, // Store responseCounts with the unique key
// // //     }));
// // //   };

// // //   // Use useEffect to calculate response counts and fetch charts only once
// // //   useEffect(() => {
// // //     Object.keys(auditDetail).forEach((chapitre) => {
// // //       Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
// // //         Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
// // //           Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
// // //             const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
// // //             const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Create unique key

// // //             // Calculate and fetch charts only if not already fetched
// // //             if (!responseCountsMap[sousParagrapheKey]) {
// // //               calculateAndFetchCharts(sectionQuestions, sousParagrapheKey);
// // //             }
// // //           });
// // //         });
// // //       });
// // //     });
// // //   }, [auditDetail, filteredAudits, responseCountsMap]); // Depend on audit details and filtered audits

// // //   return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
// // //     <div key={chapitreIndex}>
// // //       <h3>{chapitre}</h3>
// // //       {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
// // //         <div key={sousChapitreIndex}>
// // //           <h4>{sousChapitre}</h4>
// // //           {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
// // //             <div key={paragrapheIndex}>
// // //               <h5>{paragraphe}</h5>
// // //               {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map(
// // //                 (sousParagraphe, sousParagrapheIndex) => {
// // //                   const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
// // //                   const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Create unique key
// // //                   const responseCounts = responseCountsMap[sousParagrapheKey] || {}; // Get calculated counts

// // //                   return (
// // //                     <div key={sousParagrapheIndex}>
// // //                       <h6>{sousParagraphe}</h6>
// // //                       {Array.isArray(sectionQuestions) ? (
// // //                         sectionQuestions.map((questionObj) => {
// // //                           const response = findResponseForQuestion(filteredAudits, questionObj.id);
// // //                           const responseClass = getResponseStyle(response, questionObj.response_type);

// // //                           return (
// // //                             <div key={questionObj.id}>
// // //                               <strong>Question:</strong> {questionObj.question}
// // //                               <br />
// // //                               <strong>Response:</strong>{' '}
// // //                               <span className={`response-btn ${responseClass}`}>{response}</span>
// // //                               <hr />
// // //                             </div>
// // //                           );
// // //                         })
// // //                       ) : (
// // //                         <p>No questions available</p>
// // //                       )}

// // //                       <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />

// // //                       {/* Display the chart */}
// // //                       {charts[`${sousParagrapheKey}-CPCNC`] ? (
// // //                         <div>
// // //                           <h6>CPCNC Chart for {sousChapitre}-{paragraphe}-{sousParagraphe}</h6>
// // //                           <img
// // //                             src={charts[`${sousParagrapheKey}-CPCNC`]}
// // //                             alt={`CPCNC Chart for ${paragraphe}-${sousParagraphe}`}
// // //                             style={{ maxWidth: '100%', height: 'auto' }}
// // //                           />
// // //                         </div>
// // //                       ) : (
// // //                         <p>Loading CPCNC chart for {paragraphe}-{sousParagraphe}...</p>
// // //                       )}

// // //                       {charts[`${sousParagrapheKey}-OKKO`] ? (
// // //                         <div>
// // //                           <h6>OK/KO Chart for {paragraphe}-{sousParagraphe}</h6>
// // //                           <img
// // //                             src={charts[`${sousParagrapheKey}-OKKO`]}
// // //                             alt={`OK/KO Chart for ${paragraphe}-${sousParagraphe}`}
// // //                             style={{ maxWidth: '100%', height: 'auto' }}
// // //                           />
// // //                         </div>
// // //                       ) : (
// // //                         <p>Loading OK/KO chart for {paragraphe}-{sousParagraphe}...</p>
// // //                       )}

// // //                       {charts[`${sousParagrapheKey}-Temperature`] ? (
// // //                         <div>
// // //                           <h6>Temperature Chart for {paragraphe}-{sousParagraphe}</h6>
// // //                           <img
// // //                             src={charts[`${sousParagrapheKey}-Temperature`]}
// // //                             alt={`Temperature Chart for ${paragraphe}-${sousParagraphe}`}
// // //                             style={{ maxWidth: '100%', height: 'auto' }}
// // //                           />
// // //                         </div>
// // //                       ) : (
// // //                         <p>Loading Temperature chart for {paragraphe}-{sousParagraphe}...</p>
// // //                       )}
// // //                     </div>
// // //                   );
// // //                 }
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       ))}
// // //     </div>
// // //   ));
// // // };

// // // export default RenderAuditDetailsWithResponses;


// // import React, { useState, useEffect } from 'react';
// // import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
// // import ResponsesTable from './ResponsesTable';
// // import axios from 'axios';

// // const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
// //   const [charts, setCharts] = useState({}); // Store charts for each section

// //   const fetchChart = async (responseCounts, sousParagrapheKey, chartType) => {
// //     let url;
// //     const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;

// //     if (chartType === "CPCNC") {
// //       url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
// //     } else if (chartType === "OKKO") {
// //       url = `/api/chart/okko/${OK}/${KO}`;
// //     } else if (chartType === "Temperature") {
// //       url = `/api/chart/temperature/${over63}/${under63}`;
// //     }

// //     try {
// //       const res = await axios.get(url, { responseType: "blob" });
// //       const imageUrl = URL.createObjectURL(res.data);
// //       setCharts((prev) => ({
// //         ...prev,
// //         [`${sousParagrapheKey}-${chartType}`]: imageUrl, // Save chart image by key
// //       }));
// //     } catch (error) {
// //       console.error(`Failed to load ${chartType} chart for ${sousParagrapheKey}:`, error);
// //     }
// //   };

// //   const calculateResponseCounts = (sectionQuestions) => {
// //     const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

// //     sectionQuestions.forEach((questionObj) => {
// //       const response = findResponseForQuestion(filteredAudits, questionObj.id);
// //       if (response === 'C') responseCounts.C++;
// //       if (response === 'PC') responseCounts.PC++;
// //       if (response === 'NC') responseCounts.NC++;
// //       if (response === 'OK') responseCounts.OK++;
// //       if (response === 'KO') responseCounts.KO++;
// //       const temperature = parseFloat(response);
// //       if (!isNaN(temperature)) {
// //         if (temperature >= 63) {
// //           responseCounts.over63++;
// //         } else {
// //           responseCounts.under63++;
// //         }
// //       }
// //     });

// //     return responseCounts;
// //   };

// //   useEffect(() => {
// //     // Loop through all sections to fetch charts based on response counts
// //     Object.keys(auditDetail).forEach((chapitre) => {
// //       Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
// //         Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
// //           Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
// //             const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
// //             const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key

// //             const responseCounts = calculateResponseCounts(sectionQuestions);
// //             if (responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0) {
// //               fetchChart(responseCounts, sousParagrapheKey, 'CPCNC');
// //             }
// //             if (responseCounts.OK > 0 || responseCounts.KO > 0) {
// //               fetchChart(responseCounts, sousParagrapheKey, 'OKKO');
// //             }
// //             if (responseCounts.over63 > 0 || responseCounts.under63 > 0) {
// //               fetchChart(responseCounts, sousParagrapheKey, 'Temperature');
// //             }
// //           });
// //         });
// //       });
// //     });
// //   }, [auditDetail, filteredAudits]); // Trigger on auditDetail or filteredAudits change

// //   return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
// //     <div key={chapitreIndex}>
// //       <h3>{chapitre}</h3>
// //       {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
// //         <div key={sousChapitreIndex}>
// //           <h4>{sousChapitre}</h4>
// //           {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
// //             <div key={paragrapheIndex}>
// //               <h5>{paragraphe}</h5>
// //               {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map(
// //                 (sousParagraphe, sousParagrapheIndex) => {
// //                   const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
// //                   const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key
// //                   const responseCounts = calculateResponseCounts(sectionQuestions); // Calculate counts

// //                   return (
// //                     <div key={sousParagrapheIndex}>
// //                       <h6>{sousParagraphe}</h6>
// //                       {/* Display questions */}
// //                       {Array.isArray(sectionQuestions) ? (
// //                         sectionQuestions.map((questionObj) => {
// //                           const response = findResponseForQuestion(filteredAudits, questionObj.id);
// //                           const responseClass = getResponseStyle(response, questionObj.response_type);
// //                           return (
// //                             <div key={questionObj.id}>
// //                               <strong>Question:</strong> {questionObj.question}
// //                               <br />
// //                               <strong>Response:</strong>{' '}
// //                               <span className={`response-btn ${responseClass}`}>{response}</span>
// //                               <hr />
// //                             </div>
// //                           );
// //                         })
// //                       ) : (
// //                         <p>No questions available</p>
// //                       )}

// //                       {/* Display response table */}
// //                       <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />

// //                       {/* Display charts */}
// //                       {charts[`${sousParagrapheKey}-CPCNC`] ? (
// //                         <div>
// //                           <h6>CPCNC Chart for {paragraphe}-{sousParagraphe}</h6>
// //                           <img
// //                             src={charts[`${sousParagrapheKey}-CPCNC`]}
// //                             alt={`CPCNC Chart for ${paragraphe}-${sousParagraphe}`}
// //                             style={{ maxWidth: '100%', height: 'auto' }}
// //                           />
// //                         </div>
// //                       ) : (
// //                         <p>Loading CPCNC chart...</p>
// //                       )}

// //                       {charts[`${sousParagrapheKey}-OKKO`] ? (
// //                         <div>
// //                           <h6>OK/KO Chart for {paragraphe}-{sousParagraphe}</h6>
// //                           <img
// //                             src={charts[`${sousParagrapheKey}-OKKO`]}
// //                             alt={`OK/KO Chart for ${paragraphe}-${sousParagraphe}`}
// //                             style={{ maxWidth: '100%', height: 'auto' }}
// //                           />
// //                         </div>
// //                       ) : (
// //                         <p>Loading OK/KO chart...</p>
// //                       )}

// //                       {charts[`${sousParagrapheKey}-Temperature`] ? (
// //                         <div>
// //                           <h6>Temperature Chart for {paragraphe}-{sousParagraphe}</h6>
// //                           <img
// //                             src={charts[`${sousParagrapheKey}-Temperature`]}
// //                             alt={`Temperature Chart for ${paragraphe}-${sousParagraphe}`}
// //                             style={{ maxWidth: '100%', height: 'auto' }}
// //                           />
// //                         </div>
// //                       ) : (
// //                         <p>Loading Temperature chart...</p>
// //                       )}
// //                     </div>
// //                   );
// //                 }
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       ))}
// //     </div>
// //   ));
// // };

// // export default RenderAuditDetailsWithResponses;


// import React, { useState, useEffect } from 'react';
// import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
// import ResponsesTable from './ResponsesTable';

// const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
//   const [chartURLs, setChartURLs] = useState({}); // Store chart URLs

//   const generateChartURL = (responseCounts, chartType) => {
//     const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;
//     let url = '';

//     if (chartType === "CPCNC") {
//       url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
//     } else if (chartType === "OKKO") {
//       url = `/api/chart/okko/${OK}/${KO}`;
//     } else if (chartType === "Temperature") {
//       url = `/api/chart/temperature/${over63}/${under63}`;
//     }

//     return url;
//   };

//   const calculateResponseCounts = (sectionQuestions) => {
//     const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };
//     let allNoResponse = true;

//     sectionQuestions.forEach((questionObj) => {
//       const response = findResponseForQuestion(filteredAudits, questionObj.id);

//       if (response !== 'No response') {
//         allNoResponse = false;
//       }

//       if (response === 'C') responseCounts.C++;
//       if (response === 'PC') responseCounts.PC++;
//       if (response === 'NC') responseCounts.NC++;
//       if (response === 'OK') responseCounts.OK++;
//       if (response === 'KO') responseCounts.KO++;

//       const temperature = parseFloat(response);
//       if (!isNaN(temperature)) {
//         if (temperature >= 63) {
//           responseCounts.over63++;
//         } else {
//           responseCounts.under63++;
//         }
//       }
//     });

//     // Return responseCounts and whether all responses are "No Response"
//     return { responseCounts, allNoResponse };
//   };

//   useEffect(() => {
//     Object.keys(auditDetail).forEach((chapitre) => {
//       Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
//         Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
//           Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
//             const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
//             const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key

//             const { responseCounts, allNoResponse } = calculateResponseCounts(sectionQuestions);

//             // Only generate chart URLs if there are actual responses (not all zero)
//             if (!allNoResponse) {
//               // Store the URLs instead of fetching charts
//               setChartURLs((prev) => ({
//                 ...prev,
//                 ...(responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0 ? {
//                   [`${sousParagrapheKey}-CPCNC`]: generateChartURL(responseCounts, 'CPCNC')
//                 } : {}),
//                 ...(responseCounts.OK > 0 || responseCounts.KO > 0 ? {
//                   [`${sousParagrapheKey}-OKKO`]: generateChartURL(responseCounts, 'OKKO')
//                 } : {}),
//                 ...(responseCounts.over63 > 0 || responseCounts.under63 > 0 ? {
//                   [`${sousParagrapheKey}-Temperature`]: generateChartURL(responseCounts, 'Temperature')
//                 } : {})
//               }));
//             }
//           });
//         });
//       });
//     });
//   }, [auditDetail, filteredAudits]);

//   return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
//     <div key={chapitreIndex}>
//       <h3>{chapitre}</h3>
//       {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
//         <div key={sousChapitreIndex}>
//           <h4>{sousChapitre}</h4>
//           {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
//             <div key={paragrapheIndex}>
//               <h5>{paragraphe}</h5>
//               {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map(
//                 (sousParagraphe, sousParagrapheIndex) => {
//                   const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
//                   const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key
//                   const { responseCounts, allNoResponse } = calculateResponseCounts(sectionQuestions); // Calculate counts

//                   if (allNoResponse) {
//                     return <p key={sousParagrapheIndex}>No responses in this section</p>;
//                   }

//                   return (
//                     <div key={sousParagrapheIndex}>
//                       <h6>{sousParagraphe}</h6>
//                       {/* Render questions */}
//                       {Array.isArray(sectionQuestions) ? (
//                         sectionQuestions.map((questionObj) => {
//                           const response = findResponseForQuestion(filteredAudits, questionObj.id);
//                           const responseClass = getResponseStyle(response, questionObj.response_type);
//                           return (
//                             <div key={questionObj.id}>
//                               <strong>Question:</strong> {questionObj.question}
//                               <br />
//                               <strong>Response:</strong>{' '}
//                               <span className={`response-btn ${responseClass}`}>{response}</span>
//                               <hr />
//                             </div>
//                           );
//                         })
//                       ) : (
//                         <p>No questions available</p>
//                       )}

//                       <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />

//                       {/* Render chart URLs instead of fetching */}
//                       {responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0 ? (
//                         <p><strong>CPCNC Chart URL:</strong> {chartURLs[`${sousParagrapheKey}-CPCNC`]}</p>
//                       ) : null}

//                       {responseCounts.OK > 0 || responseCounts.KO > 0 ? (
//                         <p><strong>OKKO Chart URL:</strong> {chartURLs[`${sousParagrapheKey}-OKKO`]}</p>
//                       ) : null}

//                       {responseCounts.over63 > 0 || responseCounts.under63 > 0 ? (
//                         <p><strong>Temperature Chart URL:</strong> {chartURLs[`${sousParagrapheKey}-Temperature`]}</p>
//                       ) : null}
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   ));
// };

// export default RenderAuditDetailsWithResponses;


import React, { useState, useEffect } from 'react';
import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
import ResponsesTable from './ResponsesTable';

const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
  const [chartURLs, setChartURLs] = useState({}); // Store chart URLs

  const generateChartURL = (responseCounts, chartType) => {
    const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;
    let url = '';

    if (chartType === "CPCNC") {
      url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
    } else if (chartType === "OKKO") {
      url = `/api/chart/okko/${OK}/${KO}`;
    } else if (chartType === "Temperature") {
      url = `/api/chart/temperature/${over63}/${under63}`;
    }

    return url;
  };

  const calculateResponseCounts = (sectionQuestions) => {
    const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

    sectionQuestions.forEach((questionObj) => {
      const response = findResponseForQuestion(filteredAudits, questionObj.id);
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

    return responseCounts;
  };

  useEffect(() => {
    Object.keys(auditDetail).forEach((chapitre) => {
      Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
        Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
          Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
            const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
            const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key

            const responseCounts = calculateResponseCounts(sectionQuestions);

            // Store the URLs instead of fetching charts
            setChartURLs((prev) => ({
              ...prev,
              [`${sousParagrapheKey}-CPCNC`]: generateChartURL(responseCounts, 'CPCNC'),
              [`${sousParagrapheKey}-OKKO`]: generateChartURL(responseCounts, 'OKKO'),
              [`${sousParagrapheKey}-Temperature`]: generateChartURL(responseCounts, 'Temperature'),
            }));
          });
        });
      });
    });
  }, [auditDetail, filteredAudits]);

  return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
    <div key={chapitreIndex}>
      <h3>{chapitre}</h3>
      {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
        <div key={sousChapitreIndex}>
          <h4>{sousChapitre}</h4>
          {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
            <div key={paragrapheIndex}>
              <h5>{paragraphe}</h5>
              {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map(
                (sousParagraphe, sousParagrapheIndex) => {
                  const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
                  const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key
                  const responseCounts = calculateResponseCounts(sectionQuestions); // Calculate counts

                  const hasResponses = sectionQuestions.some((questionObj) => {
                    const response = findResponseForQuestion(filteredAudits, questionObj.id);
                    return response !== 'No response';
                  });

                  if (!hasResponses) {
                    return <p key={sousParagrapheIndex}>No responses in this section</p>;
                  }

                  return (
                    <div key={sousParagrapheIndex}>
                      <h6>{sousParagraphe}</h6>
                      {/* Render questions */}
                      {Array.isArray(sectionQuestions) ? (
                        sectionQuestions.map((questionObj) => {
                          const response = findResponseForQuestion(filteredAudits, questionObj.id);
                          if (response === 'No response') return null; // Skip unanswered questions

                          const responseClass = getResponseStyle(response, questionObj.response_type);
                          return (
                            <div key={questionObj.id}>
                              <strong>Question:</strong> {questionObj.question}
                              <br />
                              <strong>Response:</strong>{' '}
                              <span className={`response-btn ${responseClass}`}>{response}</span>
                              <hr />
                            </div>
                          );
                        })
                      ) : (
                        <p>No questions available</p>
                      )}

                      <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />

                      {/* Render chart URLs */}
                      <div>
                        <p><strong>CPCNC Chart URL:</strong> {chartURLs[`${sousParagrapheKey}-CPCNC`]}</p>
                        <p><strong>OKKO Chart URL:</strong> {chartURLs[`${sousParagrapheKey}-OKKO`]}</p>
                        <p><strong>Temperature Chart URL:</strong> {chartURLs[`${sousParagrapheKey}-Temperature`]}</p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ));
};

export default RenderAuditDetailsWithResponses;
