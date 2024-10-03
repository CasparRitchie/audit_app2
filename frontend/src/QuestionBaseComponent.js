// // import React from 'react';
// // import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
// // import classNames from 'classnames';
// // import ToggleableRadioButtons from './ToggleableRadioButtons'; // Import the new component

// // function QuestionBaseComponent({
// //   questionObj,
// //   formResponses = {},
// //   handleInputChange,
// //   handleCommentChange,
// //   handleImageChange,
// //   isDuplicate = false, // Prop to differentiate between original and duplicate questions
// //   handleDuplicate,
// //   handleRemove,
// //   comments = {},
// //   images = {},
// // }) {
// //   const questionId = questionObj.id || questionObj.duplicateId;

// //   const responseValue = formResponses[questionId]?.response || '';
// //   const isAnswered = responseValue !== '';

// //   const showAlert = () => {
// //     if (questionObj.information) {
// //       alert(questionObj.information);
// //     }
// //   };

// //   return (
// //     <div
// //       key={questionId}
// //       className={classNames('form-group d-flex flex-nowrap align-items-center justify-content', { 'answered-question': isAnswered })}
// //     >
// //       {/* Question Label */}
// //       <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
// //         <label>
// //           {questionObj.question} {isDuplicate && `(Duplicate ${questionObj.index !== undefined ? questionObj.index + 1 : 1})`}
// //           {questionObj.information && (
// //             <span
// //               onClick={showAlert}
// //               style={{ marginLeft: '10px', cursor: 'pointer' }}
// //             >
// //               ℹ️
// //             </span>
// //           )}
// //         </label>
// //       </div>

// //       {/* Response Input Field */}
// //       <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
// //         {questionObj.response_type === 'Temperature' ? (
// //           <input
// //             type="number"
// //             value={responseValue}
// //             onChange={(event) => handleInputChange(event, questionId)}
// //             placeholder="Enter temperature"
// //             className="form-control"
// //           />
// //         ) : (
// //           <ToggleableRadioButtons
// //             questionId={questionId}
// //             options={questionObj.response_type.split('/')}
// //             formResponses={formResponses}
// //             handleInputChange={handleInputChange}
// //           />
// //         )}
// //       </div>

// //       {/* Comment Input Field */}
// //       <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
// //         <textarea
// //           className="form-control"
// //           value={comments[questionId] || ''}
// //           onChange={(event) => handleCommentChange(event, questionId)}
// //           placeholder="..."
// //         />
// //       </div>

// //       {/* Image Upload Field */}
// //       <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
// //         <label htmlFor={`file-input-${questionId}`} className="file-label">
// //           <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
// //         </label>
// //         <input
// //           type="file"
// //           id={`file-input-${questionId}`}
// //           className="form-control-file"
// //           accept="image/*"
// //           multiple
// //           style={{ display: 'none' }}
// //           onChange={(event) => handleImageChange(event, questionId)}
// //         />
// //         <div className="uploaded-files">
// //           {images[questionId] && Array.from(images[questionId]).map((file, index) => (
// //             <span key={index} style={{ fontSize: '0.8rem' }}>{file.name}</span>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Duplicate and Remove Buttons */}
// //       <div className="flex-item action-buttons" style={{ display: 'flex', gap: '10px' }}>
// //         {!isDuplicate && (
// //           <button
// //             type="button"
// //             className="btn btn-secondary"
// //             onClick={() => handleDuplicate(questionObj)}
// //           >
// //             +
// //           </button>
// //         )}
// //         <button
// //           type="button"
// //           className="btn btn-danger"
// //           onClick={() => handleRemove(questionId)}
// //         >
// //           X
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default QuestionBaseComponent;


// import React from 'react';
// import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
// import classNames from 'classnames';
// import ToggleableRadioButtons from './ToggleableRadioButtons'; // Import the new component

// function QuestionBaseComponent({
//   questionObj,
//   formResponses = {},
//   handleInputChange,
//   handleCommentChange,
//   handleImageChange,
//   isDuplicate = false, // Prop to differentiate between original and duplicate questions
//   handleDuplicate,
//   handleRemove,
//   comments = {},
//   images = {},
// }) {
//   const questionId = questionObj.id || questionObj.duplicateId;
//   const responseValue = formResponses[questionId]?.response || '';
//   const isAnswered = responseValue !== '';

//   const showAlert = () => {
//     if (questionObj.information) {
//       alert(questionObj.information);
//     }
//   };

//   return (
//     <div
//       key={questionId}
//       className={classNames('form-group d-flex align-items-center', { 'answered-question': isAnswered })}
//       style={{ justifyContent: 'space-between', gap: '15px' }} // Spread items with space-between
//     >
//       {/* Question Label */}
//       <div className="flex-item question" style={{ flexBasis: '200px', flexShrink: 0 }}>
//         <label>
//           {questionObj.question} {isDuplicate && `(Duplicate ${questionObj.index !== undefined ? questionObj.index + 1 : 1})`}
//           {questionObj.information && (
//             <span
//               onClick={showAlert}
//               style={{ marginLeft: '10px', cursor: 'pointer' }}
//             >
//               ℹ️
//             </span>
//           )}
//         </label>
//       </div>

//       {/* Response Input Field */}
//       <div className="flex-item response-field" style={{ flexGrow: 1 }}>
//         {questionObj.response_type === 'Temperature' ? (
//           <input
//             type="number"
//             value={responseValue}
//             onChange={(event) => handleInputChange(event, questionId)}
//             placeholder="Enter temperature"
//             className="form-control"
//           />
//         ) : (
//           <ToggleableRadioButtons
//             questionId={questionId}
//             options={questionObj.response_type.split('/')}
//             formResponses={formResponses}
//             handleInputChange={handleInputChange}
//           />
//         )}
//       </div>

//       {/* Comment Input Field */}
//       <div className="flex-item comment-field" style={{ flexGrow: 1 }}>
//         <textarea
//           className="form-control"
//           value={comments[questionId] || ''}
//           onChange={(event) => handleCommentChange(event, questionId)}
//           placeholder="..."
//         />
//       </div>

//       {/* Image Upload Field */}
//       <div className="flex-item image-upload" style={{ flexGrow: 1 }}>
//         <label htmlFor={`file-input-${questionId}`} className="file-label">
//           <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
//         </label>
//         <input
//           type="file"
//           id={`file-input-${questionId}`}
//           className="form-control-file"
//           accept="image/*"
//           multiple
//           style={{ display: 'none' }}
//           onChange={(event) => handleImageChange(event, questionId)}
//         />
//         <div className="uploaded-files">
//           {images[questionId] && Array.from(images[questionId]).map((file, index) => (
//             <span key={index} style={{ fontSize: '0.8rem' }}>{file.name}</span>
//           ))}
//         </div>
//       </div>

//       {/* Duplicate and Remove Buttons */}
//       <div className="flex-item action-buttons" style={{ flexShrink: 0, display: 'flex', gap: '10px' }}>
//         {!isDuplicate && (
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => handleDuplicate(questionObj)}
//           >
//             +
//           </button>
//         )}
//         <button
//           type="button"
//           className="btn btn-danger"
//           onClick={() => handleRemove(questionId)}
//         >
//           X
//         </button>
//       </div>
//     </div>
//   );
// }

// export default QuestionBaseComponent;


import React from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
import classNames from 'classnames';
import ToggleableRadioButtons from './ToggleableRadioButtons'; // Import the new component

function QuestionBaseComponent({
  sousChapitre,       // Pass sousChapitre as prop
  paragraphe,         // Pass paragraphe as prop
  questionObj,
  formResponses = {},
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  isDuplicate = false, // Prop to differentiate between original and duplicate questions
  handleDuplicate,
  handleRemove,
  comments = {},
  images = {},
}) {
  const questionId = questionObj.id || questionObj.duplicateId;

  // Generate unique ID by combining sousChapitre, paragraphe, and questionId
  const uniqueQuestionId = `${sousChapitre}-${paragraphe}-${questionId}`;

  const responseValue = formResponses[questionId]?.response || '';
  const isAnswered = responseValue !== '';

  const showAlert = () => {
    if (questionObj.information) {
      alert(questionObj.information);
    }
  };

  return (
    <div
      key={uniqueQuestionId}  // Use unique ID as key
      className={classNames('form-group d-flex flex-nowrap align-items-center justify-content', { 'answered-question': isAnswered })}
    >
      {/* Question Label */}
      <div className="flex-item question" style={{ flexBasis: '200px', flexShrink: 0 }}>
        <label>
          {questionObj.question} {isDuplicate && `(Duplicate ${questionObj.index !== undefined ? questionObj.index + 1 : 1})`}
          {questionObj.information && (
            <span
              onClick={showAlert}
              style={{ marginLeft: '10px', cursor: 'pointer' }}
            >
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
            onChange={(event) => handleInputChange(event, questionId)}
            placeholder="Enter temperature"
            className="form-control"
          />
        ) : (
          <ToggleableRadioButtons
            questionId={questionId}
            options={questionObj.response_type.split('/')}
            formResponses={formResponses}
            handleInputChange={handleInputChange}
          />
        )}
      </div>

      {/* Comment Input Field */}
      <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <textarea
          className="form-control"
          value={comments[questionId] || ''}
          onChange={(event) => handleCommentChange(event, questionId)}
          placeholder="..."
        />
      </div>

      {/* Image Upload Field */}
      <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
        <label htmlFor={`file-input-${uniqueQuestionId}`} className="file-label">
          <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
        </label>
        <input
          type="file"
          id={`file-input-${uniqueQuestionId}`}  // Use unique ID for the input
          className="form-control-file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(event) => handleImageChange(event, questionId)}
        />
        <div className="uploaded-files">
          {images[questionId] && Array.from(images[questionId]).map((file, index) => (
            <span key={index} style={{ fontSize: '0.8rem' }}>{file.name}</span>
          ))}
        </div>
      </div>

      {/* Duplicate and Remove Buttons */}
      <div className="flex-item action-buttons" style={{ display: 'flex', gap: '10px' }}>
        {!isDuplicate && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleDuplicate(questionObj)}
          >
            +
          </button>
        )}
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleRemove(questionId)}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default QuestionBaseComponent;
