import React from 'react';
import QuestionBaseComponent from './QuestionBaseComponent';

function DuplicateQuestionComponent({
  duplicate,
  index,
  formResponses,
  handleInputChange,
  handleCommentChange,
  handleImageChange,
  handleRemoveDuplicate, // Ensure this is correctly passed
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
      handleRemove={handleRemoveDuplicate} // Pass the correct remove handler
      comments={comments}
      images={images}
    />
  );
}

export default DuplicateQuestionComponent;
