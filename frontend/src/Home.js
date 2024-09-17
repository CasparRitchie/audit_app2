import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>ID Restauration</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Link to="/create">
          <button>Creer Audit</button>
        </Link>
        <Link to="/view">
          <button>Voir Audits</button>
        </Link>
        <Link to="/edit">
          <button>Editer Audit (en construction)</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
