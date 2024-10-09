import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCharts from './SummaryCharts';
import RenderAuditDetailsWithResponses from './components/CombinedComponent';
import { calculateCPCNC, calculateOKKO, calculateTemperature } from './functions/calculateResponses';

import './Analyse.css';

function Analyse() {
  const [audits, setAudits] = useState([]);
  const [auditDetail, setAuditDetail] = useState({});
  const [selectedAuditId, setSelectedAuditId] = useState('');

  useEffect(() => {
    axios.get('/api/get_audits').then((response) => {
      setAudits(response.data);
    });

    axios.get('/api/audit_detail').then((response) => {
      setAuditDetail(response.data);
    });
  }, []);

  const uniqueAuditIds = [...new Set(audits.map((audit) => audit.auditId))];

  const filteredAudits = selectedAuditId
    ? audits.filter((audit) => audit.auditId === parseInt(selectedAuditId))
    : [];

  const renderChartsAndDetails = () => (
    <>
      <SummaryCharts
        key={selectedAuditId}
        auditId={selectedAuditId}
        cpcncData={calculateCPCNC(filteredAudits)}
        okkoData={calculateOKKO(filteredAudits)}
        temperatureData={calculateTemperature(filteredAudits)}
      />
      <RenderAuditDetailsWithResponses auditDetail={auditDetail} filteredAudits={filteredAudits} />
    </>
  );

  return (
    <div className="container">
      <h1>Analyse Data</h1>
      <div className="form-group">
        <label htmlFor="auditSelect">Select Audit ID:</label>
        <select
          id="auditSelect"
          className="form-control"
          value={selectedAuditId}
          onChange={(e) => setSelectedAuditId(e.target.value)}
        >
          <option value="">Select an Audit</option>
          {uniqueAuditIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>

      {selectedAuditId && renderChartsAndDetails()}
    </div>
  );
}

export default Analyse;
