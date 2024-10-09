// import React, { useState, useEffect } from 'react';
// import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
// import ResponsesTable from './ResponsesTable';

// const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
//   const [sectionChartUrls, setSectionChartUrls] = useState({}); // Store chart URLs for each section
//   const [imageQueue, setImageQueue] = useState([]); // Queue to manage image loading order

//   const generateChartUrl = (responseCounts, chartType) => {
//     const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;
//     let url = '';

//     if (chartType === "CPCNC" && (C > 0 || PC > 0 || NC > 0)) {
//       url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
//     } else if (chartType === "OKKO" && (OK > 0 || KO > 0)) {
//       url = `/api/chart/okko/${OK}/${KO}`;
//     } else if (chartType === "Temperature" && (over63 > 0 || under63 > 0)) {
//       url = `/api/chart/temperature/${over63}/${under63}`;
//     }

//     return url;
//   };

//   const calculateResponseCounts = (sectionQuestions) => {
//     const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

//     sectionQuestions.forEach((questionObj) => {
//       const response = findResponseForQuestion(filteredAudits, questionObj.id);
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

//     return responseCounts;
//   };

//   const loadChartsSequentially = async () => {
//     const timestamp = Date.now() + Math.random();
//     const newQueue = [...imageQueue];

//     for (let i = 0; i < newQueue.length; i++) {
//       const { url, sectionKey, chartType } = newQueue[i];
//       const response = await fetch(url, { responseType: 'blob' });
//       const blobUrl = URL.createObjectURL(await response.blob());

//       setSectionChartUrls((prev) => ({
//         ...prev,
//         [`${sectionKey}-${chartType}`]: blobUrl,
//       }));

//       await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading delay
//     }
//   };

//   useEffect(() => {
//     Object.keys(auditDetail).forEach((chapitre) => {
//       Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
//         Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
//           Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
//             const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
//             const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key

//             const responseCounts = calculateResponseCounts(sectionQuestions);
//             const newQueue = [];

//             const cpcncUrl = generateChartUrl(responseCounts, 'CPCNC');
//             if (cpcncUrl) {
//               newQueue.push({ url: `${cpcncUrl}?t=${Date.now()}`, sectionKey: sousParagrapheKey, chartType: 'CPCNC' });
//             }

//             const okkoUrl = generateChartUrl(responseCounts, 'OKKO');
//             if (okkoUrl) {
//               newQueue.push({ url: `${okkoUrl}?t=${Date.now()}`, sectionKey: sousParagrapheKey, chartType: 'OKKO' });
//             }

//             const temperatureUrl = generateChartUrl(responseCounts, 'Temperature');
//             if (temperatureUrl) {
//               newQueue.push({ url: `${temperatureUrl}?t=${Date.now()}`, sectionKey: sousParagrapheKey, chartType: 'Temperature' });
//             }

//             setImageQueue((prevQueue) => [...prevQueue, ...newQueue]);
//           });
//         });
//       });
//     });
//   }, [auditDetail, filteredAudits]);

//   useEffect(() => {
//     if (imageQueue.length > 0) {
//       loadChartsSequentially();
//     }
//   }, [imageQueue]);

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
//                   const responseCounts = calculateResponseCounts(sectionQuestions);

//                   const hasResponses = sectionQuestions.some((questionObj) => {
//                     const response = findResponseForQuestion(filteredAudits, questionObj.id);
//                     return response !== 'No response';
//                   });

//                   if (!hasResponses) {
//                     return <p key={sousParagrapheIndex}>No responses in this section</p>;
//                   }

//                   return (
//                     <div key={sousParagrapheIndex}>
//                       <h6>{sousParagraphe}</h6>
//                       {/* Render questions */}
//                       {Array.isArray(sectionQuestions) ? (
//                         sectionQuestions.map((questionObj) => {
//                           const response = findResponseForQuestion(filteredAudits, questionObj.id);
//                           if (response === 'No response') return null; // Skip unanswered questions

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

//                       {/* Render chart URLs */}
//                       <div>
//                         {sectionChartUrls[`${sousParagrapheKey}-CPCNC`] && (
//                           <img src={sectionChartUrls[`${sousParagrapheKey}-CPCNC`]} alt="CPCNC Chart" />
//                         )}
//                         {sectionChartUrls[`${sousParagrapheKey}-OKKO`] && (
//                           <img src={sectionChartUrls[`${sousParagrapheKey}-OKKO`]} alt="OKKO Chart" />
//                         )}
//                         {sectionChartUrls[`${sousParagrapheKey}-Temperature`] && (
//                           <img src={sectionChartUrls[`${sousParagrapheKey}-Temperature`]} alt="Temperature Chart" />
//                         )}
//                       </div>
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
  const [sectionChartUrls, setSectionChartUrls] = useState({}); // Store chart URLs for each section
  const [imageQueue, setImageQueue] = useState([]); // Queue to manage image loading order

  const generateChartUrl = (responseCounts, chartType) => {
    const { C, PC, NC, OK, KO, over63, under63 } = responseCounts;
    let url = '';

    if (chartType === "CPCNC" && (C > 0 || PC > 0 || NC > 0)) {
      url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
    } else if (chartType === "OKKO" && (OK > 0 || KO > 0)) {
      url = `/api/chart/okko/${OK}/${KO}`;
    } else if (chartType === "Temperature" && (over63 > 0 || under63 > 0)) {
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

  const loadChartsSequentially = async () => {
    const newQueue = [...imageQueue];

    for (let i = 0; i < newQueue.length; i++) {
      const { url, sectionKey, chartType } = newQueue[i];
      const response = await fetch(url, { responseType: 'blob' });
      const blobUrl = URL.createObjectURL(await response.blob());

      setSectionChartUrls((prev) => ({
        ...prev,
        [`${sectionKey}-${chartType}`]: blobUrl,
      }));

      // Simulate a slight delay between loading charts
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  useEffect(() => {
    const newQueue = [];

    Object.keys(auditDetail).forEach((chapitre) => {
      Object.keys(auditDetail[chapitre]).forEach((sousChapitre) => {
        Object.keys(auditDetail[chapitre][sousChapitre]).forEach((paragraphe) => {
          Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).forEach((sousParagraphe) => {
            const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
            const sousParagrapheKey = `${sousChapitre}-${paragraphe}-${sousParagraphe}`; // Unique key

            const responseCounts = calculateResponseCounts(sectionQuestions);

            // Generate and queue chart URLs for each section
            const cpcncUrl = generateChartUrl(responseCounts, 'CPCNC');
            if (cpcncUrl) {
              newQueue.push({ url: `${cpcncUrl}?t=${Date.now()}`, sectionKey: sousParagrapheKey, chartType: 'CPCNC' });
            }

            const okkoUrl = generateChartUrl(responseCounts, 'OKKO');
            if (okkoUrl) {
              newQueue.push({ url: `${okkoUrl}?t=${Date.now()}`, sectionKey: sousParagrapheKey, chartType: 'OKKO' });
            }

            const temperatureUrl = generateChartUrl(responseCounts, 'Temperature');
            if (temperatureUrl) {
              newQueue.push({ url: `${temperatureUrl}?t=${Date.now()}`, sectionKey: sousParagrapheKey, chartType: 'Temperature' });
            }
          });
        });
      });
    });

    setImageQueue(newQueue); // Update the image queue for loading

  }, [auditDetail, filteredAudits]);

  useEffect(() => {
    if (imageQueue.length > 0) {
      loadChartsSequentially(); // Load charts only when the queue is updated
    }
  }, [imageQueue]);

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
                  const responseCounts = calculateResponseCounts(sectionQuestions);

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

                      {/* Render charts */}
                      <div>
                        {sectionChartUrls[`${sousParagrapheKey}-CPCNC`] && (
                          <img src={sectionChartUrls[`${sousParagrapheKey}-CPCNC`]} alt="CPCNC Chart" />
                        )}
                        {sectionChartUrls[`${sousParagrapheKey}-OKKO`] && (
                          <img src={sectionChartUrls[`${sousParagrapheKey}-OKKO`]} alt="OKKO Chart" />
                        )}
                        {sectionChartUrls[`${sousParagrapheKey}-Temperature`] && (
                          <img src={sectionChartUrls[`${sousParagrapheKey}-Temperature`]} alt="Temperature Chart" />
                        )}
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
