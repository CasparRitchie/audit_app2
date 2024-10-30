import React, { useState } from 'react';
import AuditHeader from './AuditHeader'; // Import the AuditHeader component

function AuditHeaderGeneral() {
  const [isExpanded, setIsExpanded] = useState(true); // Control expand/collapse state for general information

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <h2 style={{ cursor: 'pointer' }} onClick={toggleExpand}>
        {isExpanded ? '▼' : '▶'} Informations Générales
      </h2>
      {isExpanded && (
        <AuditHeader />
      )}
    </div>
  );
}

export default AuditHeaderGeneral;
