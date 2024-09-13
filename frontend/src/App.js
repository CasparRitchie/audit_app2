import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import AuditHeader from './AuditHeader';
import AuditDetail from './AuditDetail';
import ViewAudits from './ViewAudits';
import EditAudit from './EditAudit';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <Link className="navbar-brand" to="/">Audit App</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/create">Create Audit</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/view">View Audits</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/edit">Edit Audit</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<><AuditHeader /><AuditDetail /></>} />
          <Route path="/view" element={<ViewAudits />} />
          <Route path="/edit" element={<EditAudit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
