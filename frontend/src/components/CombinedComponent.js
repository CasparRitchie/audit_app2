// // import React from 'react';
// // import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
// // import ResponsesTable from './ResponsesTable';

// // const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
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
// //                   const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

// //                   if (Array.isArray(sectionQuestions)) {
// //                     sectionQuestions.forEach((questionObj) => {
// //                       const response = findResponseForQuestion(filteredAudits, questionObj.id);
// //                       if (response === 'C') responseCounts.C++;
// //                       if (response === 'PC') responseCounts.PC++;
// //                       if (response === 'NC') responseCounts.NC++;
// //                       if (response === 'OK') responseCounts.OK++;
// //                       if (response === 'KO') responseCounts.KO++;
// //                       const temperature = parseFloat(response);
// //                       if (!isNaN(temperature)) {
// //                         if (temperature >= 63) {
// //                           responseCounts.over63++;
// //                         } else {
// //                           responseCounts.under63++;
// //                         }
// //                       }
// //                     });
// //                   }

// //                   return (
// //                     <div key={sousParagrapheIndex}>
// //                       <h6>{sousParagraphe}</h6>
// //                       {Array.isArray(sectionQuestions) ? (
// //                         sectionQuestions.map((questionObj) => {
// //                           const response = findResponseForQuestion(filteredAudits, questionObj.id);
// //                           const responseClass = getResponseStyle(response, questionObj.response_type);

// //                           return (
// //                             <div key={questionObj.id}>
// //                               <strong>Question:</strong> {questionObj.question}
// //                               <br />
// //                               <strong>Response:</strong> <span className={`response-btn ${responseClass}`}>{response}</span>
// //                               <hr />
// //                             </div>
// //                           );
// //                         })
// //                       ) : (
// //                         <p>No questions available</p>
// //                       )}
// //                       <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />
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
// import axios from 'axios';

// const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
//   const [charts, setCharts] = useState({}); // State to store charts for each sousParagraphe

//   useEffect(() => {
//     // Fetch charts for each sousParagraphe only once
//     const fetchCharts = async (sousParagraphe, responseCounts) => {
//       if (responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0) {
//         // Avoid making API request if chart for this sousParagraphe already exists
//         if (!charts[sousParagraphe]) {
//           try {
//             const res = await axios.get(`/api/chart/cpcnc/${responseCounts.C}/${responseCounts.PC}/${responseCounts.NC}`);
//             setCharts((prevCharts) => ({
//               ...prevCharts,
//               [sousParagraphe]: res.data, // Store chart URL by sousParagraphe
//             }));
//           } catch (err) {
//             console.error(`Error generating CPCNC chart for ${sousParagraphe}:`, err);
//           }
//         }
//       }
//     };

//     // Iterate over auditDetail to find all sousParagraphe sections and trigger chart fetching
//     Object.keys(auditDetail).forEach((chapitre) => {
//       Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
//         Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
//           Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
//             const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
//             const responseCounts = calculateResponseCounts(sectionQuestions);

//             // Fetch the chart for this sousParagraphe
//             fetchCharts(sousParagraphe, responseCounts);
//           });
//         });
//       });
//     });
//   }, [auditDetail, filteredAudits]); // Only run when auditDetail or filteredAudits change

//   // Function to calculate response counts
//   const calculateResponseCounts = (sectionQuestions) => {
//     const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

//     if (Array.isArray(sectionQuestions)) {
//       sectionQuestions.forEach((questionObj) => {
//         const response = findResponseForQuestion(filteredAudits, questionObj.id);
//         if (response === 'C') responseCounts.C++;
//         if (response === 'PC') responseCounts.PC++;
//         if (response === 'NC') responseCounts.NC++;
//         if (response === 'OK') responseCounts.OK++;
//         if (response === 'KO') responseCounts.KO++;
//         const temperature = parseFloat(response);
//         if (!isNaN(temperature)) {
//           if (temperature >= 63) {
//             responseCounts.over63++;
//           } else {
//             responseCounts.under63++;
//           }
//         }
//       });
//     }

//     return responseCounts;
//   };

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
//                   const sectionQuestions =
//                     auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];

//                   const responseCounts = calculateResponseCounts(sectionQuestions);

//                   return (
//                     <div key={sousParagrapheIndex}>
//                       <h6>{sousParagraphe}</h6>
//                       {Array.isArray(sectionQuestions) ? (
//                         sectionQuestions.map((questionObj) => {
//                           const response = findResponseForQuestion(filteredAudits, questionObj.id);
//                           const responseClass = getResponseStyle(response, questionObj.response_type);

//                           return (
//                             <div key={questionObj.id}>
//                               <strong>Question:</strong> {questionObj.question}
//                               <br />
//                               <strong>Response:</strong> <span className={`response-btn ${responseClass}`}>{response}</span>
//                               <hr />
//                             </div>
//                           );
//                         })
//                       ) : (
//                         <p>No questions available</p>
//                       )}

//                       {/* Response Summary Table */}
//                       <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />

//                       {/* Display section-specific chart */}
//                       {charts[sousParagraphe] && (
//                         <div>
//                           <h6>CPCNC Chart for {sousParagraphe}</h6>
//                           <img
//                             src={charts[sousParagraphe]}
//                             alt={`CPCNC Chart for ${sousParagraphe}`}
//                             style={{ maxWidth: '100%', height: 'auto' }}
//                           />
//                         </div>
//                       )}
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
import axios from 'axios';

const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
  const [charts, setCharts] = useState({}); // Store charts for each sousParagraphe
  const [activeSousParagraphe, setActiveSousParagraphe] = useState(null); // Track current sousParagraphe being processed

  // Fetch charts for the active sousParagraphe in useEffect
  useEffect(() => {
    if (activeSousParagraphe) {
      const responseCounts = activeSousParagraphe.responseCounts;
      const { C, PC, NC } = responseCounts;

      const fetchChart = async () => {
        try {
          // Fetch the chart data directly, expecting a binary response
          const res = await axios.get(`/api/chart/cpcnc/${C}/${PC}/${NC}`, { responseType: 'blob' });

          // Create a URL for the image blob
          const imageUrl = URL.createObjectURL(res.data);

          setCharts((prev) => ({
            ...prev,
            [activeSousParagraphe.sousParagraphe]: imageUrl,
          }));
        } catch (error) {
          console.error(`Failed to load chart for ${activeSousParagraphe.sousParagraphe}:`, error);
        }
      };

      fetchChart();
    }
  }, [activeSousParagraphe]);

  // Use useEffect to set the active sousParagraphe after the component mounts and renders audit details
  useEffect(() => {
    const keys = Object.keys(auditDetail);
    if (keys.length > 0) {
      const firstChapitre = keys[0];
      const firstSousChapitre = Object.keys(auditDetail[firstChapitre])[0];
      const firstParagraphe = Object.keys(auditDetail[firstChapitre][firstSousChapitre])[0];
      const firstSousParagraphe = Object.keys(auditDetail[firstChapitre][firstSousChapitre][firstParagraphe])[0];

      const sectionQuestions = auditDetail[firstChapitre][firstSousChapitre][firstParagraphe][firstSousParagraphe];
      const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

      if (Array.isArray(sectionQuestions)) {
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

        // Set the first sousParagraphe and response counts to trigger the chart loading
        setActiveSousParagraphe({ sousParagraphe: firstSousParagraphe, responseCounts });
      }
    }
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
                  const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

                  if (Array.isArray(sectionQuestions)) {
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
                  }

                  return (
                    <div key={sousParagrapheIndex}>
                      <h6>{sousParagraphe}</h6>
                      {Array.isArray(sectionQuestions) ? (
                        sectionQuestions.map((questionObj) => {
                          const response = findResponseForQuestion(filteredAudits, questionObj.id);
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

                      {/* Display the chart */}
                      {charts[sousParagraphe] ? (
                        <div>
                          <h6>CPCNC Chart for {sousParagraphe}</h6>
                          <img
                            src={charts[sousParagraphe]}
                            alt={`CPCNC Chart for ${sousParagraphe}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      ) : (
                        <p>Loading chart for {sousParagraphe}...</p>
                      )}
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
