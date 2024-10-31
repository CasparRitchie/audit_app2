import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCharts from './SummaryCharts';
import RenderAuditDetailsWithResponses from './components/CombinedComponent';
import { calculateCPCNC, calculateOKKO, calculateTemperature, calculateColdTemperature} from './functions/calculateResponses';

import './Analyse.css';

function Analyse() {
  const [audits, setAudits] = useState([]);
  const [auditDetail, setAuditDetail] = useState({});
  const [selectedAuditId, setSelectedAuditId] = useState('');

  useEffect(() => {
    axios.get('/api/get_audits')
      .then((response) => {
        console.log('Audits:', response.data); // Debugging logs
        setAudits(response.data);
      })
      .catch(error => {
        console.error('Error fetching audits:', error); // Error handling
      });

    axios.get('/api/audit_detail')
      .then((response) => {
        console.log('Audit Details:', response.data); // Debugging logs
        setAuditDetail(response.data);
      })
      .catch(error => {
        console.error('Error fetching audit details:', error); // Error handling
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
        coldtemperatureData={calculateColdTemperature(filteredAudits)}
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
