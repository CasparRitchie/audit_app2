import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EditAudit() {
  const { auditId } = useParams();  // Get audit ID from the URL
  const [auditData, setAuditData] = useState(null);

  useEffect(() => {
    axios.get(`/api/get_audit/${auditId}`)
      .then(response => {
        setAuditData(response.data);
      })
      .catch(error => {
        console.error('Error fetching audit data:', error);
      });
  }, [auditId]);

  if (!auditData) {
    return <div>Loading audit data...</div>;
  }

  // You can use your existing AuditDetail component to show and edit audit data here
  return (
    <div>
      <h2>Edit Audit</h2>
      {/* You can reuse AuditDetail or AuditHeader form here */}
      <pre>{JSON.stringify(auditData, null, 2)}</pre>
      {/* Build out the form or use AuditHeader/AuditDetail */}
    </div>
  );
}

export default EditAudit;
