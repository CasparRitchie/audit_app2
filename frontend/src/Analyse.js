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
//           const filteredAudits = data.filter(audit => audit && audit.auditId);
//           filteredAudits.forEach(audit => {
//             console.log(`Audit ID (raw): ${audit.auditId} | Type: ${typeof audit.auditId}`);
//           });
//           setAudits(filteredAudits);
//         } else {
//           console.error('Data fetched for audits is not an array:', data);
//           setAudits([]);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching audits:', error);
//       });

//     axios.get('/api/audit_detail')
//       .then((response) => {
//         console.log('Fetched audit details:', response.data);
//         setAuditDetail(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching audit details:', error);
//       });
//   }, []);

//   // Extract unique Audit HEADER IDs and log them for debugging
//   const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
//     const auditIdStr = String(audit.auditId); // Convert auditId to string
//     if (audit.auditId && !uniqueIds.includes(auditIdStr)) {
//       console.log(`Adding unique Audit ID: ${auditIdStr}`);
//       uniqueIds.push(auditIdStr);
//     }
//     return uniqueIds;
//   }, []);

//   console.log('Unique Audit Header IDs:', uniqueAuditHeaderIds);

//   const filteredAudits = selectedAuditHeaderId
//     ? Object.values(
//         audits
//           .filter((audit) => audit.auditId === selectedAuditHeaderId)
//           .reduce((uniqueResponses, audit) => {
//             if (
//               !uniqueResponses[audit.question] ||
//               uniqueResponses[audit.question].auditDetailId < audit.auditDetailId
//             ) {
//               uniqueResponses[audit.question] = audit;
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

export const findResponseForQuestion = (responseMap, questionId) => {
  if (!(responseMap instanceof Map)) {
    console.error("responseMap is not a Map!", responseMap);
    return 'No response';
  }

  const numericQuestionId = parseInt(questionId, 10);
  const response = responseMap.get(numericQuestionId);

  if (!response) {
    console.debug(`No response found for Question ID: ${questionId}`);
    return 'No response';
  }

  return response;
};

function Analyse() {
  const [audits, setAudits] = useState([]);
  const [auditDetail, setAuditDetail] = useState({});
  const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState('');
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [isDataProcessed, setIsDataProcessed] = useState(false);
  const [responseMap, setResponseMap] = useState(new Map());
  const [loading, setLoading] = useState(true);

  // Fetch audits and audit details on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [auditsResponse, auditDetailResponse] = await Promise.all([
          axios.get('/api/get_audits'),
          axios.get('/api/audit_detail'),
        ]);

        const auditsData = auditsResponse.data || [];
        setAudits(auditsData.filter(audit => audit && audit.auditId));
        setAuditDetail(auditDetailResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Preprocess audits into a Map
  useEffect(() => {
    if (audits.length > 0) {
      const map = new Map();
      audits.forEach((audit) => {
        if (audit.question != null) {
          const questionId = parseInt(audit.question, 10);
          map.set(questionId, audit.response);
        }
      });

      console.log("Generated responseMap:", map);
      setResponseMap(map);
    }
  }, [audits]);

  // Filter audits for the selected Audit Header ID
  useEffect(() => {
    if (selectedAuditHeaderId && audits.length > 0) {
      const uniqueQuestions = {};

      audits.forEach(audit => {
        if (audit.auditId === selectedAuditHeaderId) {
          const questionId = audit.question;
          if (
            !uniqueQuestions[questionId] ||
            uniqueQuestions[questionId].auditDetailId < audit.auditDetailId
          ) {
            uniqueQuestions[questionId] = audit;
          }
        }
      });

      setFilteredAudits(Object.values(uniqueQuestions));
      setIsDataProcessed(true);
    }
  }, [selectedAuditHeaderId, audits]);

  const renderChartsAndDetails = () => {
    if (!isDataProcessed) {
      return <p>Loading data...</p>;
    }

    return (
      <>
        <SummaryCharts
          key={selectedAuditHeaderId}
          auditId={selectedAuditHeaderId}
          cpcncData={calculateCPCNC(filteredAudits)}
          okkoData={calculateOKKO(filteredAudits)}
          temperatureData={calculateTemperature(filteredAudits)}
          coldtemperatureData={calculateColdTemperature(filteredAudits)}
        />
        <RenderAuditDetailsWithResponses
          auditDetail={auditDetail}
          filteredAudits={filteredAudits}
          responseMap={responseMap} // Pass Map to child component
        />
      </>
    );
  };

  const uniqueAuditHeaderIds = audits.reduce((uniqueIds, audit) => {
    const auditIdStr = String(audit.auditId);
    if (!uniqueIds.includes(auditIdStr)) {
      uniqueIds.push(auditIdStr);
    }
    return uniqueIds;
  }, []);

  return (
    <div className="container">
      <h1>Analyse Data</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="auditSelect">Select Audit HEADER ID:</label>
            <select
              id="auditSelect"
              className="form-control"
              value={selectedAuditHeaderId}
              onChange={(e) => {
                setSelectedAuditHeaderId(e.target.value);
                setIsDataProcessed(false);
              }}
            >
              <option value="">Select an Audit HEADER</option>
              {uniqueAuditHeaderIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
          {selectedAuditHeaderId && renderChartsAndDetails()}
        </>
      )}
    </div>
  );
}

export default Analyse;
