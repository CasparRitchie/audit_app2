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
  const isSelected = (option) => formResponses[duplicate.duplicateId]?.response === option;

  const getButtonColor = (option) => {
    if (option === 'C' || option === 'OK') return 'btn-success'; // Green for "C" or "OK"
    if (option === 'PC') return 'custom-btn-warning'; // Custom class for "PC"
    if (option === 'NC' || option === 'KO') return 'btn-danger'; // Red for "NC" or "KO"
    return 'custom-btn-secondary'; // Default grey for unselected options
  };

  return (
    <div key={duplicate.duplicateId} className="card mt-3">
      <div className="card-body d-flex flex-nowrap align-items-center">
        <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
          <label>{duplicate.question} (Duplicate {index + 1})</label>
        </div>

        <div className="flex-item response-field" style={{ flexBasis: '15%', flexShrink: 0 }}>
          {duplicate.response_type === 'Temperature' ? (
            <input
              type="number"
              value={formResponses[duplicate.duplicateId]?.response || ''}
              onChange={(event) => handleInputChange(event, duplicate.duplicateId, true)}
              placeholder="Enter temperature"
              className="form-control"
            />
          ) : (
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
                    checked={isSelected(option)}
                    onChange={(event) => handleInputChange(event, duplicate.duplicateId, true)}
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

        <div className="flex-item comment-field" style={{ flexBasis: '20%', flexShrink: 0 }}>
          <textarea
            className="form-control"
            value={comments[duplicate.duplicateId] || ''}
            onChange={(event) => handleCommentChange(event, duplicate.duplicateId)}
            placeholder="Add a comment"
          />
        </div>

        <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
          <input
            type="file"
            className="form-control-file"
            accept="image/*"
            onChange={(event) => handleImageChange(event, duplicate.duplicateId)}
          />
        </div>
      </div>
    </div>
  );
}

export default DuplicateQuestionComponent;
