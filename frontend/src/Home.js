// // import React from 'react';
// // import { Link } from 'react-router-dom';

// // function Home() {
// //   return (
// //     <div>
// //       <h1>ID Restauration</h1>
// //       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
// //         <Link to="/create">
// //           <button>Creer Audit</button>
// //         </Link>
// //         <Link to="/view">
// //           <button>Voir Audits</button>
// //         </Link>
// //         <Link to="/edit">
// //           <button>Editer Audit (en construction)</button>
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Home() {
//   const navigate = useNavigate();

//   const handleCreateAudit = () => {
//     // Perform any setup if needed, then navigate
//     navigate('/create');  // This will change the view to the Create Audit component
//   };

//   return (
//     <div>
//       <h1>ID Restauration</h1>
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <button onClick={handleCreateAudit}>Creer Audit</button>
//         <button onClick={() => navigate('/view')}>Voir Audits</button>
//         <button onClick={() => navigate('/edit')}>Editer Audit (en construction)</button>
//       </div>
//     </div>
//   );
// }

// export default Home;


import React, { useState } from 'react';
import AuditHeader from './AuditHeader';
import AuditDetail from './AuditDetail';

function Home() {
  const [showCreateAudit, setShowCreateAudit] = useState(false);
  const [showViewAudits, setShowViewAudits] = useState(false);
  const [showEditAudit, setShowEditAudit] = useState(false);

  const handleCreateAudit = () => {
    setShowCreateAudit(true);
    setShowViewAudits(false);
    setShowEditAudit(false);
  };

  const handleViewAudits = () => {
    setShowCreateAudit(false);
    setShowViewAudits(true);
    setShowEditAudit(false);
  };

  const handleEditAudit = () => {
    setShowCreateAudit(false);
    setShowViewAudits(false);
    setShowEditAudit(true);
  };

  return (
    <div>
      <h1>ID Restauration</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={handleCreateAudit}>Creer Audit</button>
        <button onClick={handleViewAudits}>Voir Audits</button>
        <button onClick={handleEditAudit}>Editer Audit (en construction)</button>
      </div>

      {/* Conditionally render components based on the state */}
      {showCreateAudit && (
        <>
          <AuditHeader />
          <AuditDetail />
        </>
      )}
      {showViewAudits && <div>View Audits Component Goes Here</div>}
      {showEditAudit && <div>Edit Audit Component (Under Construction)</div>}
    </div>
  );
}

export default Home;
