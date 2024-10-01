import React from 'react';
import QuestionBaseComponent from './QuestionBaseComponent';

function DuplicateQuestionComponent({
  duplicate,
  index,
  formResponses,
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  handleRemoveDuplicate,
  comments,
  images,
}) {
  return (
    <QuestionBaseComponent
      questionObj={{ ...duplicate, index }}
      formResponses={formResponses}
      handleInputChange={handleInputChange}
      handleCommentChange={handleCommentChange}
      handleImageChange={handleImageChange}
      isDuplicate={true} // This is a duplicate
      handleDuplicate={null} // No duplicate creation for duplicate questions
      handleRemove={handleRemoveDuplicate} // Remove duplicate
      comments={comments}
      images={images}
    />
  );
}

export default DuplicateQuestionComponent;
