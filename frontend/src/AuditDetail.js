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
//   const [auditHeaders, setAuditHeaders] = useState([]);


//   useEffect(() => {
//     const fetchAuditHeaders = async () => {
//         try {
//             const response = await axios.get('/api/audit_header');
//             setAuditHeaders(response.data);
//         } catch (error) {
//             console.error('Error fetching audit headers:', error);
//         }
//     };
//     fetchAuditHeaders();
// }, []);

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


//   const getRowColor = (index) => (index % 2 === 0 ? '#f8f9fa' : '#ffffff');

//   const handleDuplicate = (questionObj) => {
//     const { id } = questionObj;
//     const duplicateId = `${id}-duplicate-${Date.now()}`;

//     setDuplicates((prev) => ({
//       ...prev,
//       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
//     }));
//   };

//   // Update progress when duplicates, formResponses, or removedQuestions change
//   useEffect(() => {
//     if (data) {
//       const progress = calculateProgress(data, formResponses, removedQuestions, duplicates);
//       updateProgress(progress);
//     }
//   }, [data, formResponses, removedQuestions, duplicates, updateProgress]);

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

//     const handleInputChange = (event, questionId) => {
//     const { value } = event.target;
//     const updatedResponses = {
//       ...formResponses,
//       [questionId]: { ...formResponses[questionId], response: value },
//     };
//     setFormResponses(updatedResponses);
//     localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
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


//   const handleRemoveQuestion = (sousChapitre, questionObj) => {
//     const questionId = questionObj.id || questionObj.duplicateId;

//     if (questionObj.duplicateId) {
//       // For duplicates
//       setDuplicates((prev) => {
//         const updatedDuplicates = { ...prev };
//         updatedDuplicates[questionObj.id] = updatedDuplicates[questionObj.id].filter(
//           (duplicate) => duplicate.duplicateId !== questionObj.duplicateId
//         );
//         if (updatedDuplicates[questionObj.id].length === 0) delete updatedDuplicates[questionObj.id];
//         return updatedDuplicates;
//       });
//     } else {
//       // For original questions
//       setRemovedQuestions((prev) => ({
//         ...prev,
//         [sousChapitre]: [
//           ...(prev[sousChapitre] || []),
//           { id: questionId, title: questionObj.question },
//         ],
//       }));
//     }

//     // Recalculate and update progress
//     updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
//     localStorage.setItem("removedQuestions", JSON.stringify(removedQuestions));
//   };

//   // Function to re-add an original question
//   const handleReAddQuestion = (sousChapitre, questionId) => {
//     setRemovedQuestions((prev) => {
//       const updated = { ...prev };
//       updated[sousChapitre] = updated[sousChapitre].filter((q) => q.id !== questionId);
//       if (updated[sousChapitre].length === 0) delete updated[sousChapitre];
//       return updated;
//     });

//     updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault(); // Prevents page reload on form submit

//     const submissionData = {
//       formResponses,
//       comments,
//       images,
//       // Add any other data you want to send
//     };

//     // Perform API call or form submission logic here
//     axios.post('/api/submit_audit', submissionData)
//       .then(response => {
//         console.log('Form submitted successfully:', response.data);
//         alert('Audit successfully submitted!'); // Provide feedback to the user
//       })
//       .catch(error => {
//         console.error('There was an error submitting the form:', error);
//         alert('An error occurred while submitting the audit. Please try again.');
//       });
//   };

//   return (
//     <form onSubmit={handleSubmit}>

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

//                     {/* Removed Questions Section */}
//                     {removedQuestions[sousChapitre]?.length > 0 && (
//                       <div style={{ backgroundColor: '#f8d7da', padding: '10px', marginBottom: '10px' }}>
//                         <h5>Removed Questions</h5>
//                         {removedQuestions[sousChapitre].map((removed) => (
//                           <div key={removed.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
//                             <span>{removed.title}</span>
//                             <button
//                               type="button"
//                               className="btn btn-link"
//                               onClick={() => handleReAddQuestion(sousChapitre, removed.id)}
//                               style={{ color: '#007bff' }}
//                             >
//                               Re-add
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Active Questions with Alternating Colors */}
//                     {expandedSousChapitres[sousChapitre] &&
//                       Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
//                         <div key={`${sousChapitre}-${paragraphe}`} className="mb-2" id={`${sousChapitre}-${paragraphe}`} style={{ paddingTop: '60px' }}>
//                           <h5 className="sticky-title">{paragraphe}</h5>
//                           {/* Render questions with alternating colors */}
//                           {Object.entries(sousParagraphes).map(([_, questions]) => {
//                             const combinedQuestions = questions
//                               .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
//                               .reduce((acc, questionObj) => {
//                                 acc.push(questionObj);
//                                 const questionDuplicates = duplicates[questionObj.id] || [];
//                                 return acc.concat(questionDuplicates);
//                               }, []);

//                             return combinedQuestions.map((questionObj, index) => (
//                               <div key={questionObj.duplicateId || questionObj.id} style={{ backgroundColor: getRowColor(index) }}>
//                                 <QuestionComponent
//                                   questionObj={questionObj}
//                                   formResponses={formResponses}
//                                   handleInputChange={handleInputChange}
//                                   handleCommentChange={handleCommentChange}
//                                   handleImageChange={handleImageChange}
//                                   handleDuplicate={handleDuplicate}
//                                   handleRemove={(q) => handleRemoveQuestion(sousChapitre, q)}
//                                   comments={comments}
//                                   images={images}
//                                   setImages={setImages}
//                                 />
//                               </div>
//                             ));
//                           })}
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
//     </form>
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
  const [auditHeaders, setAuditHeaders] = useState([]);
  const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState(null);

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

  useEffect(() => {
    const fetchAuditHeaders = async () => {
      try {
        const response = await axios.get('/api/get_audits');
        setAuditHeaders(response.data);
      } catch (error) {
        console.error('Error fetching audit headers:', error);
      }
    };
    fetchAuditHeaders();
  }, []);

  const getRowColor = (index) => (index % 2 === 0 ? '#f8f9fa' : '#ffffff');

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    const duplicateId = `${id}-duplicate-${Date.now()}`;

    setDuplicates((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
    }));
  };

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
      setDuplicates((prev) => {
        const updatedDuplicates = { ...prev };
        updatedDuplicates[questionObj.id] = updatedDuplicates[questionObj.id].filter(
          (duplicate) => duplicate.duplicateId !== questionObj.duplicateId
        );
        if (updatedDuplicates[questionObj.id].length === 0) delete updatedDuplicates[questionObj.id];
        return updatedDuplicates;
      });
    } else {
      setRemovedQuestions((prev) => ({
        ...prev,
        [sousChapitre]: [
          ...(prev[sousChapitre] || []),
          { id: questionId, title: questionObj.question },
        ],
      }));
    }
    updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
    localStorage.setItem("removedQuestions", JSON.stringify(removedQuestions));
  };

  const handleReAddQuestion = (sousChapitre, questionId) => {
    setRemovedQuestions((prev) => {
      const updated = { ...prev };
      updated[sousChapitre] = updated[sousChapitre].filter((q) => q.id !== questionId);
      if (updated[sousChapitre].length === 0) delete updated[sousChapitre];
      return updated;
    });
    updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submissionData = {
      auditId: selectedAuditHeaderId,
      formResponses,
      comments,
      images,
    };

    axios.post('/api/submit_audit', submissionData)
      .then(response => {
        console.log('Form submitted successfully:', response.data);
        alert('Audit successfully submitted!');
      })
      .catch(error => {
        console.error('There was an error submitting the form:', error);
        alert('An error occurred while submitting the audit. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            {data && (
              <Sidebar
                data={data}
                formResponses={formResponses}
                removedQuestions={removedQuestions}
                duplicates={duplicates}
              />
            )}
          </div>
          <div className="col-md-9">
            <h2>Grilles de l'audit</h2>

            {/* Dropdown for selecting an audit header */}
            <div className="form-group">
              <label htmlFor="auditHeaderSelect">Select Audit Header:</label>
              <select
                id="auditHeaderSelect"
                className="form-control"
                value={selectedAuditHeaderId || ""}
                onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
                required
              >
                <option value="" disabled>Select an audit header</option>
                {auditHeaders.map((header) => (
                  <option key={header.id} value={header.id}>
                    {header.question}
                  </option>
                ))}
              </select>
            </div>

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

                      {removedQuestions[sousChapitre]?.length > 0 && (
                        <div style={{ backgroundColor: '#f8d7da', padding: '10px', marginBottom: '10px' }}>
                          <h5>Removed Questions</h5>
                          {removedQuestions[sousChapitre].map((removed) => (
                            <div key={removed.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{removed.title}</span>
                              <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => handleReAddQuestion(sousChapitre, removed.id)}
                                style={{ color: '#007bff' }}
                              >
                                Re-add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {expandedSousChapitres[sousChapitre] &&
                        Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
                          <div key={`${sousChapitre}-${paragraphe}`} className="mb-2" id={`${sousChapitre}-${paragraphe}`} style={{ paddingTop: '60px' }}>
                            <h5 className="sticky-title">{paragraphe}</h5>
                            {/* Render questions with alternating colors */}
                            {Object.entries(sousParagraphes).map(([_, questions]) => {
                              const combinedQuestions = questions
                                .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
                                .reduce((acc, questionObj) => {
                                  acc.push(questionObj);
                                  const questionDuplicates = duplicates[questionObj.id] || [];
                                  return acc.concat(questionDuplicates);
                                }, []);

                              return combinedQuestions.map((questionObj, index) => (
                                <div key={questionObj.duplicateId || questionObj.id} style={{ backgroundColor: getRowColor(index) }}>
                                  <QuestionComponent
                                    questionObj={questionObj}
                                    formResponses={formResponses}
                                    handleInputChange={handleInputChange}
                                    handleCommentChange={handleCommentChange}
                                    handleImageChange={handleImageChange}
                                    handleDuplicate={handleDuplicate}
                                    handleRemove={(q) => handleRemoveQuestion(sousChapitre, q)}
                                    comments={comments}
                                    images={images}
                                    setImages={setImages}
                                  />
                                </div>
                              ));
                            })}
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
    </form>
  );
}

export default AuditDetail;
