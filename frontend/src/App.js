import React from 'react';
import AuditHeader from './AuditHeader';
import AuditDetail from './AuditDetail';

function App() {
  console.log("App.js is loaded");
  return (
    <div>
      {/* Render Audit Header */}
      <AuditHeader />

      {/* Render Audit Detail */}
      <AuditDetail />
    </div>
  );
}

export default App;
