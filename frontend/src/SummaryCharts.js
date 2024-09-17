import React from 'react';

function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
  // URLs for the backend API to get the charts
  const cpcncChartUrl = `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}`;
  const okkoChartUrl = `/api/chart/okko/${okkoData.OK}/${okkoData.KO}`;
  const temperatureChartUrl = `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}`;

  return (
    <div>
      <h3>Charts for Audit {auditId}</h3>

      {/* C/PC/NC Chart */}
      <div>
        <h4>C/PC/NC Proportion</h4>
        <img src={cpcncChartUrl} alt="C/PC/NC Chart" />
      </div>

      {/* OK/KO Chart */}
      <div>
        <h4>OK/KO Proportion</h4>
        <img src={okkoChartUrl} alt="OK/KO Chart" />
      </div>

      {/* Temperature Chart */}
      <div>
        <h4>Temperature Proportion</h4>
        <img src={temperatureChartUrl} alt="Temperature Chart" />
      </div>
    </div>
  );
}

export default SummaryCharts;
