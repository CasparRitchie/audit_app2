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
      <div className="card-body d-flex flex-nowrap align-items-center">
        {/* Duplicate Question Label */}
        <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
          <label>{duplicate.question} (Duplicate {index + 1})</label>
        </div>

        {/* Input for Duplicated Question */}
        <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
          {duplicate.response_type === 'Temperature' ? (
            <input
              type="number"
              value={formResponses[`${duplicate.duplicateId}`] || ''}
              onChange={(event) => handleInputChange(event, `${duplicate.duplicateId}`)}
              placeholder="Enter temperature"
              className="form-control"
            />
          ) : duplicate.response_type === 'C/PC/NC' || duplicate.response_type === 'OK/KO' ? (
            <div className="btn-group" role="group" aria-label={`${duplicate.response_type} options`}>
              {duplicate.response_type.split('/').map((option) => (
                <React.Fragment key={option}>
                  <input
                    type="radio"
                    className="btn-check"
                    name={`options-${duplicate.duplicateId}`}
                    id={`${option}-${duplicate.duplicateId}`}
                    autoComplete="off"
                    value={option}
                    checked={formResponses[duplicate.duplicateId] === option}
                    onChange={(event) => handleInputChange(event, duplicate.duplicateId)}
                  />
                  <label
                    className={`btn ${
                      option === 'C' || option === 'OK' ? 'btn-success' : option === 'PC' ? 'btn-warning' : 'btn-danger'
                    }`}
                    htmlFor={`${option}-${duplicate.duplicateId}`}
                  >
                    {option}
                  </label>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <select
              value={formResponses[`${duplicate.duplicateId}`] || ''}
              onChange={(event) => handleInputChange(event, `${duplicate.duplicateId}`)}
              className="form-control"
            >
              <option value="">Select</option>
              {duplicate.response_type.split('/').map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Comment Input for Duplicated Question */}
        <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
          <textarea
            className="form-control"
            value={comments[`${duplicate.duplicateId}`] || ''}
            onChange={(event) => handleCommentChange(event, `${duplicate.duplicateId}`)}
            placeholder="Add a comment"
          />
        </div>

        {/* Image Upload for Duplicated Question */}
        <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
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
