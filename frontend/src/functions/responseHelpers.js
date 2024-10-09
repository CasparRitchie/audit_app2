
// Function to find the corresponding response for a question ID
export const findResponseForQuestion = (filteredAudits, questionId) => {
  // console.log("Searching for Question ID:", questionId);
  // console.log("filteredAudits:", filteredAudits);

  const responseObj = filteredAudits.find((audit) => audit.question === String(questionId));

  if (responseObj && responseObj.response) {
    // console.log("Found response:", responseObj.response.response);
    return responseObj.response.response;
  } else {
    // console.log("No response found for Question ID:", questionId);
    return 'No response';
  }
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
  }
  return ''; // Default for other types
};
