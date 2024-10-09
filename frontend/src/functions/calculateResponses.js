// functions/calculateResponses.js

export const calculateCPCNC = (questions) => {
  const counts = { C: 0, PC: 0, NC: 0 };
  questions.forEach((q) => {
    const response = q.response && q.response.response;
    if (response === 'C' || response === 'PC' || response === 'NC') {
      counts[response]++;
    }
  });
  return counts;
};

export const calculateOKKO = (questions) => {
  const counts = { OK: 0, KO: 0 };
  questions.forEach((q) => {
    const response = q.response && q.response.response;
    if (response === 'OK' || response === 'KO') {
      counts[response]++;
    }
  });
  return counts;
};

export const calculateTemperature = (questions) => {
  const counts = { over63: 0, under63: 0 };
  questions.forEach((q) => {
    const response = q.response && parseFloat(q.response.response);
    if (!isNaN(response)) {
      if (response >= 63) {
        counts.over63++;
      } else {
        counts.under63++;
      }
    }
  });
  return counts;
};
// New function to combine all calculations
export const calculateResponseCounts = (questions) => {
  return {
    ...calculateCPCNC(questions),
    ...calculateOKKO(questions),
    ...calculateTemperature(questions),
  };
};
