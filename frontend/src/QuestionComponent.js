import React from 'react';
import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
import classNames from 'classnames';


function QuestionComponent({
  questionObj,
  formResponses = {},
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  comments = {},
  images = {},
}) {
  const responseValue = formResponses[questionObj.id]?.response || '';
  const isAnswered = responseValue !== '';

  const showAlert = () => {
    if (questionObj.information) {
      alert(questionObj.information);
    }
  };

  return (
    <div
      key={questionObj.id}
      className={classNames('form-group d-flex flex-nowrap align-items-center', { 'answered-question': isAnswered })}
    >
      {/* Question Label and Information Bubble */}
      <div className="flex-item question" style={{ flexBasis: '20%', flexShrink: 0 }}>
        <label>
          {questionObj.question}
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
            onChange={(event) => handleInputChange(event, questionObj.id)}
            placeholder="Enter temperature"
            className="form-control"
          />
        ) : (
          <div className="btn-group" role="group">
            {questionObj.response_type.split('/').map((option) => {
              const isSelected = formResponses[questionObj.id]?.response === option;
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
                    name={`options-${questionObj.id}`}
                    id={`${option}-${questionObj.id}`}
                    autoComplete="off"
                    value={option}
                    checked={isSelected}
                    onChange={(event) => handleInputChange(event, questionObj.id)}
                  />
                  <label
                    className={`btn ${isSelected ? getButtonColor(option) : 'custom-btn-secondary'}`}
                    htmlFor={`${option}-${questionObj.id}`}
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
          value={comments[questionObj.id] || ''}
          onChange={(event) => handleCommentChange(event, questionObj.id)}
          placeholder="..."
        />
      </div>

      {/* Image Upload Field */}
      <div className="flex-item image-upload" style={{ flexBasis: '15%', flexShrink: 0 }}>
        <label htmlFor={`file-input-${questionObj.id}`} className="file-label">
          <FaCamera style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
        </label>
        <input
          type="file"
          id={`file-input-${questionObj.id}`}
          className="form-control-file"
          accept="image/*"
          multiple  // Allow multiple file uploads
          style={{ display: 'none' }}  // Hide the input
          onChange={(event) => handleImageChange(event, questionObj.id)}
        />
        {/* Optional: You can display uploaded filenames here */}
        <div className="uploaded-files">
          {images[questionObj.id] && Array.from(images[questionObj.id]).map((file, index) => (
            <span key={index} style={{ fontSize: '0.8rem' }}>{file.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionComponent;
