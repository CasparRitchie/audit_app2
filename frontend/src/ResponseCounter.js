import React, { useState, useEffect } from 'react';

function ResponseCounter({ sectionQuestions }) {
  const [cpcncCount, setCpcncCount] = useState({ C: 0, PC: 0, NC: 0 });
  const [okkoCount, setOkkoCount] = useState({ OK: 0, KO: 0 });
  const [temperatureCount, setTemperatureCount] = useState({ over63: 0, under63: 0 });

  useEffect(() => {
    const cpcncCounts = { C: 0, PC: 0, NC: 0 };
    const okkoCounts = { OK: 0, KO: 0 };
    const temperatureCounts = { over63: 0, under63: 0 };

    sectionQuestions.forEach((questionObj) => {
      const response = questionObj.response && questionObj.response.response;

      if (response === 'C' || response === 'PC' || response === 'NC') {
        cpcncCounts[response]++;
      } else if (response === 'OK' || response === 'KO') {
        okkoCounts[response]++;
      } else if (!isNaN(parseFloat(response))) {
        if (parseFloat(response) >= 63) {
          temperatureCounts.over63++;
        } else {
          temperatureCounts.under63++;
        }
      }
    });

    setCpcncCount(cpcncCounts);
    setOkkoCount(okkoCounts);
    setTemperatureCount(temperatureCounts);

  }, [sectionQuestions]);

  return (
    <div>
      <h5>Response Counts:</h5>
      <p>CPCNC: C = {cpcncCount.C}, PC = {cpcncCount.PC}, NC = {cpcncCount.NC}</p>
      <p>OKKO: OK = {okkoCount.OK}, KO = {okkoCount.KO}</p>
      <p>Temperature: Over 63 = {temperatureCount.over63}, Under 63 = {temperatureCount.under63}</p>
    </div>
  );
}

export default ResponseCounter;
