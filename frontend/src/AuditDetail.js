// // AuditDetail.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import QuestionComponent from './QuestionComponent';
// import DuplicateQuestionComponent from './DuplicateQuestionComponent';

// function AuditDetail() {
//   const [data, setData] = useState(null);
//   const [formResponses, setFormResponses] = useState({});
//   const [comments, setComments] = useState({});
//   const [images, setImages] = useState({});
//   const [duplicates, setDuplicates] = useState({});
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
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//   const handleInputChange = (event, questionId) => {
//     const { value } = event.target;
//     setFormResponses(prev => ({
//       ...prev,
//       [questionId]: value,
//     }));
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [questionId]: { response: value }
//     }));
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
//                 <h4>{sousChapitre}</h4>
//                 {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
//                   <div key={paragraphe} className="mb-2">
//                     <h5>{paragraphe}</h5>
//                     {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
//                       <div key={sousParagraphe} className="card mb-2">
//                         <div className="card-body">
//                           {questions.map((questionObj) => (
//                             <div key={questionObj.id}>
//                               {/* Render the question component */}
//                               <QuestionComponent
//                                 questionObj={questionObj}
//                                 formResponses={formResponses}
//                                 handleInputChange={handleInputChange}
//                                 handleCommentChange={handleCommentChange}
//                                 handleImageChange={handleImageChange}
//                                 handleDuplicate={handleDuplicate}
//                                 comments={comments}
//                                 images={images}
//                               />

//                               {/* Render duplicated questions */}
//                               {(duplicates[questionObj.id] || []).map((duplicate, index) => (
//                                 <DuplicateQuestionComponent
//                                   key={duplicate.duplicateId}
//                                   duplicate={duplicate}
//                                   index={index}
//                                   formResponses={formResponses}
//                                   handleInputChange={handleInputChange}
//                                   handleCommentChange={handleCommentChange}
//                                   handleImageChange={handleImageChange}
//                                   comments={comments}
//                                   images={images}
//                                 />
//                               ))}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
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


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionComponent from './QuestionComponent';
import DuplicateQuestionComponent from './DuplicateQuestionComponent';

function AuditDetail() {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [comments, setComments] = useState({});
  const [images, setImages] = useState({});
  const [duplicates, setDuplicates] = useState({});
  const [expandedSousChapitres, setExpandedSousChapitres] = useState({}); // Track expanded/collapsed state
  const [auditId, setAuditId] = useState(null);

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
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    setFormResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [questionId]: { response: value }
    }));
  };

  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments(prev => ({
      ...prev,
      [questionId]: value,
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [`comment_${questionId}`]: { comment: value }
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('auditId', auditId);

    Object.entries(formResponses).forEach(([questionId, response]) => {
      formData.append(`responses[${questionId}]`, response);
    });

    Object.entries(comments).forEach(([questionId, comment]) => {
      formData.append(`comments[${questionId}]`, comment);
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

  return (
    <div>
      <h2>Audit Detail</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(data).map(([chapitre, sousChapitres]) => (
          <div key={chapitre}>
            <h3>{chapitre}</h3>
            {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
              <div key={sousChapitre} className="mb-3">
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
                                    handleInputChange={handleInputChange}
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
