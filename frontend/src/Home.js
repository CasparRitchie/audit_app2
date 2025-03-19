import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleCreateAudit = () => {
    // Perform any setup if needed, then navigate
    navigate('/create');  // This will change the view to the Create Audit component
  };

  return (
    <div>
      <h1>ID Restauration</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={handleCreateAudit}>Creer Audit</button>
        <button onClick={() => navigate('/view')}>Voir Audits</button>
        <button onClick={() => navigate('/edit')}>Editer Audit (en construction)</button>
        <button onClick={() => navigate('/analyse')}>Analyse Audits</button>
        <button onClick={() => navigate('/livrable')}>Livrable</button>

      </div>
    </div>
  );
}

export default Home;
