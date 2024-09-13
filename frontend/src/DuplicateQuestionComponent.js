// DuplicateQuestionComponent.js
import React from 'react';

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
  return (
    <div key={`${duplicate.duplicateId}`} className="card mt-3">
      <div className="card-body">
        <label>{duplicate.question} (Duplicate {index + 1})</label>

        {/* Input for duplicated question */}
        {duplicate.response_type === 'Temperature' ? (
          <input
            type="number"
            value={formResponses[`${duplicate.duplicateId}`] || ''}
            onChange={(event) => handleInputChange(event, `${duplicate.duplicateId}`)}
            placeholder="Enter temperature"
          />
        ) : (
          <select
            value={formResponses[`${duplicate.duplicateId}`] || ''}
            onChange={(event) => handleInputChange(event, `${duplicate.duplicateId}`)}
          >
            <option value="">Select</option>
            {duplicate.response_type.split('/').map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {/* Comment Input for Duplicated Question */}
        <div className="mt-2">
          <textarea
            className="form-control"
            value={comments[`${duplicate.duplicateId}`] || ''}
            onChange={(event) => handleCommentChange(event, `${duplicate.duplicateId}`)}
            placeholder="Add a comment"
          />
        </div>

        {/* Image Upload for Duplicated Question */}
        <div className="mt-2">
          <label>Upload Image (optional):</label>
          <input
            type="file"
            className="form-control-file"
            accept="image/*"
            onChange={(event) => handleImageChange(event, `${duplicate.duplicateId}`)}
          />
        </div>
      </div>
    </div>
  );
}

export default DuplicateQuestionComponent;
