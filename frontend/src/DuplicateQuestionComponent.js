// import React from 'react';
// import { FaCamera } from 'react-icons/fa';

// function DuplicateQuestionComponent({
//   duplicate,
//   index,
//   formResponses,
//   handleInputChange,
//   handleCommentChange,
//   handleImageChange,
//   comments,
//   images,
// }) {
//   const isSelected = (option) => formResponses[duplicate.duplicateId]?.response === option;

//   const getButtonColor = (option) => {
//     if (option === 'C' || option === 'OK') return 'btn-success';
//     if (option === 'PC') return 'custom-btn-warning';
//     if (option === 'NC' || option === 'KO') return 'btn-danger';
//     return 'custom-btn-secondary';
//   };

//   return (
//     <div key={duplicate.duplicateId} className="d-flex align-items-center">
//       {/* Question Label */}
//       <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
//         <label>{duplicate.question} (Duplicate {index + 1})</label>
//       </div>

//       {/* Response Buttons */}
//       <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
//         {duplicate.response_type === 'Temperature' ? (
//           <input
//             type="number"
//             value={formResponses[duplicate.duplicateId]?.response || ''}
//             onChange={(event) => handleInputChange(event, duplicate.duplicateId)}
//             placeholder="Enter temperature"
//             className="form-control"
//           />
//         ) : (
//           <div className="btn-group" role="group">
//             {duplicate.response_type.split('/').map((option) => (
//               <React.Fragment key={option}>
//                 <input
//                   type="radio"
//                   className="btn-check"
//                   name={`options-${duplicate.duplicateId}`}
//                   id={`${option}-${duplicate.duplicateId}`}
//                   autoComplete="off"
//                   value={option}
//                   checked={isSelected(option)}
//                   onChange={(event) => handleInputChange(event, duplicate.duplicateId)}
//                 />
//                 <label
//                   className={`btn ${isSelected(option) ? getButtonColor(option) : 'custom-btn-secondary'}`}
//                   htmlFor={`${option}-${duplicate.duplicateId}`}
//                 >
//                   {option}
//                 </label>
//               </React.Fragment>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Comment Input Field */}
//       <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
//         <textarea
//           className="form-control"
//           value={comments[duplicate.duplicateId] || ''}
//           onChange={(event) => handleCommentChange(event, duplicate.duplicateId)}
//           placeholder="..."
//         />
//       </div>

//       {/* Image Upload Field */}
//       <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
//         <label htmlFor={`file-input-${duplicate.duplicateId}`} className="file-label">
//           <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
//         </label>
//         <input
//           type="file"
//           id={`file-input-${duplicate.duplicateId}`}
//           className="form-control-file"
//           accept="image/*"
//           multiple
//           style={{ display: 'none' }} // Hide the input
//           onChange={(event) => handleImageChange(event, duplicate.duplicateId)}
//         />
//         {/* Optional: Display uploaded filenames */}
//         <div className="uploaded-files">
//           {images[duplicate.duplicateId] && Array.from(images[duplicate.duplicateId]).map((file, index) => (
//             <span key={index} style={{ fontSize: '0.8rem' }}>{file.name}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DuplicateQuestionComponent;


import React from 'react';
import { FaCamera } from 'react-icons/fa';

function DuplicateQuestionComponent({
  duplicate,
  index,
  formResponses,
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  comments,
  images,
}) {
  const isSelected = (option) => formResponses[duplicate.duplicateId]?.response === option;

  const getButtonColor = (option) => {
    if (option === 'C' || option === 'OK') return 'btn-success';
    if (option === 'PC') return 'custom-btn-warning';
    if (option === 'NC' || option === 'KO') return 'btn-danger';
    return 'custom-btn-secondary';
  };

  return (
    <div key={duplicate.duplicateId} className="d-flex align-items-center question-row">
      {/* Question Label */}
      <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <label>{duplicate.question} (Duplicate {index + 1})</label>
      </div>

      {/* Response Buttons */}
      <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
        {duplicate.response_type === 'Temperature' ? (
          <input
            type="number"
            value={formResponses[duplicate.duplicateId]?.response || ''}
            onChange={(event) => handleInputChange(event, duplicate.duplicateId)}
            placeholder="Enter temperature"
            className="form-control"
          />
        ) : (
          <div className="btn-group" role="group">
            {duplicate.response_type.split('/').map((option) => (
              <React.Fragment key={option}>
                <input
                  type="radio"
                  className="btn-check"
                  name={`options-${duplicate.duplicateId}`}
                  id={`${option}-${duplicate.duplicateId}`}
                  autoComplete="off"
                  value={option}
                  checked={isSelected(option)}
                  onChange={(event) => handleInputChange(event, duplicate.duplicateId)}
                />
                <label
                  className={`btn ${isSelected(option) ? getButtonColor(option) : 'custom-btn-secondary'}`}
                  htmlFor={`${option}-${duplicate.duplicateId}`}
                >
                  {option}
                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Comment Input Field */}
      <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <textarea
          className="form-control"
          value={comments[duplicate.duplicateId] || ''}
          onChange={(event) => handleCommentChange(event, duplicate.duplicateId)}
          placeholder="..."
        />
      </div>

      {/* Image Upload Field */}
      <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
        <label htmlFor={`file-input-${duplicate.duplicateId}`} className="file-label">
          <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
        </label>
        <input
          type="file"
          id={`file-input-${duplicate.duplicateId}`}
          className="form-control-file"
          accept="image/*"
          multiple
          style={{ display: 'none' }} // Hide the input
          onChange={(event) => handleImageChange(event, duplicate.duplicateId)}
        />
        {/* Optional: Display uploaded filenames */}
        <div className="uploaded-files">
          {images[duplicate.duplicateId] && Array.from(images[duplicate.duplicateId]).map((file, index) => (
            <span key={index} style={{ fontSize: '0.8rem' }}>{file.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DuplicateQuestionComponent;
