// // import React from 'react';
// // import classNames from 'classnames'; // For conditional class assignment

// // function QuestionComponent({
// //   questionObj,
// //   formResponses = {}, // Default to an empty object to prevent undefined errors
// //   handleInputChange,
// //   handleCommentChange,
// //   handleImageChange,
// //   handleDuplicate,
// //   comments = {}, // Default to an empty object to prevent undefined errors
// //   images = {}, // Default to an empty object to prevent undefined errors
// // }) {
// //   // Check if the question has been answered based on the response type
// //   const responseValue = formResponses[questionObj.id]?.response || ''; // Get the response value safely
// //   const isAnswered = responseValue !== ''; // Consider question answered if it has a non-empty response

// //   return (
// //     <div
// //       key={questionObj.id}
// //       className={classNames('form-group', { 'answered-question': isAnswered })} // Apply greyed-out style if answered
// //     >
// //       <label>
// //         {questionObj.question}
// //         {questionObj.information && (
// //           <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
// //             ℹ️
// //           </span>
// //         )}
// //       </label>

// //       {/* Render input based on response type */}
// //       {questionObj.response_type === 'Temperature' ? (
// //         <input
// //           type="number"
// //           value={responseValue}
// //           onChange={(event) => handleInputChange(event, questionObj.id)}
// //           placeholder="Enter temperature"
// //         />
// //       ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
// //         <div>
// //           <div className="btn-group" role="group" aria-label={`${questionObj.response_type} options`}>
// //             {questionObj.response_type.split('/').map((option) => (
// //               <React.Fragment key={option}>
// //                 <input
// //                   type="radio"
// //                   className="btn-check"
// //                   name={`options-${questionObj.id}`}
// //                   id={`${option}-${questionObj.id}`}
// //                   autoComplete="off"
// //                   value={option}
// //                   checked={responseValue === option} // Check if this option is selected
// //                   onChange={(event) => handleInputChange(event, questionObj.id)}
// //                 />
// //                 <label
// //                   className={`btn ${
// //                     option === 'C' || option === 'OK' ? 'btn-success' : option === 'PC' ? 'btn-warning' : 'btn-danger'
// //                   }`}
// //                   htmlFor={`${option}-${questionObj.id}`}
// //                 >
// //                   {option}
// //                 </label>
// //               </React.Fragment>
// //             ))}
// //           </div>
// //         </div>
// //       ) : (
// //         <select
// //           value={responseValue}
// //           onChange={(event) => handleInputChange(event, questionObj.id)}
// //         >
// //           <option value="">Selectionner</option>
// //           {questionObj.response_type.split('/').map((option) => (
// //             <option key={option} value={option}>
// //               {option}
// //             </option>
// //           ))}
// //         </select>
// //       )}

// //       {/* Comment Input */}
// //       <div className="mt-2">
// //         <label>Commentaire:</label>
// //         <textarea
// //           className="form-control"
// //           value={comments[questionObj.id] || ''} // Default to empty string if undefined
// //           onChange={(event) => handleCommentChange(event, questionObj.id)}
// //           placeholder="Add a comment"
// //         />
// //       </div>

// //       {/* Image Upload */}
// //       <div className="mt-2">
// //         <label>Ajouter Image (optional):</label>
// //         <input
// //           type="file"
// //           className="form-control-file"
// //           accept="image/*"
// //           onChange={(event) => handleImageChange(event, questionObj.id)}
// //         />
// //       </div>

// //       {/* Duplicate Button */}
// //       <div className="mt-2">
// //         <button
// //           type="button"
// //           className="btn btn-secondary"
// //           onClick={() => handleDuplicate(questionObj)}
// //         >
// //           Duplicate
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default QuestionComponent;


// import React from 'react';
// import classNames from 'classnames'; // For conditional class assignment

// function QuestionComponent({
//   questionObj,
//   formResponses = {}, // Default to an empty object to prevent undefined errors
//   handleInputChange,
//   handleCommentChange,
//   handleImageChange,
//   handleDuplicate,
//   comments = {}, // Default to an empty object to prevent undefined errors
//   images = {}, // Default to an empty object to prevent undefined errors
// }) {
//   // Check if the question has been answered based on the response type
//   const responseValue = formResponses[questionObj.id]?.response || ''; // Get the response value safely
//   const isAnswered = responseValue !== ''; // Consider question answered if it has a non-empty response

//   return (
//     <div
//       key={questionObj.id}
//       className={classNames('form-group d-flex flex-wrap align-items-start', { 'answered-question': isAnswered })} // Apply greyed-out style if answered
//     >
//       {/* Question Label and Information Bubble */}
//       <div className="flex-item question">
//         <label>
//           {questionObj.question}
//           {questionObj.information && (
//             <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
//               ℹ️
//             </span>
//           )}
//         </label>
//       </div>

//       {/* Response Input Field */}
//       <div className="flex-item response-field">
//         {questionObj.response_type === 'Temperature' ? (
//           <input
//             type="number"
//             value={responseValue}
//             onChange={(event) => handleInputChange(event, questionObj.id)}
//             placeholder="Enter temperature"
//             className="form-control"
//           />
//         ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
//           <div className="btn-group" role="group" aria-label={`${questionObj.response_type} options`}>
//             {questionObj.response_type.split('/').map((option) => (
//               <React.Fragment key={option}>
//                 <input
//                   type="radio"
//                   className="btn-check"
//                   name={`options-${questionObj.id}`}
//                   id={`${option}-${questionObj.id}`}
//                   autoComplete="off"
//                   value={option}
//                   checked={responseValue === option}
//                   onChange={(event) => handleInputChange(event, questionObj.id)}
//                 />
//                 <label
//                   className={`btn ${
//                     option === 'C' || option === 'OK' ? 'btn-success' : option === 'PC' ? 'btn-warning' : 'btn-danger'
//                   }`}
//                   htmlFor={`${option}-${questionObj.id}`}
//                 >
//                   {option}
//                 </label>
//               </React.Fragment>
//             ))}
//           </div>
//         ) : (
//           <select
//             value={responseValue}
//             onChange={(event) => handleInputChange(event, questionObj.id)}
//             className="form-control"
//           >
//             <option value="">Selectionner</option>
//             {questionObj.response_type.split('/').map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>

//       {/* Comment Input Field */}
//       <div className="flex-item comment-field">
//         <textarea
//           className="form-control"
//           value={comments[questionObj.id] || ''} // Default to empty string if undefined
//           onChange={(event) => handleCommentChange(event, questionObj.id)}
//           placeholder="Add a comment"
//         />
//       </div>

//       {/* Image Upload Field */}
//       <div className="flex-item image-upload">
//         <input
//           type="file"
//           className="form-control-file"
//           accept="image/*"
//           onChange={(event) => handleImageChange(event, questionObj.id)}
//         />
//       </div>

//       {/* Duplicate Button */}
//       <div className="flex-item duplicate-button mt-2">
//         <button
//           type="button"
//           className="btn btn-secondary"
//           onClick={() => handleDuplicate(questionObj)}
//         >
//           Duplicate
//         </button>
//       </div>
//     </div>
//   );
// }

// export default QuestionComponent;


import React from 'react';
import classNames from 'classnames'; // For conditional class assignment

function QuestionComponent({
  questionObj,
  formResponses = {}, // Default to an empty object to prevent undefined errors
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  handleDuplicate,
  comments = {}, // Default to an empty object to prevent undefined errors
  images = {}, // Default to an empty object to prevent undefined errors
}) {
  // Check if the question has been answered based on the response type
  const responseValue = formResponses[questionObj.id]?.response || ''; // Get the response value safely
  const isAnswered = responseValue !== ''; // Consider question answered if it has a non-empty response

  return (
    <div
      key={questionObj.id}
      className={classNames('form-group d-flex flex-nowrap align-items-center', { 'answered-question': isAnswered })} // Ensure items are on a single row
    >
      {/* Question Label and Information Bubble */}
      <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <label>
          {questionObj.question}
          {questionObj.information && (
            <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
              ℹ️
            </span>
          )}
        </label>
      </div>

      {/* Response Input Field */}
      <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
        {questionObj.response_type === 'Temperature' ? (
          <input
            type="number"
            value={responseValue}
            onChange={(event) => handleInputChange(event, questionObj.id)}
            placeholder="Enter temperature"
            className="form-control"
          />
        ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
          <div className="btn-group" role="group" aria-label={`${questionObj.response_type} options`}>
            {questionObj.response_type.split('/').map((option) => (
              <React.Fragment key={option}>
                <input
                  type="radio"
                  className="btn-check"
                  name={`options-${questionObj.id}`}
                  id={`${option}-${questionObj.id}`}
                  autoComplete="off"
                  value={option}
                  checked={responseValue === option}
                  onChange={(event) => handleInputChange(event, questionObj.id)}
                />
                <label
                  className={`btn ${
                    option === 'C' || option === 'OK' ? 'btn-success' : option === 'PC' ? 'btn-warning' : 'btn-danger'
                  }`}
                  htmlFor={`${option}-${questionObj.id}`}
                >
                  {option}
                </label>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <select
            value={responseValue}
            onChange={(event) => handleInputChange(event, questionObj.id)}
            className="form-control"
          >
            <option value="">Selectionner</option>
            {questionObj.response_type.split('/').map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Comment Input Field */}
      <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <textarea
          className="form-control"
          value={comments[questionObj.id] || ''} // Default to empty string if undefined
          onChange={(event) => handleCommentChange(event, questionObj.id)}
          placeholder="Add a comment"
        />
      </div>

      {/* Image Upload Field */}
      <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
        <input
          type="file"
          className="form-control-file"
          accept="image/*"
          onChange={(event) => handleImageChange(event, questionObj.id)}
        />
      </div>

      {/* Duplicate Button */}
      <div className="flex-item duplicate-button mt-2" style={{ flexBasis: '10%', flexShrink: 0 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleDuplicate(questionObj)}
        >
          Duplicate
        </button>
      </div>
    </div>
  );
}

export default QuestionComponent;
