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
  setImages,

}) {
  return (
    <QuestionBaseComponent
      questionObj={questionObj}
      formResponses={formResponses}
      handleInputChange={handleInputChange}
      handleCommentChange={handleCommentChange}
      handleImageChange={handleImageChange}
      handleDuplicate={handleDuplicate}
      handleRemove={handleRemove}
      comments={comments}
      images={images}
      setImages={setImages}

    />
  );
}

export default QuestionComponent;
