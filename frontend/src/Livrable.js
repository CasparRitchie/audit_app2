import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCharts from './SummaryCharts';
import RenderAuditDetailsWithResponses from './components/CombinedComponent';
import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature } from './functions/calculateResponses';

import './Livrable.css';

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

function Livrable() {
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
    if (!isDataProcessed || !filteredAudits.length) {
      return <p>Loading data...</p>; // Ensure data is processed before rendering
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
          responseMap={responseMap}
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
      <h1>Livrable - Générer un pdf</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="auditSelect">Choisir Audit:</label>
            <select
              id="auditSelect"
              className="form-control"
              value={selectedAuditHeaderId}
              onChange={(e) => {
                setSelectedAuditHeaderId(e.target.value);
                setIsDataProcessed(false);
              }}
            >
              <option value="">Veuillez choisir un audit</option>
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

export default Livrable;
