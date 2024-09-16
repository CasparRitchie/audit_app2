// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import QuestionComponent from './QuestionComponent';
// // import DuplicateQuestionComponent from './DuplicateQuestionComponent';

// // function AuditDetail({ updateProgress }) {
// //   const [data, setData] = useState(null);
// //   const [formResponses, setFormResponses] = useState({});
// //   const [comments, setComments] = useState({});
// //   const [images, setImages] = useState({});
// //   const [duplicates, setDuplicates] = useState({});
// //   const [expandedSousChapitres, setExpandedSousChapitres] = useState({}); // Track expanded/collapsed state
// //   const [auditId, setAuditId] = useState(null);
// //   const [progress, setProgress] = useState(0); // Track overall progress

// //   useEffect(() => {
// //     axios.get('/api/audit_detail')
// //       .then(response => {
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
// //         updateProgressBar(response.data);
// //       })
// //       .catch(error => console.error('Error fetching data:', error));
// //   }, []);

// //   const updateProgressBar = (auditData) => {
// //     let totalQuestions = 0;
// //     let answeredQuestions = 0;

// //     Object.entries(auditData).forEach(([_, sousChapitres]) => {
// //       Object.entries(sousChapitres).forEach(([_, paragraphes]) => {
// //         Object.entries(paragraphes).forEach(([_, sousParagraphes]) => {
// //           Object.entries(sousParagraphes).forEach(([_, questions]) => {
// //             totalQuestions += questions.length;
// //             questions.forEach((question) => {
// //               if (formResponses[question.id]) {
// //                 answeredQuestions += 1;
// //               }
// //               const duplicatesForQuestion = duplicates[question.id] || [];
// //               totalQuestions += duplicatesForQuestion.length;
// //               duplicatesForQuestion.forEach((duplicate) => {
// //                 if (formResponses[duplicate.duplicateId]) {
// //                   answeredQuestions += 1;
// //                 }
// //               });
// //             });
// //           });
// //         });
// //       });
// //     });

// //     const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);
// //     setProgress(completionRate);
// //     updateProgress({ totalQuestions, answeredQuestions });
// //   };

// //   const handleInputChange = (event, questionId) => {
// //     const { value } = event.target;
// //     setFormResponses(prev => ({
// //       ...prev,
// //       [questionId]: value,
// //     }));
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [questionId]: { response: value }
// //     }));
// //     updateProgressBar(data); // Update progress bar after input change
// //   };

// //   const handleCommentChange = (event, questionId) => {
// //     const { value } = event.target;
// //     setComments(prev => ({
// //       ...prev,
// //       [questionId]: value,
// //     }));
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [`comment_${questionId}`]: { comment: value }
// //     }));
// //   };

// //   const handleImageChange = (event, questionId) => {
// //     const file = event.target.files[0];
// //     setImages(prev => ({
// //       ...prev,
// //       [questionId]: file,
// //     }));
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [`image_${questionId}`]: { imageName: file.name }
// //     }));
// //   };

// //   const handleDuplicate = (questionObj) => {
// //     const { id } = questionObj;
// //     const duplicateId = `${id}-duplicate-${Date.now()}`;
// //     setDuplicates(prev => ({
// //       ...prev,
// //       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
// //     }));
// //     updateProgressBar(data); // Update progress bar after duplication
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     const formData = new FormData();
// //     formData.append('auditId', auditId);

// //     Object.entries(formResponses).forEach(([questionId, response]) => {
// //       formData.append(`responses[${questionId}]`, response);
// //     });

// //     Object.entries(comments).forEach(([questionId, comment]) => {
// //       formData.append(`comments[${questionId}]`, comment);
// //     });

// //     Object.entries(images).forEach(([questionId, image]) => {
// //       if (image) {
// //         formData.append(`images[${questionId}]`, image);
// //       }
// //     });

// //     axios.post('/api/submit', formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' },
// //     })
// //       .then(() => {
// //         alert('Audit detail submitted successfully!');
// //         localStorage.removeItem("auditResponses");
// //         localStorage.removeItem("auditId");
// //       })
// //       .catch(error => console.error('Error submitting audit detail:', error));
// //   };

// //   const toggleSousChapitre = (sousChapitre) => {
// //     setExpandedSousChapitres(prevState => ({
// //       ...prevState,
// //       [sousChapitre]: !prevState[sousChapitre],
// //     }));
// //   };

// //   if (!data) {
// //     return <div>Loading audit details...</div>;
// //   }

// //   return (
// //     <div>
// //       <h2>Audit Detail</h2>

// //       {/* Progress Bar */}
// //       <div className="progress mb-3">
// //         <div
// //           className="progress-bar"
// //           role="progressbar"
// //           style={{ width: `${progress}%` }}
// //           aria-valuenow={progress}
// //           aria-valuemin="0"
// //           aria-valuemax="100"
// //         >
// //           {progress}% Completed
// //         </div>
// //       </div>

// //       <form onSubmit={handleSubmit}>
// //         {Object.entries(data).map(([chapitre, sousChapitres]) => (
// //           <div key={chapitre}>
// //             <h3>{chapitre}</h3>
// //             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// //               <div key={sousChapitre} className="mb-3">
// //                 <h4>
// //                   <button
// //                     type="button"
// //                     className="btn btn-link"
// //                     onClick={() => toggleSousChapitre(sousChapitre)}
// //                   >
// //                     {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
// //                   </button>
// //                 </h4>
// //                 {expandedSousChapitres[sousChapitre] && (
// //                   <div>
// //                     {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// //                       <div key={paragraphe} className="mb-2">
// //                         <h5>{paragraphe}</h5>
// //                         {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
// //                           <div key={sousParagraphe} className="card mb-2">
// //                             <div className="card-body">
// //                               {questions.map((questionObj) => (
// //                                 <div key={questionObj.id}>
// //                                   <QuestionComponent
// //                                     questionObj={questionObj}
// //                                     formResponses={formResponses}
// //                                     handleInputChange={handleInputChange}
// //                                     handleCommentChange={handleCommentChange}
// //                                     handleImageChange={handleImageChange}
// //                                     handleDuplicate={handleDuplicate}
// //                                     comments={comments}
// //                                     images={images}
// //                                   />
// //                                   {(duplicates[questionObj.id] || []).map((duplicate, index) => (
// //                                     <DuplicateQuestionComponent
// //                                       key={duplicate.duplicateId}
// //                                       duplicate={duplicate}
// //                                       index={index}
// //                                       formResponses={formResponses}
// //                                       handleInputChange={handleInputChange}
// //                                       handleCommentChange={handleCommentChange}
// //                                       handleImageChange={handleImageChange}
// //                                       comments={comments}
// //                                       images={images}
// //                                     />
// //                                   ))}
// //                                 </div>
// //                               ))}
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         ))}
// //         <button type="submit" className="btn btn-primary">Submit</button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default AuditDetail;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import QuestionComponent from './QuestionComponent';
// import DuplicateQuestionComponent from './DuplicateQuestionComponent';

// function AuditDetail({ updateProgress }) {
//   const [data, setData] = useState(null);
//   const [formResponses, setFormResponses] = useState({});
//   const [comments, setComments] = useState({});
//   const [images, setImages] = useState({});
//   const [duplicates, setDuplicates] = useState({});
//   const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
//   const [auditId, setAuditId] = useState(null);

//   useEffect(() => {
//     axios.get('/api/audit_detail')
//       .then(response => {
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
//         updateProgress(calculateProgress(response.data, storedResponses));
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//   const handleInputChange = (event, questionId, sousChapitre) => {
//     const { value } = event.target;
//     const updatedResponses = {
//       ...formResponses,
//       [questionId]: { response: value },
//     };
//     setFormResponses(updatedResponses);
//     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
//     updateProgress(calculateProgress(data, updatedResponses));
//   };

//   const handleCommentChange = (event, questionId) => {
//     const { value } = event.target;
//     setComments(prev => ({
//       ...prev,
//       [questionId]: value,
//     }));
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [`comment_${questionId}`]: { comment: value }
//     }));
//   };

//   const handleImageChange = (event, questionId) => {
//     const file = event.target.files[0];
//     setImages(prev => ({
//       ...prev,
//       [questionId]: file,
//     }));
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [`image_${questionId}`]: { imageName: file.name }
//     }));
//   };

//   const handleDuplicate = (questionObj) => {
//     const { id } = questionObj;
//     const duplicateId = `${id}-duplicate-${Date.now()}`;
//     setDuplicates(prev => ({
//       ...prev,
//       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
//     }));
//     updateProgress(calculateProgress(data, formResponses));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('auditId', auditId);

//     Object.entries(formResponses).forEach(([questionId, response]) => {
//       formData.append(`responses[${questionId}]`, response);
//     });

//     Object.entries(comments).forEach(([questionId, comment]) => {
//       formData.append(`comments[${questionId}]`, comment);
//     });

//     Object.entries(images).forEach(([questionId, image]) => {
//       if (image) {
//         formData.append(`images[${questionId}]`, image);
//       }
//     });

//     axios.post('/api/submit', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//       .then(() => {
//         alert('Audit detail submitted successfully!');
//         localStorage.removeItem("auditResponses");
//         localStorage.removeItem("auditId");
//       })
//       .catch(error => console.error('Error submitting audit detail:', error));
//   };

//   const toggleSousChapitre = (sousChapitre) => {
//     setExpandedSousChapitres(prevState => ({
//       ...prevState,
//       [sousChapitre]: !prevState[sousChapitre],
//     }));
//   };

//   // Progress calculation function
//   const calculateProgress = (auditData = {}, responses = {}) => {
//     let progressData = {};

//     Object.entries(auditData || {}).forEach(([chapitre, sousChapitres = {}]) => {
//       Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
//         let totalQuestions = 0;
//         let answeredQuestions = 0;

//         Object.entries(paragraphes || {}).forEach(([_, sousParagraphes = {}]) => {
//           Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
//             totalQuestions += questions.length;

//             questions.forEach((question) => {
//               if (responses[question.id]?.response) {
//                 answeredQuestions += 1;
//               }

//               const duplicateQuestions = duplicates[question.id] || [];
//               totalQuestions += duplicateQuestions.length;

//               duplicateQuestions.forEach((duplicate) => {
//                 if (responses[duplicate.duplicateId]?.response) {
//                   answeredQuestions += 1;
//                 }
//               });
//             });
//           });
//         });

//         const percentageComplete = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

//         progressData[sousChapitre] = {
//           percentage: percentageComplete,
//           totalQuestions,
//           answeredQuestions,
//         };
//       });
//     });

//     return progressData;
//   };

//   if (!data) {
//     return <div>Loading audit details...</div>;
//   }

//   return (
//     <div>
//       <h2>Audit Detail</h2>
//       <form onSubmit={handleSubmit}>
//         {Object.entries(data).map(([chapitre, sousChapitres]) => (
//           <div key={chapitre}>
//             <h3>{chapitre}</h3>
//             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
//               <div key={sousChapitre} className="mb-3">
//                 <h4>
//                   <button
//                     type="button"
//                     className="btn btn-link"
//                     onClick={() => toggleSousChapitre(sousChapitre)}
//                   >
//                     {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
//                   </button>
//                 </h4>
//                 {expandedSousChapitres[sousChapitre] && (
//                   <div>
//                     {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
//                       <div key={paragraphe} className="mb-2">
//                         <h5>{paragraphe}</h5>
//                         {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
//                           <div key={sousParagraphe} className="card mb-2">
//                             <div className="card-body">
//                               {questions.map((questionObj) => (
//                                 <div key={questionObj.id}>
//                                   <QuestionComponent
//                                     questionObj={questionObj}
//                                     formResponses={formResponses}
//                                     handleInputChange={(event) => handleInputChange(event, questionObj.id, sousChapitre)}
//                                     handleCommentChange={handleCommentChange}
//                                     handleImageChange={handleImageChange}
//                                     handleDuplicate={handleDuplicate}
//                                     comments={comments}
//                                     images={images}
//                                   />
//                                   {(duplicates[questionObj.id] || []).map((duplicate, index) => (
//                                     <DuplicateQuestionComponent
//                                       key={duplicate.duplicateId}
//                                       duplicate={duplicate}
//                                       index={index}
//                                       formResponses={formResponses}
//                                       handleInputChange={handleInputChange}
//                                       handleCommentChange={handleCommentChange}
//                                       handleImageChange={handleImageChange}
//                                       comments={comments}
//                                       images={images}
//                                     />
//                                   ))}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ))}
//         <button type="submit" className="btn btn-primary">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default AuditDetail;


import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import QuestionComponent from './QuestionComponent';
import DuplicateQuestionComponent from './DuplicateQuestionComponent';

function AuditDetail({ updateProgress }) {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [comments, setComments] = useState({});
  const [images, setImages] = useState({});
  const [duplicates, setDuplicates] = useState({});
  const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
  const [auditId, setAuditId] = useState(null);

  const calculateProgress = useCallback((auditData = {}, responses = {}) => {
    let progressData = {};

    Object.entries(auditData || {}).forEach(([chapitre, sousChapitres = {}]) => {
      Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
        let totalQuestions = 0;
        let answeredQuestions = 0;

        Object.entries(paragraphes || {}).forEach(([_, sousParagraphes = {}]) => {
          Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
            totalQuestions += questions.length;

            questions.forEach((question) => {
              if (responses[question.id]?.response) {
                answeredQuestions += 1;
              }

              const duplicateQuestions = duplicates[question.id] || [];
              totalQuestions += duplicateQuestions.length;

              duplicateQuestions.forEach((duplicate) => {
                if (responses[duplicate.duplicateId]?.response) {
                  answeredQuestions += 1;
                }
              });
            });
          });
        });

        const percentageComplete = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

        progressData[sousChapitre] = {
          percentage: percentageComplete,
          totalQuestions,
          answeredQuestions,
        };
      });
    });

    return progressData;
  }, [duplicates]);

  useEffect(() => {
    axios.get('/api/audit_detail')
      .then(response => {
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
        // Trigger initial progress update based on the loaded data
        updateProgress(calculateProgress(response.data, storedResponses));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [calculateProgress, updateProgress]);

  // const handleInputChange = (event, questionId, sousChapitre) => {
  //   const { value } = event.target;
  //   const updatedResponses = {
  //     ...formResponses,
  //     [questionId]: { response: value }, // Store only the response here
  //   };
  //   setFormResponses(updatedResponses);
  //   localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
  //   updateProgress(calculateProgress(data, updatedResponses));
  // };
  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...formResponses,
      [questionId]: { ...formResponses[questionId], response: value }, // Store response and comment together
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
    updateProgress(calculateProgress(data, updatedResponses));
};

// const handleCommentChange = (event, questionId) => {
//     const { value } = event.target;
//     const updatedResponses = {
//       ...formResponses,
//       [questionId]: { ...formResponses[questionId], comment: value }, // Store comment under the same questionId
//     };
//     setFormResponses(updatedResponses);
//     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
// };

  // const handleCommentChange = (event, questionId) => {
  //   const { value } = event.target;
  //   setComments(prev => ({
  //     ...prev,
  //     [questionId]: value,
  //   }));
  //   localStorage.setItem("auditResponses", JSON.stringify({
  //     ...formResponses,
  //     [`comment_${questionId}`]: { comment: value }
  //   }));
  // };
  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments(prev => ({
      ...prev,
      [questionId]: value, // Just use questionId directly
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [questionId]: { ...formResponses[questionId], comment: value }, // Use questionId directly
    }));
};

  const handleImageChange = (event, questionId) => {
    const file = event.target.files[0];
    setImages(prev => ({
      ...prev,
      [questionId]: file,
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [`image_${questionId}`]: { imageName: file.name }
    }));
  };

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    const duplicateId = `${id}-duplicate-${Date.now()}`;
    setDuplicates(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
    }));
    updateProgress(calculateProgress(data, formResponses));
  };


//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('auditId', auditId);

//     // Append responses
//     Object.entries(formResponses).forEach(([questionId, response]) => {
//         // Check if the response is an object and serialize it
//         const finalResponse = typeof response === 'object' ? JSON.stringify(response) : response;
//         formData.append(`responses[${questionId}]`, finalResponse);
//     });

//     // Append comments
//     Object.entries(comments).forEach(([questionId, comment]) => {
//         formData.append(`comments[${questionId}]`, comment);
//     });

//     // Append images
//     Object.entries(images).forEach(([questionId, image]) => {
//         if (image) {
//             formData.append(`images[${questionId}]`, image);
//         }
//     });

//     axios.post('/api/submit', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//     })
//     .then(() => {
//         alert('Audit detail submitted successfully!');
//         localStorage.removeItem("auditResponses");
//         localStorage.removeItem("auditId");
//     })
//     .catch(error => console.error('Error submitting audit detail:', error));
// };
const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('auditId', auditId);

  // Append responses (which may include comments now)
  Object.entries(formResponses).forEach(([questionId, response]) => {
      // Check if the response is an object and serialize it
      const finalResponse = typeof response === 'object' ? JSON.stringify(response) : response;
      formData.append(`responses[${questionId}]`, finalResponse);
  });

  // Append images
  Object.entries(images).forEach(([questionId, image]) => {
      if (image) {
          formData.append(`images[${questionId}]`, image);
      }
  });

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

  if (!data) {
    return <div>Loading audit details...</div>;
  }

  return (
    <div>
      <h2>Audit Detail</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(data).map(([chapitre, sousChapitres]) => (
          <div key={chapitre}>
            <h3>{chapitre}</h3>
            {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
              <div key={sousChapitre} className="mb-3" id={sousChapitre}>
                <h4>
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
                    {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
                      <div key={paragraphe} className="mb-2">
                        <h5>{paragraphe}</h5>
                        {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
                          <div key={sousParagraphe} className="card mb-2">
                            <div className="card-body">
                              {questions.map((questionObj) => (
                                <div key={questionObj.id}>
                                  <QuestionComponent
                                    questionObj={questionObj}
                                    formResponses={formResponses}
                                    handleInputChange={(event) => handleInputChange(event, questionObj.id, sousChapitre)}
                                    handleCommentChange={handleCommentChange}
                                    handleImageChange={handleImageChange}
                                    handleDuplicate={handleDuplicate}
                                    comments={comments}
                                    images={images}
                                  />
                                  {(duplicates[questionObj.id] || []).map((duplicate, index) => (
                                    <DuplicateQuestionComponent
                                      key={duplicate.duplicateId}
                                      duplicate={duplicate}
                                      index={index}
                                      formResponses={formResponses}
                                      handleInputChange={handleInputChange}
                                      handleCommentChange={handleCommentChange}
                                      handleImageChange={handleImageChange}
                                      comments={comments}
                                      images={images}
                                    />
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default AuditDetail;
