// // import React from 'react';
// // import QuestionBaseComponent from './QuestionBaseComponent';

// // function DuplicateQuestionComponent({
// //   duplicate,
// //   index,
// //   formResponses,
// //   handleInputChange,
// //   handleCommentChange,
// //   handleImageChange,
// //   handleRemoveDuplicate,
// //   handleRemove, // Add handleRemove prop here
// //   comments,
// //   images,
// // }) {
// //   return (
// //     <QuestionBaseComponent
// //       questionObj={{ ...duplicate, index }}
// //       formResponses={formResponses}
// //       handleInputChange={handleInputChange}
// //       handleCommentChange={handleCommentChange}
// //       handleImageChange={handleImageChange}
// //       isDuplicate={true} // This is a duplicate
// //       handleDuplicate={null} // No duplicate creation for duplicate questions
// //       handleRemove={handleRemoveDuplicate || handleRemove} // Use handleRemoveDuplicate if available, otherwise fallback
// //       comments={comments}
// //       images={images}
// //     />
// //   );
// // }

// // export default DuplicateQuestionComponent;

// import React from 'react';
// import QuestionBaseComponent from './QuestionBaseComponent';

// function DuplicateQuestionComponent({
//   duplicate,
//   index,
//   formResponses,
//   handleInputChange,
//   handleCommentChange,
//   handleImageChange,
//   handleRemoveDuplicate,
//   handleDuplicate,
//   handleRemove, // Ensure handleRemove is here
//   comments,
//   images,
// }) {
//   return (
//     <QuestionBaseComponent
//       questionObj={{ ...duplicate, index }}
//       formResponses={formResponses}
//       handleInputChange={handleInputChange}
//       handleCommentChange={handleCommentChange}
//       handleImageChange={handleImageChange}
//       isDuplicate={true}
//       handleDuplicate={handleDuplicate}
//       handleRemove={handleRemoveDuplicate || handleRemove} // Use handleRemoveDuplicate or fallback
//       comments={comments}
//       images={images}
//     />
//   );
// }

// export default DuplicateQuestionComponent;


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
