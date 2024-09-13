
// import React from 'react';

// function Sidebar({ data }) {
//   return (
//     <div className="sidebar">
//       <h3>Completion Progress</h3>
//       <ul className="list-group">
//         {Object.entries(data).map(([sousChapitre, progressData]) => (
//           <li key={sousChapitre} className="list-group-item">
//             <h5>{sousChapitre}</h5>
//             <div className="progress">
//               <div
//                 className="progress-bar"
//                 role="progressbar"
//                 style={{ width: `${progressData.percentage}%` }}
//                 aria-valuenow={progressData.percentage}
//                 aria-valuemin="0"
//                 aria-valuemax="100"
//               >
//                 {progressData.percentage}%
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

import React from 'react';

function Sidebar({ data }) {
  return (
    <div className="sidebar" style={styles.sidebar}>
      <h3>Completion Progress</h3>
      <ul className="list-group">
        {Object.entries(data).map(([sousChapitre, progressData]) => (
          <li key={sousChapitre} className="list-group-item">
            <h5>{sousChapitre}</h5>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressData.percentage}%` }}
                aria-valuenow={progressData.percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progressData.percentage}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    position: 'sticky',
    top: '20px', // Adjust the value to control how far from the top the sidebar starts sticking
    height: '100vh', // Optional: Set a height if needed
    overflowY: 'auto', // Optional: Add scrolling if content overflows
    padding: '10px',
    backgroundColor: '#f8f9fa', // Optional: Add a background color to the sidebar
  },
};

export default Sidebar;
