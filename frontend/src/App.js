import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import AuditHeader from './AuditHeader';
import AuditDetail from './AuditDetail';
import ViewAudits from './ViewAudits';
import EditAudit from './EditAudit';
import Sidebar from './Sidebar'; // Import Sidebar
import Analyse from './Analyse';

function App() {
  const [progressData, setProgressData] = useState({}); // Track progress data for sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true); // State to handle sidebar visibility

  const updateProgress = (progress) => {
    setProgressData(progress); // Update progress state with new values
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  window.addEventListener("orientationchange", function() {
    if (window.orientation === 0 || window.orientation === 180) {
      alert("Please rotate your device to landscape for the best experience.");
    }
  });

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
