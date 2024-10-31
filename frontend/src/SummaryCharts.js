import React, { useState, useEffect } from 'react';

function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData, coldtemperatureData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
  const [okkoChartUrl, setOkkoChartUrl] = useState(null);
  const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
  const [coldtemperatureChartUrl, setColdTemperatureChartUrl] = useState(null);
  const [imageQueue, setImageQueue] = useState([]); // Image loading queue to ensure proper order

  // Function to clear and prepare images to be loaded
  const clearImages = () => {
    setCpcncChartUrl(null);
    setOkkoChartUrl(null);
    setTemperatureChartUrl(null);
    setColdTemperatureChartUrl(null);
    setImageQueue([]); // Clear queue before loading
    setIsLoading(true);
  };

  // Sequentially load the charts using imageQueue to avoid random loading order
  const loadChartsSequentially = async () => {
    const timestamp = Date.now() + Math.random();
    const newQueue = [];

    if (cpcncData && (cpcncData.C || cpcncData.PC || cpcncData.NC)) {
      newQueue.push({
        url: `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${timestamp}`,
        setter: setCpcncChartUrl,
      });
    }
    if (okkoData && (okkoData.OK || okkoData.KO)) {
      newQueue.push({
        url: `/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${timestamp}`,
        setter: setOkkoChartUrl,
      });
    }
    if (temperatureData && (temperatureData.over63 || temperatureData.under63)) {
      newQueue.push({
        url: `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${timestamp}`,
        setter: setTemperatureChartUrl,
      });
    }

    if (coldtemperatureData && (coldtemperatureData.over10 || coldtemperatureData.under10)) {
      newQueue.push({
        url: `/api/chart/cold_temperature/${coldtemperatureData.over10}/${coldtemperatureData.under10}?t=${timestamp}`,
        setter: setColdTemperatureChartUrl,
      });
    }

    setImageQueue(newQueue);

    // Process the image queue in sequence
    for (let i = 0; i < newQueue.length; i++) {
      const { url, setter } = newQueue[i];
      setter(url);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading time between charts
    }

    setIsLoading(false);
  };

  // TableComponent for rendering the data next to the charts
  const TableComponent = ({ labels, values }) => {
    const total = values.reduce((sum, value) => sum + value, 0);

    if (total === 0) return null; // No values, don't render the table

    return (
      <table style={{ marginLeft: '20px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '5px', border: '1px solid black' }}>Status</th>
            <th style={{ padding: '5px', border: '1px solid black' }}>Percentage (Count)</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => {
            const value = values[index];
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return (
              <tr key={label}>
                <td style={{ padding: '5px', border: '1px solid black' }}>{label}</td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {percentage}% ({value})
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    if (cpcncData && okkoData && temperatureData && coldtemperatureData) {
      // Clear and reload images whenever new data is received
      clearImages();
      loadChartsSequentially();
    }
  }, [auditId, cpcncData, okkoData, temperatureData, coldtemperatureData]);

  // Chart rendering data
  const chartRenderers = {
    'C/PC/NC Proportion': {
      labels: ['C', 'PC', 'NC'],
      values: [cpcncData.C, cpcncData.PC, cpcncData.NC],
      chartUrl: cpcncChartUrl,
    },
    'OK/KO Proportion': {
      labels: ['OK', 'KO'],
      values: [okkoData.OK, okkoData.KO],
      chartUrl: okkoChartUrl,
    },
    'Temperature Proportion': {
      labels: ['>= 63°C', '< 63°C'],
      values: [temperatureData.over63, temperatureData.under63],
      chartUrl: temperatureChartUrl,
    },
    'Cold Temperature Proportion': {
      labels: ['>= 10°C', '< 10°C'],
      values: [coldtemperatureData.over10, coldtemperatureData.under10],
      chartUrl: coldtemperatureChartUrl,
    },
  };

  // Render all charts and their tables sequentially
  return (
    <div>
      <h3>Charts for Audit {auditId}</h3>
      {Object.keys(chartRenderers).map((chartTitle) => {
        const { labels, values, chartUrl } = chartRenderers[chartTitle];
        const total = values.reduce((sum, value) => sum + value, 0);

        if (total === 0) return null; // Skip rendering if there are no values for this chart

        return (
          <div key={chartTitle} style={{ width: '100%' }}>
            <h4>{chartTitle}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {chartUrl ? (
                <img
                  src={chartUrl}
                  alt={`${chartTitle} Chart`}
                  className="chart-image"
                  style={{ maxWidth: '45%', height: 'auto' }}
                  onLoad={() => console.log(`${chartTitle} chart loaded`)}
                  onError={() => console.error(`Error loading ${chartTitle} chart`)}
                />
              ) : (
                <p>Loading {chartTitle} chart...</p>
              )}
              <TableComponent labels={labels} values={values} style={{ marginLeft: '20px', width: '45%' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCharts;
