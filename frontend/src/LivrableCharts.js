import React, { useState, useEffect, useCallback } from 'react';

function LivrableCharts({ auditId, cpcncData, okkoData, temperatureData, coldtemperatureData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
  const [okkoChartUrl, setOkkoChartUrl] = useState(null);
  const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
  const [coldtemperatureChartUrl, setColdTemperatureChartUrl] = useState(null);
  const [imageQueue, setImageQueue] = useState([]); // Image loading queue to ensure proper order

  const clearImages = useCallback(() => {
    setCpcncChartUrl(null);
    setOkkoChartUrl(null);
    setTemperatureChartUrl(null);
    setColdTemperatureChartUrl(null);
    setImageQueue([]); // Clear queue before loading
    setIsLoading(true);
  }, []);

  const prepareImageQueue = useCallback(() => {
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

    setImageQueue(newQueue); // Explicitly set the queue
  }, [cpcncData, okkoData, temperatureData, coldtemperatureData]);

  const loadChartsSequentially = useCallback(async () => {
    for (let i = 0; i < imageQueue.length; i++) {
      const { url, setter } = imageQueue[i];
      try {
        setter(url); // Set the chart URL
        console.log(`Loading chart: ${url}`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading time between charts
      } catch (error) {
        console.error(`Error loading chart: ${url}`, error);
      }
    }
    setIsLoading(false);
  }, [imageQueue]);

  useEffect(() => {
    if (cpcncData && okkoData && temperatureData && coldtemperatureData) {
      clearImages();
      prepareImageQueue(); // Prepare the queue
    }
  }, [auditId, cpcncData, okkoData, temperatureData, coldtemperatureData, clearImages, prepareImageQueue]);

  useEffect(() => {
    if (imageQueue.length > 0) {
      loadChartsSequentially(); // Load charts when the queue is ready
    }
  }, [imageQueue, loadChartsSequentially]);

  const chartRenderers = {
    'C/PC/NC Proportion': {
      values: [cpcncData.C, cpcncData.PC, cpcncData.NC],
      chartUrl: cpcncChartUrl,
    },
    'OK/KO Proportion': {
      values: [okkoData.OK, okkoData.KO],
      chartUrl: okkoChartUrl,
    },
    'Temperature Proportion': {
      values: [temperatureData.over63, temperatureData.under63],
      chartUrl: temperatureChartUrl,
    },
    'Cold Temperature Proportion': {
      values: [coldtemperatureData.over10, coldtemperatureData.under10],
      chartUrl: coldtemperatureChartUrl,
    },
  };

  return isLoading ? (
    <div>
      <h3>Loading charts for Audit {auditId}...</h3>
      <p>Please wait while charts are being generated.</p>
    </div>
  ) : (
    <div>
      <h3>Charts for Audit {auditId}</h3>
      {Object.keys(chartRenderers).map((chartTitle) => {
        const { values, chartUrl } = chartRenderers[chartTitle];
        const total = values.reduce((sum, value) => sum + value, 0);

        if (total === 0) return null;

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
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LivrableCharts;
