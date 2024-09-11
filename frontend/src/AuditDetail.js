// // // // import React, { useEffect, useState } from 'react';
// // // // import axios from 'axios';

// // // // function AuditDetail() {
// // // //   const [data, setData] = useState(null);  // State to store the data
// // // //   const [formResponses, setFormResponses] = useState({});  // State for form responses
// // // //   const [comments, setComments] = useState({});  // State for optional comments
// // // //   const [images, setImages] = useState({});  // State for optional images

// // // //   // Fetch audit detail data from the backend
// // // //   useEffect(() => {
// // // //     axios.get('/api/audit_detail')
// // // //       .then(response => {
// // // //         console.log('Fetched data:', response.data);  // Debug fetched data
// // // //         setData(response.data);  // Set the fetched data
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('There was an error fetching the data!', error);
// // // //       });
// // // //   }, []);

// // // //   // Handle form input change for audit details
// // // //   const handleInputChange = (event, questionId) => {
// // // //     setFormResponses({
// // // //       ...formResponses,
// // // //       [questionId]: event.target.value,
// // // //     });
// // // //   };

// // // //   // Handle comment input change
// // // //   const handleCommentChange = (event, questionId) => {
// // // //     setComments({
// // // //       ...comments,
// // // //       [questionId]: event.target.value,
// // // //     });
// // // //   };

// // // //   // Handle image file change
// // // //   const handleImageChange = (event, questionId) => {
// // // //     const file = event.target.files[0];
// // // //     setImages({
// // // //       ...images,
// // // //       [questionId]: file,
// // // //     });
// // // //   };

// // // //   // Submit audit detail form data
// // // //   const handleSubmit = (event) => {
// // // //     event.preventDefault();
// // // //     const formData = new FormData();

// // // //     Object.entries(formResponses).forEach(([questionId, response]) => {
// // // //       formData.append(`responses[${questionId}]`, response);
// // // //     });

// // // //     Object.entries(comments).forEach(([questionId, comment]) => {
// // // //       formData.append(`comments[${questionId}]`, comment);
// // // //     });

// // // //     Object.entries(images).forEach(([questionId, image]) => {
// // // //       if (image) {
// // // //         formData.append(`images[${questionId}]`, image);
// // // //       }
// // // //     });

// // // //     axios.post('/api/submit', formData, {
// // // //       headers: {
// // // //         'Content-Type': 'multipart/form-data',
// // // //       },
// // // //     })
// // // //       .then(response => {
// // // //         alert('Form submitted successfully!');
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('There was an error submitting the form!', error);
// // // //       });
// // // //   };

// // // //   // Ensure data exists before rendering
// // // //   if (!data) {
// // // //     return <div>Loading...</div>;
// // // //   }

// // // //   // Helper function to handle NaN values and replace them with empty string
// // // //   const cleanValue = (value) => {
// // // //     return value === null || value === undefined || isNaN(value) ? '' : value;
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>Audit Detail</h1>
// // // //       <form onSubmit={handleSubmit}>
// // // //         {Object.entries(data).map(([chapitre, sousChapitres]) => (
// // // //           <div key={chapitre}>
// // // //             <h2>{chapitre}</h2>
// // // //             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// // // //               <div key={sousChapitre}>
// // // //                 <h3>{sousChapitre}</h3>
// // // //                 {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// // // //                   <div key={paragraphe}>
// // // //                     <h4>{paragraphe}</h4>
// // // //                     {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
// // // //                       <div key={sousParagraphe}>
// // // //                         <h5>{sousParagraphe}</h5>
// // // //                         {Array.isArray(questions) ? (
// // // //   questions.map((questionObj) => (
// // // //     <div key={questionObj.id}>
// // // //       <label>{cleanValue(questionObj.question)}</label>
// // // //       {questionObj.response_type === 'Temperature' ? (
// // // //         <input
// // // //           type="number"
// // // //           value={formResponses[questionObj.id] || ''}
// // // //           onChange={(event) => handleInputChange(event, questionObj.id)}
// // // //         />
// // // //       ) : (
// // // //         <select
// // // //           value={formResponses[questionObj.id] || ''}
// // // //           onChange={(event) => handleInputChange(event, questionObj.id)}
// // // //         >
// // // //           {cleanValue(questionObj.response_type).split('/').map((option) => (
// // // //             <option key={option} value={option}>{option}</option>
// // // //           ))}
// // // //         </select>
// // // //       )}
// // // //       <div>
// // // //         <label>Comment (optional):</label>
// // // //         <textarea
// // // //           value={comments[questionObj.id] || ''}
// // // //           onChange={(event) => handleCommentChange(event, questionObj.id)}
// // // //         />
// // // //       </div>
// // // //       <div>
// // // //         <label>Upload Image (optional):</label>
// // // //         <input
// // // //           type="file"
// // // //           accept="image/*"
// // // //           onChange={(event) => handleImageChange(event, questionObj.id)}
// // // //         />
// // // //       </div>
// // // //     </div>
// // // //   ))
// // // // ) : (
// // // //   <p>No questions available for this subsection.</p>
// // // // )}
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         ))}
// // // //         <button type="submit">Submit</button>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default AuditDetail;




// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // function AuditDetail() {
// // //   const [data, setData] = useState(null);  // State to store the fetched data

// // //   // Fetch audit detail data from the backend
// // //   useEffect(() => {
// // //     axios.get('/api/audit_detail')
// // //       .then(response => {
// // //         console.log('Fetched data:', response.data);  // Debug fetched data
// // //         setData(response.data);  // Set the fetched data
// // //       })
// // //       .catch(error => {
// // //         console.error('There was an error fetching the data!', error);
// // //       });
// // //   }, []);

// // //   // Ensure data exists before rendering
// // //   if (!data) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   return (
// // //     <div>
// // //       <h1>Audit Detail</h1>
// // //       <pre>{JSON.stringify(data, null, 2)}</pre> {/* Pretty-print the JSON data */}
// // //     </div>
// // //   );
// // // }

// // // export default AuditDetail;



// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // function AuditDetail() {
// //   const [data, setData] = useState(null);  // State to store the data

// //   // Fetch audit detail data from the backend
// //   useEffect(() => {
// //     axios.get('/api/audit_detail')
// //       .then(response => {
// //         console.log('Fetched data:', response.data);  // Debug fetched data
// //         setData(response.data);  // Set the fetched data
// //       })
// //       .catch(error => {
// //         console.error('There was an error fetching the data!', error);
// //       });
// //   }, []);

// //   // Ensure data exists before rendering
// //   if (!data) {
// //     return <div>Loading...</div>;
// //   }

// //   return (
// //     <div>
// //       <h1>Audit Detail</h1>
// //       {Object.entries(data).map(([chapitre, sousChapitres]) => (
// //         <div key={chapitre}>
// //           <h2>{chapitre}</h2>
// //           {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
// //             <div key={sousChapitre}>
// //               <h3>{sousChapitre}</h3>
// //               {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
// //                 <div key={paragraphe}>
// //                   <h4>{paragraphe}</h4>
// //                   {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
// //                     <div key={sousParagraphe}>
// //                       <h5>{sousParagraphe}</h5>
// //                       {questions.map((questionObj) => (
// //                         <div key={questionObj.id}>
// //                           <p><strong>Question:</strong> {questionObj.question}</p>
// //                           <p><strong>Response Type:</strong> {questionObj.response_type}</p>
// //                           <p><strong>Information:</strong> {questionObj.information || "N/A"}</p>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ))}
// //                 </div>
// //               ))}
// //             </div>
// //           ))}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // export default AuditDetail;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function AuditDetail() {
//   const [data, setData] = useState(null);  // State to store the data
//   const [formResponses, setFormResponses] = useState({});  // State for form responses
//   const [comments, setComments] = useState({});  // State for optional comments
//   const [images, setImages] = useState({});  // State for optional images

//   // Fetch audit detail data from the backend
//   useEffect(() => {
//     axios.get('/api/audit_detail')
//       .then(response => {
//         console.log('Fetched data:', response.data);  // Debug fetched data
//         setData(response.data);  // Set the fetched data
//       })
//       .catch(error => {
//         console.error('There was an error fetching the data!', error);
//       });
//   }, []);

//   // Handle form input change for audit details
//   const handleInputChange = (event, questionId) => {
//     setFormResponses({
//       ...formResponses,
//       [questionId]: event.target.value,
//     });
//   };

//   // Handle comment input change
//   const handleCommentChange = (event, questionId) => {
//     setComments({
//       ...comments,
//       [questionId]: event.target.value,
//     });
//   };

//   // Handle image file change
//   const handleImageChange = (event, questionId) => {
//     const file = event.target.files[0];
//     setImages({
//       ...images,
//       [questionId]: file,
//     });
//   };

//   // Submit audit detail form data
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData();

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
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     })
//       .then(response => {
//         alert('Form submitted successfully!');
//       })
//       .catch(error => {
//         console.error('There was an error submitting the form!', error);
//       });
//   };

//   // Ensure data exists before rendering
//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h1>Audit Detail</h1>
//       <form onSubmit={handleSubmit}>
//         {Object.entries(data).map(([chapitre, sousChapitres]) => (
//           <div key={chapitre}>
//             <h2>{chapitre}</h2>
//             {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
//               <div key={sousChapitre}>
//                 <h3>{sousChapitre}</h3>
//                 {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
//                   <div key={paragraphe}>
//                     <h4>{paragraphe}</h4>
//                     {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
//                       <div key={sousParagraphe}>
//                         <h5>{sousParagraphe}</h5>
//                         {questions.map((questionObj) => (
//                           <div key={questionObj.id}>
//                             <label>
//                               {questionObj.question}
//                               {questionObj.information && (
//                                 <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
//                                   ℹ️
//                                 </span>
//                               )}
//                             </label>

//                             {/* Render different inputs based on the response type */}
//                             {questionObj.response_type === 'Temperature' ? (
//                               <input
//                                 type="number"
//                                 value={formResponses[questionObj.id] || ''}
//                                 onChange={(event) => handleInputChange(event, questionObj.id)}
//                                 placeholder="Enter temperature"
//                               />
//                             ) : (
//                               <select
//                                 value={formResponses[questionObj.id] || ''}
//                                 onChange={(event) => handleInputChange(event, questionObj.id)}
//                               >
//                                 <option value="">Select</option>
//                                 {questionObj.response_type.split('/').map((option) => (
//                                   <option key={option} value={option}>{option}</option>
//                                 ))}
//                               </select>
//                             )}

//                             {/* Comment Input */}
//                             <div>
//                               <label>Comment (optional):</label>
//                               <textarea
//                                 value={comments[questionObj.id] || ''}
//                                 onChange={(event) => handleCommentChange(event, questionObj.id)}
//                                 placeholder="Add a comment"
//                               />
//                             </div>

//                             {/* Image Upload */}
//                             <div>
//                               <label>Upload Image (optional):</label>
//                               <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(event) => handleImageChange(event, questionObj.id)}
//                               />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         ))}
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default AuditDetail;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AuditDetail() {
  const [data, setData] = useState(null);  // State to store the data
  const [formResponses, setFormResponses] = useState({});  // State for form responses
  const [comments, setComments] = useState({});  // State for optional comments
  const [images, setImages] = useState({});  // State for optional images
  const [duplicates, setDuplicates] = useState({});  // State to track duplicated questions

  // Fetch audit detail data from the backend
  useEffect(() => {
    axios.get('/api/audit_detail')
      .then(response => {
        console.log('Fetched data:', response.data);  // Debug fetched data
        setData(response.data);  // Set the fetched data
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  // Handle form input change for audit details
  const handleInputChange = (event, questionId) => {
    setFormResponses({
      ...formResponses,
      [questionId]: event.target.value,
    });
  };

  // Handle comment input change
  const handleCommentChange = (event, questionId) => {
    setComments({
      ...comments,
      [questionId]: event.target.value,
    });
  };

  // Handle image file change
  const handleImageChange = (event, questionId) => {
    const file = event.target.files[0];
    setImages({
      ...images,
      [questionId]: file,
    });
  };

  // Handle duplication of a question
  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    setDuplicates({
      ...duplicates,
      [id]: [...(duplicates[id] || []), questionObj],
    });
  };

  // Submit audit detail form data
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

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
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        alert('Form submitted successfully!');
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
      });
  };

  // Ensure data exists before rendering
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Audit Detail</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(data).map(([chapitre, sousChapitres]) => (
          <div key={chapitre}>
            <h2>{chapitre}</h2>
            {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
              <div key={sousChapitre}>
                <h3>{sousChapitre}</h3>
                {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => (
                  <div key={paragraphe}>
                    <h4>{paragraphe}</h4>
                    {Object.entries(sousParagraphes).map(([sousParagraphe, questions]) => (
                      <div key={sousParagraphe}>
                        <h5>{sousParagraphe}</h5>

                        {/* Questions Rendering */}
                        {questions.map((questionObj) => (
                          <div key={questionObj.id}>
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
                            <div>
                              <label>Comment (optional):</label>
                              <textarea
                                value={comments[questionObj.id] || ''}
                                onChange={(event) => handleCommentChange(event, questionObj.id)}
                                placeholder="Add a comment"
                              />
                            </div>

                            {/* Image Upload */}
                            <div>
                              <label>Upload Image (optional):</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageChange(event, questionObj.id)}
                              />
                            </div>

                            {/* Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => handleDuplicate(questionObj)}
                            >
                              Duplicate
                            </button>

                            {/* Render duplicated questions */}
                            {(duplicates[questionObj.id] || []).map((duplicate, index) => (
                              <div key={`${duplicate.id}-duplicate-${index}`}>
                                <label>{duplicate.question} (Duplicate {index + 1})</label>

                                {/* Render input for duplicated question */}
                                {duplicate.response_type === 'Temperature' ? (
                                  <input
                                    type="number"
                                    value={formResponses[`${duplicate.id}-duplicate-${index}`] || ''}
                                    onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
                                    placeholder="Enter temperature"
                                  />
                                ) : (
                                  <select
                                    value={formResponses[`${duplicate.id}-duplicate-${index}`] || ''}
                                    onChange={(event) => handleInputChange(event, `${duplicate.id}-duplicate-${index}`)}
                                  >
                                    <option value="">Select</option>
                                    {duplicate.response_type.split('/').map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                )}

                                {/* Comment Input for Duplicated Question */}
                                <div>
                                  <label>Comment (optional):</label>
                                  <textarea
                                    value={comments[`${duplicate.id}-duplicate-${index}`] || ''}
                                    onChange={(event) => handleCommentChange(event, `${duplicate.id}-duplicate-${index}`)}
                                    placeholder="Add a comment"
                                  />
                                </div>

                                {/* Image Upload for Duplicated Question */}
                                <div>
                                  <label>Upload Image (optional):</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => handleImageChange(event, `${duplicate.id}-duplicate-${index}`)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AuditDetail;
