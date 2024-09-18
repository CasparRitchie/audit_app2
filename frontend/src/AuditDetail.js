// import React, { useEffect, useState, useCallback } from 'react';
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

//   const calculateProgress = useCallback((auditData = {}, responses = {}) => {
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
//             paragrapheTotalQuestions += questions.length;

//             questions.forEach((question) => {
//               if (responses[question.id]?.response) {
//                 paragrapheAnsweredQuestions += 1;
//               }

//               const duplicateQuestions = duplicates[question.id] || [];
//               paragrapheTotalQuestions += duplicateQuestions.length;

//               duplicateQuestions.forEach((duplicate) => {
//                 if (responses[duplicate.duplicateId]?.response) {
//                   paragrapheAnsweredQuestions += 1;
//                 }
//               });
//             });
//           });

//           const paragraphePercentageComplete = paragrapheTotalQuestions > 0 ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100) : 0;

//           sousChapitreTotalQuestions += paragrapheTotalQuestions;
//           sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;

//           paragrapheProgressData[paragraphe] = {
//             percentage: paragraphePercentageComplete,
//             totalQuestions: paragrapheTotalQuestions,
//             answeredQuestions: paragrapheAnsweredQuestions,
//           };
//         });

//         const sousChapitrePercentageComplete = sousChapitreTotalQuestions > 0 ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100) : 0;

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

//         updateProgress(calculateProgress(response.data, storedResponses));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [calculateProgress, updateProgress]);

//   const handleInputChange = (event, questionId) => {
//     const { value } = event.target;
//     const updatedResponses = {
//       ...formResponses,
//       [questionId]: { ...formResponses[questionId], response: value },
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
//       [questionId]: { ...formResponses[questionId], comment: value },
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

//   const toggleSousChapitre = (sousChapitre) => {
//     setExpandedSousChapitres(prevState => ({
//       ...prevState,
//       [sousChapitre]: !prevState[sousChapitre],
//     }));
//   };

//   if (!data) {
//     return <div>Loading audit details...</div>;
//   }

//   return (
//     <div>
//       <h2>Grilles de l'audit</h2>
//       <form onSubmit={handleSubmit}>
//         {Object.entries(data).map(([chapitre, sousChapitres]) => (
//           <div key={chapitre}>
//             <h3>{chapitre}</h3>
//             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
//               <div key={sousChapitre} className="mb-3" id={sousChapitre}>
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
//                       <div key={paragraphe} id={paragraphe} className="mb-2">
//                         <h5>{paragraphe}</h5>
//                         {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
//                           <div key={sousParagraphe} className="card mb-2">
//                             <div className="card-body">
//                               {questions.map((questionObj, index) => (
//                                 <div key={questionObj.id} style={{ backgroundColor: index % 2 === 0 ? '#e1e1e1' : '#ffffff' }}>
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
//                                       />
//                                     ))}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//           <button type="submit" className="btn btn-primary">Envoyer</button>
//         </form>
//       </div>
//     );
//   }

//   export default AuditDetail;


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
      if (!sousChapitres) return; // Add this check to prevent null/undefined sousChapitres

      Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
        if (!paragraphes) return; // Add this check to prevent null/undefined paragraphes

        let sousChapitreTotalQuestions = 0;
        let sousChapitreAnsweredQuestions = 0;

        let paragrapheProgressData = {};

        Object.entries(paragraphes || {}).forEach(([paragraphe, sousParagraphes = {}]) => {
          if (!sousParagraphes) return; // Add this check to prevent null/undefined sousParagraphes

          let paragrapheTotalQuestions = 0;
          let paragrapheAnsweredQuestions = 0;

          Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
            if (!questions) return; // Add this check to prevent null/undefined questions

            paragrapheTotalQuestions += questions.length;

            questions.forEach((question) => {
              if (responses[question.id]?.response) {
                paragrapheAnsweredQuestions += 1;
              }

              const duplicateQuestions = duplicates[question.id] || [];
              paragrapheTotalQuestions += duplicateQuestions.length;

              duplicateQuestions.forEach((duplicate) => {
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

        updateProgress(calculateProgress(response.data, storedResponses));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [calculateProgress, updateProgress]);

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...formResponses,
      [questionId]: { ...formResponses[questionId], response: value },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
    updateProgress(calculateProgress(data, updatedResponses));
  };

  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments(prev => ({
      ...prev,
      [questionId]: value,
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [questionId]: { ...formResponses[questionId], comment: value },
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('auditId', auditId);

    Object.entries(formResponses).forEach(([questionId, response]) => {
      const finalResponse = typeof response === 'object' ? JSON.stringify(response) : response;
      formData.append(`responses[${questionId}]`, finalResponse);
    });

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

  // Helper function to calculate the alternating background
  const getBackgroundColor = (index) => index % 2 === 0 ? '#e1e1e1' : '#ffffff';

  return (
    <div>
      <h2>Grilles de l'audit</h2>
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
                      <div key={paragraphe} id={paragraphe} className="mb-2">
                        <h5>{paragraphe}</h5>
                        {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
                          <div key={sousParagraphe} className="card mb-2">
                            <div className="card-body">
                              {questions.reduce((acc, questionObj, questionIndex) => {
                                const allQuestionsAndDuplicates = [
                                  questionObj,
                                  ...(duplicates[questionObj.id] || [])
                                ];

                                allQuestionsAndDuplicates.forEach((item, itemIndex) => {
                                  acc.push(
                                    <div key={item.id || item.duplicateId} style={{ backgroundColor: getBackgroundColor(questionIndex + itemIndex) }}>
                                      {item.duplicateId ? (
                                        <DuplicateQuestionComponent
                                          duplicate={item}
                                          index={itemIndex}
                                          formResponses={formResponses}
                                          handleInputChange={handleInputChange}
                                          handleCommentChange={handleCommentChange}
                                          handleImageChange={                                          handleInputChange}
                                          comments={comments}
                                          images={images}
                                        />
                                      ) : (
                                        <QuestionComponent
                                          questionObj={item}
                                          formResponses={formResponses}
                                          handleInputChange={(event) => handleInputChange(event, item.id, sousChapitre)}
                                          handleCommentChange={handleCommentChange}
                                          handleImageChange={handleImageChange}
                                          handleDuplicate={handleDuplicate}
                                          comments={comments}
                                          images={images}
                                        />
                                      )}
                                    </div>
                                  );
                                });

                                return acc;
                              }, [])}
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
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  );
}

export default AuditDetail;
