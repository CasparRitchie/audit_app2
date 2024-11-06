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
