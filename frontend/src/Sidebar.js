// import React from 'react';

// function Sidebar({ data }) {
//   return (
//     <div className="sidebar" style={styles.sidebar}>
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

// const styles = {
//   sidebar: {
//     position: 'sticky',
//     top: '20px', // Adjust the value to control how far from the top the sidebar starts sticking
//     height: '100vh', // Optional: Set a height if needed
//     overflowY: 'auto', // Optional: Add scrolling if content overflows
//     padding: '10px',
//     backgroundColor: '#f8f9fa', // Optional: Add a background color to the sidebar
//   },
// };

// export default Sidebar;

import React from 'react';
import { Link } from 'react-scroll'; // Import Link from react-scroll

function Sidebar({ data }) {
  return (
    <div className="sidebar" style={styles.sidebar}>
      <h3>Completion Progress</h3>
      <ul className="list-group">
        {Object.entries(data).map(([sousChapitre, progressData]) => (
          <li key={sousChapitre} className="list-group-item">
            {/* Link component from react-scroll for smooth scrolling */}
            <Link
              to={sousChapitre} // The id of the section you want to scroll to
              smooth={true} // Enable smooth scrolling
              offset={-70}  // Optional: Offset from the top of the viewport when scrolling
              duration={500} // Optional: Set the scrolling duration
              className="text-decoration-none"
            >
              <h5>{sousChapitre}</h5>
            </Link>
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
    top: '20px',
    height: '100vh',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f8f9fa',
  },
};

export default Sidebar;
