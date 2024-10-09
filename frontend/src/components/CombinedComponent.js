// import React, { useState, useEffect } from 'react';
// import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
// import ResponsesTable from './ResponsesTable';
// import axios from 'axios';

// const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
//   const [charts, setCharts] = useState({}); // Store charts for each sousParagraphe
//   const [activeSousParagraphe, setActiveSousParagraphe] = useState(null); // Track current sousParagraphe being processed

//   // Fetch charts for the active sousParagraphe in useEffect
//   useEffect(() => {
//     if (activeSousParagraphe) {
//       const responseCounts = activeSousParagraphe.responseCounts;
//       const { C, PC, NC } = responseCounts;

//       const fetchChart = async () => {
//         try {
//           // Fetch the chart data directly, expecting a binary response
//           const res = await axios.get(`/api/chart/cpcnc/${C}/${PC}/${NC}`, { responseType: 'blob' });

//           // Create a URL for the image blob
//           const imageUrl = URL.createObjectURL(res.data);

//           setCharts((prev) => ({
//             ...prev,
//             [activeSousParagraphe.sousParagraphe]: imageUrl,
//           }));
//         } catch (error) {
//           console.error(`Failed to load chart for ${activeSousParagraphe.sousParagraphe}:`, error);
//         }
//       };

//       fetchChart();
//     }
//   }, [activeSousParagraphe]);

//   // Use useEffect to set the active sousParagraphe after the component mounts and renders audit details
//   useEffect(() => {
//     const keys = Object.keys(auditDetail);
//     if (keys.length > 0) {
//       const firstChapitre = keys[0];
//       const firstSousChapitre = Object.keys(auditDetail[firstChapitre])[0];
//       const firstParagraphe = Object.keys(auditDetail[firstChapitre][firstSousChapitre])[0];
//       const firstSousParagraphe = Object.keys(auditDetail[firstChapitre][firstSousChapitre][firstParagraphe])[0];

//       const sectionQuestions = auditDetail[firstChapitre][firstSousChapitre][firstParagraphe][firstSousParagraphe];
//       const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

//       if (Array.isArray(sectionQuestions)) {
//         sectionQuestions.forEach((questionObj) => {
//           const response = findResponseForQuestion(filteredAudits, questionObj.id);
//           if (response === 'C') responseCounts.C++;
//           if (response === 'PC') responseCounts.PC++;
//           if (response === 'NC') responseCounts.NC++;
//           if (response === 'OK') responseCounts.OK++;
//           if (response === 'KO') responseCounts.KO++;
//           const temperature = parseFloat(response);
//           if (!isNaN(temperature)) {
//             if (temperature >= 63) {
//               responseCounts.over63++;
//             } else {
//               responseCounts.under63++;
//             }
//           }
//         });

//         // Set the first sousParagraphe and response counts to trigger the chart loading
//         setActiveSousParagraphe({ sousParagraphe: firstSousParagraphe, responseCounts });
//       }
//     }
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
//                   const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

//                   if (Array.isArray(sectionQuestions)) {
//                     sectionQuestions.forEach((questionObj) => {
//                       const response = findResponseForQuestion(filteredAudits, questionObj.id);
//                       if (response === 'C') responseCounts.C++;
//                       if (response === 'PC') responseCounts.PC++;
//                       if (response === 'NC') responseCounts.NC++;
//                       if (response === 'OK') responseCounts.OK++;
//                       if (response === 'KO') responseCounts.KO++;
//                       const temperature = parseFloat(response);
//                       if (!isNaN(temperature)) {
//                         if (temperature >= 63) {
//                           responseCounts.over63++;
//                         } else {
//                           responseCounts.under63++;
//                         }
//                       }
//                     });
//                   }

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

//                       {/* Display the chart */}
//                       {charts[sousParagraphe] ? (
//                         <div>
//                           <h6>CPCNC Chart for {sousParagraphe}</h6>
//                           <img
//                             src={charts[sousParagraphe]}
//                             alt={`CPCNC Chart for ${sousParagraphe}`}
//                             style={{ maxWidth: '100%', height: 'auto' }}
//                           />
//                         </div>
//                       ) : (
//                         <p>Loading chart for {sousParagraphe}...</p>
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
  const [charts, setCharts] = useState({}); // Store charts for each unique section

  const fetchChart = async (responseCounts, sousParagrapheKey, chartType) => {
    let url;
    const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;

    if (chartType === "CPCNC") {
      url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
    } else if (chartType === "OKKO") {
      url = `/api/chart/okko/${OK}/${KO}`;
    } else if (chartType === "Temperature") {
      url = `/api/chart/temperature/${over63}/${under63}`;
    }

    try {
      const res = await axios.get(url, { responseType: "blob" });
      const imageUrl = URL.createObjectURL(res.data);
      setCharts((prev) => ({
        ...prev,
        [`${sousParagrapheKey}-${chartType}`]: imageUrl, // Unique key per chart type
      }));
    } catch (error) {
      console.error(`Failed to load ${chartType} chart for ${sousParagrapheKey}:`, error);
    }
  };

  // const calculateAndFetchCharts = (sectionQuestions, sousParagrapheKey) => {
  //   const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

  //   if (Array.isArray(sectionQuestions)) {
  //     sectionQuestions.forEach((questionObj) => {
  //       const response = findResponseForQuestion(filteredAudits, questionObj.id);
  //       if (response === "C") responseCounts.C++;
  //       if (response === "PC") responseCounts.PC++;
  //       if (response === "NC") responseCounts.NC++;
  //       if (response === "OK") responseCounts.OK++;
  //       if (response === "KO") responseCounts.KO++;
  //       const temperature = parseFloat(response);
  //       if (!isNaN(temperature)) {
  //         if (temperature >= 63) {
  //           responseCounts.over63++;
  //         } else {
  //           responseCounts.under63++;
  //         }
  //       }
  //     });
  //   }

  //   // Only fetch if counts are not all zero to avoid `0/0/0` errors
  //   if (responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0) {
  //     fetchChart(responseCounts, sousParagrapheKey, "CPCNC");
  //   }

  //   if (responseCounts.OK > 0 || responseCounts.KO > 0) {
  //     fetchChart(responseCounts, sousParagrapheKey, "OKKO");
  //   }

  //   if (responseCounts.over63 > 0 || responseCounts.under63 > 0) {
  //     fetchChart(responseCounts, sousParagrapheKey, "Temperature");
  //   }
  // };
  const calculateAndFetchCharts = (sectionQuestions, sousParagrapheKey) => {
    const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

    if (Array.isArray(sectionQuestions)) {
      sectionQuestions.forEach((questionObj) => {
        const response = findResponseForQuestion(filteredAudits, questionObj.id);
        console.log(`Question ID: ${questionObj.id}, Response: ${response}`); // Log each question and response

        if (response === "C") responseCounts.C++;
        if (response === "PC") responseCounts.PC++;
        if (response === "NC") responseCounts.NC++;
        if (response === "OK") responseCounts.OK++;
        if (response === "KO") responseCounts.KO++;

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

    console.log(`Final response counts for ${sousParagrapheKey}:`, responseCounts); // Log final counts for each section

    // Fetch charts based on the counts
    if (responseCounts.C > 0 || responseCounts.PC > 0 || responseCounts.NC > 0) {
      fetchChart(responseCounts, sousParagrapheKey, "CPCNC");
    }
    if (responseCounts.OK > 0 || responseCounts.KO > 0) {
      fetchChart(responseCounts, sousParagrapheKey, "OKKO");
    }
    if (responseCounts.over63 > 0 || responseCounts.under63 > 0) {
      fetchChart(responseCounts, sousParagrapheKey, "Temperature");
    }
  };

  // Use useEffect to trigger chart fetching for each section
  useEffect(() => {
    Object.keys(auditDetail).forEach((chapitre) => {
      Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
        Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
          Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
            const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
            const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Create unique key

            calculateAndFetchCharts(sectionQuestions, sousParagrapheKey); // Calculate counts and fetch charts
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
                  const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Create unique key

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

                      <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={{ C: 0, PC: 0, NC: 0 }} />

                      {/* Display the chart */}
                      {charts[`${sousParagrapheKey}-CPCNC`] ? (
                        <div>
                          <h6>CPCNC Chart for {sousChapitre}-{paragraphe}-{sousParagraphe}</h6>
                          <img
                            src={charts[`${sousParagrapheKey}-CPCNC`]}
                            alt={`CPCNC Chart for ${paragraphe}-${sousParagraphe}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      ) : (
                        <p>Loading CPCNC chart for {paragraphe}-{sousParagraphe}...</p>
                      )}

                      {charts[`${sousParagrapheKey}-OKKO`] ? (
                        <div>
                          <h6>OK/KO Chart for {paragraphe}-{sousParagraphe}</h6>
                          <img
                            src={charts[`${sousParagrapheKey}-OKKO`]}
                            alt={`OK/KO Chart for ${paragraphe}-${sousParagraphe}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      ) : (
                        <p>Loading OK/KO chart for {paragraphe}-{sousParagraphe}...</p>
                      )}

                      {charts[`${sousParagrapheKey}-Temperature`] ? (
                        <div>
                          <h6>Temperature Chart for {paragraphe}-{sousParagraphe}</h6>
                          <img
                            src={charts[`${sousParagrapheKey}-Temperature`]}
                            alt={`Temperature Chart for ${paragraphe}-${sousParagraphe}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      ) : (
                        <p>Loading Temperature chart for {paragraphe}-{sousParagraphe}...</p>
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
