// // // // // // // // // import React, { useEffect, useState, useCallback } from 'react';
// // // // // // // // // import axios from 'axios';
// // // // // // // // // import Sidebar from './Sidebar';
// // // // // // // // // import QuestionComponent from './QuestionComponent';
// // // // // // // // // import DuplicateQuestionComponent from './DuplicateQuestionComponent';

// // // // // // // // // function AuditDetail({ updateProgress }) {
// // // // // // // // //   const [data, setData] = useState(null);
// // // // // // // // //   const [formResponses, setFormResponses] = useState({});
// // // // // // // // //   const [comments, setComments] = useState({});
// // // // // // // // //   const [images, setImages] = useState({});
// // // // // // // // //   const [imagePreviews, setImagePreviews] = useState({});
// // // // // // // // //   const [duplicates, setDuplicates] = useState({});
// // // // // // // // //   const [removedQuestions, setRemovedQuestions] = useState({});
// // // // // // // // //   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
// // // // // // // // //   const [auditId, setAuditId] = useState(null);

// // // // // // // // //   // Calculate progress function
// // // // // // // // //   const calculateProgress = useCallback((auditData = {}, responses = {}, removedQuestions = {}) => {
// // // // // // // // //     let progressData = {};
// // // // // // // // //     Object.entries(auditData).forEach(([chapitre, sousChapitres]) => {
// // // // // // // // //       Object.entries(sousChapitres).forEach(([sousChapitre, paragraphes]) => {
// // // // // // // // //         let sousChapitreTotalQuestions = 0;
// // // // // // // // //         let sousChapitreAnsweredQuestions = 0;
// // // // // // // // //         let paragrapheProgressData = {};

// // // // // // // // //         Object.entries(paragraphes).forEach(([paragraphe, sousParagraphes]) => {
// // // // // // // // //           let paragrapheTotalQuestions = 0;
// // // // // // // // //           let paragrapheAnsweredQuestions = 0;

// // // // // // // // //           Object.entries(sousParagraphes).forEach(([_, questions]) => {
// // // // // // // // //             const activeQuestions = questions.filter(
// // // // // // // // //               (question) => !(removedQuestions[sousChapitre] || []).find((q) => q.id === question.id)
// // // // // // // // //             );

// // // // // // // // //             paragrapheTotalQuestions += activeQuestions.length;
// // // // // // // // //             activeQuestions.forEach((question) => {
// // // // // // // // //               if (responses[question.id]?.response) paragrapheAnsweredQuestions += 1;
// // // // // // // // //             });
// // // // // // // // //           });

// // // // // // // // //           const paragraphePercentage = paragrapheTotalQuestions
// // // // // // // // //             ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
// // // // // // // // //             : 0;

// // // // // // // // //           sousChapitreTotalQuestions += paragrapheTotalQuestions;
// // // // // // // // //           sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;
// // // // // // // // //           paragrapheProgressData[paragraphe] = { percentage: paragraphePercentage };
// // // // // // // // //         });

// // // // // // // // //         const sousChapitrePercentage = sousChapitreTotalQuestions
// // // // // // // // //           ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
// // // // // // // // //           : 0;

// // // // // // // // //         progressData[sousChapitre] = {
// // // // // // // // //           percentage: sousChapitrePercentage,
// // // // // // // // //           paragraphes: paragrapheProgressData,
// // // // // // // // //         };
// // // // // // // // //       });
// // // // // // // // //     });

// // // // // // // // //     return progressData;
// // // // // // // // //   }, []);

// // // // // // // // //   // Load and set data with storage integration
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const fetchData = async () => {
// // // // // // // // //       try {
// // // // // // // // //         const response = await axios.get('/api/audit_detail');
// // // // // // // // //         setData(response.data);
// // // // // // // // //         console.log("Fetched data:", response.data); // Check data structure
// // // // // // // // //         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
// // // // // // // // //         const storedRemovedQuestions = JSON.parse(localStorage.getItem("removedQuestions")) || {};

// // // // // // // // //         if (storedResponses) setFormResponses(storedResponses);
// // // // // // // // //         setRemovedQuestions(storedRemovedQuestions);
// // // // // // // // //       } catch (error) {
// // // // // // // // //         console.error('Error fetching data:', error);
// // // // // // // // //       }
// // // // // // // // //     };

// // // // // // // // //     fetchData();
// // // // // // // // //   }, [calculateProgress]);

// // // // // // // // //   const handleInputChange = (event, questionId) => {
// // // // // // // // //     const { value } = event.target;
// // // // // // // // //     const updatedResponses = {
// // // // // // // // //       ...formResponses,
// // // // // // // // //       [questionId]: { ...formResponses[questionId], response: value },
// // // // // // // // //     };
// // // // // // // // //     setFormResponses(updatedResponses);
// // // // // // // // //     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// // // // // // // // //     updateProgress(calculateProgress(data, updatedResponses, removedQuestions));
// // // // // // // // //   };

// // // // // // // // //   const handleCommentChange = (event, questionId) => {
// // // // // // // // //     const { value } = event.target;
// // // // // // // // //     setComments((prev) => ({ ...prev, [questionId]: value }));
// // // // // // // // //     const updatedResponses = {
// // // // // // // // //       ...formResponses,
// // // // // // // // //       [questionId]: {
// // // // // // // // //         ...formResponses[questionId],
// // // // // // // // //         comment: value,
// // // // // // // // //         response: formResponses[questionId]?.response || '',
// // // // // // // // //       },
// // // // // // // // //     };
// // // // // // // // //     setFormResponses(updatedResponses);
// // // // // // // // //     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// // // // // // // // //   };

// // // // // // // // //   const handleImageChange = (event, questionId) => {
// // // // // // // // //     const files = Array.from(event.target.files);
// // // // // // // // //     setImages((prev) => ({ ...prev, [questionId]: [...(prev[questionId] || []), ...files] }));
// // // // // // // // //     localStorage.setItem(
// // // // // // // // //       "auditResponses",
// // // // // // // // //       JSON.stringify({
// // // // // // // // //         ...formResponses,
// // // // // // // // //         [questionId]: {
// // // // // // // // //           ...formResponses[questionId],
// // // // // // // // //           images: [...(formResponses[questionId]?.images || []), ...files.map((file) => file.name)],
// // // // // // // // //         },
// // // // // // // // //       })
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const handleDuplicate = (questionObj) => {
// // // // // // // // //     const { id } = questionObj;
// // // // // // // // //     const duplicateId = `${id}-duplicate-${Date.now()}`;
// // // // // // // // //     setDuplicates((prev) => ({
// // // // // // // // //       ...prev,
// // // // // // // // //       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
// // // // // // // // //     }));
// // // // // // // // //   };

// // // // // // // // //   const handleRemoveQuestion = (sousChapitre, questionId, questionTitle) => {
// // // // // // // // //     const updatedRemovedQuestions = {
// // // // // // // // //       ...removedQuestions,
// // // // // // // // //       [sousChapitre]: [
// // // // // // // // //         ...(removedQuestions[sousChapitre] || []),
// // // // // // // // //         { id: questionId, title: questionTitle },
// // // // // // // // //       ],
// // // // // // // // //     };
// // // // // // // // //     setRemovedQuestions(updatedRemovedQuestions);
// // // // // // // // //     localStorage.setItem("removedQuestions", JSON.stringify(updatedRemovedQuestions));
// // // // // // // // //   };

// // // // // // // // //   const handleRemoveDuplicate = (duplicateId) => {
// // // // // // // // //     setDuplicates((prev) => {
// // // // // // // // //       const updatedDuplicates = {};
// // // // // // // // //       Object.keys(prev).forEach((questionId) => {
// // // // // // // // //         updatedDuplicates[questionId] = prev[questionId].filter(
// // // // // // // // //           (duplicate) => duplicate.duplicateId !== duplicateId
// // // // // // // // //         );
// // // // // // // // //         if (updatedDuplicates[questionId].length === 0) delete updatedDuplicates[questionId];
// // // // // // // // //       });
// // // // // // // // //       return updatedDuplicates;
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const handleReAddQuestion = (sousChapitre, questionId) => {
// // // // // // // // //     const updatedRemovedQuestions = {
// // // // // // // // //       ...removedQuestions,
// // // // // // // // //       [sousChapitre]: removedQuestions[sousChapitre].filter((item) => item.id !== questionId),
// // // // // // // // //     };
// // // // // // // // //     if (updatedRemovedQuestions[sousChapitre].length === 0) delete updatedRemovedQuestions[sousChapitre];
// // // // // // // // //     setRemovedQuestions(updatedRemovedQuestions);
// // // // // // // // //     localStorage.setItem("removedQuestions", JSON.stringify(updatedRemovedQuestions));
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div className="container-fluid">
// // // // // // // // //       <div className="row">
// // // // // // // // //         <div className="col-md-3">
// // // // // // // // //           {data && <Sidebar data={calculateProgress(data, formResponses, removedQuestions)} />}
// // // // // // // // //         </div>

// // // // // // // // //         <div className="col-md-9">
// // // // // // // // //           <h2>Grilles de l'audit</h2>
// // // // // // // // //           {data && Object.entries(data).map(([chapitre, sousChapitres]) => (
// // // // // // // // //             <div key={chapitre}>
// // // // // // // // //               <h3>{chapitre}</h3>
// // // // // // // // //               {sousChapitres && Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// // // // // // // // //                 <div key={sousChapitre} id={sousChapitre} className="mb-3">
// // // // // // // // //                   <h4 className="paragraphe-header">
// // // // // // // // //                     <button
// // // // // // // // //                       type="button"
// // // // // // // // //                       className="btn btn-link"
// // // // // // // // //                       onClick={() => setExpandedSousChapitres((prev) => ({
// // // // // // // // //                         ...prev,
// // // // // // // // //                         [sousChapitre]: !prev[sousChapitre],
// // // // // // // // //                       }))}
// // // // // // // // //                     >
// // // // // // // // //                       {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
// // // // // // // // //                     </button>
// // // // // // // // //                   </h4>

// // // // // // // // //                   {/* Render Removed Questions */}
// // // // // // // // //                   {removedQuestions[sousChapitre]?.length > 0 && (
// // // // // // // // //                     <div style={{ backgroundColor: '#f8d7da', padding: '10px', marginBottom: '10px' }}>
// // // // // // // // //                       <h5>Removed Questions</h5>
// // // // // // // // //                       {removedQuestions[sousChapitre].map((removed) => (
// // // // // // // // //                         <div key={removed.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
// // // // // // // // //                           <span>{removed.title}</span>
// // // // // // // // //                           <button
// // // // // // // // //                             type="button"
// // // // // // // // //                             className="btn btn-link"
// // // // // // // // //                             onClick={() => handleReAddQuestion(sousChapitre, removed.id)}
// // // // // // // // //                             style={{ color: '#007bff' }}
// // // // // // // // //                           >
// // // // // // // // //                             Re-add
// // // // // // // // //                           </button>
// // // // // // // // //                         </div>
// // // // // // // // //                       ))}
// // // // // // // // //                     </div>
// // // // // // // // //                   )}

// // // // // // // // //                   {/* Render Active Questions */}
// // // // // // // // //                   {expandedSousChapitres[sousChapitre] && paragraphes && Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// // // // // // // // //                     <div key={`${sousChapitre}-${paragraphe}`} className="mb-2">
// // // // // // // // //                       <h5>{paragraphe}</h5>
// // // // // // // // //                       {sousParagraphes && Object.entries(sousParagraphes).map(([_, questions]) =>
// // // // // // // // //                         questions
// // // // // // // // //                           .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
// // // // // // // // //                           .map((questionObj, index) =>
// // // // // // // // //                             questionObj.duplicateId ? (
// // // // // // // // //                               <DuplicateQuestionComponent
// // // // // // // // //                                 key={questionObj.duplicateId}
// // // // // // // // //                                 duplicate={questionObj}
// // // // // // // // //                                 index={index}
// // // // // // // // //                                 formResponses={formResponses}
// // // // // // // // //                                 handleInputChange={handleInputChange}
// // // // // // // // //                                 handleCommentChange={handleCommentChange}
// // // // // // // // //                                 handleImageChange={handleImageChange}
// // // // // // // // //                                 handleRemoveDuplicate={() => handleRemoveDuplicate(questionObj.duplicateId)}
// // // // // // // // //                                 handleRemove={handleRemoveQuestion}
// // // // // // // // //                                 comments={comments}
// // // // // // // // //                                 images={images}
// // // // // // // // //                               />
// // // // // // // // //                             ) : (
// // // // // // // // //                               <QuestionComponent
// // // // // // // // //                                 key={questionObj.id}
// // // // // // // // //                                 questionObj={questionObj}
// // // // // // // // //                                 formResponses={formResponses}
// // // // // // // // //                                 handleInputChange={handleInputChange}
// // // // // // // // //                                 handleCommentChange={handleCommentChange}
// // // // // // // // //                                 handleImageChange={handleImageChange}
// // // // // // // // //                                 handleDuplicate={() => handleDuplicate(questionObj)}
// // // // // // // // //                                 handleRemove={() => handleRemoveQuestion(sousChapitre, questionObj.id, questionObj.question)}
// // // // // // // // //                                 comments={comments}
// // // // // // // // //                                 images={images}
// // // // // // // // //                               />
// // // // // // // // //                             )
// // // // // // // // //                           )
// // // // // // // // //                       )}
// // // // // // // // //                     </div>
// // // // // // // // //                   ))}
// // // // // // // // //                 </div>
// // // // // // // // //               ))}
// // // // // // // // //             </div>
// // // // // // // // //           ))}
// // // // // // // // //           <button type="submit" className="btn btn-primary">Envoyer</button>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default AuditDetail;

// // // import React, { useEffect, useState, useCallback } from 'react';
// // // import axios from 'axios';
// // // import Sidebar from './Sidebar';
// // // import QuestionComponent from './QuestionComponent';

// // // function AuditDetail({ updateProgress }) {
// // //   const [data, setData] = useState(null);
// // //   const [formResponses, setFormResponses] = useState({});
// // //   const [comments, setComments] = useState({});
// // //   const [images, setImages] = useState({});
// // //   const [duplicates, setDuplicates] = useState({});
// // //   const [removedQuestions, setRemovedQuestions] = useState({});
// // //   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const response = await axios.get('/api/audit_detail');
// // //         setData(response.data);
// // //         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
// // //         const storedRemovedQuestions = JSON.parse(localStorage.getItem("removedQuestions")) || {};

// // //         if (storedResponses) setFormResponses(storedResponses);
// // //         setRemovedQuestions(storedRemovedQuestions);
// // //       } catch (error) {
// // //         console.error('Error fetching data:', error);
// // //       }
// // //     };
// // //     fetchData();
// // //   }, []);

// // //   const handleInputChange = (event, questionId) => {
// // //         const { value } = event.target;
// // //         const updatedResponses = {
// // //           ...formResponses,
// // //           [questionId]: { ...formResponses[questionId], response: value },
// // //         };
// // //         setFormResponses(updatedResponses);
// // //         localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// // //         updateProgress(calculateProgress(data, updatedResponses, removedQuestions));
// // //       };
// // //   const handleCommentChange = (event, questionId) => { /* Update comments logic */ };
// // //   const handleImageChange = (event, questionId) => { /* Update images logic */ };
// // //   const handleDuplicate = (questionObj) => { /* Duplicate handling */ };
// // //   const handleRemoveQuestion = (sousChapitre, questionId, questionTitle) => { /* Removing question logic */ };
// // //   const handleRemoveDuplicate = (duplicateId) => { /* Removing duplicate logic */ };
// // //   const handleReAddQuestion = (sousChapitre, questionId) => { /* Re-adding question logic */ };

// // //   return (
// // //     <div className="container-fluid">
// // //       <div className="row">
// // //         <div className="col-md-3">
// // //           {data && <Sidebar
// // //             data={data}
// // //             formResponses={formResponses}
// // //             removedQuestions={removedQuestions}
// // //           />}
// // //         </div>
// // //         <div className="col-md-9">
// // //           <h2>Grilles de l'audit</h2>
// // //           {data && Object.entries(data).map(([chapitre, sousChapitres]) => (
// // //             <div key={chapitre}>
// // //               <h3>{chapitre}</h3>
// // //               {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// // //                 <div key={sousChapitre} id={sousChapitre} className="mb-3">
// // //                   <h4 className="paragraphe-header">
// // //                     <button
// // //                       type="button"
// // //                       className="btn btn-link"
// // //                       onClick={() => setExpandedSousChapitres((prev) => ({
// // //                         ...prev,
// // //                         [sousChapitre]: !prev[sousChapitre],
// // //                       }))}
// // //                     >
// // //                       {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
// // //                     </button>
// // //                   </h4>

// // //                   {/* Removed Questions Section */}
// // //                   {removedQuestions[sousChapitre]?.length > 0 && (
// // //                     <div style={{ backgroundColor: '#f8d7da', padding: '10px', marginBottom: '10px' }}>
// // //                       <h5>Removed Questions</h5>
// // //                       {removedQuestions[sousChapitre].map((removed) => (
// // //                         <div key={removed.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
// // //                           <span>{removed.title}</span>
// // //                           <button
// // //                             type="button"
// // //                             className="btn btn-link"
// // //                             onClick={() => handleReAddQuestion(sousChapitre, removed.id)}
// // //                             style={{ color: '#007bff' }}
// // //                           >
// // //                             Re-add
// // //                           </button>
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   )}

// // //                   {/* Active Questions */}
// // //                   {expandedSousChapitres[sousChapitre] &&
// // //                     Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// // //                       <div key={`${sousChapitre}-${paragraphe}`} className="mb-2">
// // //                         <h5>{paragraphe}</h5>
// // //                         {Object.entries(sousParagraphes).map(([_, questions]) =>
// // //                           questions
// // //                             .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
// // //                             .map((questionObj, index) => (
// // //                               <QuestionComponent
// // //                                 key={questionObj.id}
// // //                                 questionObj={questionObj}
// // //                                 formResponses={formResponses}
// // //                                 handleInputChange={handleInputChange}
// // //                                 handleCommentChange={handleCommentChange}
// // //                                 handleImageChange={handleImageChange}
// // //                                 handleDuplicate={handleDuplicate}
// // //                                 handleRemove={() => handleRemoveQuestion(sousChapitre, questionObj.id, questionObj.question)}
// // //                                 comments={comments}
// // //                                 images={images}
// // //                                 setImages={setImages}
// // //                               />
// // //                             ))
// // //                         )}
// // //                       </div>
// // //                     ))}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           ))}
// // //           <button type="submit" className="btn btn-primary">Envoyer</button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default AuditDetail;


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import Sidebar from './Sidebar';
// // import QuestionComponent from './QuestionComponent';

// // function AuditDetail({ updateProgress }) {
// //   const [data, setData] = useState(null);
// //   const [formResponses, setFormResponses] = useState({});
// //   const [comments, setComments] = useState({});
// //   const [images, setImages] = useState({});
// //   const [duplicates, setDuplicates] = useState({});
// //   const [removedQuestions, setRemovedQuestions] = useState({});
// //   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get('/api/audit_detail');
// //         setData(response.data);
// //         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
// //         const storedRemovedQuestions = JSON.parse(localStorage.getItem("removedQuestions")) || {};

// //         if (storedResponses) setFormResponses(storedResponses);
// //         setRemovedQuestions(storedRemovedQuestions);
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   const handleInputChange = (event, questionId) => {
// //     const { value } = event.target;
// //     const updatedResponses = {
// //       ...formResponses,
// //       [questionId]: { ...formResponses[questionId], response: value },
// //     };
// //     setFormResponses(updatedResponses);
// //     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// //     // `updateProgress` can be used here if it triggers any other necessary updates.
// //     updateProgress();
// //   };


// //   const handleCommentChange = (event, questionId) => {
// //     const { value } = event.target;
// //     setComments((prev) => ({ ...prev, [questionId]: value }));
// //     const updatedResponses = {
// //       ...formResponses,
// //       [questionId]: {
// //         ...formResponses[questionId],
// //         comment: value,
// //         response: formResponses[questionId]?.response || '',
// //       },
// //     };
// //     setFormResponses(updatedResponses);
// //     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// //   };

// //   const handleImageChange = (event, questionId) => {
// //     const files = Array.from(event.target.files);
// //     setImages((prev) => ({ ...prev, [questionId]: [...(prev[questionId] || []), ...files] }));
// //     localStorage.setItem(
// //       "auditResponses",
// //       JSON.stringify({
// //         ...formResponses,
// //         [questionId]: {
// //           ...formResponses[questionId],
// //           images: [...(formResponses[questionId]?.images || []), ...files.map((file) => file.name)],
// //         },
// //       })
// //     );
// //   };

// //   const handleDuplicate = (questionObj) => {
// //     const { id } = questionObj;
// //     const duplicateId = `${id}-duplicate-${Date.now()}`;
// //     setDuplicates((prev) => ({
// //       ...prev,
// //       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
// //     }));
// //   };

// //   const handleRemoveQuestion = (sousChapitre, questionId, questionTitle) => {
// //     const updatedRemovedQuestions = {
// //       ...removedQuestions,
// //       [sousChapitre]: [
// //         ...(removedQuestions[sousChapitre] || []),
// //         { id: questionId, title: questionTitle },
// //       ],
// //     };
// //     setRemovedQuestions(updatedRemovedQuestions);
// //     localStorage.setItem("removedQuestions", JSON.stringify(updatedRemovedQuestions));
// //   };

// //   const handleRemoveDuplicate = (duplicateId) => {
// //     setDuplicates((prev) => {
// //       const updatedDuplicates = {};
// //       Object.keys(prev).forEach((questionId) => {
// //         updatedDuplicates[questionId] = prev[questionId].filter(
// //           (duplicate) => duplicate.duplicateId !== duplicateId
// //         );
// //         if (updatedDuplicates[questionId].length === 0) delete updatedDuplicates[questionId];
// //       });
// //       return updatedDuplicates;
// //     });
// //   };

// //   const handleReAddQuestion = (sousChapitre, questionId) => {
// //     const updatedRemovedQuestions = {
// //       ...removedQuestions,
// //       [sousChapitre]: removedQuestions[sousChapitre].filter((item) => item.id !== questionId),
// //     };
// //     if (updatedRemovedQuestions[sousChapitre].length === 0) delete updatedRemovedQuestions[sousChapitre];
// //     setRemovedQuestions(updatedRemovedQuestions);
// //     localStorage.setItem("removedQuestions", JSON.stringify(updatedRemovedQuestions));
// //   };


// //   return (
// //     <div className="container-fluid">
// //       <div className="row">
// //         <div className="col-md-3">
// //           {data && (
// //             <Sidebar
// //               data={data}
// //               formResponses={formResponses}
// //               removedQuestions={removedQuestions}
// //             />
// //           )}
// //         </div>
// //         <div className="col-md-9">
// //           <h2>Grilles de l'audit</h2>
// //           {data &&
// //             Object.entries(data).map(([chapitre, sousChapitres]) => (
// //               <div key={chapitre}>
// //                 <h3>{chapitre}</h3>
// //                 {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// //                   <div key={sousChapitre} id={sousChapitre} className="mb-3">
// //                     <h4 className="paragraphe-header">
// //                       <button
// //                         type="button"
// //                         className="btn btn-link"
// //                         onClick={() => setExpandedSousChapitres((prev) => ({
// //                           ...prev,
// //                           [sousChapitre]: !prev[sousChapitre],
// //                         }))}
// //                       >
// //                         {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
// //                       </button>
// //                     </h4>

// //                     {/* Removed Questions Section */}
// //                     {removedQuestions[sousChapitre]?.length > 0 && (
// //                       <div style={{ backgroundColor: '#f8d7da', padding: '10px', marginBottom: '10px' }}>
// //                         <h5>Removed Questions</h5>
// //                         {removedQuestions[sousChapitre].map((removed) => (
// //                           <div key={removed.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
// //                             <span>{removed.title}</span>
// //                             <button
// //                               type="button"
// //                               className="btn btn-link"
// //                               onClick={() => handleReAddQuestion(sousChapitre, removed.id)}
// //                               style={{ color: '#007bff' }}
// //                             >
// //                               Re-add
// //                             </button>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}

// //                     {/* Active Questions */}
// //                     {expandedSousChapitres[sousChapitre] &&
// //                       Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// //                         <div key={`${sousChapitre}-${paragraphe}`} className="mb-2">
// //                           <h5>{paragraphe}</h5>
// //                           {Object.entries(sousParagraphes).map(([_, questions]) =>
// //                             questions
// //                               .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
// //                               .map((questionObj) => (
// //                                 <QuestionComponent
// //                                   key={questionObj.id}
// //                                   questionObj={questionObj}
// //                                   formResponses={formResponses}
// //                                   handleInputChange={handleInputChange}
// //                                   handleCommentChange={handleCommentChange}
// //                                   handleImageChange={handleImageChange}
// //                                   handleDuplicate={handleDuplicate}
// //                                   handleRemove={() => handleRemoveQuestion(sousChapitre, questionObj.id, questionObj.question)}
// //                                   comments={comments}
// //                                   images={images}
// //                                   setImages={setImages}
// //                                 />
// //                               ))
// //                           )}
// //                         </div>
// //                       ))}
// //                   </div>
// //                 ))}
// //               </div>
// //             ))}
// //           <button type="submit" className="btn btn-primary">Envoyer</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default AuditDetail;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import QuestionComponent from './QuestionComponent';
// import calculateProgress from './functions/calculateProgress';

// function AuditDetail({ updateProgress }) {
//   const [data, setData] = useState(null);
//   const [formResponses, setFormResponses] = useState({});
//   const [comments, setComments] = useState({});
//   const [images, setImages] = useState({});
//   const [duplicates, setDuplicates] = useState({});
//   const [removedQuestions, setRemovedQuestions] = useState({});
//   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});

//   // Call updateProgress in useEffect when dependencies change
//   useEffect(() => {
//     if (data) {
//       updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
//     }
//   }, [data, formResponses, removedQuestions, duplicates, updateProgress]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/api/audit_detail');
//         setData(response.data);
//         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
//         const storedRemovedQuestions = JSON.parse(localStorage.getItem("removedQuestions")) || {};

//         if (storedResponses) setFormResponses(storedResponses);
//         setRemovedQuestions(storedRemovedQuestions);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleInputChange = (event, questionId) => {
//     const { value } = event.target;
//     const updatedResponses = {
//       ...formResponses,
//       [questionId]: { ...formResponses[questionId], response: value },
//     };
//     setFormResponses(updatedResponses);
//     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
//   };

//   const handleDuplicate = (questionObj) => {
//     const { id } = questionObj;
//     const duplicateId = `${id}-duplicate-${Date.now()}`;
//     setDuplicates((prev) => ({
//       ...prev,
//       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
//     }));
//   };

//   const handleRemoveDuplicate = (duplicateId) => {
//     setDuplicates((prev) => {
//       const updatedDuplicates = {};
//       Object.keys(prev).forEach((questionId) => {
//         updatedDuplicates[questionId] = prev[questionId].filter(
//           (duplicate) => duplicate.duplicateId !== duplicateId
//         );
//         if (updatedDuplicates[questionId].length === 0) delete updatedDuplicates[questionId];
//       });
//       return updatedDuplicates;
//     });
//   };


//   const handleCommentChange = (event, questionId) => {
//     const { value } = event.target;
//     setComments((prev) => ({ ...prev, [questionId]: value }));
//     const updatedResponses = {
//       ...formResponses,
//       [questionId]: {
//         ...formResponses[questionId],
//         comment: value,
//         response: formResponses[questionId]?.response || '',
//       },
//     };
//     setFormResponses(updatedResponses);
//     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
//   };

//   const handleImageChange = (event, questionId) => {
//     const files = Array.from(event.target.files);
//     setImages((prev) => ({ ...prev, [questionId]: [...(prev[questionId] || []), ...files] }));
//     localStorage.setItem(
//       "auditResponses",
//       JSON.stringify({
//         ...formResponses,
//         [questionId]: {
//           ...formResponses[questionId],
//           images: [...(formResponses[questionId]?.images || []), ...files.map((file) => file.name)],
//         },
//       })
//     );
//   };


//   const handleRemoveQuestion = (sousChapitre, questionId, questionTitle) => {
//     const updatedRemovedQuestions = {
//       ...removedQuestions,
//       [sousChapitre]: [
//         ...(removedQuestions[sousChapitre] || []),
//         { id: questionId, title: questionTitle },
//       ],
//     };
//     setRemovedQuestions(updatedRemovedQuestions);
//     localStorage.setItem("removedQuestions", JSON.stringify(updatedRemovedQuestions));
//   };

//   const handleReAddQuestion = (sousChapitre, questionId) => {
//     const updatedRemovedQuestions = {
//       ...removedQuestions,
//       [sousChapitre]: removedQuestions[sousChapitre].filter((item) => item.id !== questionId),
//     };
//     if (updatedRemovedQuestions[sousChapitre].length === 0) delete updatedRemovedQuestions[sousChapitre];
//     setRemovedQuestions(updatedRemovedQuestions);
//     localStorage.setItem("removedQuestions", JSON.stringify(updatedRemovedQuestions));
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-3">
//           {data && (
//             <Sidebar
//               data={data}
//               formResponses={formResponses}
//               removedQuestions={removedQuestions}
//               duplicates={duplicates}
//             />
//           )}
//         </div>
//         <div className="col-md-9">
//           <h2>Grilles de l'audit</h2>
//           {data &&
//             Object.entries(data).map(([chapitre, sousChapitres]) => (
//               <div key={chapitre}>
//                 <h3>{chapitre}</h3>
//                 {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
//                   <div key={sousChapitre} id={sousChapitre} className="mb-3">
//                     <h4 className="paragraphe-header">
//                       <button
//                         type="button"
//                         className="btn btn-link"
//                         onClick={() =>
//                           setExpandedSousChapitres((prev) => ({
//                             ...prev,
//                             [sousChapitre]: !prev[sousChapitre],
//                           }))
//                         }
//                       >
//                         {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
//                       </button>
//                     </h4>

//                     {expandedSousChapitres[sousChapitre] &&
//                       Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
//                         <div key={`${sousChapitre}-${paragraphe}`} className="mb-2">
//                           <h5>{paragraphe}</h5>
//                           {Object.entries(sousParagraphes).map(([_, questions]) =>
//                             questions
//                               .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
//                               .map((questionObj) => (
//                                 <React.Fragment key={questionObj.id}>
//                                   <QuestionComponent
//                                     questionObj={questionObj}
//                                     formResponses={formResponses}
//                                     handleInputChange={handleInputChange}
//                                     handleDuplicate={handleDuplicate}
//                                     handleRemove={() =>
//                                       handleRemoveQuestion(sousChapitre, questionObj.id, questionObj.question)
//                                     }
//                                     comments={comments}
//                                     images={images}
//                                     setImages={setImages}
//                                   />
//                                   {duplicates[questionObj.id]?.map((duplicate) => (
//                                     <QuestionComponent
//                                       key={duplicate.duplicateId}
//                                       questionObj={duplicate}
//                                       formResponses={formResponses}
//                                       handleInputChange={handleInputChange}
//                                       handleDuplicate={handleDuplicate}
//                                       handleRemove={() => handleRemoveDuplicate(duplicate.duplicateId)}
//                                       comments={comments}
//                                       images={images}
//                                       setImages={setImages}
//                                     />
//                                   ))}
//                                 </React.Fragment>
//                               ))
//                           )}
//                         </div>
//                       ))}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           <button type="submit" className="btn btn-primary">Envoyer</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuditDetail;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import QuestionComponent from './QuestionComponent';
import calculateProgress from './functions/calculateProgress';

function AuditDetail({ updateProgress }) {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [comments, setComments] = useState({});
  const [images, setImages] = useState({});
  const [duplicates, setDuplicates] = useState({});
  const [removedQuestions, setRemovedQuestions] = useState({});
  const [expandedSousChapitres, setExpandedSousChapitres] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/audit_detail');
        setData(response.data);
        const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
        const storedRemovedQuestions = JSON.parse(localStorage.getItem("removedQuestions")) || {};

        if (storedResponses) setFormResponses(storedResponses);
        setRemovedQuestions(storedRemovedQuestions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    const duplicateId = `${id}-duplicate-${Date.now()}`;

    setDuplicates((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
    }));
  };

  // Update progress when duplicates, formResponses, or removedQuestions change
  useEffect(() => {
    if (data) {
      const progress = calculateProgress(data, formResponses, removedQuestions, duplicates);
      updateProgress(progress);
    }
  }, [data, formResponses, removedQuestions, duplicates, updateProgress]);

  const handleRemoveDuplicate = (duplicateId) => {
    setDuplicates((prev) => {
      const updatedDuplicates = {};
      Object.keys(prev).forEach((questionId) => {
        updatedDuplicates[questionId] = prev[questionId].filter(
          (duplicate) => duplicate.duplicateId !== duplicateId
        );
        if (updatedDuplicates[questionId].length === 0) delete updatedDuplicates[questionId];
      });
      return updatedDuplicates;
    });
  };

    const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...formResponses,
      [questionId]: { ...formResponses[questionId], response: value },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
  };
  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments((prev) => ({ ...prev, [questionId]: value }));
    const updatedResponses = {
      ...formResponses,
      [questionId]: {
        ...formResponses[questionId],
        comment: value,
        response: formResponses[questionId]?.response || '',
      },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
  };

  const handleImageChange = (event, questionId) => {
    const files = Array.from(event.target.files);
    setImages((prev) => ({ ...prev, [questionId]: [...(prev[questionId] || []), ...files] }));
    localStorage.setItem(
      "auditResponses",
      JSON.stringify({
        ...formResponses,
        [questionId]: {
          ...formResponses[questionId],
          images: [...(formResponses[questionId]?.images || []), ...files.map((file) => file.name)],
        },
      })
    );
  };


  const handleRemoveQuestion = (sousChapitre, questionObj) => {
    const questionId = questionObj.id || questionObj.duplicateId;

    if (questionObj.duplicateId) {
      // For duplicates
      setDuplicates((prev) => {
        const updatedDuplicates = { ...prev };
        updatedDuplicates[questionObj.id] = updatedDuplicates[questionObj.id].filter(
          (duplicate) => duplicate.duplicateId !== questionObj.duplicateId
        );
        if (updatedDuplicates[questionObj.id].length === 0) delete updatedDuplicates[questionObj.id];
        return updatedDuplicates;
      });
    } else {
      // For original questions
      setRemovedQuestions((prev) => ({
        ...prev,
        [sousChapitre]: [
          ...(prev[sousChapitre] || []),
          { id: questionId, title: questionObj.question },
        ],
      }));
    }

    // Recalculate and update progress
    updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
    localStorage.setItem("removedQuestions", JSON.stringify(removedQuestions));
  };

  // Function to re-add an original question
  const handleReAddQuestion = (sousChapitre, questionId) => {
    setRemovedQuestions((prev) => ({
      ...prev,
      [sousChapitre]: prev[sousChapitre].filter((item) => item.id !== questionId),
    }));
    updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
  };


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          {data && (
            <Sidebar
              data={data}
              formResponses={formResponses}
              removedQuestions={removedQuestions}
              duplicates={duplicates} // Pass duplicates to Sidebar
            />
          )}
        </div>
        <div className="col-md-9">
          <h2>Grilles de l'audit</h2>
          {data &&
            Object.entries(data).map(([chapitre, sousChapitres]) => (
              <div key={chapitre}>
                <h3>{chapitre}</h3>
                {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
                  <div key={sousChapitre} id={sousChapitre} className="mb-3">
                    <h4 className="paragraphe-header">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() =>
                          setExpandedSousChapitres((prev) => ({
                            ...prev,
                            [sousChapitre]: !prev[sousChapitre],
                          }))
                        }
                      >
                        {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
                      </button>
                    </h4>

                    {expandedSousChapitres[sousChapitre] &&
                      Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
                        <div key={`${sousChapitre}-${paragraphe}`} className="mb-2">
                          <h5>{paragraphe}</h5>
                          {Object.entries(sousParagraphes).map(([_, questions]) =>
                            questions
                              .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
                              .map((questionObj) => (
                                <React.Fragment key={questionObj.id}>
                                  <QuestionComponent
                                    questionObj={questionObj}
                                    handleRemove={() => handleRemoveQuestion(sousChapitre, questionObj)}
                                    formResponses={formResponses}
                                    handleInputChange={handleInputChange}
                                    handleCommentChange={handleCommentChange}
                                    handleImageChange={handleImageChange}
                                    handleDuplicate={handleDuplicate}
                                    comments={comments}
                                    images={images}
                                    setImages={setImages}
                                  />

                                  {duplicates[questionObj.id]?.map((duplicate) => (
                                    <QuestionComponent
                                      key={duplicate.duplicateId}
                                      questionObj={duplicate}
                                      handleRemove={() => handleRemoveDuplicate(duplicate.duplicateId)} // Pass specific removal for duplicates
                                      formResponses={formResponses}
                                      handleInputChange={handleInputChange}
                                      handleCommentChange={handleCommentChange}
                                      handleImageChange={handleImageChange}
                                      handleDuplicate={handleDuplicate}
                                      comments={comments}
                                      images={images}
                                      setImages={setImages}
                                    />
                                  ))}
                                </React.Fragment>
                              ))
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          <button type="submit" className="btn btn-primary">Envoyer</button>
        </div>
      </div>
    </div>
  );
}

export default AuditDetail;
