
// // import React, { useEffect, useState, useCallback } from 'react';
// // import axios from 'axios';
// // import QuestionBaseComponent from './QuestionBaseComponent';

// // function AuditDetail({ updateProgress }) {
// //   const [data, setData] = useState(null);
// //   const [formResponses, setFormResponses] = useState({});
// //   const [comments, setComments] = useState({});
// //   const [images, setImages] = useState({});
// //   const [imagePreviews, setImagePreviews] = useState({}); // Store image preview URLs
// //   const [duplicates, setDuplicates] = useState({});
// //   const [removedQuestions, setRemovedQuestions] = useState({});
// //   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
// //   const [auditId, setAuditId] = useState(null);

// //   const calculateProgress = useCallback((auditData = {}, responses = {}, removedQuestions = {}) => {
// //     let progressData = {};
// //     Object.entries(auditData || {}).forEach(([chapitre, sousChapitres = {}]) => {
// //       Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
// //         let sousChapitreTotalQuestions = 0;
// //         let sousChapitreAnsweredQuestions = 0;
// //         let paragrapheProgressData = {};

// //         Object.entries(paragraphes || {}).forEach(([paragraphe, sousParagraphes = {}]) => {
// //           let paragrapheTotalQuestions = 0;
// //           let paragrapheAnsweredQuestions = 0;

// //           Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
// //             const activeQuestions = questions.filter(
// //               (question) => !(removedQuestions[sousChapitre] || []).includes(question.id)
// //             );

// //             paragrapheTotalQuestions += activeQuestions.length;

// //             activeQuestions.forEach((question) => {
// //               if (responses[question.id]?.response) {
// //                 paragrapheAnsweredQuestions += 1;
// //               }

// //               const duplicateQuestions = duplicates[question.id] || [];
// //               const activeDuplicates = duplicateQuestions.filter(
// //                 (duplicate) => !(removedQuestions[sousChapitre] || []).includes(duplicate.duplicateId)
// //               );

// //               paragrapheTotalQuestions += activeDuplicates.length;

// //               activeDuplicates.forEach((duplicate) => {
// //                 if (responses[duplicate.duplicateId]?.response) {
// //                   paragrapheAnsweredQuestions += 1;
// //                 }
// //               });
// //             });
// //           });

// //           const paragraphePercentageComplete = paragrapheTotalQuestions > 0
// //             ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
// //             : 0;

// //           sousChapitreTotalQuestions += paragrapheTotalQuestions;
// //           sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;

// //           paragrapheProgressData[paragraphe] = {
// //             percentage: paragraphePercentageComplete,
// //             totalQuestions: paragrapheTotalQuestions,
// //             answeredQuestions: paragrapheAnsweredQuestions,
// //           };
// //         });

// //         const sousChapitrePercentageComplete = sousChapitreTotalQuestions > 0
// //           ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
// //           : 0;

// //         progressData[sousChapitre] = {
// //           percentage: sousChapitrePercentageComplete,
// //           totalQuestions: sousChapitreTotalQuestions,
// //           answeredQuestions: sousChapitreAnsweredQuestions,
// //           paragraphes: paragrapheProgressData,
// //         };
// //       });
// //     });

// //     return progressData;
// //   }, [duplicates]);


// //   useEffect(() => {
// //     if (data) {
// //       const updatedProgress = calculateProgress(data, formResponses, removedQuestions);
// //       updateProgress(updatedProgress);
// //     }
// //   }, [data, formResponses, duplicates, removedQuestions, updateProgress, calculateProgress]);


// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get('/api/audit_detail');
// //         setData(response.data);
// //         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
// //         const storedAuditId = localStorage.getItem("auditId");

// //         if (storedResponses) {
// //           setFormResponses(storedResponses);
// //         }

// //         if (storedAuditId) {
// //           setAuditId(storedAuditId);
// //         } else {
// //           const newAuditId = Date.now().toString();
// //           setAuditId(newAuditId);
// //           localStorage.setItem("auditId", newAuditId);
// //         }

// //         updateProgress(calculateProgress(response.data, storedResponses, removedQuestions));
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     fetchData();
// //   }, [calculateProgress, updateProgress, removedQuestions]);

// //   // Sticky Header Effect for h3, h4, and h5 elements
// // useEffect(() => {
// //   const handleScroll = () => {
// //     const h3Headers = document.querySelectorAll('h3');
// //     const h4Headers = document.querySelectorAll('h4');
// //     const h5Headers = document.querySelectorAll('h5');

// //     // Sticky behavior for h3 elements
// //     h3Headers.forEach((header, index) => {
// //       const nextHeader = h3Headers[index + 1]; // Get the next h3 element
// //       const headerRect = header.getBoundingClientRect();
// //       const nextHeaderRect = nextHeader?.getBoundingClientRect();

// //       // When the next h3 is about to overlap the current sticky h3
// //       if (nextHeaderRect && nextHeaderRect.top <= headerRect.height) {
// //         header.style.transform = `translateY(${nextHeaderRect.top - headerRect.height}px)`;
// //       } else {
// //         header.style.transform = 'translateY(0)'; // Reset transformation
// //       }
// //     });

// //     // Sticky behavior for h4 elements
// //     h4Headers.forEach((header, index) => {
// //       const nextHeader = h4Headers[index + 1]; // Get the next h4 element
// //       const headerRect = header.getBoundingClientRect();
// //       const nextHeaderRect = nextHeader?.getBoundingClientRect();

// //       // When the next h4 is about to overlap the current sticky h4
// //       if (nextHeaderRect && nextHeaderRect.top <= headerRect.height) {
// //         header.style.transform = `translateY(${nextHeaderRect.top - headerRect.height}px)`;
// //       } else {
// //         header.style.transform = 'translateY(0)'; // Reset transformation
// //       }
// //     });

// //     // Sticky behavior for h5 elements
// //     h5Headers.forEach((header, index) => {
// //       const nextHeader = h5Headers[index + 1]; // Get the next h5 element
// //       const headerRect = header.getBoundingClientRect();
// //       const nextHeaderRect = nextHeader?.getBoundingClientRect();

// //       // When the next h5 is about to overlap the current sticky h5
// //       if (nextHeaderRect && nextHeaderRect.top <= headerRect.height) {
// //         header.style.transform = `translateY(${nextHeaderRect.top - headerRect.height}px)`;
// //       } else {
// //         header.style.transform = 'translateY(0)'; // Reset transformation
// //       }
// //     });
// //   };

// //   window.addEventListener('scroll', handleScroll);

// //   return () => {
// //     window.removeEventListener('scroll', handleScroll); // Cleanup event listener
// //   };
// // }, []);

// //   const handleInputChange = (event, questionId) => {
// //     const { value } = event.target;
// //     const updatedResponses = {
// //       ...formResponses,
// //       [questionId]: { ...formResponses[questionId], response: value },
// //     };
// //     setFormResponses(updatedResponses);
// //     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// //     updateProgress(calculateProgress(data, updatedResponses, removedQuestions));
// //   };

// //   const handleCommentChange = (event, questionId) => {
// //     const { value } = event.target;
// //     setComments(prev => ({
// //       ...prev,
// //       [questionId]: value,
// //     }));
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [questionId]: { ...formResponses[questionId], comment: value },
// //     }));
// //   };

// //   const handleImageChange = (event, questionId) => {
// //     const files = Array.from(event.target.files); // Get all selected files

// //     setImages(prev => ({
// //       ...prev,
// //       [questionId]: [...(prev[questionId] || []), ...files], // Store multiple images for the question
// //     }));

// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [`images_${questionId}`]: [...(formResponses[`images_${questionId}`] || []), ...files.map(file => file.name)]
// //     }));
// //   };

// //   const handleDuplicate = (questionObj) => {
// //     const { id } = questionObj;

// //     // Create a unique duplicateId for each duplicate question
// //     const duplicateId = `${id}-duplicate-${Date.now()}`;  // Unique ID with timestamp

// //     setDuplicates((prev) => ({
// //       ...prev,
// //       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }], // Assign unique duplicateId
// //     }));
// //   };

// //   const handleRemoveQuestion = (sousChapitre, questionId) => {
// //     // Remove the original question and its duplicates
// //     const relatedDuplicates = duplicates[questionId] || [];

// //     setRemovedQuestions((prev) => ({
// //       ...prev,
// //       [sousChapitre]: [
// //         ...(prev[sousChapitre] || []),
// //         questionId, // Add the original question ID
// //         ...relatedDuplicates.map((dup) => dup.duplicateId) // Add all related duplicate IDs
// //       ],
// //     }));

// //     // Update the progress with the newly removed questions
// //     updateProgress(calculateProgress(data, formResponses, {
// //       ...removedQuestions,
// //       [sousChapitre]: [
// //         ...(removedQuestions[sousChapitre] || []),
// //         questionId,
// //         ...relatedDuplicates.map((dup) => dup.duplicateId),
// //       ],
// //     }));
// //   };

// //   const handleRemoveDuplicate = (duplicateId) => {
// //     setDuplicates((prev) => {
// //       const updatedDuplicates = {};

// //       Object.keys(prev).forEach((questionId) => {
// //         updatedDuplicates[questionId] = prev[questionId].filter((duplicate) => duplicate.duplicateId !== duplicateId);
// //         if (updatedDuplicates[questionId].length === 0) {
// //           delete updatedDuplicates[questionId];
// //         }
// //       });

// //       return updatedDuplicates;
// //     });
// //   };

// //   const handleReAddQuestion = (sousChapitre, questionObj) => {
// //     setRemovedQuestions((prev) => ({
// //       ...prev,
// //       [sousChapitre]: prev[sousChapitre]?.filter(id => id !== questionObj.id),
// //     }));
// //     updateProgress(calculateProgress(data, formResponses, removedQuestions));
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     const formData = new FormData();
// //     formData.append('auditId', auditId);

// //     Object.entries(formResponses).forEach(([questionId, response]) => {
// //       const finalResponse = typeof response === 'object' ? JSON.stringify(response) : response;
// //       formData.append(`responses[${questionId}]`, finalResponse);
// //     });

// //     Object.entries(images).forEach(([questionId, image]) => {
// //       if (image) {
// //         formData.append(`images[${questionId}]`, image);
// //       }
// //     });

// //     axios.post('/api/submit', formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' },
// //     })
// //     .then(() => {
// //       alert('Audit detail submitted successfully!');
// //       localStorage.removeItem("auditResponses");
// //       localStorage.removeItem("auditId");
// //     })
// //     .catch(error => console.error('Error submitting audit detail:', error));
// //   };

// //   const toggleSousChapitre = (sousChapitre) => {
// //     setExpandedSousChapitres(prevState => ({
// //       ...prevState,
// //       [sousChapitre]: !prevState[sousChapitre],
// //     }));
// //   };

// //   const getBackgroundColor = (index) => index % 2 === 0 ? '#e1e1e1' : '#ffffff';

// //   const renderQuestionComponent = (item, itemIndex, sousChapitre) => {
// //     const isRemoved = (removedQuestions[sousChapitre] || []).includes(item.id || item.duplicateId);
// //     if (!isRemoved) {
// //       const questionKey = item.duplicateId || `original-${item.id}-${itemIndex}`; // Use index for additional uniqueness

// //       return (
// //         <div
// //           key={questionKey}
// //           style={{ backgroundColor: getBackgroundColor(itemIndex), marginLeft: 0 }}
// //         >
// //           <QuestionBaseComponent
// //             questionObj={item}
// //             formResponses={formResponses}
// //             handleInputChange={handleInputChange}
// //             handleCommentChange={handleCommentChange}
// //             handleImageChange={handleImageChange}
// //             isDuplicate={!!item.duplicateId}  // Mark whether the item is a duplicate
// //             handleDuplicate={item.duplicateId ? null : handleDuplicate}
// //             handleRemove={item.duplicateId ? () => handleRemoveDuplicate(item.duplicateId) : () => handleRemoveQuestion(sousChapitre, item.id)}
// //             setImages={setImages}
// //             images={images}
// //             comments={comments}
// //           />
// //           {/* Render image preview if available */}
// //           {imagePreviews[item.id] && (
// //             <div style={{ marginTop: '10px' }}>
// //               <img
// //                 src={imagePreviews[item.id]}
// //                 alt="Preview"
// //                 style={{ width: '100px', height: 'auto', border: '1px solid #ccc' }}
// //               />
// //             </div>
// //           )}
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   return (
// //     <div className="container">
// //       <div className="row">
// //         <div className="col-md-3">
// //           {/* Sidebar with data */}
// //           {data && <Sidebar data={calculateProgress(data, formResponses, removedQuestions)} />}
// //         </div>
// //         <div className="col-md-9 main-content">
// //           <h2>Grilles de l'audit</h2>
// //           <form onSubmit={handleSubmit}>
// //             {data && Object.entries(data).map(([chapitre, sousChapitres]) => (
// //               <div key={chapitre}>
// //                 <h3>{chapitre}</h3>
// //                 {sousChapitres && Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// //                   <div key={sousChapitre} className="mb-3" id={sousChapitre}>
// //                     <h4 className="paragraphe-header">
// //                       <button
// //                         type="button"
// //                         className="btn btn-link"
// //                         onClick={() => toggleSousChapitre(sousChapitre)}
// //                       >
// //                         {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
// //                       </button>
// //                     </h4>
// //                     {expandedSousChapitres[sousChapitre] && (
// //                       <div>
// //                         {paragraphes && Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => {
// //                           const uniqueId = `${sousChapitre}-${paragraphe}`; // Unique ID

// //                           const allQuestionsFlattened = [];
// //                           sousParagraphes && Object.entries(sousParagraphes).forEach(([_, questions]) => {
// //                             questions.forEach((questionObj) => {
// //                               allQuestionsFlattened.push({ ...questionObj, isDuplicate: false });
// //                               (duplicates[questionObj.id] || []).forEach((duplicate) => {
// //                                 allQuestionsFlattened.push({ ...duplicate, isDuplicate: true });
// //                               });
// //                             });
// //                           });

// //                           return (
// //                             <div key={uniqueId} id={uniqueId} className="mb-2">
// //                               <h5>{paragraphe}</h5>

// //                               {(removedQuestions[sousChapitre] || []).length > 0 && (
// //                                 <div className="mb-2">
// //                                   <h6>Questions Removed:</h6>
// //                                   <ul>
// //                                     {allQuestionsFlattened
// //                                       .filter(question => removedQuestions[sousChapitre].includes(question.id || question.duplicateId))
// //                                       .map(question => (
// //                                         <li key={question.duplicateId || `removed-${question.id}`}>
// //                                           {question.question}
// //                                           <button
// //                                             type="button"
// //                                             className="btn btn-success btn-sm ml-2"
// //                                             onClick={() => handleReAddQuestion(sousChapitre, question)}
// //                                           >
// //                                             Rajouter
// //                                           </button>
// //                                         </li>
// //                                       ))}
// //                                   </ul>
// //                                 </div>
// //                               )}

// //                               {allQuestionsFlattened.map((item, index) => (
// //                                 renderQuestionComponent(item, index, sousChapitre)
// //                               ))}
// //                             </div>
// //                           );
// //                         })}
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             ))}
// //             <button type="submit" className="btn btn-primary">Envoyer</button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default AuditDetail;


// import React, { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import QuestionBaseComponent from './QuestionBaseComponent';
// import Sidebar from './Sidebar';

// function AuditDetail({ updateProgress }) {
//   const [data, setData] = useState(null);
//   const [formResponses, setFormResponses] = useState({});
//   const [comments, setComments] = useState({});
//   const [images, setImages] = useState({});
//   const [imagePreviews, setImagePreviews] = useState({});
//   const [duplicates, setDuplicates] = useState({});
//   const [removedQuestions, setRemovedQuestions] = useState({});
//   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
//   const [auditId, setAuditId] = useState(null);

//   // Define calculateProgress function
//   const calculateProgress = useCallback((auditData = {}, responses = {}, removedQuestions = {}) => {
//     let progressData = {};
//     Object.entries(auditData || {}).forEach(([chapitre, sousChapitres = {}]) => {
//       Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
//         let sousChapitreTotalQuestions = 0;
//         let sousChapitreAnsweredQuestions = 0;
//         let paragrapheProgressData = {};

//         Object.entries(paragraphes || {}).forEach(([paragraphe, sousParagraphes = {}]) => {
//           let paragrapheTotalQuestions = 0;
//           let paragrapheAnsweredQuestions = 0;

//           Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
//             const activeQuestions = questions.filter(
//               (question) => !(removedQuestions[sousChapitre] || []).includes(question.id)
//             );

//             paragrapheTotalQuestions += activeQuestions.length;

//             activeQuestions.forEach((question) => {
//               if (responses[question.id]?.response) {
//                 paragrapheAnsweredQuestions += 1;
//               }

//               const duplicateQuestions = duplicates[question.id] || [];
//               const activeDuplicates = duplicateQuestions.filter(
//                 (duplicate) => !(removedQuestions[sousChapitre] || []).includes(duplicate.duplicateId)
//               );

//               paragrapheTotalQuestions += activeDuplicates.length;

//               activeDuplicates.forEach((duplicate) => {
//                 if (responses[duplicate.duplicateId]?.response) {
//                   paragrapheAnsweredQuestions += 1;
//                 }
//               });
//             });
//           });

//           const paragraphePercentageComplete = paragrapheTotalQuestions > 0
//             ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
//             : 0;

//           sousChapitreTotalQuestions += paragrapheTotalQuestions;
//           sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;

//           paragrapheProgressData[paragraphe] = {
//             percentage: paragraphePercentageComplete,
//             totalQuestions: paragrapheTotalQuestions,
//             answeredQuestions: paragrapheAnsweredQuestions,
//           };
//         });

//         const sousChapitrePercentageComplete = sousChapitreTotalQuestions > 0
//           ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
//           : 0;

//         progressData[sousChapitre] = {
//           percentage: sousChapitrePercentageComplete,
//           totalQuestions: sousChapitreTotalQuestions,
//           answeredQuestions: sousChapitreAnsweredQuestions,
//           paragraphes: paragrapheProgressData,
//         };
//       });
//     });

//     return progressData;
//   }, [duplicates]);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/audit_detail');
//         setData(response.data);
//         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
//         const storedAuditId = localStorage.getItem("auditId");

//         if (storedResponses) {
//           setFormResponses(storedResponses);
//         }

//         if (storedAuditId) {
//           setAuditId(storedAuditId);
//         } else {
//           const newAuditId = Date.now().toString();
//           setAuditId(newAuditId);
//           localStorage.setItem("auditId", newAuditId);
//         }

//         updateProgress(calculateProgress(response.data, storedResponses, removedQuestions));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [calculateProgress, updateProgress, removedQuestions]);

//   // Submit handler
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('auditId', auditId);

//     Object.entries(formResponses).forEach(([questionId, response]) => {
//       const finalResponse = typeof response === 'object' ? JSON.stringify(response) : response;
//       formData.append(`responses[${questionId}]`, finalResponse);
//     });

//     Object.entries(images).forEach(([questionId, image]) => {
//       if (image) {
//         formData.append(`images[${questionId}]`, image);
//       }
//     });

//     axios.post('/api/submit', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//     .then(() => {
//       alert('Audit detail submitted successfully!');
//       localStorage.removeItem("auditResponses");
//       localStorage.removeItem("auditId");
//     })
//     .catch(error => console.error('Error submitting audit detail:', error));
//   };

//   // Toggle visibility of sousChapitre
//   const toggleSousChapitre = (sousChapitre) => {
//     setExpandedSousChapitres(prevState => ({
//       ...prevState,
//       [sousChapitre]: !prevState[sousChapitre],
//     }));
//   };

//   // Render each question component
//   const renderQuestionComponent = (item, itemIndex, sousChapitre) => {
//     const isRemoved = (removedQuestions[sousChapitre] || []).includes(item.id || item.duplicateId);
//     if (!isRemoved) {
//       const questionKey = item.duplicateId || `original-${item.id}-${itemIndex}`;

//       return (
//         <div
//           key={questionKey}
//           style={{ backgroundColor: itemIndex % 2 === 0 ? '#e1e1e1' : '#ffffff', marginLeft: 0 }}
//         >
//           <QuestionBaseComponent
//             questionObj={item}
//             formResponses={formResponses}
//             handleInputChange={handleInputChange}
//             handleCommentChange={handleCommentChange}
//             handleImageChange={handleImageChange}
//             isDuplicate={!!item.duplicateId}
//             handleDuplicate={item.duplicateId ? null : handleDuplicate}
//             handleRemove={item.duplicateId ? () => handleRemoveDuplicate(item.duplicateId) : () => handleRemoveQuestion(sousChapitre, item.id)}
//             setImages={setImages}
//             images={images}
//             comments={comments}
//           />
//           {imagePreviews[item.id] && (
//             <div style={{ marginTop: '10px' }}>
//               <img
//                 src={imagePreviews[item.id]}
//                 alt="Preview"
//                 style={{ width: '100px', height: 'auto', border: '1px solid #ccc' }}
//               />
//             </div>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="container">
//       <div className="row">
//         <div className="col-md-3">
//           {data && <Sidebar data={calculateProgress(data, formResponses, removedQuestions)} />}
//         </div>
//         <div className="col-md-9 main-content">
//           <h2>Grilles de l'audit</h2>
//           <form onSubmit={handleSubmit}>
//             {data && Object.entries(data).map(([chapitre, sousChapitres]) => (
//               <div key={chapitre}>
//                 <h3>{chapitre}</h3>
//                 {sousChapitres && Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
//                   <div key={sousChapitre} className="mb-3" id={sousChapitre}>
//                     <h4 className="paragraphe-header">
//                       <button
//                         type="button"
//                         className="btn btn-link"
//                         onClick={() => toggleSousChapitre(sousChapitre)}
//                       >
//                         {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
//                       </button>
//                     </h4>
//                     {expandedSousChapitres[sousChapitre] && (
//                       <div>
//                         {paragraphes && Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => {
//                           const uniqueId = `${sousChapitre}-${paragraphe}`;
//                           const allQuestionsFlattened = [];

//                           sousParagraphes && Object.entries(sousParagraphes).forEach(([_, questions]) => {
//                             questions.forEach((questionObj) => {
//                               allQuestionsFlattened.push({ ...questionObj, isDuplicate: false });
//                               (duplicates[questionObj.id] || []).forEach((duplicate) => {
//                                 allQuestionsFlattened.push({ ...duplicate, isDuplicate: true });
//                               });
//                             });
//                           });

//                           return (
//                             <div key={uniqueId} id={uniqueId} className="mb-2">
//                               <h5>{paragraphe}</h5>

//                               {(removedQuestions[sousChapitre] || []).length > 0 && (
//                                 <div className="mb-2">
//                                   <h6>Questions Removed:</h6>
//                                   <ul>
//                                     {allQuestionsFlattened
//                                       .filter(question => removedQuestions[sousChapitre].includes(question.id || question.duplicateId))
//                                       .map(question => (
//                                         <li key={question.duplicateId || `removed-${question.id}`}>
//                                           {question.question}
//                                           <button
//                                             type="button"
//                                             className="btn btn-success btn-sm ml-2"
//                                             onClick={() => handleReAddQuestion(sousChapitre, question)}
//                                           >
//                                             Rajouter
//                                           </button>
//                                         </li>
//                                       ))}
//                                   </ul>
//                                 </div>
//                               )}

//                               {allQuestionsFlattened.map((item, index) => (
//                                 renderQuestionComponent(item, index, sousChapitre)
//                               ))}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ))}
//             <button type="submit" className="btn btn-primary">Envoyer</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuditDetail;


import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import QuestionBaseComponent from './QuestionBaseComponent';
import Sidebar from './Sidebar';

function AuditDetail({ updateProgress }) {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [comments, setComments] = useState({});
  const [images, setImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [duplicates, setDuplicates] = useState({});
  const [removedQuestions, setRemovedQuestions] = useState({});
  const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
  const [auditId, setAuditId] = useState(null);

  const calculateProgress = useCallback((auditData = {}, responses = {}, removedQuestions = {}) => {
    let progressData = {};
    Object.entries(auditData || {}).forEach(([chapitre, sousChapitres = {}]) => {
      Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
        let sousChapitreTotalQuestions = 0;
        let sousChapitreAnsweredQuestions = 0;
        let paragrapheProgressData = {};

        Object.entries(paragraphes || {}).forEach(([paragraphe, sousParagraphes = {}]) => {
          let paragrapheTotalQuestions = 0;
          let paragrapheAnsweredQuestions = 0;

          Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
            const activeQuestions = questions.filter(
              (question) => !(removedQuestions[sousChapitre] || []).includes(question.id)
            );

            paragrapheTotalQuestions += activeQuestions.length;

            activeQuestions.forEach((question) => {
              if (responses[question.id]?.response) {
                paragrapheAnsweredQuestions += 1;
              }

              const duplicateQuestions = duplicates[question.id] || [];
              const activeDuplicates = duplicateQuestions.filter(
                (duplicate) => !(removedQuestions[sousChapitre] || []).includes(duplicate.duplicateId)
              );

              paragrapheTotalQuestions += activeDuplicates.length;

              activeDuplicates.forEach((duplicate) => {
                if (responses[duplicate.duplicateId]?.response) {
                  paragrapheAnsweredQuestions += 1;
                }
              });
            });
          });

          const paragraphePercentageComplete = paragrapheTotalQuestions > 0
            ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
            : 0;

          sousChapitreTotalQuestions += paragrapheTotalQuestions;
          sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;

          paragrapheProgressData[paragraphe] = {
            percentage: paragraphePercentageComplete,
            totalQuestions: paragrapheTotalQuestions,
            answeredQuestions: paragrapheAnsweredQuestions,
          };
        });

        const sousChapitrePercentageComplete = sousChapitreTotalQuestions > 0
          ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
          : 0;

        progressData[sousChapitre] = {
          percentage: sousChapitrePercentageComplete,
          totalQuestions: sousChapitreTotalQuestions,
          answeredQuestions: sousChapitreAnsweredQuestions,
          paragraphes: paragrapheProgressData,
        };
      });
    });

    return progressData;
  }, [duplicates]);

  useEffect(() => {
    if (data) {
      const updatedProgress = calculateProgress(data, formResponses, removedQuestions);
      updateProgress(updatedProgress);
    }
  }, [data, formResponses, duplicates, removedQuestions, updateProgress, calculateProgress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/audit_detail');
        setData(response.data);
        const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
        const storedAuditId = localStorage.getItem("auditId");

        if (storedResponses) {
          setFormResponses(storedResponses);
        }

        if (storedAuditId) {
          setAuditId(storedAuditId);
        } else {
          const newAuditId = Date.now().toString();
          setAuditId(newAuditId);
          localStorage.setItem("auditId", newAuditId);
        }

        updateProgress(calculateProgress(response.data, storedResponses, removedQuestions));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [calculateProgress, updateProgress, removedQuestions]);

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...formResponses,
      [questionId]: { ...formResponses[questionId], response: value },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
    updateProgress(calculateProgress(data, updatedResponses, removedQuestions));
  };

  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;

    // Update the comments state (if needed for UI purposes)
    setComments(prev => ({
      ...prev,
      [questionId]: value,
    }));

    // Update the formResponses to include the comment as part of the response object
    const updatedResponses = {
      ...formResponses,
      [questionId]: {
        ...formResponses[questionId],
        comment: value,  // Ensure the comment is part of the response object
        response: formResponses[questionId]?.response || ''  // Preserve existing response if present
      }
    };

    // Save the updated formResponses to state and localStorage
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
};

  const handleImageChange = (event, questionId) => {
    const files = Array.from(event.target.files); // Get all selected files

    setImages(prev => ({
      ...prev,
      [questionId]: [...(prev[questionId] || []), ...files], // Store multiple images for the question
    }));

    // Update the local storage to store image names
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [questionId]: {
        ...formResponses[questionId],
        images: [...(formResponses[questionId]?.images || []), ...files.map(file => file.name)]
      }
    }));
  };

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;

    // Create a unique duplicateId for each duplicate question
    const duplicateId = `${id}-duplicate-${Date.now()}`;  // Unique ID with timestamp

    setDuplicates((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { ...questionObj, duplicateId }], // Assign unique duplicateId
    }));
  };

  const handleRemoveQuestion = (sousChapitre, questionId) => {
    // Remove the original question and its duplicates
    const relatedDuplicates = duplicates[questionId] || [];

    setRemovedQuestions((prev) => ({
      ...prev,
      [sousChapitre]: [
        ...(prev[sousChapitre] || []),
        questionId, // Add the original question ID
        ...relatedDuplicates.map((dup) => dup.duplicateId) // Add all related duplicate IDs
      ],
    }));

    // Update the progress with the newly removed questions
    updateProgress(calculateProgress(data, formResponses, {
      ...removedQuestions,
      [sousChapitre]: [
        ...(removedQuestions[sousChapitre] || []),
        questionId,
        ...relatedDuplicates.map((dup) => dup.duplicateId),
      ],
    }));
  };

  const handleRemoveDuplicate = (duplicateId) => {
    setDuplicates((prev) => {
      const updatedDuplicates = {};

      Object.keys(prev).forEach((questionId) => {
        updatedDuplicates[questionId] = prev[questionId].filter((duplicate) => duplicate.duplicateId !== duplicateId);
        if (updatedDuplicates[questionId].length === 0) {
          delete updatedDuplicates[questionId];
        }
      });

      return updatedDuplicates;
    });
  };

  const handleReAddQuestion = (sousChapitre, questionObj) => {
    setRemovedQuestions((prev) => ({
      ...prev,
      [sousChapitre]: prev[sousChapitre]?.filter(id => id !== questionObj.id),
    }));
    updateProgress(calculateProgress(data, formResponses, removedQuestions));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('auditId', auditId);

    // Loop through formResponses to add responses and comments to the FormData
    Object.entries(formResponses).forEach(([questionId, responseObj]) => {
        // Store the response in the 'response' column
        if (responseObj?.response) {
            const finalResponse = typeof responseObj.response === 'object' ? JSON.stringify(responseObj.response) : responseObj.response;
            formData.append(`responses[${questionId}]`, finalResponse);
        }

        // Store the comment in the 'comment' column
        if (responseObj?.comment) {
            formData.append(`comments[${questionId}]`, responseObj.comment);
        }
    });

    // Loop through images and add them to the formData
    Object.entries(images).forEach(([questionId, imageList]) => {
        imageList.forEach((image) => {
            formData.append(`images[${questionId}][]`, image); // Using array syntax [] to store multiple images
        });
    });

    // Submit the form
    axios.post('/api/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
        alert('Audit detail submitted successfully!');
        localStorage.removeItem("auditResponses");
        localStorage.removeItem("auditId");
    })
    .catch(error => console.error('Error submitting audit detail:', error));
};

  const toggleSousChapitre = (sousChapitre) => {
    setExpandedSousChapitres(prevState => ({
      ...prevState,
      [sousChapitre]: !prevState[sousChapitre],
    }));
  };

  const renderQuestionComponent = (item, itemIndex, sousChapitre) => {
    const isRemoved = (removedQuestions[sousChapitre] || []).includes(item.id || item.duplicateId);
    if (!isRemoved) {
      const questionKey = item.duplicateId || `original-${item.id}-${itemIndex}`; // Use index for additional uniqueness

      return (
        <div
          key={questionKey}
          style={{ backgroundColor: itemIndex % 2 === 0 ? '#e1e1e1' : '#ffffff', marginLeft: 0 }}
        >
          <QuestionBaseComponent
            questionObj={item}
            formResponses={formResponses}
            handleInputChange={handleInputChange}
            handleCommentChange={handleCommentChange}
            handleImageChange={handleImageChange}
            isDuplicate={!!item.duplicateId}  // Mark whether the item is a duplicate
            handleDuplicate={item.duplicateId ? null : handleDuplicate}
            handleRemove={item.duplicateId ? () => handleRemoveDuplicate(item.duplicateId) : () => handleRemoveQuestion(sousChapitre, item.id)}
            setImages={setImages}
            images={images}
            comments={comments}
          />
          {/* Render image preview if available */}
          {imagePreviews[item.id] && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imagePreviews[item.id]}
                alt="Preview"
                style={{ width: '100px', height: 'auto', border: '1px solid #ccc' }}
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar column */}
        <div className="col-md-3">
          {data && <Sidebar data={calculateProgress(data, formResponses, removedQuestions)} />}
        </div>

        {/* Main content column */}
        <div className="col-md-9">
          <h2>Grilles de l'audit</h2>
          <form onSubmit={handleSubmit}>
            {data && Object.entries(data).map(([chapitre, sousChapitres]) => (
              <div key={chapitre}>
                <h3>{chapitre}</h3>
                {sousChapitres && Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
                  <div key={sousChapitre} className="mb-3" id={sousChapitre}>
                    <h4 className="paragraphe-header">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => toggleSousChapitre(sousChapitre)}
                      >
                        {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
                      </button>
                    </h4>
                    {expandedSousChapitres[sousChapitre] && (
                      <div>
                        {paragraphes && Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => {
                          const uniqueId = `${sousChapitre}-${paragraphe}`; // Unique ID

                          const allQuestionsFlattened = [];
                          sousParagraphes && Object.entries(sousParagraphes).forEach(([_, questions]) => {
                            questions.forEach((questionObj) => {
                              allQuestionsFlattened.push({ ...questionObj, isDuplicate: false });
                              (duplicates[questionObj.id] || []).forEach((duplicate) => {
                                allQuestionsFlattened.push({ ...duplicate, isDuplicate: true });
                              });
                            });
                          });

                          return (
                            <div key={uniqueId} id={uniqueId} className="mb-2">
                              <h5>{paragraphe}</h5>
                              {allQuestionsFlattened.map((item, index) => (
                                renderQuestionComponent(item, index, sousChapitre)
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuditDetail;
