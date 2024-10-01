import React from 'react';

function ToggleableRadioButtons({ questionId, options, formResponses, handleInputChange }) {
  const responseValue = formResponses[questionId]?.response || '';

  const handleClick = (event) => {
    const { value } = event.target;
    if (value === responseValue) {
      // If the clicked button is already selected, clear the response
      handleInputChange({ target: { value: '' } }, questionId);
    } else {
      // Otherwise, set the new selected value
      handleInputChange(event, questionId);
    }
  };

  const getButtonColor = (option) => {
    if (option === 'C' || option === 'OK') return 'btn-success';
    if (option === 'PC') return 'custom-btn-warning';
    if (option === 'NC' || option === 'KO') return 'btn-danger';
    return 'custom-btn-secondary';
  };

  return (
    <div className="btn-group" role="group">
      {options.map((option) => {
        const isSelected = responseValue === option;
        return (
          <React.Fragment key={option}>
            <input
              type="checkbox" // <-- Change this to checkbox to allow toggle behavior
              className="btn-check"
              name={`options-${questionId}`}
              id={`${option}-${questionId}`}
              autoComplete="off"
              value={option}
              checked={isSelected}
              onChange={handleClick} // Call handleClick for toggling
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
  );
}

export default ToggleableRadioButtons;
