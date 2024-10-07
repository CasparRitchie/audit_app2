import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import AuditHeader from './AuditHeader';
import AuditDetail from './AuditDetail';
import ViewAudits from './ViewAudits';
import EditAudit from './EditAudit';
import Sidebar from './Sidebar';
import Analyse from './Analyse';

function App() {
  const [progressData, setProgressData] = useState({}); // Track progress data for sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to handle sidebar visibility

  // Memoize updateProgress using useCallback
  const updateProgress = useCallback((progress) => {
    setProgressData(progress); // Update progress state with new values
  }, []); // The empty array ensures this function is only created once

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  return (
    <Router>
      <div className="container-fluid mt-4">
        <button className="sidebar-toggle btn btn-primary mb-2" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>

        <div className="row">
          {/* Sidebar Section */}
          {isSidebarOpen && (
            <div className="col-md-3">
              <Sidebar data={progressData} />
            </div>
          )}

          {/* Main Content Section */}
          <div className={isSidebarOpen ? "col-md-9" : "col-md-12"}>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
              <Link className="navbar-brand" to="/">Audit App</Link>
              <div className="navbar-nav">
                <Link className="nav-item nav-link" to="/create">Nouvel Audit</Link>
                <Link className="nav-item nav-link" to="/view">Voir Audits</Link>
                <Link className="nav-item nav-link" to="/edit">Editer Audit</Link>
                <Link className="nav-item nav-link" to="/analyse">Analyse Audits</Link>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<><AuditHeader /><AuditDetail updateProgress={updateProgress} /></>} />
              <Route path="/view" element={<ViewAudits />} />
              <Route path="/edit" element={<EditAudit />} />
              <Route path="/analyse" element={<Analyse />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
