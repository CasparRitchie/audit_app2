// functions/createChart.js
import axios from 'axios';

export const createChart = async (responseCounts, sousParagrapheKey, chartType, setCharts) => {
  const { C, PC, NC, OK, KO, over63, under63, over10, under10 } = responseCounts;
  let url = '';

  if (chartType === 'CPCNC' && (C || PC || NC)) {
    url = `/api/chart/cpcnc/${C}/${PC}/${NC}`;
  } else if (chartType === 'OKKO' && (OK || KO)) {
    url = `/api/chart/okko/${OK}/${KO}`;
  } else if (chartType === 'Temperature' && (over63 || under63)) {
    url = `/api/chart/temperature/${over63}/${under63}`;
  } else if (chartType === 'Cold Temperature' && (over63 || under63)) {
    url = `/api/chart/coldtemperature/${under10}/${over10}`;
  }

  if (!url) {
    // console.log(`Skipping chart generation for ${chartType}: no valid responses.`);
    return;
  }

  try {
    const res = await axios.get(url, { responseType: 'blob' });
    const imageUrl = URL.createObjectURL(res.data);
    setCharts((prev) => ({
      ...prev,
      [`${sousParagrapheKey}-${chartType}`]: imageUrl,
    }));
  } catch (error) {
    console.error(`Failed to load ${chartType} chart for ${sousParagrapheKey}:`, error);
  }
};
