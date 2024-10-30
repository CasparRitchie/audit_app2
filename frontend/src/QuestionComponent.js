import React from 'react';
import QuestionBaseComponent from './QuestionBaseComponent';

function QuestionComponent({
  questionObj,
  formResponses,
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  handleDuplicate,
  handleRemove,  // Important: pass down handleRemove correctly
  comments,
  images,
}) {
  return (
    <QuestionBaseComponent
      questionObj={questionObj}
      formResponses={formResponses}
      handleInputChange={handleInputChange}
      handleCommentChange={handleCommentChange}
      handleImageChange={handleImageChange}
      handleDuplicate={handleDuplicate}
      handleRemove={handleRemove}  // Ensure handleRemove is correctly passed down
      comments={comments}
      images={images}
    />
  );
}

export default QuestionComponent;
