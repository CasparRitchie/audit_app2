import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import AuditHeaderGeneral from './AuditHeaderGeneral';
import AuditDetail from './AuditDetail';
import ViewAudits from './ViewAudits';
import EditAudit from './EditAudit';
import Analyse from './Analyse';
import Livrable from './Livrable';

function App() {
  const [progressData, setProgressData] = useState({});

  const updateProgress = useCallback((progress) => {
    setProgressData(progress);
  }, []);

  return (
    <Router>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
              <Link className="navbar-brand" to="/">Audit App</Link>
              <div className="navbar-nav">
                <Link className="nav-item nav-link" to="/audit-header">Nouvelle En-tête d'Audit</Link>
                <Link className="nav-item nav-link" to="/create">Détails de l'Audit</Link>
                <Link className="nav-item nav-link" to="/view">Voir Audits</Link>
                <Link className="nav-item nav-link" to="/edit">Editer Audit</Link>
                <Link className="nav-item nav-link" to="/analyse">Analyse Audits</Link>
                <Link className="nav-item nav-link" to="/livrable">Livrable</Link>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/audit-header" element={<AuditHeaderGeneral />} />
              <Route path="/create" element={<AuditDetail updateProgress={updateProgress} progressData={progressData} />} />
              <Route path="/view" element={<ViewAudits />} />
              <Route path="/edit" element={<EditAudit />} />
              <Route path="/analyse" element={<Analyse />} />
              <Route path="/livrable" element={<Livrable />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
