// import React from 'react';
// import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
// import classNames from 'classnames';
// import ToggleableRadioButtons from './ToggleableRadioButtons'; // Import the new component

// function QuestionBaseComponent({
//   sousChapitre,
//   paragraphe,
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
//   setImages,
// }) {
//   const questionId = questionObj.duplicateId || questionObj.id; // Use duplicateId if it's a duplicate

//   // Generate unique ID for rendering by combining sousChapitre, paragraphe, and questionId
//   const uniqueQuestionId = `${sousChapitre}-${paragraphe}-${questionId}`;

//   const responseValue = formResponses[questionId]?.response || '';
//   const isAnswered = responseValue !== '';

//   const showAlert = () => {
//     if (questionObj.information) {
//       alert(questionObj.information);
//     }
//   };
//   const handleRemoveImage = (questionId, imageIndex) => {
//     const updatedImages = Array.from(images[questionId]).filter((_, index) => index !== imageIndex); // Remove the selected image
//     setImages((prevImages) => ({
//       ...prevImages,
//       [questionId]: updatedImages, // Update the state with the remaining images
//     }));
//     localStorage.setItem("auditResponses", JSON.stringify({
//       ...formResponses,
//       [`image_${questionId}`]: updatedImages, // Update the localStorage too
//     }));
//   };

//   return (
//     <div
//       key={uniqueQuestionId}  // Use unique ID as key
//       className={classNames('form-group d-flex flex-nowrap align-items-center justify-content', { 'answered-question': isAnswered })}
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
//       <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
//         {questionObj.response_type === 'Temperature' ? (
//           <input
//             type="number"
//             value={responseValue}
//             onChange={(event) => handleInputChange(event, questionId)}  // Use unique questionId
//             placeholder="Enter temperature"
//             className="form-control"
//           />
//         ) : (
//           <ToggleableRadioButtons
//             questionId={questionId}  // Pass the unique questionId or duplicateId
//             options={questionObj.response_type.split('/')}
//             formResponses={formResponses}
//             handleInputChange={handleInputChange}
//           />
//         )}
//       </div>

//       {/* Comment Input Field */}
//       <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
//         <label htmlFor={`comment-${questionId}`}>Comment</label> {/* Label with htmlFor attribute */}
//         <textarea
//           id={`comment-${questionId}`}  // Unique ID for the textarea
//           className="form-control"
//           value={comments[questionId] || ''}
//           onChange={(event) => handleCommentChange(event, questionId)}  // Use unique questionId
//           placeholder="..."
//         />
//       </div>

//       {/* Image Upload Field */}
//       <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
//         <label htmlFor={`file-input-${uniqueQuestionId}`} className="file-label">
//           <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
//         </label>
//         <input
//           type="file"
//           id={`file-input-${uniqueQuestionId}`}  // Use unique ID for the input
//           className="form-control-file"
//           accept="image/*"
//           multiple
//           style={{ display: 'none' }}
//           onChange={(event) => handleImageChange(event, questionId)}  // Use unique questionId
//         />

// <div className="uploaded-files" style={{ position: 'relative', height: '60px' }}>
//   {images[questionId] && Array.from(images[questionId]).map((file, index) => (
//     <div key={index} style={{ position: 'absolute', left: `${index * 15}px`, zIndex: index }}>
//       <img
//         src={URL.createObjectURL(file)} // Display the image as a mini version
//         alt={`Preview ${index}`}
//         style={{
//           width: '50px',
//           height: '50px',
//           objectFit: 'cover',
//           borderRadius: '5px',
//           border: '1px solid #ccc',
//         }}
//       />
//       <button
//         type="button"
//         onClick={() => handleRemoveImage(questionId, index)} // Call a remove function on click
//         style={{
//           position: 'absolute',
//           top: '-5px',
//           right: '-5px',
//           background: 'red',
//           color: 'white',
//           borderRadius: '50%',
//           border: 'none',
//           width: '18px',
//           height: '18px',
//           cursor: 'pointer',
//           fontSize: '12px',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         X
//       </button>
//     </div>
//   ))}
// </div>
//       </div>

//       {/* Duplicate and Remove Buttons */}
//       <div className="flex-item action-buttons" style={{ display: 'flex', gap: '10px' }}>
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
//           onClick={() => handleRemove(questionId)}  // Use unique questionId
//         >
//           X
//         </button>
//       </div>
//     </div>
//   );
// }

// export default QuestionBaseComponent;

import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
import classNames from 'classnames';
import ToggleableRadioButtons from './ToggleableRadioButtons'; // Import the new component

function QuestionBaseComponent({
  sousChapitre,
  paragraphe,
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
  setImages,
}) {
  const questionId = questionObj.duplicateId || questionObj.id; // Use duplicateId if it's a duplicate

  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image for modal view

  // Generate unique ID for rendering by combining sousChapitre, paragraphe, and questionId
  const uniqueQuestionId = `${sousChapitre}-${paragraphe}-${questionId}`;

  const responseValue = formResponses[questionId]?.response || '';
  const isAnswered = responseValue !== '';

  const showAlert = () => {
    if (questionObj.information) {
      alert(questionObj.information);
    }
  };

  // Handle removing an image
  const handleRemoveImage = () => {
    const updatedImages = Array.from(images[questionId]).filter(
      (file) => file !== selectedImage
    );
    setImages((prevImages) => ({
      ...prevImages,
      [questionId]: updatedImages,
    }));
    localStorage.setItem(
      "auditResponses",
      JSON.stringify({
        ...formResponses,
        [`image_${questionId}`]: updatedImages,
      })
    );
    setSelectedImage(null);
  };

  // Open the modal with a selected image
  const handleImageClick = (image) => {
    setSelectedImage(image); // Show full-size image on click
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
            onChange={(event) => handleInputChange(event, questionId)}  // Use unique questionId
            placeholder="Enter temperature"
            className="form-control"
          />
        ) : (
          <ToggleableRadioButtons
            questionId={questionId}  // Pass the unique questionId or duplicateId
            options={questionObj.response_type.split('/')}
            formResponses={formResponses}
            handleInputChange={handleInputChange}
          />
        )}
      </div>

      {/* Comment Input Field */}
      <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <label htmlFor={`comment-${questionId}`}>Comment</label> {/* Label with htmlFor attribute */}
        <textarea
          id={`comment-${questionId}`}  // Unique ID for the textarea
          className="form-control"
          value={comments[questionId] || ''}
          onChange={(event) => handleCommentChange(event, questionId)}  // Use unique questionId
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
          onChange={(event) => handleImageChange(event, questionId)}  // Use unique questionId
        />

        <div className="uploaded-files" style={{ position: 'relative', height: '60px' }}>
          {images[questionId] && Array.from(images[questionId]).map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '5px',
                marginRight: '5px',
                cursor: 'pointer',
              }}
              onClick={() => handleImageClick(file)} // Show full-size image on click
            />
          ))}
        </div>
      </div>

      {/* Duplicate and Remove Buttons */}
      <div className="flex-item action-buttons" style={{ display: 'flex', gap: '10px' }}>
        {!isDuplicate && (
          <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            console.log("Duplicate button clicked for question:", questionObj.id); // Log for debugging
            handleDuplicate(questionObj);
          }}
        >
          +
        </button>
        )}
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleRemove(questionObj)} // Call handleRemove
        >
          X
        </button>
      </div>

      {/* Modal for viewing the full-size image */}
      {selectedImage && (
        <div className="image-modal" style={modalStyles}>
          <div style={modalContentStyles}>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
            <button
              style={closeButtonStyles}
              onClick={() => setSelectedImage(null)} // Close the modal
            >
              Close
            </button>
            <button
              style={removeButtonStyles}
              onClick={handleRemoveImage} // Remove the image
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Styles
const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  position: 'relative',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#ccc',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
};

const removeButtonStyles = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
};

export default QuestionBaseComponent;
