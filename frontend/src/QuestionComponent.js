// QuestionComponent.js
import React from 'react';

function QuestionComponent({
  questionObj,
  formResponses,
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  handleDuplicate,
  comments,
  images,
}) {
  return (
    <div key={questionObj.id} className="form-group">
      <label>
        {questionObj.question}
        {questionObj.information && (
          <span title={questionObj.information} style={{ marginLeft: '10px', cursor: 'help' }}>
            ℹ️
          </span>
        )}
      </label>

      {/* Render input based on response type */}
      {questionObj.response_type === 'Temperature' ? (
        <input
          type="number"
          value={formResponses[questionObj.id] || ''}
          onChange={(event) => handleInputChange(event, questionObj.id)}
          placeholder="Enter temperature"
        />
      ) : questionObj.response_type === 'C/PC/NC' || questionObj.response_type === 'OK/KO' ? (
        <div>
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
                  checked={formResponses[questionObj.id] === option}
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
        </div>
      ) : (
        <select
          value={formResponses[questionObj.id] || ''}
          onChange={(event) => handleInputChange(event, questionObj.id)}
        >
          <option value="">Select</option>
          {questionObj.response_type.split('/').map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {/* Comment Input */}
      <div className="mt-2">
        <label>Comment (optional):</label>
        <textarea
          className="form-control"
          value={comments[questionObj.id] || ''}
          onChange={(event) => handleCommentChange(event, questionObj.id)}
          placeholder="Add a comment"
        />
      </div>

      {/* Image Upload */}
      <div className="mt-2">
        <label>Upload Image (optional):</label>
        <input
          type="file"
          className="form-control-file"
          accept="image/*"
          onChange={(event) => handleImageChange(event, questionObj.id)}
        />
      </div>

      {/* Duplicate Button */}
      <div className="mt-2">
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
