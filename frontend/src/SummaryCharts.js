// // // // // // // // // // import React from 'react';

// // // // // // // // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // // // // // // // //   const timestamp = new Date().getTime(); // Ensure unique URLs to prevent caching

// // // // // // // // // //   const cpcncChartUrl = cpcncData
// // // // // // // // // //     ? `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${timestamp}`
// // // // // // // // // //     : null;
// // // // // // // // // //   const okkoChartUrl = okkoData
// // // // // // // // // //     ? `/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${timestamp}`
// // // // // // // // // //     : null;
// // // // // // // // // //   const temperatureChartUrl = temperatureData
// // // // // // // // // //     ? `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${timestamp}`
// // // // // // // // // //     : null;

// // // // // // // // // //   return (
// // // // // // // // // //     <div>
// // // // // // // // // //       <h3>Charts for Audit {auditId}</h3>

// // // // // // // // // //       {/* C/PC/NC Chart */}
// // // // // // // // // //       <div>
// // // // // // // // // //         <h4>C/PC/NC Proportion</h4>
// // // // // // // // // //         {cpcncChartUrl ? (
// // // // // // // // // //           <img src={cpcncChartUrl} alt="C/PC/NC Chart" />
// // // // // // // // // //         ) : (
// // // // // // // // // //           <p>No data available for C/PC/NC chart</p>
// // // // // // // // // //         )}
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* OK/KO Chart */}
// // // // // // // // // //       <div>
// // // // // // // // // //         <h4>OK/KO Proportion</h4>
// // // // // // // // // //         {okkoChartUrl ? (
// // // // // // // // // //           <img src={okkoChartUrl} alt="OK/KO Chart" />
// // // // // // // // // //         ) : (
// // // // // // // // // //           <p>No data available for OK/KO chart</p>
// // // // // // // // // //         )}
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* Temperature Chart */}
// // // // // // // // // //       <div>
// // // // // // // // // //         <h4>Temperature Proportion</h4>
// // // // // // // // // //         {temperatureChartUrl ? (
// // // // // // // // // //           <img src={temperatureChartUrl} alt="Temperature Chart" />
// // // // // // // // // //         ) : (
// // // // // // // // // //           <p>No data available for Temperature chart</p>
// // // // // // // // // //         )}
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // export default SummaryCharts;


// // // // // // // // // import React from 'react';

// // // // // // // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // // // // // // //   const timestamp = new Date().getTime(); // Ensure unique URLs to prevent caching

// // // // // // // // //   // Only generate URLs if valid data is present
// // // // // // // // //   const cpcncChartUrl = (cpcncData.C > 0 || cpcncData.PC > 0 || cpcncData.NC > 0)
// // // // // // // // //     ? `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${timestamp}`
// // // // // // // // //     : null;

// // // // // // // // //   const okkoChartUrl = (okkoData.OK > 0 || okkoData.KO > 0)
// // // // // // // // //     ? `/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${timestamp}`
// // // // // // // // //     : null;

// // // // // // // // //   const temperatureChartUrl = (temperatureData.over63 > 0 || temperatureData.under63 > 0)
// // // // // // // // //     ? `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${timestamp}`
// // // // // // // // //     : null;

// // // // // // // // //   return (
// // // // // // // // //     <div>
// // // // // // // // //       <h3>Charts for Audit {auditId}</h3>

// // // // // // // // //       {/* C/PC/NC Chart */}
// // // // // // // // //       <div>
// // // // // // // // //         <h4>C/PC/NC Proportion</h4>
// // // // // // // // //         {cpcncChartUrl ? (
// // // // // // // // //           <img src={cpcncChartUrl} alt="C/PC/NC Chart" />
// // // // // // // // //         ) : (
// // // // // // // // //           <p>No data available for C/PC/NC chart</p>
// // // // // // // // //         )}
// // // // // // // // //       </div>

// // // // // // // // //       {/* OK/KO Chart */}
// // // // // // // // //       <div>
// // // // // // // // //         <h4>OK/KO Proportion</h4>
// // // // // // // // //         {okkoChartUrl ? (
// // // // // // // // //           <img src={okkoChartUrl} alt="OK/KO Chart" />
// // // // // // // // //         ) : (
// // // // // // // // //           <p>No data available for OK/KO chart</p>
// // // // // // // // //         )}
// // // // // // // // //       </div>

// // // // // // // // //       {/* Temperature Chart */}
// // // // // // // // //       <div>
// // // // // // // // //         <h4>Temperature Proportion</h4>
// // // // // // // // //         {temperatureChartUrl ? (
// // // // // // // // //           <img src={temperatureChartUrl} alt="Temperature Chart" />
// // // // // // // // //         ) : (
// // // // // // // // //           <p>No data available for Temperature chart</p>
// // // // // // // // //         )}
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default SummaryCharts;


// // // // // // // // import React from 'react';

// // // // // // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // // // // // //   const cpcncTimestamp = new Date().getTime() + Math.random(); // Unique timestamp for C/PC/NC chart
// // // // // // // //   const okkoTimestamp = new Date().getTime() + Math.random(); // Unique timestamp for OK/KO chart
// // // // // // // //   const temperatureTimestamp = new Date().getTime() + Math.random(); // Unique timestamp for temperature chart

// // // // // // // //   // Conditional URL creation to prevent errors in case data is undefined
// // // // // // // //   const cpcncChartUrl = cpcncData
// // // // // // // //     ? `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`
// // // // // // // //     : null;
// // // // // // // //   const okkoChartUrl = okkoData
// // // // // // // //     ? `/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`
// // // // // // // //     : null;
// // // // // // // //   const temperatureChartUrl = temperatureData
// // // // // // // //     ? `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`
// // // // // // // //     : null;

// // // // // // // //   return (
// // // // // // // //     <div>
// // // // // // // //       <h3>Charts for Audit {auditId}</h3>

// // // // // // // //       {/* C/PC/NC Chart */}
// // // // // // // //       <div>
// // // // // // // //         <h4>C/PC/NC Proportion</h4>
// // // // // // // //         {cpcncChartUrl ? (
// // // // // // // //           <img src={cpcncChartUrl} alt="C/PC/NC Chart" />
// // // // // // // //         ) : (
// // // // // // // //           <p>No data available for C/PC/NC chart</p>
// // // // // // // //         )}
// // // // // // // //       </div>

// // // // // // // //       {/* OK/KO Chart */}
// // // // // // // //       <div>
// // // // // // // //         <h4>OK/KO Proportion</h4>
// // // // // // // //         {okkoChartUrl ? (
// // // // // // // //           <img src={okkoChartUrl} alt="OK/KO Chart" />
// // // // // // // //         ) : (
// // // // // // // //           <p>No data available for OK/KO chart</p>
// // // // // // // //         )}
// // // // // // // //       </div>

// // // // // // // //       {/* Temperature Chart */}
// // // // // // // //       <div>
// // // // // // // //         <h4>Temperature Proportion</h4>
// // // // // // // //         {temperatureChartUrl ? (
// // // // // // // //           <img src={temperatureChartUrl} alt="Temperature Chart" />
// // // // // // // //         ) : (
// // // // // // // //           <p>No data available for Temperature chart</p>
// // // // // // // //         )}
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default SummaryCharts;


// // // // // // // import React, { useState, useEffect } from 'react';

// // // // // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // // //   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
// // // // // // //   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
// // // // // // //   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);

// // // // // // //   useEffect(() => {
// // // // // // //     if (cpcncData && okkoData && temperatureData) {
// // // // // // //       // Unique timestamps for each chart to avoid caching issues
// // // // // // //       const cpcncTimestamp = Date.now() + Math.random();
// // // // // // //       const okkoTimestamp = Date.now() + Math.random();
// // // // // // //       const temperatureTimestamp = Date.now() + Math.random();

// // // // // // //       // Construct URLs with auditId and timestamps
// // // // // // //       setCpcncChartUrl(
// // // // // // //         `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`
// // // // // // //       );
// // // // // // //       setOkkoChartUrl(
// // // // // // //         `/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`
// // // // // // //       );
// // // // // // //       setTemperatureChartUrl(
// // // // // // //         `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`
// // // // // // //       );
// // // // // // //       // Once URLs are set, loading is done
// // // // // // //       setIsLoading(false);
// // // // // // //     }
// // // // // // //   }, [auditId, cpcncData, okkoData, temperatureData]);

// // // // // // //   if (isLoading) {
// // // // // // //     return <p>Loading charts...</p>;
// // // // // // //   }

// // // // // // //   console.log("CPCNC Chart URL:", cpcncChartUrl);
// // // // // // //   console.log("OKKO Chart URL:", okkoChartUrl);
// // // // // // //   console.log("Temperature Chart URL:", temperatureChartUrl);
// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <h3>Charts for Audit {auditId}</h3>

// // // // // // //       {/* C/PC/NC Chart */}
// // // // // // //       <div>
// // // // // // //         <h4>C/PC/NC Proportion</h4>
// // // // // // //         {cpcncChartUrl ? (
// // // // // // //           <img src={cpcncChartUrl} alt="C/PC/NC Chart" />
// // // // // // //         ) : (
// // // // // // //           <p>No data available for C/PC/NC chart</p>
// // // // // // //         )}
// // // // // // //       </div>

// // // // // // //       {/* OK/KO Chart */}
// // // // // // //       <div>
// // // // // // //         <h4>OK/KO Proportion</h4>
// // // // // // //         {okkoChartUrl ? (
// // // // // // //           <img src={okkoChartUrl} alt="OK/KO Chart" />
// // // // // // //         ) : (
// // // // // // //           <p>No data available for OK/KO chart</p>
// // // // // // //         )}
// // // // // // //       </div>

// // // // // // //       {/* Temperature Chart */}
// // // // // // //       <div>
// // // // // // //         <h4>Temperature Proportion</h4>
// // // // // // //         {temperatureChartUrl ? (
// // // // // // //           <img src={temperatureChartUrl} alt="Temperature Chart" />
// // // // // // //         ) : (
// // // // // // //           <p>No data available for Temperature chart</p>
// // // // // // //         )}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default SummaryCharts;


// // // // // // import React, { useState, useEffect } from 'react';

// // // // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // //   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
// // // // // //   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
// // // // // //   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);

// // // // // //   useEffect(() => {
// // // // // //     if (cpcncData && okkoData && temperatureData) {
// // // // // //       // Define the base URL for the backend
// // // // // //       const backendBaseUrl = 'http://127.0.0.1:5000';  // Make sure this points to your backend

// // // // // //       // Unique timestamps for each chart to avoid caching issues
// // // // // //       const cpcncTimestamp = Date.now() + Math.random();
// // // // // //       const okkoTimestamp = Date.now() + Math.random();
// // // // // //       const temperatureTimestamp = Date.now() + Math.random();

// // // // // //       // Construct URLs with auditId and timestamps
// // // // // //       setCpcncChartUrl(
// // // // // //         `${backendBaseUrl}/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`
// // // // // //       );
// // // // // //       setOkkoChartUrl(
// // // // // //         `${backendBaseUrl}/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`
// // // // // //       );
// // // // // //       setTemperatureChartUrl(
// // // // // //         `${backendBaseUrl}/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`
// // // // // //       );
// // // // // //       // Once URLs are set, loading is done
// // // // // //       setIsLoading(false);
// // // // // //     }
// // // // // //   }, [auditId, cpcncData, okkoData, temperatureData]);

// // // // // //   if (isLoading) {
// // // // // //     return <p>Loading charts...</p>;
// // // // // //   }

// // // // // //   console.log("CPCNC Chart URL:", cpcncChartUrl);
// // // // // //   console.log("OKKO Chart URL:", okkoChartUrl);
// // // // // //   console.log("Temperature Chart URL:", temperatureChartUrl);
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h3>Charts for Audit {auditId}</h3>

// // // // // //       {/* C/PC/NC Chart */}
// // // // // //       <div>
// // // // // //         <h4>C/PC/NC Proportion</h4>
// // // // // //         {cpcncChartUrl ? (
// // // // // //           <img
// // // // // //             src={cpcncChartUrl}
// // // // // //             alt="C/PC/NC Chart"
// // // // // //             key={cpcncChartUrl}  // Ensure re-render
// // // // // //           />
// // // // // //         ) : (
// // // // // //           <p>No data available for C/PC/NC chart</p>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* OK/KO Chart */}
// // // // // //       <div>
// // // // // //         <h4>OK/KO Proportion</h4>
// // // // // //         {okkoChartUrl ? (
// // // // // //           <img
// // // // // //             src={okkoChartUrl}
// // // // // //             alt="OK/KO Chart"
// // // // // //             key={okkoChartUrl}  // Ensure re-render
// // // // // //           />
// // // // // //         ) : (
// // // // // //           <p>No data available for OK/KO chart</p>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* Temperature Chart */}
// // // // // //       <div>
// // // // // //         <h4>Temperature Proportion</h4>
// // // // // //         {temperatureChartUrl ? (
// // // // // //           <img
// // // // // //             src={temperatureChartUrl}
// // // // // //             alt="Temperature Chart"
// // // // // //             key={temperatureChartUrl}  // Ensure re-render
// // // // // //           />
// // // // // //         ) : (
// // // // // //           <p>No data available for Temperature chart</p>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default SummaryCharts;

// // // // // import React, { useState, useEffect } from 'react';

// // // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
// // // // //   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
// // // // //   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
// // // // //   const [imageLoaded, setImageLoaded] = useState({
// // // // //     cpcnc: false,
// // // // //     okko: false,
// // // // //     temperature: false
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     if (cpcncData && okkoData && temperatureData) {
// // // // //       // Define the base URL for the backend
// // // // //       const backendBaseUrl = 'http://127.0.0.1:5000';

// // // // //       // Unique timestamps for each chart to avoid caching issues
// // // // //       const cpcncTimestamp = Date.now() + Math.random();
// // // // //       const okkoTimestamp = Date.now() + Math.random();
// // // // //       const temperatureTimestamp = Date.now() + Math.random();

// // // // //       // Construct URLs with auditId and timestamps
// // // // //       setCpcncChartUrl(
// // // // //         `${backendBaseUrl}/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`
// // // // //       );
// // // // //       setOkkoChartUrl(
// // // // //         `${backendBaseUrl}/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`
// // // // //       );
// // // // //       setTemperatureChartUrl(
// // // // //         `${backendBaseUrl}/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`
// // // // //       );
// // // // //       // Once URLs are set, start loading
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   }, [auditId, cpcncData, okkoData, temperatureData]);

// // // // //   // Image onLoad handler
// // // // //   const handleImageLoad = (chartType) => {
// // // // //     setImageLoaded((prev) => ({ ...prev, [chartType]: true }));
// // // // //   };

// // // // //   // Image onError handler (e.g., retry mechanism could be implemented here)
// // // // //   const handleImageError = (chartType) => {
// // // // //     console.error(`Error loading ${chartType} chart`);
// // // // //     // Optionally, retry logic can be added here
// // // // //   };

// // // // //   if (isLoading) {
// // // // //     return <p>Loading charts...</p>;
// // // // //   }

// // // // //   return (
// // // // //     <div>
// // // // //       <h3>Charts for Audit {auditId}</h3>

// // // // //       {/* C/PC/NC Chart */}
// // // // //       <div>
// // // // //         <h4>C/PC/NC Proportion</h4>
// // // // //         {cpcncChartUrl ? (
// // // // //           <img
// // // // //             src={cpcncChartUrl}
// // // // //             alt="C/PC/NC Chart"
// // // // //             onLoad={() => handleImageLoad('cpcnc')}
// // // // //             onError={() => handleImageError('cpcnc')}
// // // // //             style={{ display: imageLoaded.cpcnc ? 'block' : 'none' }}  // Hide until fully loaded
// // // // //           />
// // // // //         ) : (
// // // // //           <p>No data available for C/PC/NC chart</p>
// // // // //         )}
// // // // //         {!imageLoaded.cpcnc && <p>Loading C/PC/NC chart...</p>}
// // // // //       </div>

// // // // //       {/* OK/KO Chart */}
// // // // //       <div>
// // // // //         <h4>OK/KO Proportion</h4>
// // // // //         {okkoChartUrl ? (
// // // // //           <img
// // // // //             src={okkoChartUrl}
// // // // //             alt="OK/KO Chart"
// // // // //             onLoad={() => handleImageLoad('okko')}
// // // // //             onError={() => handleImageError('okko')}
// // // // //             style={{ display: imageLoaded.okko ? 'block' : 'none' }}  // Hide until fully loaded
// // // // //           />
// // // // //         ) : (
// // // // //           <p>No data available for OK/KO chart</p>
// // // // //         )}
// // // // //         {!imageLoaded.okko && <p>Loading OK/KO chart...</p>}
// // // // //       </div>

// // // // //       {/* Temperature Chart */}
// // // // //       <div>
// // // // //         <h4>Temperature Proportion</h4>
// // // // //         {temperatureChartUrl ? (
// // // // //           <img
// // // // //             src={temperatureChartUrl}
// // // // //             alt="Temperature Chart"
// // // // //             onLoad={() => handleImageLoad('temperature')}
// // // // //             onError={() => handleImageError('temperature')}
// // // // //             style={{ display: imageLoaded.temperature ? 'block' : 'none' }}  // Hide until fully loaded
// // // // //           />
// // // // //         ) : (
// // // // //           <p>No data available for Temperature chart</p>
// // // // //         )}
// // // // //         {!imageLoaded.temperature && <p>Loading Temperature chart...</p>}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default SummaryCharts;


// // // // import React, { useState, useEffect } from 'react';

// // // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
// // // //   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
// // // //   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
// // // //   const [imageLoaded, setImageLoaded] = useState({
// // // //     cpcnc: false,
// // // //     okko: false,
// // // //     temperature: false,
// // // //   });
// // // //   const [imageError, setImageError] = useState({
// // // //     cpcnc: false,
// // // //     okko: false,
// // // //     temperature: false,
// // // //   });

// // // //   // Function to load the chart URLs asynchronously
// // // //   const loadChartsAsync = async () => {
// // // //     try {
// // // //       const backendBaseUrl = 'http://127.0.0.1:5000';
// // // //       const cpcncTimestamp = Date.now() + Math.random();
// // // //       const okkoTimestamp = Date.now() + Math.random();
// // // //       const temperatureTimestamp = Date.now() + Math.random();

// // // //       // Generate URLs
// // // //       const cpcncUrl = `${backendBaseUrl}/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`;
// // // //       const okkoUrl = `${backendBaseUrl}/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`;
// // // //       const temperatureUrl = `${backendBaseUrl}/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`;

// // // //       // Update the URLs in state
// // // //       setCpcncChartUrl(cpcncUrl);
// // // //       setOkkoChartUrl(okkoUrl);
// // // //       setTemperatureChartUrl(temperatureUrl);

// // // //       setIsLoading(false);
// // // //     } catch (error) {
// // // //       console.error('Error loading chart URLs:', error);
// // // //       setIsLoading(false);  // Stop the loading spinner even if there's an error
// // // //     }
// // // //   };

// // // //   // UseEffect to trigger chart loading
// // // //   useEffect(() => {
// // // //     if (cpcncData && okkoData && temperatureData) {
// // // //       loadChartsAsync();
// // // //     }
// // // //   }, [auditId, cpcncData, okkoData, temperatureData]);

// // // //   const handleImageLoad = (chartType) => {
// // // //     setImageLoaded((prev) => ({ ...prev, [chartType]: true }));
// // // //   };

// // // //   const handleImageError = (chartType) => {
// // // //     setImageError((prev) => ({ ...prev, [chartType]: true }));
// // // //     console.error(`Error loading ${chartType} chart`);
// // // //   };

// // // //   if (isLoading) {
// // // //     return <p>Loading charts...</p>;
// // // //   }

// // // //   return (
// // // //     <div>
// // // //       <h3>Charts for Audit {auditId}</h3>

// // // //       {/* C/PC/NC Chart */}
// // // //       <div>
// // // //         <h4>C/PC/NC Proportion</h4>
// // // //         {cpcncChartUrl && !imageError.cpcnc ? (
// // // //           <img
// // // //             src={cpcncChartUrl}
// // // //             alt="C/PC/NC Chart"
// // // //             onLoad={() => handleImageLoad('cpcnc')}
// // // //             onError={() => handleImageError('cpcnc')}
// // // //             style={{ display: imageLoaded.cpcnc ? 'block' : 'none' }}
// // // //           />
// // // //         ) : (
// // // //           <p>{imageError.cpcnc ? "Error loading C/PC/NC chart" : "No data available for C/PC/NC chart"}</p>
// // // //         )}
// // // //         {!imageLoaded.cpcnc && !imageError.cpcnc && <p>Loading C/PC/NC chart...</p>}
// // // //       </div>

// // // //       {/* OK/KO Chart */}
// // // //       <div>
// // // //         <h4>OK/KO Proportion</h4>
// // // //         {okkoChartUrl && !imageError.okko ? (
// // // //           <img
// // // //             src={okkoChartUrl}
// // // //             alt="OK/KO Chart"
// // // //             onLoad={() => handleImageLoad('okko')}
// // // //             onError={() => handleImageError('okko')}
// // // //             style={{ display: imageLoaded.okko ? 'block' : 'none' }}
// // // //           />
// // // //         ) : (
// // // //           <p>{imageError.okko ? "Error loading OK/KO chart" : "No data available for OK/KO chart"}</p>
// // // //         )}
// // // //         {!imageLoaded.okko && !imageError.okko && <p>Loading OK/KO chart...</p>}
// // // //       </div>

// // // //       {/* Temperature Chart */}
// // // //       <div>
// // // //         <h4>Temperature Proportion</h4>
// // // //         {temperatureChartUrl && !imageError.temperature ? (
// // // //           <img
// // // //             src={temperatureChartUrl}
// // // //             alt="Temperature Chart"
// // // //             onLoad={() => handleImageLoad('temperature')}
// // // //             onError={() => handleImageError('temperature')}
// // // //             style={{ display: imageLoaded.temperature ? 'block' : 'none' }}
// // // //           />
// // // //         ) : (
// // // //           <p>{imageError.temperature ? "Error loading Temperature chart" : "No data available for Temperature chart"}</p>
// // // //         )}
// // // //         {!imageLoaded.temperature && !imageError.temperature && <p>Loading Temperature chart...</p>}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default SummaryCharts;


// // // import React, { useState, useEffect } from 'react';

// // // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
// // //   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
// // //   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
// // //   const [chartError, setChartError] = useState(null);

// // //   // Function to fetch and set C/PC/NC chart
// // //   const fetchCpcncChart = async () => {
// // //     try {
// // //       const backendBaseUrl = 'http://127.0.0.1:5000';
// // //       const cpcncTimestamp = Date.now() + Math.random();
// // //       const url = `${backendBaseUrl}/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`;
// // //       setCpcncChartUrl(url);
// // //     } catch (error) {
// // //       setChartError("Error loading C/PC/NC chart");
// // //       console.error('C/PC/NC Chart Error:', error);
// // //     }
// // //   };

// // //   // Function to fetch and set OK/KO chart
// // //   const fetchOkkoChart = async () => {
// // //     try {
// // //       const backendBaseUrl = 'http://127.0.0.1:5000';
// // //       const okkoTimestamp = Date.now() + Math.random();
// // //       const url = `${backendBaseUrl}/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`;
// // //       setOkkoChartUrl(url);
// // //     } catch (error) {
// // //       setChartError("Error loading OK/KO chart");
// // //       console.error('OK/KO Chart Error:', error);
// // //     }
// // //   };

// // //   // Function to fetch and set Temperature chart
// // //   const fetchTemperatureChart = async () => {
// // //     try {
// // //       const backendBaseUrl = 'http://127.0.0.1:5000';
// // //       const temperatureTimestamp = Date.now() + Math.random();
// // //       const url = `${backendBaseUrl}/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`;
// // //       setTemperatureChartUrl(url);
// // //     } catch (error) {
// // //       setChartError("Error loading Temperature chart");
// // //       console.error('Temperature Chart Error:', error);
// // //     }
// // //   };

// // //   // Main function to load all charts synchronously
// // //   const loadAllCharts = async () => {
// // //     try {
// // //       await Promise.all([fetchCpcncChart(), fetchOkkoChart(), fetchTemperatureChart()]);
// // //       setIsLoading(false);
// // //     } catch (error) {
// // //       setChartError("Error loading charts");
// // //       console.error('Chart Loading Error:', error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (cpcncData && okkoData && temperatureData) {
// // //       loadAllCharts();
// // //     }
// // //   }, [auditId, cpcncData, okkoData, temperatureData]);

// // //   if (isLoading) {
// // //     return <p>Loading charts...</p>;
// // //   }

// // //   if (chartError) {
// // //     return <p>{chartError}</p>;
// // //   }

// // //   return (
// // //     <div>
// // //       <h3>Charts for Audit {auditId}</h3>

// // //       {/* C/PC/NC Chart */}
// // //       <div>
// // //         <h4>C/PC/NC Proportion</h4>
// // //         {cpcncChartUrl ? (
// // //           <img src={cpcncChartUrl} alt="C/PC/NC Chart" />
// // //         ) : (
// // //           <p>No data available for C/PC/NC chart</p>
// // //         )}
// // //       </div>

// // //       {/* OK/KO Chart */}
// // //       <div>
// // //         <h4>OK/KO Proportion</h4>
// // //         {okkoChartUrl ? (
// // //           <img src={okkoChartUrl} alt="OK/KO Chart" />
// // //         ) : (
// // //           <p>No data available for OK/KO chart</p>
// // //         )}
// // //       </div>

// // //       {/* Temperature Chart */}
// // //       <div>
// // //         <h4>Temperature Proportion</h4>
// // //         {temperatureChartUrl ? (
// // //           <img src={temperatureChartUrl} alt="Temperature Chart" />
// // //         ) : (
// // //           <p>No data available for Temperature chart</p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default SummaryCharts;


// // import React, { useState, useEffect } from 'react';

// // function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
// //   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
// //   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
// //   const [imagesLoaded, setImagesLoaded] = useState(0); // Track how many images are loaded

// //   useEffect(() => {
// //     if (cpcncData && okkoData && temperatureData) {
// //       // Unique timestamps for each chart to avoid caching issues
// //       const cpcncTimestamp = Date.now() + Math.random();
// //       const okkoTimestamp = Date.now() + Math.random();
// //       const temperatureTimestamp = Date.now() + Math.random();

// //       // Construct URLs with auditId and timestamps
// //       setCpcncChartUrl(`/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`);
// //       setOkkoChartUrl(`/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`);
// //       setTemperatureChartUrl(`/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`);

// //       setIsLoading(false);
// //     }
// //   }, [auditId, cpcncData, okkoData, temperatureData]);

// //   const handleImageLoad = () => {
// //     setImagesLoaded((prev) => prev + 1);
// //   };

// //   useEffect(() => {
// //     if (imagesLoaded === 3) {
// //       console.log('All images loaded');
// //       // This re-render ensures the correct charts are displayed
// //     }
// //   }, [imagesLoaded]);

// //   if (isLoading) {
// //     return <p>Loading charts...</p>;
// //   }

// //   return (
// //     <div>
// //       <h3>Charts for Audit {auditId}</h3>

// //       {/* C/PC/NC Chart */}
// //       <div>
// //         <h4>C/PC/NC Proportion</h4>
// //         {cpcncChartUrl ? (
// //           <img key={cpcncChartUrl} src={cpcncChartUrl} alt="C/PC/NC Chart" onLoad={handleImageLoad} />
// //         ) : (
// //           <p>No data available for C/PC/NC chart</p>
// //         )}
// //       </div>

// //       {/* OK/KO Chart */}
// //       <div>
// //         <h4>OK/KO Proportion</h4>
// //         {okkoChartUrl ? (
// //           <img key={okkoChartUrl} src={okkoChartUrl} alt="OK/KO Chart" onLoad={handleImageLoad} />
// //         ) : (
// //           <p>No data available for OK/KO chart</p>
// //         )}
// //       </div>

// //       {/* Temperature Chart */}
// //       <div>
// //         <h4>Temperature Proportion</h4>
// //         {temperatureChartUrl ? (
// //           <img key={temperatureChartUrl} src={temperatureChartUrl} alt="Temperature Chart" onLoad={handleImageLoad} />
// //         ) : (
// //           <p>No data available for Temperature chart</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default SummaryCharts;


// import React, { useState, useEffect } from 'react';

// function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
//   const [isLoading, setIsLoading] = useState(true);
//   const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
//   const [okkoChartUrl, setOkkoChartUrl] = useState(null);
//   const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
//   const [imagesLoaded, setImagesLoaded] = useState(0); // Track how many images are loaded

//   useEffect(() => {
//     if (cpcncData && okkoData && temperatureData) {
//       // Log auditId and the data being loaded
//       console.log(`Loading charts for auditId: ${auditId}`);
//       console.log('CPCNC Data:', cpcncData);
//       console.log('OKKO Data:', okkoData);
//       console.log('Temperature Data:', temperatureData);

//       // Unique timestamps for each chart to avoid caching issues
//       const cpcncTimestamp = Date.now() + Math.random();
//       const okkoTimestamp = Date.now() + Math.random();
//       const temperatureTimestamp = Date.now() + Math.random();

//       // Clear URLs before reloading
//       setCpcncChartUrl(null);
//       setOkkoChartUrl(null);
//       setTemperatureChartUrl(null);
//       setImagesLoaded(0);

//       console.log('Clearing previous charts and reloading...');

//       // Construct URLs with auditId and timestamps
//       setCpcncChartUrl(`/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${cpcncTimestamp}`);
//       setOkkoChartUrl(`/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${okkoTimestamp}`);
//       setTemperatureChartUrl(`/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${temperatureTimestamp}`);

//       setIsLoading(false);
//     }
//   }, [auditId, cpcncData, okkoData, temperatureData]);

//   const handleImageLoad = (imageType) => {
//     setImagesLoaded((prev) => prev + 1);
//     console.log(`${imageType} chart loaded successfully.`);
//   };

//   useEffect(() => {
//     if (imagesLoaded === 3) {
//       console.log('All images loaded for auditId:', auditId);
//     }
//   }, [imagesLoaded]);

//   if (isLoading) {
//     return <p>Loading charts...</p>;
//   }

//   return (
//     <div>
//       <h3>Charts for Audit {auditId}</h3>

//       {/* C/PC/NC Chart */}
//       <div>
//         <h4>C/PC/NC Proportion</h4>
//         {cpcncChartUrl ? (
//           <img
//             key={cpcncChartUrl}
//             src={cpcncChartUrl}
//             alt="C/PC/NC Chart"
//             onLoad={() => handleImageLoad('C/PC/NC')}
//             onError={() => console.error('Error loading C/PC/NC chart')}
//           />
//         ) : (
//           <p>No data available for C/PC/NC chart</p>
//         )}
//       </div>

//       {/* OK/KO Chart */}
//       <div>
//         <h4>OK/KO Proportion</h4>
//         {okkoChartUrl ? (
//           <img
//             key={okkoChartUrl}
//             src={okkoChartUrl}
//             alt="OK/KO Chart"
//             onLoad={() => handleImageLoad('OK/KO')}
//             onError={() => console.error('Error loading OK/KO chart')}
//           />
//         ) : (
//           <p>No data available for OK/KO chart</p>
//         )}
//       </div>

//       {/* Temperature Chart */}
//       <div>
//         <h4>Temperature Proportion</h4>
//         {temperatureChartUrl ? (
//           <img
//             key={temperatureChartUrl}
//             src={temperatureChartUrl}
//             alt="Temperature Chart"
//             onLoad={() => handleImageLoad('Temperature')}
//             onError={() => console.error('Error loading Temperature chart')}
//           />
//         ) : (
//           <p>No data available for Temperature chart</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SummaryCharts;


import React, { useState, useEffect } from 'react';

function SummaryCharts({ auditId, cpcncData, okkoData, temperatureData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cpcncChartUrl, setCpcncChartUrl] = useState(null);
  const [okkoChartUrl, setOkkoChartUrl] = useState(null);
  const [temperatureChartUrl, setTemperatureChartUrl] = useState(null);
  const [imageQueue, setImageQueue] = useState([]); // Image loading queue to ensure proper order

  // Function to clear and prepare images to be loaded
  const clearImages = () => {
    setCpcncChartUrl(null);
    setOkkoChartUrl(null);
    setTemperatureChartUrl(null);
    setImageQueue([]);  // Clear queue before loading
    setIsLoading(true);
  };

  // Sequentially load the charts
  const loadChartsSequentially = async () => {
    console.log(`Starting sequential chart loading for auditId: ${auditId}`);
    const timestamp = Date.now() + Math.random();

    // Load C/PC/NC chart
    const cpcncChartUrl = `/api/chart/cpcnc/${cpcncData.C}/${cpcncData.PC}/${cpcncData.NC}?t=${timestamp}`;
    setCpcncChartUrl(cpcncChartUrl);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms after setting the chart to simulate loading

    // Load OK/KO chart
    const okkoChartUrl = `/api/chart/okko/${okkoData.OK}/${okkoData.KO}?t=${timestamp}`;
    setOkkoChartUrl(okkoChartUrl);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Load Temperature chart
    const temperatureChartUrl = `/api/chart/temperature/${temperatureData.over63}/${temperatureData.under63}?t=${timestamp}`;
    setTemperatureChartUrl(temperatureChartUrl);
    setIsLoading(false);
    console.log("Finished loading charts for auditId:", auditId);
  };

  useEffect(() => {
    if (cpcncData && okkoData && temperatureData) {
      // Clear and reload images whenever new data is received
      clearImages();
      loadChartsSequentially();
    }
  }, [auditId, cpcncData, okkoData, temperatureData]);

  // Conditionally render the charts with proper logging
  return (
    <div>
      <h3>Charts for Audit {auditId}</h3>

      {/* C/PC/NC Chart */}
      <div>
        <h4>C/PC/NC Proportion</h4>
        {cpcncChartUrl ? (
          <img
            key={cpcncChartUrl}
            src={cpcncChartUrl}
            alt="C/PC/NC Chart"
            onLoad={() => console.log("C/PC/NC chart loaded")}
            onError={() => console.error("Error loading C/PC/NC chart")}
          />
        ) : (
          <p>Loading C/PC/NC chart...</p>
        )}
      </div>

      {/* OK/KO Chart */}
      <div>
        <h4>OK/KO Proportion</h4>
        {okkoChartUrl ? (
          <img
            key={okkoChartUrl}
            src={okkoChartUrl}
            alt="OK/KO Chart"
            onLoad={() => console.log("OK/KO chart loaded")}
            onError={() => console.error("Error loading OK/KO chart")}
          />
        ) : (
          <p>Loading OK/KO chart...</p>
        )}
      </div>

      {/* Temperature Chart */}
      <div>
        <h4>Temperature Proportion</h4>
        {temperatureChartUrl ? (
          <img
            key={temperatureChartUrl}
            src={temperatureChartUrl}
            alt="Temperature Chart"
            onLoad={() => console.log("Temperature chart loaded")}
            onError={() => console.error("Error loading Temperature chart")}
          />
        ) : (
          <p>Loading Temperature chart...</p>
        )}
      </div>
    </div>
  );
}

export default SummaryCharts;
