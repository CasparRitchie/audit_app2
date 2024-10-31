// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import axios from 'axios';
// // // // // // import SummaryCharts from './SummaryCharts';
// // // // // // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // // // // // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature} from './functions/calculateResponses';

// // // // // // import './Analyse.css';

// // // // // // function Analyse() {
// // // // // //   const [audits, setAudits] = useState([]);
// // // // // //   const [auditDetail, setAuditDetail] = useState({});
// // // // // //   const [selectedAuditId, setSelectedAuditId] = useState('');

// // // // // //   useEffect(() => {
// // // // // //     axios.get('/api/get_audits')
// // // // // //       .then((response) => {
// // // // // //         console.log('Audits:', response.data); // Debugging logs
// // // // // //         setAudits(response.data);
// // // // // //       })
// // // // // //       .catch(error => {
// // // // // //         console.error('Error fetching audits:', error); // Error handling
// // // // // //       });

// // // // // //     axios.get('/api/audit_detail')
// // // // // //       .then((response) => {
// // // // // //         console.log('Audit Details:', response.data); // Debugging logs
// // // // // //         setAuditDetail(response.data);
// // // // // //       })
// // // // // //       .catch(error => {
// // // // // //         console.error('Error fetching audit details:', error); // Error handling
// // // // // //       });
// // // // // //   }, []);

// // // // // //   const uniqueAuditIds = [...new Set(audits.map((audit) => audit.auditId))];

// // // // // //   const filteredAudits = selectedAuditId
// // // // // //     ? audits.filter((audit) => audit.auditId === parseInt(selectedAuditId))
// // // // // //     : [];

// // // // // //   const renderChartsAndDetails = () => (
// // // // // //     <>
// // // // // //       <SummaryCharts
// // // // // //         key={selectedAuditId}
// // // // // //         auditId={selectedAuditId}
// // // // // //         cpcncData={calculateCPCNC(filteredAudits)}
// // // // // //         okkoData={calculateOKKO(filteredAudits)}
// // // // // //         temperatureData={calculateTemperature(filteredAudits)}
// // // // // //         coldtemperatureData={calculateColdTemperature(filteredAudits)}
// // // // // //       />
// // // // // //       <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
// // // // // //     </>
// // // // // //   );

// // // // // //   return (
// // // // // //     <div className="container">
// // // // // //       <h1>Analyse Data</h1>
// // // // // //       <div className="form-group">
// // // // // //         <label htmlFor="auditSelect">Select Audit ID:</label>
// // // // // //         <select
// // // // // //           id="auditSelect"
// // // // // //           className="form-control"
// // // // // //           value={selectedAuditId}
// // // // // //           onChange={(e) => setSelectedAuditId(e.target.value)}
// // // // // //         >
// // // // // //           <option value="">Select an Audit</option>
// // // // // //           {uniqueAuditIds.map((id) => (
// // // // // //             <option key={id} value={id}>
// // // // // //               {id}
// // // // // //             </option>
// // // // // //           ))}
// // // // // //         </select>
// // // // // //       </div>

// // // // // //       {selectedAuditId && renderChartsAndDetails()}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default Analyse;


// // // // // import React, { useState, useEffect } from 'react';
// // // // // import axios from 'axios';
// // // // // import SummaryCharts from './SummaryCharts';
// // // // // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // // // // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

// // // // // import './Analyse.css';

// // // // // function Analyse() {
// // // // //   const [audits, setAudits] = useState([]);
// // // // //   const [auditDetail, setAuditDetail] = useState({});
// // // // //   // const [selectedAuditId, setSelectedAuditId] = useState('');
// // // // //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');

// // // // //   useEffect(() => {
// // // // //     axios.get('/api/get_audits')
// // // // //       .then((response) => {
// // // // //         console.log('Fetched audits:', response.data); // Log audits fetched from the API
// // // // //         setAudits(Array.isArray(response.data) ? response.data : []); // Set audits to an empty array if format is incorrect
// // // // //       })
// // // // //       .catch(error => {
// // // // //         console.error('Error fetching audits:', error); // Error handling
// // // // //       });

// // // // //     axios.get('/api/audit_detail')
// // // // //       .then((response) => {
// // // // //         console.log('Fetched audit details:', response.data); // Log audit details fetched
// // // // //         setAuditDetail(response.data);
// // // // //       })
// // // // //       .catch(error => {
// // // // //         console.error('Error fetching audit details:', error); // Error handling
// // // // //       });
// // // // //   }, []);

// // // // //   // const uniqueAuditIds = Array.isArray(audits) ? [...new Set(audits.map((audit) => audit.auditId))] : []; // Ensure audits is an array
// // // // //   const uniqueAuditHeaderIds = [...new Set(audits.map(audit => audit.auditId))];


// // // // //   // const filteredAudits = selectedAuditId
// // // // //   //   ? audits.filter((audit) => audit.auditId === parseInt(selectedAuditId))
// // // // //   //   : [];

// // // // //   const filteredAudits = selectedAuditHeaderId
// // // // //   ? audits
// // // // //       .filter((audit) => audit.auditId === selectedAuditHeaderId)
// // // // //       .reduce((uniqueResponses, audit) => {
// // // // //         if (!uniqueResponses[audit.question] || uniqueResponses[audit.question].auditDetailId < audit.auditDetailId) {
// // // // //           uniqueResponses[audit.question] = audit; // Keep latest entry per question
// // // // //         }
// // // // //         return uniqueResponses;
// // // // //       }, {})
// // // // //   : [];

// // // // //   const renderChartsAndDetails = () => (
// // // // //     <>
// // // // //       <SummaryCharts
// // // // //         key={selectedAuditId}
// // // // //         auditId={selectedAuditId}
// // // // //         cpcncData={calculateCPCNC(filteredAudits)}
// // // // //         okkoData={calculateOKKO(filteredAudits)}
// // // // //         temperatureData={calculateTemperature(filteredAudits)}
// // // // //         coldtemperatureData={calculateColdTemperature(filteredAudits)}
// // // // //       />
// // // // //       <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
// // // // //     </>
// // // // //   );

// // // // //   return (
// // // // //     <div className="container">
// // // // //       <h1>Analyse Data</h1>
// // // // //       <div className="form-group">
// // // // //         <label htmlFor="auditSelect">Select Audit ID:</label>
// // // // //         <select
// // // // //           id="auditSelect"
// // // // //           className="form-control"
// // // // //           value={selectedAuditHeaderId}
// // // // //           onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
// // // // //         >
// // // // //           <option value="">Select an Audit HEADER</option>
// // // // //           {uniqueAuditHeaderIds.map((id) => (
// // // // //             <option key={id} value={id}>
// // // // //               {id}
// // // // //             </option>
// // // // //           ))}
// // // // //         </select>
// // // // //       </div>

// // // // //       {selectedAuditId && renderChartsAndDetails()}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default Analyse;


// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import SummaryCharts from './SummaryCharts';
// // // // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // // // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

// // // // import './Analyse.css';

// // // // function Analyse() {
// // // //   const [audits, setAudits] = useState([]);
// // // //   const [auditDetail, setAuditDetail] = useState({});
// // // //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');

// // // //   useEffect(() => {
// // // //     axios.get('/api/get_audits')
// // // //       .then((response) => {
// // // //         console.log('Fetched audits:', response.data); // Log audits fetched from the API
// // // //         setAudits(Array.isArray(response.data) ? response.data : []); // Ensure audits is set as an array
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('Error fetching audits:', error); // Error handling
// // // //       });

// // // //     axios.get('/api/audit_detail')
// // // //       .then((response) => {
// // // //         console.log('Fetched audit details:', response.data); // Log audit details fetched
// // // //         setAuditDetail(response.data);
// // // //       })
// // // //       .catch(error => {
// // // //         console.error('Error fetching audit details:', error); // Error handling
// // // //       });
// // // //   }, []);

// // // //   // Get unique Audit HEADER IDs for the dropdown
// // // //   const uniqueAuditHeaderIds = [...new Set(audits.map(audit => audit.auditId))];

// // // //   // Filter audits by selected Audit HEADER ID and deduplicate by question
// // // //   const filteredAudits = selectedAuditHeaderId
// // // //     ? Object.values(
// // // //         audits
// // // //           .filter((audit) => audit.auditId === selectedAuditHeaderId)
// // // //           .reduce((uniqueResponses, audit) => {
// // // //             if (
// // // //               !uniqueResponses[audit.question] ||
// // // //               uniqueResponses[audit.question].auditDetailId < audit.auditDetailId
// // // //             ) {
// // // //               uniqueResponses[audit.question] = audit; // Keep the latest entry per question
// // // //             }
// // // //             return uniqueResponses;
// // // //           }, {})
// // // //       )
// // // //     : [];

// // // //   const renderChartsAndDetails = () => (
// // // //     <>
// // // //       <SummaryCharts
// // // //         key={selectedAuditHeaderId}
// // // //         auditId={selectedAuditHeaderId}
// // // //         cpcncData={calculateCPCNC(filteredAudits)}
// // // //         okkoData={calculateOKKO(filteredAudits)}
// // // //         temperatureData={calculateTemperature(filteredAudits)}
// // // //         coldtemperatureData={calculateColdTemperature(filteredAudits)}
// // // //       />
// // // //       <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
// // // //     </>
// // // //   );

// // // //   return (
// // // //     <div className="container">
// // // //       <h1>Analyse Data</h1>
// // // //       <div className="form-group">
// // // //         <label htmlFor="auditSelect">Select Audit HEADER ID:</label>
// // // //         <select
// // // //           id="auditSelect"
// // // //           className="form-control"
// // // //           value={selectedAuditHeaderId}
// // // //           onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
// // // //         >
// // // //           <option value="">Select an Audit HEADER</option>
// // // //           {uniqueAuditHeaderIds.map((id) => (
// // // //             <option key={id} value={id}>
// // // //               {id}
// // // //             </option>
// // // //           ))}
// // // //         </select>
// // // //       </div>

// // // //       {selectedAuditHeaderId && renderChartsAndDetails()}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default Analyse;


// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import SummaryCharts from './SummaryCharts';
// // // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

// // // import './Analyse.css';

// // // function Analyse() {
// // //   const [audits, setAudits] = useState([]);
// // //   const [auditDetail, setAuditDetail] = useState({});
// // //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');

// // //   useEffect(() => {
// // //     axios.get('/api/get_audits')
// // //       .then((response) => {
// // //         console.log('Fetched audits:', response.data); // Log audits fetched from the API
// // //         setAudits(Array.isArray(response.data) ? response.data : []); // Ensure audits is set as an array
// // //       })
// // //       .catch(error => {
// // //         console.error('Error fetching audits:', error); // Error handling
// // //       });

// // //     axios.get('/api/audit_detail')
// // //       .then((response) => {
// // //         console.log('Fetched audit details:', response.data); // Log audit details fetched
// // //         setAuditDetail(response.data);
// // //       })
// // //       .catch(error => {
// // //         console.error('Error fetching audit details:', error); // Error handling
// // //       });
// // //   }, []);

// // //   // Get unique Audit HEADER IDs for the dropdown
// // //   const uniqueAuditHeaderIds = [...new Set(audits.map(audit => audit.auditId))];
// // //   console.log('Unique Audit Header IDs:', uniqueAuditHeaderIds); // Debugging log to check extracted IDs

// // //   // Filter audits by selected Audit HEADER ID and deduplicate by question
// // //   const filteredAudits = selectedAuditHeaderId
// // //     ? Object.values(
// // //         audits
// // //           .filter((audit) => audit.auditId === selectedAuditHeaderId)
// // //           .reduce((uniqueResponses, audit) => {
// // //             if (
// // //               !uniqueResponses[audit.question] ||
// // //               uniqueResponses[audit.question].auditDetailId < audit.auditDetailId
// // //             ) {
// // //               uniqueResponses[audit.question] = audit; // Keep the latest entry per question
// // //             }
// // //             return uniqueResponses;
// // //           }, {})
// // //       )
// // //     : [];

// // //   const renderChartsAndDetails = () => (
// // //     <>
// // //       <SummaryCharts
// // //         key={selectedAuditHeaderId}
// // //         auditId={selectedAuditHeaderId}
// // //         cpcncData={calculateCPCNC(filteredAudits)}
// // //         okkoData={calculateOKKO(filteredAudits)}
// // //         temperatureData={calculateTemperature(filteredAudits)}
// // //         coldtemperatureData={calculateColdTemperature(filteredAudits)}
// // //       />
// // //       <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
// // //     </>
// // //   );

// // //   return (
// // //     <div className="container">
// // //       <h1>Analyse Data</h1>
// // //       <div className="form-group">
// // //         <label htmlFor="auditSelect">Select Audit HEADER ID:</label>
// // //         <select
// // //           id="auditSelect"
// // //           className="form-control"
// // //           value={selectedAuditHeaderId}
// // //           onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
// // //         >
// // //           <option value="">Select an Audit HEADER</option>
// // //           {uniqueAuditHeaderIds.length > 0 ? (
// // //             uniqueAuditHeaderIds.map((id) => (
// // //               <option key={id} value={id}>
// // //                 {id}
// // //               </option>
// // //             ))
// // //           ) : (
// // //             <option disabled>No Audit Headers Found</option>
// // //           )}
// // //         </select>
// // //       </div>

// // //       {selectedAuditHeaderId && renderChartsAndDetails()}
// // //     </div>
// // //   );
// // // }

// // // export default Analyse;


// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import SummaryCharts from './SummaryCharts';
// // import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// // import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

// // import './Analyse.css';

// // function Analyse() {
// //   const [audits, setAudits] = useState([]);
// //   const [auditDetail, setAuditDetail] = useState({});
// //   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');

// //   useEffect(() => {
// //     axios.get('/api/get_audits')
// //       .then((response) => {
// //         const data = response.data;
// //         console.log('Fetched audits (raw response):', data);
// //         if (Array.isArray(data)) {
// //           setAudits(data);
// //         } else {
// //           console.error('Data fetched for audits is not an array:', data);
// //           setAudits([]);
// //         }
// //       })
// //       .catch(error => {
// //         console.error('Error fetching audits:', error); // Error handling
// //       });

// //     axios.get('/api/audit_detail')
// //       .then((response) => {
// //         console.log('Fetched audit details:', response.data); // Log audit details fetched
// //         setAuditDetail(response.data);
// //       })
// //       .catch(error => {
// //         console.error('Error fetching audit details:', error); // Error handling
// //       });
// //   }, []);

// //   // Extract unique Audit HEADER IDs and log each auditId
// //   const uniqueAuditHeaderIds = [...new Set(audits.map(audit => {
// //     console.log('Processing auditId:', audit.auditId); // Verify each auditId is processed correctly
// //     return audit.auditId;
// //   }))];

// //   console.log('Unique Audit Header IDs:', uniqueAuditHeaderIds); // Final log for dropdown options

// //   // Filter audits by selected Audit HEADER ID and deduplicate by question
// //   const filteredAudits = selectedAuditHeaderId
// //     ? Object.values(
// //         audits
// //           .filter((audit) => audit.auditId === selectedAuditHeaderId)
// //           .reduce((uniqueResponses, audit) => {
// //             if (
// //               !uniqueResponses[audit.question] ||
// //               uniqueResponses[audit.question].auditDetailId < audit.auditDetailId
// //             ) {
// //               uniqueResponses[audit.question] = audit; // Keep the latest entry per question
// //             }
// //             return uniqueResponses;
// //           }, {})
// //       )
// //     : [];

// //   const renderChartsAndDetails = () => (
// //     <>
// //       <SummaryCharts
// //         key={selectedAuditHeaderId}
// //         auditId={selectedAuditHeaderId}
// //         cpcncData={calculateCPCNC(filteredAudits)}
// //         okkoData={calculateOKKO(filteredAudits)}
// //         temperatureData={calculateTemperature(filteredAudits)}
// //         coldtemperatureData={calculateColdTemperature(filteredAudits)}
// //       />
// //       <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
// //     </>
// //   );

// //   return (
// //     <div className="container">
// //       <h1>Analyse Data</h1>
// //       <div className="form-group">
// //         <label htmlFor="auditSelect">Select Audit HEADER ID:</label>
// //         <select
// //           id="auditSelect"
// //           className="form-control"
// //           value={selectedAuditHeaderId}
// //           onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
// //         >
// //           <option value="">Select an Audit HEADER</option>
// //           {uniqueAuditHeaderIds.length > 0 ? (
// //             uniqueAuditHeaderIds.map((id) => (
// //               <option key={id} value={id}>
// //                 {id}
// //               </option>
// //             ))
// //           ) : (
// //             <option disabled>No Audit Headers Found</option>
// //           )}
// //         </select>
// //       </div>

// //       {selectedAuditHeaderId && renderChartsAndDetails()}
// //     </div>
// //   );
// // }

// // export default Analyse;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import SummaryCharts from './SummaryCharts';
// import RenderAuditDetailsWithResponses from './components/CombinedComponent';
// import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

// import './Analyse.css';

// function Analyse() {
//   const [audits, setAudits] = useState([]);
//   const [auditDetail, setAuditDetail] = useState({});
//   const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');

//   useEffect(() => {
//     axios.get('/api/get_audits')
//       .then((response) => {
//         const data = response.data;
//         console.log('Fetched audits (raw response):', data);

//         if (Array.isArray(data)) {
//           // Filter out any entries that don't have a valid auditId
//           const filteredAudits = data.filter(audit => audit && audit.auditId);
//           setAudits(filteredAudits);
//         } else {
//           console.error('Data fetched for audits is not an array:', data);
//           setAudits([]);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching audits:', error); // Error handling
//       });

//     axios.get('/api/audit_detail')
//       .then((response) => {
//         console.log('Fetched audit details:', response.data); // Log audit details fetched
//         setAuditDetail(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching audit details:', error); // Error handling
//       });
//   }, []);

//   // Extract unique Audit HEADER IDs
//   const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
//     if (audit.auditId && !uniqueIds.includes(String(audit.auditId))) {
//       uniqueIds.push(String(audit.auditId)); // Ensure IDs are string for dropdown compatibility
//     }
//     return uniqueIds;
//   }, []);

//   console.log('Unique Audit Header IDs:', uniqueAuditHeaderIds); // Log to verify IDs

//   // Filter audits by selected Audit HEADER ID and deduplicate by question
//   const filteredAudits = selectedAuditHeaderId
//     ? Object.values(
//         audits
//           .filter((audit) => audit.auditId === selectedAuditHeaderId)
//           .reduce((uniqueResponses, audit) => {
//             if (
//               !uniqueResponses[audit.question] ||
//               uniqueResponses[audit.question].auditDetailId < audit.auditDetailId
//             ) {
//               uniqueResponses[audit.question] = audit; // Keep the latest entry per question
//             }
//             return uniqueResponses;
//           }, {})
//       )
//     : [];

//   const renderChartsAndDetails = () => (
//     <>
//       <SummaryCharts
//         key={selectedAuditHeaderId}
//         auditId={selectedAuditHeaderId}
//         cpcncData={calculateCPCNC(filteredAudits)}
//         okkoData={calculateOKKO(filteredAudits)}
//         temperatureData={calculateTemperature(filteredAudits)}
//         coldtemperatureData={calculateColdTemperature(filteredAudits)}
//       />
//       <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
//     </>
//   );

//   return (
//     <div className="container">
//       <h1>Analyse Data</h1>
//       <div className="form-group">
//         <label htmlFor="auditSelect">Select Audit HEADER ID:</label>
//         <select
//           id="auditSelect"
//           className="form-control"
//           value={selectedAuditHeaderId}
//           onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
//         >
//           <option value="">Select an Audit HEADER</option>
//           {uniqueAuditHeaderIds.length > 0 ? (
//             uniqueAuditHeaderIds.map((id) => (
//               <option key={id} value={id}>
//                 {id}
//               </option>
//             ))
//           ) : (
//             <option disabled>No Audit Headers Found</option>
//           )}
//         </select>
//       </div>

//       {selectedAuditHeaderId && renderChartsAndDetails()}
//     </div>
//   );
// }

// export default Analyse;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCharts from './SummaryCharts';
import RenderAuditDetailsWithResponses from './components/CombinedComponent';
import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

import './Analyse.css';

function Analyse() {
  const [audits, setAudits] = useState([]);
  const [auditDetail, setAuditDetail] = useState({});
  const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');

  useEffect(() => {
    axios.get('/api/get_audits')
      .then((response) => {
        const data = response.data;
        console.log('Fetched audits (raw response):', data);

        if (Array.isArray(data)) {
          const filteredAudits = data.filter(audit => audit && audit.auditId);
          filteredAudits.forEach(audit => {
            console.log(`Audit ID (raw): ${audit.auditId} | Type: ${typeof audit.auditId}`);
          });
          setAudits(filteredAudits);
        } else {
          console.error('Data fetched for audits is not an array:', data);
          setAudits([]);
        }
      })
      .catch(error => {
        console.error('Error fetching audits:', error);
      });

    axios.get('/api/audit_detail')
      .then((response) => {
        console.log('Fetched audit details:', response.data);
        setAuditDetail(response.data);
      })
      .catch(error => {
        console.error('Error fetching audit details:', error);
      });
  }, []);

  // Extract unique Audit HEADER IDs and log them for debugging
  const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
    const auditIdStr = String(audit.auditId); // Convert auditId to string
    if (audit.auditId && !uniqueIds.includes(auditIdStr)) {
      console.log(`Adding unique Audit ID: ${auditIdStr}`);
      uniqueIds.push(auditIdStr);
    }
    return uniqueIds;
  }, []);

  console.log('Unique Audit Header IDs:', uniqueAuditHeaderIds);

  const filteredAudits = selectedAuditHeaderId
    ? Object.values(
        audits
          .filter((audit) => audit.auditId === selectedAuditHeaderId)
          .reduce((uniqueResponses, audit) => {
            if (
              !uniqueResponses[audit.question] ||
              uniqueResponses[audit.question].auditDetailId < audit.auditDetailId
            ) {
              uniqueResponses[audit.question] = audit;
            }
            return uniqueResponses;
          }, {})
      )
    : [];

  const renderChartsAndDetails = () => (
    <>
      <SummaryCharts
        key={selectedAuditHeaderId}
        auditId={selectedAuditHeaderId}
        cpcncData={calculateCPCNC(filteredAudits)}
        okkoData={calculateOKKO(filteredAudits)}
        temperatureData={calculateTemperature(filteredAudits)}
        coldtemperatureData={calculateColdTemperature(filteredAudits)}
      />
      <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
    </>
  );

  return (
    <div className="container">
      <h1>Analyse Data</h1>
      <div className="form-group">
        <label htmlFor="auditSelect">Select Audit HEADER ID:</label>
        <select
          id="auditSelect"
          className="form-control"
          value={selectedAuditHeaderId}
          onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
        >
          <option value="">Select an Audit HEADER</option>
          {uniqueAuditHeaderIds.length > 0 ? (
            uniqueAuditHeaderIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))
          ) : (
            <option disabled>No Audit Headers Found</option>
          )}
        </select>
      </div>

      {selectedAuditHeaderId && renderChartsAndDetails()}
    </div>
  );
}

export default Analyse;
