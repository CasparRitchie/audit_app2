// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

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
//     const duplicateId = `${id}-duplicate-${Date.now()}`; // Unique key for each duplication

//     setDuplicates(prev => ({
//       ...prev,
//       [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
//     }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('auditId', auditId);

//     // Add original and duplicated responses to formData
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
//                             <div key={questionObj.id} className="form-group">
//                               <label>
//                                 {questionObj.question}
//                                 {questionObj.information && (
//                                   <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
//                                     ℹ️
//                                   </span>
//                                 )}
//                               </label>
//                               {/* Render input based on response type */}
//                               {questionObj.response_type === 'Temperature' ? (
//                                   <input
//                                       type="number"
//                                       value={formResponses[questionObj.id] || ''}
//                                       onChange={(event) => handleInputChange(event, questionObj.id)}
//                                       placeholder="Enter temperature"
//                                   />
//                               ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
//                                   <div>
//                                       {/* Color-coded radio buttons for C/PC/NC or OK/KO */}
//                                       <div className="btn-group" role="group" aria-label={`${questionObj.response_type} options`}>
//                                           {questionObj.response_type.split('/').map(option => (
//                                               <React.Fragment key={option}>
//                                                   <input
//                                                       type="radio"
//                                                       className="btn-check"
//                                                       name={`options-${questionObj.id}`}
//                                                       id={`${option}-${questionObj.id}`}
//                                                       autoComplete="off"
//                                                       value={option}
//                                                       checked={formResponses[questionObj.id] === option}
//                                                       onChange={(event) => handleInputChange(event, questionObj.id)}
//                                                   />
//                                                   <label
//                                                       className={`btn ${option === 'C' || option === 'OK' ? 'btn-success' :
//                                                                        option === 'PC' ? 'btn-warning' : 'btn-danger'}`}
//                                                       htmlFor={`${option}-${questionObj.id}`}
//                                                   >
//                                                       {option}
//                                                   </label>
//                                               </React.Fragment>
//                                           ))}
//                                       </div>
//                                   </div>
//                               ) : (
//                                   <select
//                                       value={formResponses[questionObj.id] || ''}
//                                       onChange={(event) => handleInputChange(event, questionObj.id)}
//                                   >
//                                       <option value="">Select</option>
//                                       {questionObj.response_type.split('/').map((option) => (
//                                           <option key={option} value={option}>{option}</option>
//                                       ))}
//                                   </select>
//                               )}

//                               {/* Comment Input */}
//                               <div className="mt-2">
//                                 <label>Comment (optional):</label>
//                                 <textarea
//                                   className="form-control"
//                                   value={comments[questionObj.id] || ''}
//                                   onChange={(event) => handleCommentChange(event, questionObj.id)}
//                                   placeholder="Add a comment"
//                                 />
//                               </div>

//                               {/* Image Upload */}
//                               <div className="mt-2">
//                                 <label>Upload Image (optional):</label>
//                                 <input
//                                   type="file"
//                                   className="form-control-file"
//                                   accept="image/*"
//                                   onChange={(event) => handleImageChange(event, questionObj.id)}
//                                 />
//                               </div>

//                               {/* Duplicate Button */}
//                               <div className="mt-2">
//                                 <button
//                                   type="button"
//                                   className="btn btn-secondary"
//                                   onClick={() => handleDuplicate(questionObj)}
//                                 >
//                                   Duplicate
//                                 </button>
//                               </div>

//                               {/* Render duplicated questions */}
//                               {(duplicates[questionObj.id] || []).map((duplicate, index) => (
//                                 <div key={`${duplicate.duplicateId}`} className="card mt-3">
//                                   <div className="card-body">
//                                     <label>{duplicate.question} (Duplicate {index + 1})</label>

//                                     {/* Input for duplicated question */}
//                                     {duplicate.response_type === 'Temperature' ? (
//                                       <input
//                                         type="number"
//                                         value={formResponses[`${duplicate.duplicateId}`] || ''}
//                                         onChange={(event) => handleInputChange(event, `${duplicate.duplicateId}`)}
//                                         placeholder="Enter temperature"
//                                       />
//                                     ) : (
//                                       <select
//                                         value={formResponses[`${duplicate.duplicateId}`] || ''}
//                                         onChange={(event) => handleInputChange(event, `${duplicate.duplicateId}`)}
//                                       >
//                                         <option value="">Select</option>
//                                         {duplicate.response_type.split('/').map((option) => (
//                                           <option key={option} value={option}>{option}</option>
//                                         ))}
//                                       </select>
//                                     )}

//                                     {/* Comment Input for Duplicated Question */}
//                                     <div className="mt-2">
//                                     <textarea
//                                         className="form-control"
//                                         value={comments[`${duplicate.duplicateId}`] || ''}
//                                         onChange={(event) => handleCommentChange(event, `${duplicate.duplicateId}`)}
//                                         placeholder="Add a comment"
//                                       />
//                                     </div>

//                                     {/* Image Upload for Duplicated Question */}
//                                     <div className="mt-2">
//                                       <label>Upload Image (optional):</label>
//                                       <input
//                                         type="file"
//                                         className="form-control-file"
//                                         accept="image/*"
//                                         onChange={(event) => handleImageChange(event, `${duplicate.duplicateId}`)}
//                                       />
//                                     </div>
//                                   </div>
//                                 </div>
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


// AuditDetail.js
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
                <h4>{sousChapitre}</h4>
                {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
                  <div key={paragraphe} className="mb-2">
                    <h5>{paragraphe}</h5>
                    {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
                      <div key={sousParagraphe} className="card mb-2">
                        <div className="card-body">
                          {questions.map((questionObj) => (
                            <div key={questionObj.id}>
                              {/* Render the question component */}
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

                              {/* Render duplicated questions */}
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
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default AuditDetail;
