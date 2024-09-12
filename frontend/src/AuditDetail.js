// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // function AuditDetail() {
// // //   const [data, setData] = useState(null);  // State to store the data
// // //   const [formResponses, setFormResponses] = useState({});  // State for form responses
// // //   const [comments, setComments] = useState({});  // State for optional comments
// // //   const [images, setImages] = useState({});  // State for optional images
// // //   const [duplicates, setDuplicates] = useState({});  // State to track duplicated questions
// // //   const [auditId, setAuditId] = useState(null);  // State for auditId

// // //   // Fetch audit detail data from the backend and load stored form responses from localStorage
// // //   useEffect(() => {
// // //     axios.get('/api/audit_detail')
// // //       .then(response => {
// // //         console.log('Fetched data:', response.data);
// // //         setData(response.data);  // Set the fetched data

// // //         // Load stored form responses from localStorage
// // //         const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
// // //         const storedAuditId = localStorage.getItem("auditId");

// // //         if (storedResponses) {
// // //           const initialFormResponses = {};
// // //           const initialComments = {};
// // //           const initialImages = {};

// // //           Object.entries(storedResponses).forEach(([key, value]) => {
// // //             if (key.startsWith("comment_")) {
// // //               const questionId = key.replace("comment_", "");
// // //               initialComments[questionId] = value.comment;
// // //             } else if (key.startsWith("image_")) {
// // //               const questionId = key.replace("image_", "");
// // //               initialImages[questionId] = value.imageName;
// // //             } else {
// // //               initialFormResponses[key] = value.response;
// // //             }
// // //           });

// // //           setFormResponses(initialFormResponses);
// // //           setComments(initialComments);
// // //           setImages(initialImages);
// // //         }

// // //         if (storedAuditId) {
// // //           setAuditId(storedAuditId);  // Restore the auditId from localStorage
// // //         } else {
// // //           const newAuditId = Date.now().toString();  // Generate a new unique auditId
// // //           setAuditId(newAuditId);
// // //           localStorage.setItem("auditId", newAuditId);  // Save the auditId in localStorage
// // //         }
// // //       })
// // //       .catch(error => {
// // //         console.error('There was an error fetching the data!', error);
// // //       });
// // //   }, []);

// // //   // Store form responses to localStorage whenever a change happens
// // //   const saveToLocalStorage = (key, value) => {
// // //     const existingData = JSON.parse(localStorage.getItem("auditResponses")) || {};
// // //     existingData[key] = value;
// // //     localStorage.setItem("auditResponses", JSON.stringify(existingData));
// // //   };

// // //   // Handle form input change for audit details
// // //   const handleInputChange = (event, questionId) => {
// // //     const value = event.target.value;
// // //     setFormResponses({
// // //       ...formResponses,
// // //       [questionId]: value,
// // //     });

// // //     // Save to localStorage
// // //     saveToLocalStorage(questionId, { response: value });
// // //   };

// // //   // Handle comment input change
// // //   const handleCommentChange = (event, questionId) => {
// // //     const value = event.target.value;
// // //     setComments({
// // //       ...comments,
// // //       [questionId]: value,
// // //     });

// // //     // Save to localStorage
// // //     saveToLocalStorage(`comment_${questionId}`, { comment: value });
// // //   };

// // //   // Handle image file change
// // //   const handleImageChange = (event, questionId) => {
// // //     const file = event.target.files[0];
// // //     setImages({
// // //       ...images,
// // //       [questionId]: file,
// // //     });

// // //     // Save to localStorage (only the file name for reference)
// // //     saveToLocalStorage(`image_${questionId}`, { imageName: file.name });
// // //   };

// // //   // Handle duplication of a question
// // //   const handleDuplicate = (questionObj) => {
// // //     const { id } = questionObj;
// // //     setDuplicates({
// // //       ...duplicates,
// // //       [id]: [...(duplicates[id] || []), questionObj],
// // //     });
// // //   };

// // //   // Submit form data
// // //   const handleSubmit = (event) => {
// // //     event.preventDefault();
// // //     const formData = new FormData();

// // //     formData.append('auditId', auditId);  // Add the auditId to the formData

// // //     Object.entries(formResponses).forEach(([questionId, response]) => {
// // //       formData.append(`responses[${questionId}]`, response);
// // //     });

// // //     Object.entries(comments).forEach(([questionId, comment]) => {
// // //       formData.append(`comments[${questionId}]`, comment);
// // //     });

// // //     Object.entries(images).forEach(([questionId, image]) => {
// // //       if (image) {
// // //         formData.append(`images[${questionId}]`, image);
// // //       }
// // //     });

// // //     axios.post('/api/submit', formData, {
// // //       headers: {
// // //         'Content-Type': 'multipart/form-data',
// // //       },
// // //     })
// // //       .then(response => {
// // //         alert('Form submitted successfully!');
// // //         // Clear localStorage upon successful submission
// // //         localStorage.removeItem("auditResponses");
// // //         localStorage.removeItem("auditId");
// // //       })
// // //       .catch(error => {
// // //         console.error('There was an error submitting the form!', error);
// // //       });
// // //   };

// // //   // Ensure data exists before rendering
// // //   if (!data) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   return (
// // //     <div>
// // //       <h1>Audit Detail</h1>
// // //       <form onSubmit={handleSubmit}>
// // //         {Object.entries(data).map(([chapitre, sousChapitres]) => (
// // //           <div key={chapitre}>
// // //             <h2>{chapitre}</h2>
// // //             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// // //               <div key={sousChapitre}>
// // //                 <h3>{sousChapitre}</h3>
// // //                 {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// // //                   <div key={paragraphe}>
// // //                     <h4>{paragraphe}</h4>
// // //                     {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
// // //                       <div key={sousParagraphe}>
// // //                         <h5>{sousParagraphe}</h5>

// // //                         {/* Questions Rendering */}
// // //                         {questions.map((questionObj) => (
// // //                           <div key={questionObj.id}>
// // //                             <label>
// // //                               {questionObj.question}
// // //                               {questionObj.information && (
// // //                                 <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
// // //                                   ℹ️
// // //                                 </span>
// // //                               )}
// // //                             </label>

// // //                             {/* Render input based on response type */}
// // //                             {questionObj.response_type === 'Temperature' ? (
// // //                               <input
// // //                                 type="number"
// // //                                 value={formResponses[questionObj.id] || ''}
// // //                                 onChange={(event) => handleInputChange(event, questionObj.id)}
// // //                                 placeholder="Enter temperature"
// // //                               />
// // //                             ) : (
// // //                               <select
// // //                                 value={formResponses[questionObj.id] || ''}
// // //                                 onChange={(event) => handleInputChange(event, questionObj.id)}
// // //                               >
// // //                                 <option value="">Select</option>
// // //                                 {questionObj.response_type.split('/').map((option) => (
// // //                                   <option key={option} value={option}>{option}</option>
// // //                                 ))}
// // //                               </select>
// // //                             )}

// // //                             {/* Comment Input */}
// // //                             <div>
// // //                               <label>Comment (optional):</label>
// // //                               <textarea
// // //                                 value={comments[questionObj.id] || ''}
// // //                                 onChange={(event) => handleCommentChange(event, questionObj.id)}
// // //                                 placeholder="Add a comment"
// // //                               />
// // //                             </div>

// // //                             {/* Image Upload */}
// // //                             <div>
// // //                               <label>Upload Image (optional):</label>
// // //                               <input
// // //                                 type="file"
// // //                                 accept="image/*"
// // //                                 onChange={(event) => handleImageChange(event, questionObj.id)}
// // //                               />
// // //                             </div>

// // //                             {/* Duplicate Button */}
// // //                             <button
// // //                               type="button"
// // //                               onClick={() => handleDuplicate(questionObj)}
// // //                             >
// // //                               Duplicate
// // //                             </button>

// // //                             {/* Render duplicated questions */}
// // //                             {(duplicates[questionObj.id] || []).map((duplicate, index) => (
// // //                               <div key={`${duplicate.id}-duplicate-${index}`}>
// // //                                 <label>{duplicate.question} (Duplicate {index + 1})</label>

// // //                                 {/* Render input for duplicated question */}
// // //                                 {duplicate.response_type === 'Temperature' ? (
// // //                                   <input
// // //                                     type="number"
// // //                                     value={formResponses[`${duplicate.id}-duplicate-${index}`] || ''}
// // //                                     onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
// // //                                     placeholder="Enter temperature"
// // //                                   />
// // //                                 ) : (
// // //                                   <select
// // //                                     value={formResponses[`${duplicate.id}-duplicate-${index}`] || ''}
// // //                                     onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
// // //                                   >
// // //                                                                         <option value="">Select</option>
// // //                                     {duplicate.response_type.split('/').map((option) => (
// // //                                       <option key={option} value={option}>{option}</option>
// // //                                     ))}
// // //                                   </select>
// // //                                 )}

// // //                                 {/* Comment Input for Duplicated Question */}
// // //                                 <div>
// // //                                   <label>Comment (optional):</label>
// // //                                   <textarea
// // //                                     value={comments[`${duplicate.id}-duplicate-${index}`] || ''}
// // //                                     onChange={(event) => handleCommentChange(event, `${duplicate.id}-duplicate-${index}`)}
// // //                                     placeholder="Add a comment"
// // //                                   />
// // //                                 </div>

// // //                                 {/* Image Upload for Duplicated Question */}
// // //                                 <div>
// // //                                   <label>Upload Image (optional):</label>
// // //                                   <input
// // //                                     type="file"
// // //                                     accept="image/*"
// // //                                     onChange={(event) => handleImageChange(event, `${duplicate.id}-duplicate-${index}`)}
// // //                                   />
// // //                                 </div>
// // //                               </div>
// // //                             ))}
// // //                           </div>
// // //                         ))}
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ))}
// // //         <button type="submit">Submit</button>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // // export default AuditDetail;


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // function AuditDetail() {
// //   const [data, setData] = useState(null);
// //   const [formResponses, setFormResponses] = useState({});
// //   const [comments, setComments] = useState({});
// //   const [images, setImages] = useState({});
// //   const [auditId, setAuditId] = useState(null);

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
// //       })
// //       .catch(error => console.error('Error fetching data:', error));
// //   }, []);

// //   const handleInputChange = (event, questionId) => {
// //     const { value } = event.target;
// //     setFormResponses({
// //       ...formResponses,
// //       [questionId]: value,
// //     });
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [questionId]: { response: value }
// //     }));
// //   };

// //   const handleCommentChange = (event, questionId) => {
// //     const { value } = event.target;
// //     setComments({
// //       ...comments,
// //       [questionId]: value,
// //     });
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [`comment_${questionId}`]: { comment: value }
// //     }));
// //   };

// //   const handleImageChange = (event, questionId) => {
// //     const file = event.target.files[0];
// //     setImages({
// //       ...images,
// //       [questionId]: file,
// //     });
// //     localStorage.setItem("auditResponses", JSON.stringify({
// //       ...formResponses,
// //       [`image_${questionId}`]: { imageName: file.name }
// //     }));
// //   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     const formData = new FormData();
// //     formData.append('auditId', auditId);

// //     Object.entries(formResponses).forEach(([questionId, response]) => {
// //       formData.append(`responses[${questionId}]`, response.response);
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
// //     .then(() => {
// //       alert('Audit detail submitted successfully!');
// //       localStorage.removeItem("auditResponses");
// //       localStorage.removeItem("auditId");
// //     })
// //     .catch(error => console.error('Error submitting audit detail:', error));
// //   };

// //   if (!data) {
// //     return <div>Loading audit details...</div>;
// //   }

// //   return (
// //     <div>
// //       <h2>Audit Detail</h2>
// //       <form onSubmit={handleSubmit}>
// //         {Object.entries(data).map(([chapitre, sousChapitres]) => (
// //           <div key={chapitre}>
// //             <h3>{chapitre}</h3>
// //             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// //               <div key={sousChapitre} className="mb-3">
// //                 <h4>{sousChapitre}</h4>
// //                 {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// //                   <div key={paragraphe} className="mb-2">
// //                     <h5>{paragraphe}</h5>
// //                     {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
// //                       <div key={sousParagraphe} className="card mb-2">
// //                         <div className="card-body">
// //                           {questions.map((questionObj) => (
// //                             <div key={questionObj.id} className="form-group">
// //                               <label>
// //                                 {questionObj.question}
// //                                 {questionObj.information && (
// //                                   <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
// //                                     ℹ️
// //                                   </span>
// //                                 )}
// //                               </label>
// //                               {/* Render input based on response type */}
// //                               {questionObj.response_type === 'Temperature' ? (
// //                                   <input
// //                                       type="number"
// //                                       value={formResponses[questionObj.id] || ''}
// //                                       onChange={(event) => handleInputChange(event, questionObj.id)}
// //                                       placeholder="Enter temperature"
// //                                   />
// //                               ) : questionObj.response_type === 'C/PC/NC' ? (
// //                                   <div>
// //                                       {/* Color-coded radio buttons for C/PC/NC */}
// //                                       <div className="btn-group" role="group" aria-label="C/PC/NC options">
// //                                           <input
// //                                               type="radio"
// //                                               className="btn-check"
// //                                               name={`options-${questionObj.id}`}
// //                                               id={`C-${questionObj.id}`}
// //                                               autoComplete="off"
// //                                               value="C"
// //                                               checked={formResponses[questionObj.id] === 'C'}
// //                                               onChange={(event) => handleInputChange(event, questionObj.id)}
// //                                           />
// //                                           <label className="btn btn-success" htmlFor={`C-${questionObj.id}`}>C</label>

// //                                           <input
// //                                               type="radio"
// //                                               className="btn-check"
// //                                               name={`options-${questionObj.id}`}
// //                                               id={`PC-${questionObj.id}`}
// //                                               autoComplete="off"
// //                                               value="PC"
// //                                               checked={formResponses[questionObj.id] === 'PC'}
// //                                               onChange={(event) => handleInputChange(event, questionObj.id)}
// //                                           />
// //                                           <label className="btn btn-warning" htmlFor={`PC-${questionObj.id}`}>PC</label>

// //                                           <input
// //                                               type="radio"
// //                                               className="btn-check"
// //                                               name={`options-${questionObj.id}`}
// //                                               id={`NC-${questionObj.id}`}
// //                                               autoComplete="off"
// //                                               value="NC"
// //                                               checked={formResponses[questionObj.id] === 'NC'}
// //                                               onChange={(event) => handleInputChange(event, questionObj.id)}
// //                                           />
// //                                           <label className="btn btn-danger" htmlFor={`NC-${questionObj.id}`}>NC</label>
// //                                       </div>
// //                                   </div>
// //                               ) : (
// //                                   <select
// //                                       value={formResponses[questionObj.id] || ''}
// //                                       onChange={(event) => handleInputChange(event, questionObj.id)}
// //                                   >
// //                                       <option value="">Select</option>
// //                                       {questionObj.response_type.split('/').map((option) => (
// //                                           <option key={option} value={option}>{option}</option>
// //                                       ))}
// //                                   </select>
// //                               )}

// //                               {/* Comment Input */}
// //                               <div className="mt-2">
// //                                 <label>Comment (optional):</label>
// //                                 <textarea
// //                                   className="form-control"
// //                                   value={comments[questionObj.id] || ''}
// //                                   onChange={(event) => handleCommentChange(event, questionObj.id)}
// //                                   placeholder="Add a comment"
// //                                 />
// //                               </div>

// //                               {/* Image Upload */}
// //                               <div className="mt-2">
// //                                 <label>Upload Image (optional):</label>
// //                                 <input
// //                                   type="file"
// //                                   className="form-control-file"
// //                                   accept="image/*"
// //                                   onChange={(event) => handleImageChange(event, questionObj.id)}
// //                                 />
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 ))}
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

// function AuditDetail() {
//   const [data, setData] = useState(null);
//   const [formResponses, setFormResponses] = useState({});
//   const [comments, setComments] = useState({});
//   const [images, setImages] = useState({});
//   const [duplicates, setDuplicates] = useState({});  // For handling duplicates
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
//     setFormResponses({
//       ...formResponses,
//       [questionId]: value,
//     });
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [questionId]: { response: value }
//     }));
//   };

//   const handleCommentChange = (event, questionId) => {
//     const { value } = event.target;
//     setComments({
//       ...comments,
//       [questionId]: value,
//     });
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [`comment_${questionId}`]: { comment: value }
//     }));
//   };

//   const handleImageChange = (event, questionId) => {
//     const file = event.target.files[0];
//     setImages({
//       ...images,
//       [questionId]: file,
//     });
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [`image_${questionId}`]: { imageName: file.name }
//     }));
//   };

//   const handleDuplicate = (questionObj) => {
//     const { id } = questionObj;
//     setDuplicates({
//       ...duplicates,
//       [id]: [...(duplicates[id] || []), questionObj],
//     });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('auditId', auditId);

//     Object.entries(formResponses).forEach(([questionId, response]) => {
//       formData.append(`responses[${questionId}]`, response.response);
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
//     .then(() => {
//       alert('Audit detail submitted successfully!');
//       localStorage.removeItem("auditResponses");
//       localStorage.removeItem("auditId");
//     })
//     .catch(error => console.error('Error submitting audit detail:', error));
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
//                                 <input
//                                   type="number"
//                                   value={formResponses[questionObj.id] || ''}
//                                   onChange={(event) => handleInputChange(event, questionObj.id)}
//                                   placeholder="Enter temperature"
//                                 />
//                               ) : questionObj.response_type === 'C/PC/NC' ? (
//                                 <div>
//                                   <div className="btn-group" role="group" aria-label="C/PC/NC options">
//                                     <input
//                                       type="radio"
//                                       className="btn-check"
//                                       name={`options-${questionObj.id}`}
//                                       id={`C-${questionObj.id}`}
//                                       autoComplete="off"
//                                       value="C"
//                                       checked={formResponses[questionObj.id] === 'C'}
//                                       onChange={(event) => handleInputChange(event, questionObj.id)}
//                                     />
//                                     <label className="btn btn-success" htmlFor={`C-${questionObj.id}`}>C</label>

//                                     <input
//                                       type="radio"
//                                       className="btn-check"
//                                       name={`options-${questionObj.id}`}
//                                       id={`PC-${questionObj.id}`}
//                                       autoComplete="off"
//                                       value="PC"
//                                       checked={formResponses[questionObj.id] === 'PC'}
//                                       onChange={(event) => handleInputChange(event, questionObj.id)}
//                                     />
//                                     <label className="btn btn-warning" htmlFor={`PC-${questionObj.id}`}>PC</label>

//                                     <input
//                                       type="radio"
//                                       className="btn-check"
//                                       name={`options-${questionObj.id}`}
//                                       id={`NC-${questionObj.id}`}
//                                       autoComplete="off"
//                                       value="NC"
//                                       checked={formResponses[questionObj.id] === 'NC'}
//                                       onChange={(event) => handleInputChange(event, questionObj.id)}
//                                     />
//                                     <label className="btn btn-danger" htmlFor={`NC-${questionObj.id}`}>NC</label>
//                                   </div>
//                                   {/* Duplicate Button */}
//                                   <button
//                                     type="button"
//                                     className="btn btn-outline-primary btn-sm"
//                                     style={{ marginLeft: '10px' }}
//                                     onClick={() => handleDuplicate(questionObj)}
//                                   >
//                                     Duplicate
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div>
//                                   <select
//                                     value={formResponses[questionObj.id] || ''}
//                                     onChange={(event) => handleInputChange(event, questionObj.id)}
//                                   >
//                                     <option value="">Select</option>
//                                     {questionObj.response_type.split('/').map((option) => (
//                                       <option key={option} value={option}>{option}</option>
//                                     ))}
//                                   </select>
//                                   {/* Duplicate Button */}
//                                   <button
//                                     type="button"
//                                     className="btn btn-outline-primary btn-sm"
//                                     style={{ marginLeft: '10px' }}
//                                     onClick={() => handleDuplicate(questionObj)}
//                                   >
//                                     Duplicate
//                                   </button>
//                                 </div>
//                               )}

//                               {/* Render duplicated questions */}
//                               {(duplicates[questionObj.id] || []).map((duplicate, index) => (
//                                 <div key={`${duplicate.id}-duplicate-${index}`} className="mt-3">
//                                   <label>{duplicate.question} (Duplicate {index + 1})</label>

//                                   {duplicate.response_type === 'C/PC/NC' ? (
//                                     <div className="btn-group" role="group" aria-label="C/PC/NC options">
//                                       <input
//                                         type="radio"
//                                         className="btn-check"
//                                         name={`options-${duplicate.id}-duplicate-${index}`}
//                                         id={`C-${duplicate.id}-duplicate-${index}`}
//                                         autoComplete="off"
//                                         value="C"
//                                         checked={formResponses[`${duplicate.id}-duplicate-${index}`] === 'C'}
//                                         onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
//                                       />
//                                       <label className="btn btn-success" htmlFor={`C-${duplicate.id}-duplicate-${index}`}>C</label>

//                                       <input
//                                         type="radio"
//                                         className="btn-check"
//                                         name={`options-${duplicate.id}-duplicate-${index}`}
//                                         id={`PC-${duplicate.id}-duplicate-${index}`}
//                                         autoComplete="off"
//                                         value="PC"
//                                         checked={formResponses[`${duplicate.id}-duplicate-${index}`] === 'PC'}
//                                         onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
//                                       />
//                                                                             <label className="btn btn-warning" htmlFor={`PC-${duplicate.id}-duplicate-${index}`}>PC</label>

// <input
//   type="radio"
//   className="btn-check"
//   name={`options-${duplicate.id}-duplicate-${index}`}
//   id={`NC-${duplicate.id}-duplicate-${index}`}
//   autoComplete="off"
//   value="NC"
//   checked={formResponses[`${duplicate.id}-duplicate-${index}`] === 'NC'}
//   onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
// />
// <label className="btn btn-danger" htmlFor={`NC-${duplicate.id}-duplicate-${index}`}>NC</label>
// </div>
// ) : (
// <select
// value={formResponses[`${duplicate.id}-duplicate-${index}`] || ''}
// onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
// >
// <option value="">Select</option>
// {duplicate.response_type.split('/').map((option) => (
//   <option key={option} value={option}>{option}</option>
// ))}
// </select>
// )}

// {/* Comment Input for Duplicated Question */}
// <div className="mt-2">
// <label>Comment (optional):</label>
// <textarea
// className="form-control"
// value={comments[`${duplicate.id}-duplicate-${index}`] || ''}
// onChange={(event) => handleCommentChange(event, `${duplicate.id}-duplicate-${index}`)}
// placeholder="Add a comment"
// />
// </div>

// {/* Image Upload for Duplicated Question */}
// <div className="mt-2">
// <label>Upload Image (optional):</label>
// <input
// type="file"
// className="form-control-file"
// accept="image/*"
// onChange={(event) => handleImageChange(event, `${duplicate.id}-duplicate-${index}`)}
// />
// </div>
// </div>
// ))}
// </div>
// ))}
// </div>
// </div>
// ))}
// </div>
// ))}
// </div>
// ))}
// </div>
// ))}
// <button type="submit" className="btn btn-primary">Submit</button>
// </form>
// </div>
// );
// }

// export default AuditDetail;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    setFormResponses({
      ...formResponses,
      [questionId]: value,
    });
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [questionId]: { response: value }
    }));
  };

  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments({
      ...comments,
      [questionId]: value,
    });
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [`comment_${questionId}`]: { comment: value }
    }));
  };

  const handleImageChange = (event, questionId) => {
    const file = event.target.files[0];
    setImages({
      ...images,
      [questionId]: file,
    });
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [`image_${questionId}`]: { imageName: file.name }
    }));
  };

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    setDuplicates({
      ...duplicates,
      [id]: [...(duplicates[id] || []), questionObj],
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('auditId', auditId);

    Object.entries(formResponses).forEach(([questionId, response]) => {
      formData.append(`responses[${questionId}]`, response.response);
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
                            <div key={questionObj.id} className="form-group">
                              <label>
                                {questionObj.question}
                                {questionObj.information && (
                                  <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
                                    ℹ️
                                  </span>
                                )}
                              </label>
                              {/* Render input based on response type */}
                              {questionObj.response_type === 'Temperature' ? (
                                  <input
                                      type="number"
                                      value={formResponses[questionObj.id] || ''}
                                      onChange={(event) => handleInputChange(event, questionObj.id)}
                                      placeholder="Enter temperature"
                                  />
                              ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
                                  <div>
                                      {/* Color-coded radio buttons for C/PC/NC or OK/KO */}
                                      <div className="btn-group" role="group" aria-label={`${questionObj.response_type} options`}>
                                          {questionObj.response_type.split('/').map(option => (
                                              <React.Fragment key={option}>
                                                  <input
                                                      type="radio"
                                                      className="btn-check"
                                                      name={`options-${questionObj.id}`}
                                                      id={`${option}-${questionObj.id}`}
                                                      autoComplete="off"
                                                      value={option}
                                                      checked={formResponses[questionObj.id] === option}
                                                      onChange={(event) => handleInputChange(event, questionObj.id)}
                                                  />
                                                  <label
                                                      className={`btn ${option === 'C' || option === 'OK' ? 'btn-success' :
                                                                       option === 'PC' ? 'btn-warning' : 'btn-danger'}`}
                                                      htmlFor={`${option}-${questionObj.id}`}
                                                  >
                                                      {option}
                                                  </label>
                                              </React.Fragment>
                                          ))}
                                      </div>
                                  </div>
                              ) : (
                                  <select
                                      value={formResponses[questionObj.id] || ''}
                                      onChange={(event) => handleInputChange(event, questionObj.id)}
                                  >
                                      <option value="">Select</option>
                                      {questionObj.response_type.split('/').map((option) => (
                                          <option key={option} value={option}>{option}</option>
                                      ))}
                                  </select>
                              )}

                              {/* Comment Input */}
                              <div className="mt-2">
                                <label>Comment (optional):</label>
                                <textarea
                                  className="form-control"
                                  value={comments[questionObj.id] || ''}
                                  onChange={(event) => handleCommentChange(event, questionObj.id)}
                                  placeholder="Add a comment"
                                />
                              </div>

                              {/* Image Upload */}
                              <div className="mt-2">
                                <label>Upload Image (optional):</label>
                                <input
                                  type="file"
                                  className="form-control-file"
                                  accept="image/*"
                                  onChange={(event) => handleImageChange(event, questionObj.id)}
                                />
                              </div>

                              {/* Duplicate Button */}
                              <div className="mt-2">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={() => handleDuplicate(questionObj)}
                                >
                                  Duplicate
                                </button>
                              </div>

                              {/* Render duplicated questions */}
                              {(duplicates[questionObj.id] || []).map((duplicate, index) => (
                                <div key={`${duplicate.id}-duplicate-${index}`} className="card mt-3">
                                  <div className="card-body">
                                    <label>{duplicate.question} (Duplicate {index + 1})</label>
                                    <input
                                      type="text"
                                      value={formResponses[`${duplicate.id}-duplicate-${index}`] || ''}
                                      onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
                                    />
                                  </div>
                                </div>
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
