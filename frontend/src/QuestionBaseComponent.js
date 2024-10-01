import React from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
import classNames from 'classnames';

function QuestionBaseComponent({
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
  const responseValue = formResponses[questionObj.id || questionObj.duplicateId]?.response || '';
  const isAnswered = responseValue !== '';

  const showAlert = () => {
    if (questionObj.information) {
      alert(questionObj.information);
    }
  };

  const questionId = questionObj.id || questionObj.duplicateId;

  return (
    <div
      key={questionId}
      className={classNames('form-group d-flex flex-nowrap align-items-center', { 'answered-question': isAnswered })}
    >
      {/* Question Label */}
      <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
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
          <div className="btn-group" role="group">
            {questionObj.response_type.split('/').map((option) => {
              const isSelected = formResponses[questionId]?.response === option;
              const getButtonColor = (option) => {
                if (option === 'C' || option === 'OK') return 'btn-success';
                if (option === 'PC') return 'custom-btn-warning';
                if (option === 'NC' || option === 'KO') return 'btn-danger';
                return 'custom-btn-secondary';
              };

              return (
                <React.Fragment key={option}>
                  <input
                    type="radio"
                    className="btn-check"
                    name={`options-${questionId}`}
                    id={`${option}-${questionId}`}
                    autoComplete="off"
                    value={option}
                    checked={isSelected}
                    onChange={(event) => handleInputChange(event, questionId)}
                  />
                  <label
                    className={`btn ${isSelected ? getButtonColor(option) : 'custom-btn-secondary'}`}
                    htmlFor={`${option}-${questionId}`}
                  >
                    {option}
                  </label>
                </React.Fragment>
              );
            })}
          </div>
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
        <label htmlFor={`file-input-${questionId}`} className="file-label">
          <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
        </label>
        <input
          type="file"
          id={`file-input-${questionId}`}
          className="form-control-file"
          accept="image/*"
          multiple  // Allow multiple file uploads
          style={{ display: 'none' }}  // Hide the input
          onChange={(event) => handleImageChange(event, questionId)}
        />
        {/* Optional: You can display uploaded filenames here */}
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
