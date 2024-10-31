export const calculateCPCNC = (questions) => {
  const counts = { C: 0, PC: 0, NC: 0 };
  questions.forEach((q) => {
    const response = q.response; // Directly access the response as it's no longer nested
    if (response === 'C' || response === 'PC' || response === 'NC') {
      counts[response]++;
    }
  });
  return counts;
};

export const calculateOKKO = (questions) => {
  const counts = { OK: 0, KO: 0 };
  questions.forEach((q) => {
    const response = q.response; // Directly access the response
    if (response === 'OK' || response === 'KO') {
      counts[response]++;
    }
  });
  return counts;
};

export const calculateTemperature = (questions) => {
  const counts = { over63: 0, under63: 0 };
  questions.forEach((q) => {
    const response = parseFloat(q.response); // Directly access the response as a number
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

export const calculateColdTemperature = (questions) => {
  const counts = { over10: 0, under10: 0 };
  questions.forEach((q) => {
    const response = parseFloat(q.response); // Directly access the response as a number
    if (!isNaN(response)) {
      if (response >= 10) {
        counts.over10++;
      } else {
        counts.under10++;
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
    ...calculateColdTemperature(questions),
  };
};
