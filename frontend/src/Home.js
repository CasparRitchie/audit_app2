import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Audit Management</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Link to="/create">
          <button>Create New Audit</button>
        </Link>
        <Link to="/view">
          <button>View Audits</button>
        </Link>
        <Link to="/edit">
          <button>Edit Audit</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
