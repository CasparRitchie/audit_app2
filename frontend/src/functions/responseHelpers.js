
// // Function to find the corresponding response for a question ID
// export const findResponseForQuestion = (filteredAudits, questionId) => {
//   // Ensure questionId is numeric for consistent comparisons
//   const numericQuestionId = parseInt(questionId, 10);

//   // Use a single console log for debugging only when no match is found
//   const responseObj = filteredAudits.find(
//     (audit) => parseInt(audit.question, 10) === numericQuestionId
//   );

//   // Avoid logging every iteration; log only when no response is found
//   if (!responseObj || !responseObj.response) {
//     console.debug(`No response found for Question ID: ${questionId}`);
//     return 'No response';
//   }

//   // Return the found response
//   return responseObj.response;
// };

// // Function to style the responses with button-like backgrounds
// export const getResponseStyle = (response, responseType) => {
//   if (responseType === 'C/PC/NC') {
//     if (response === 'C') return 'btn btn-success'; // Green for 'C'
//     if (response === 'PC') return 'btn btn-warning'; // Amber for 'PC'
//     if (response === 'NC') return 'btn btn-danger'; // Red for 'NC'
//   } else if (responseType === 'OK/KO') {
//     if (response === 'OK') return 'btn btn-success'; // Green for 'OK'
//     if (response === 'KO') return 'btn btn-danger'; // Red for 'KO'
//   } else if (responseType === 'Temperature') {
//     if (parseFloat(response) >= 63) return 'btn btn-success'; // Green if temperature >= 63
//     return 'btn btn-danger'; // Red if temperature < 63
//   } else if (responseType === 'Cold Temperature') {
//     if (parseFloat(response) <= 10) return 'btn btn-success'; // Green if temperature <= 10
//     return 'btn btn-danger'; // Red if temperature > 10
//   }
//   return ''; // Default for other types
// };



// Function to preprocess filteredAudits into a Map
export const createResponseMap = (filteredAudits) => {
  return new Map(
    filteredAudits.map((audit) => [
      parseInt(audit.question, 10), // Key: question ID as a number
      audit.response, // Value: response
    ])
  );
};

// Function to find the corresponding response for a question ID
export const findResponseForQuestion = (responseMap, questionId) => {
  // Ensure questionId is numeric for consistent comparisons
  const numericQuestionId = parseInt(questionId, 10);

  // Fetch the response directly from the Map
  const response = responseMap.get(numericQuestionId);

  // Avoid logging every iteration; log only when no response is found
  if (!response) {
    console.debug(`No response found for Question ID: ${questionId}`);
    return 'No response';
  }

  // Return the found response
  return response;
};

// Function to style the responses with button-like backgrounds
export const getResponseStyle = (response, responseType) => {
  if (responseType === 'C/PC/NC') {
    if (response === 'C') return 'btn btn-success'; // Green for 'C'
    if (response === 'PC') return 'btn btn-warning'; // Amber for 'PC'
    if (response === 'NC') return 'btn btn-danger'; // Red for 'NC'
  } else if (responseType === 'OK/KO') {
    if (response === 'OK') return 'btn btn-success'; // Green for 'OK'
    if (response === 'KO') return 'btn btn-danger'; // Red for 'KO'
  } else if (responseType === 'Temperature') {
    if (parseFloat(response) >= 63) return 'btn btn-success'; // Green if temperature >= 63
    return 'btn btn-danger'; // Red if temperature < 63
  } else if (responseType === 'Cold Temperature') {
    if (parseFloat(response) <= 10) return 'btn btn-success'; // Green if temperature <= 10
    return 'btn btn-danger'; // Red if temperature > 10
  }
  return ''; // Default for other types
};
