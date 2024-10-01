import React from 'react';
import QuestionBaseComponent from './QuestionBaseComponent';

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
    <QuestionBaseComponent
      questionObj={questionObj}
      formResponses={formResponses}
      handleInputChange={handleInputChange}
      handleCommentChange={handleCommentChange}
      handleImageChange={handleImageChange}
      isDuplicate={false} // Not a duplicate
      handleDuplicate={handleDuplicate}
      handleRemove={null} // Original questions handled differently in AuditDetail
      comments={comments}
      images={images}
    />
  );
}

export default QuestionComponent;
