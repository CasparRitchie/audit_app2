// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';  // Generate unique IDs for duplicated questions

// function App() {
//   const [data, setData] = useState(null);  // State to store the data
//   const [formResponses, setFormResponses] = useState({});  // State for form responses
//   const [comments, setComments] = useState({});  // State for optional comments
//   const [images, setImages] = useState({});  // State for optional images
//   const [questionOrder, setQuestionOrder] = useState({});  // Keep track of the order of questions

//   // Fetch data from Flask backend when the component mounts
//   useEffect(() => {
//     axios.get('/api/data')  // Use relative path
//       .then(response => {
//         setData(response.data);  // Set the fetched data

//         // Set the initial question order
//         const initialOrder = {};
//         Object.entries(response.data).forEach(([chapitre, sousChapitres]) => {
//           initialOrder[chapitre] = {};
//           Object.entries(sousChapitres).forEach(([sousChapitre, paragraphes]) => {
//             initialOrder[chapitre][sousChapitre] = {};
//             Object.entries(paragraphes).forEach(([paragraphe, sousParagraphes]) => {
//               initialOrder[chapitre][sousChapitre][paragraphe] = {};
//               Object.entries(sousParagraphes).forEach(([sousParagraphe, questions]) => {
//                 initialOrder[chapitre][sousChapitre][paragraphe][sousParagraphe] = questions.map(q => q.id);
//               });
//             });
//           });
//         });
//         setQuestionOrder(initialOrder);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the data!', error);
//       });
//   }, []);

//   // Handle form input change
//   const handleInputChange = (event, questionId) => {
//     setFormResponses({
//       ...formResponses,
//       [questionId]: event.target.value,
//     });
//   };

//   // Handle comment change
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
//       [questionId]: file,  // Store the file in state
//     });
//   };

//   // Handle duplication of a question, placing it directly below the original
//   const handleDuplicateQuestion = (originalQuestion, chapitre, sousChapitre, paragraphe, sousParagraphe) => {
//     const duplicatedQuestion = { ...originalQuestion, id: uuidv4() };  // Generate a new ID for the duplicated question

//     // Insert the duplicated question right after the original one
//     const updatedOrder = { ...questionOrder };
//     const originalIndex = updatedOrder[chapitre][sousChapitre][paragraphe][sousParagraphe].indexOf(originalQuestion.id);

//     updatedOrder[chapitre][sousChapitre][paragraphe][sousParagraphe].splice(originalIndex + 1, 0, duplicatedQuestion.id);

//     setQuestionOrder(updatedOrder);
//     setData({
//       ...data,
//       [chapitre]: {
//         ...data[chapitre],
//         [sousChapitre]: {
//           ...data[chapitre][sousChapitre],
//           [paragraphe]: {
//             ...data[chapitre][sousChapitre][paragraphe],
//             [sousParagraphe]: [
//               ...data[chapitre][sousChapitre][paragraphe][sousParagraphe],
//               duplicatedQuestion
//             ]
//           }
//         }
//       }
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const formData = new FormData();  // Use FormData to handle text and file uploads

//     // Append form responses
//     Object.entries(formResponses).forEach(([questionId, response]) => {
//       formData.append(`responses[${questionId}]`, response);
//     });

//     // Append comments
//     Object.entries(comments).forEach(([questionId, comment]) => {
//       formData.append(`comments[${questionId}]`, comment);
//     });

//     // Append images
//     Object.entries(images).forEach(([questionId, image]) => {
//       if (image) {
//         formData.append(`images[${questionId}]`, image);
//       }
//     });

//     // Send form data to Flask backend
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

//   // Check if data is null (still loading) and show a loading message
//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   // Render the form when data is available
//   return (
//     <div>
//       <h1>Form from CSV Data</h1>
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
//                         {Array.isArray(questions) && questionOrder[chapitre] && questionOrder[chapitre][sousChapitre] && questionOrder[chapitre][sousChapitre][paragraphe] && questionOrder[chapitre][sousChapitre][paragraphe][sousParagraphe] ? (
//                           questionOrder[chapitre][sousChapitre][paragraphe][sousParagraphe].map((questionId) => {
//                             const questionObj = questions.find(q => q.id === questionId);
//                             return (
//                               <div key={questionObj.id}>
//                                 <label>{questionObj.question}</label>

//                                 {/* Information bubble */}
//                                 {questionObj.information && questionObj.information !== "NaN" ? (
//                                   <span
//                                     title={questionObj.information}
//                                     style={{
//                                       marginLeft: '10px',
//                                       cursor: 'pointer',
//                                       fontSize: '18px',
//                                     }}
//                                   >
//                                     ℹ️
//                                   </span>
//                                 ) : null}

//                                 {questionObj.response_type === 'Temperature' ? (
//                                   <input
//                                     type="number"
//                                     value={formResponses[questionObj.id] || ''}
//                                     onChange={(event) => handleInputChange(event, questionObj.id)}
//                                   />
//                                 ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
//                                   <div>
//                                     {questionObj.response_type.split('/').map((option) => (
//                                       <label key={option}>
//                                         <input
//                                           type="radio"
//                                           name={questionObj.id}
//                                           value={option}
//                                           checked={formResponses[questionObj.id] === option}
//                                           onChange={(event) => handleInputChange(event, questionObj.id)}
//                                         />
//                                         {option}
//                                       </label>
//                                     ))}
//                                   </div>
//                                 ) : (
//                                   <select
//                                     value={formResponses[questionObj.id] || ''}
//                                     onChange={(event) => handleInputChange(event, questionObj.id)}
//                                   >
//                                     {questionObj.response_type.split('/').map((option) => (
//                                       <option key={option} value={option}>{option}</option>
//                                     ))}
//                                   </select>
//                                 )}

//                                 {/* Optional comment input */}
//                                 <div>
//                                   <label>Comment (optional):</label>
//                                   <textarea
//                                     value={comments[questionObj.id] || ''}
//                                     onChange={(event) => handleCommentChange(event, questionObj.id)}
//                                   />
//                                 </div>

//                                 {/* Optional image upload */}
//                                 <div>
//                                   <label>Upload Image (optional):</label>
//                                   <input
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(event) => handleImageChange(event, questionObj.id)}
//                                   />
//                                 </div>

//                                                                 {/* Duplicate button */}
//                                                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleDuplicateQuestion(
//                                       questionObj,
//                                       chapitre,
//                                       sousChapitre,
//                                       paragraphe,
//                                       sousParagraphe
//                                     )
//                                   }
//                                 >
//                                   Duplicate
//                                 </button>
//                               </div>
//                             );
//                           })
//                         ) : (
//                           <p>No questions available for this section.</p>
//                         )}
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

// export default App;






import React from 'react';
import AuditHeader from './AuditHeader';
import AuditDetail from './AuditDetail';

function App() {
  console.log("App.js is loaded");
  return (
    <div>
      {/* Render Audit Header */}
      <AuditHeader />

      {/* Render Audit Detail */}
      <AuditDetail />
    </div>
  );
}

export default App;
