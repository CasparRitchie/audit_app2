// // // import React from 'react';
// // // import { Link } from 'react-scroll';
// // // import calculateProgress from './functions/calculateProgress';

// // // function Sidebar({ data, formResponses, removedQuestions, duplicates }) {
// // //   // Calculate progress data
// // //   const progressData = calculateProgress(data, formResponses, removedQuestions, duplicates);

// // //   return (
// // //     <div className="sidebar" style={styles.sidebar}>
// // //       <h3 className="sidebar-h3">Complétion</h3>
// // //       <ul className="list-group">
// // //         {Object.entries(progressData).map(([sousChapitre, progress]) => (
// // //           <li key={sousChapitre} className="list-group-item">
// // //             <Link
// // //               to={sousChapitre}
// // //               smooth={true}
// // //               offset={-70}
// // //               duration={500}
// // //               className="text-decoration-none"
// // //             >
// // //               <h5 className="sidebar-h5">{sousChapitre}</h5>
// // //             </Link>

// // //             <div className="progress mb-2">
// // //               <div
// // //                 className="progress-bar"
// // //                 role="progressbar"
// // //                 style={{ width: `${progress.percentage}%` }}
// // //                 aria-valuenow={progress.percentage}
// // //                 aria-valuemin="0"
// // //                 aria-valuemax="100"
// // //               >
// // //                 {progress.percentage}%
// // //               </div>
// // //             </div>

// // //             {/* Paragraphes section */}
// // //             {progress.paragraphes && (
// // //               <ul className="list-group">
// // //                 {Object.entries(progress.paragraphes).map(([paragraphe, parData]) => (
// // //                   <li key={`${sousChapitre}-${paragraphe}`} className="list-group-item">
// // //                     <Link
// // //                       to={`${sousChapitre}-${paragraphe}`}
// // //                       smooth={true}
// // //                       offset={-70}
// // //                       duration={500}
// // //                       className="text-decoration-none"
// // //                     >
// // //                       <h6>{paragraphe}</h6>
// // //                     </Link>

// // //                     <div className="progress">
// // //                       <div
// // //                         className="progress-bar bg-secondary"
// // //                         role="progressbar"
// // //                         style={{ width: `${parData.percentage}%` }}
// // //                         aria-valuenow={parData.percentage}
// // //                         aria-valuemin="0"
// // //                         aria-valuemax="100"
// // //                       >
// // //                         {parData.percentage}%
// // //                       </div>
// // //                     </div>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             )}
// // //           </li>
// // //         ))}
// // //       </ul>
// // //     </div>
// // //   );
// // // }

// // // const styles = {
// // //   sidebar: {
// // //     position: 'sticky',
// // //     top: '20px',
// // //     height: '100vh',
// // //     overflowY: 'auto',
// // //     padding: '10px',
// // //     backgroundColor: '#f8f9fa',
// // //   },
// // // };

// // // export default Sidebar;


// // import React from 'react';
// // import { Link } from 'react-scroll';
// // import calculateProgress from './functions/calculateProgress';

// // function Sidebar({ data, formResponses, removedQuestions, duplicates }) {
// //   // Calculate progress data
// //   const progressData = calculateProgress(data, formResponses, removedQuestions, duplicates);

// //   return (
// //     <div className="sidebar" style={styles.sidebar}>
// //       <h3 className="sidebar-h3">Complétion</h3>
// //       <ul className="list-group">
// //         {Object.entries(progressData).map(([sousChapitre, progress]) => (
// //           <li key={sousChapitre} className="list-group-item">
// //             <Link
// //               to={sousChapitre}
// //               smooth={true}
// //               offset={-70} // Offset for sticky positioning
// //               duration={500}
// //               className="text-decoration-none"
// //             >
// //               <h5 className="sidebar-h5">{sousChapitre}</h5>
// //             </Link>

// //             <div className="progress mb-2">
// //               <div
// //                 className="progress-bar"
// //                 role="progressbar"
// //                 style={{ width: `${progress.percentage}%` }}
// //                 aria-valuenow={progress.percentage}
// //                 aria-valuemin="0"
// //                 aria-valuemax="100"
// //               >
// //                 {progress.percentage}%
// //               </div>
// //             </div>

// //             {/* Paragraphes section */}
// //             {progress.paragraphes && (
// //               <ul className="list-group">
// //                 {Object.entries(progress.paragraphes).map(([paragraphe, parData]) => (
// //                   <li key={`${sousChapitre}-${paragraphe}`} className="list-group-item">
// //                     <Link
// //                       to={`${sousChapitre}-${paragraphe}`}
// //                       smooth={true}
// //                       offset={-70}
// //                       duration={500}
// //                       className="text-decoration-none"
// //                     >
// //                       <h6>{paragraphe}</h6>
// //                     </Link>

// //                     <div className="progress">
// //                       <div
// //                         className="progress-bar bg-secondary"
// //                         role="progressbar"
// //                         style={{ width: `${parData.percentage}%` }}
// //                         aria-valuenow={parData.percentage}
// //                         aria-valuemin="0"
// //                         aria-valuemax="100"
// //                       >
// //                         {parData.percentage}%
// //                       </div>
// //                     </div>
// //                   </li>
// //                 ))}
// //               </ul>
// //             )}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// // const styles = {
// //   sidebar: {
// //     position: 'sticky',
// //     top: '20px',
// //     height: '100vh',
// //     overflowY: 'auto',
// //     padding: '10px',
// //     backgroundColor: '#f8f9fa',
// //     borderRight: '1px solid #ddd',
// //   },
// //   listGroupItem: {
// //     padding: '10px',
// //   }
// // };

// // export default Sidebar;


// import React, { useState } from 'react';
// import { Link } from 'react-scroll';
// import calculateProgress from './functions/calculateProgress';

// function Sidebar({ data, formResponses, removedQuestions, duplicates }) {
//   const [isVisible, setIsVisible] = useState(true); // State to control sidebar visibility

//   // Function to toggle sidebar visibility
//   const toggleSidebar = () => setIsVisible(!isVisible);

//   // Calculate progress data
//   const progressData = calculateProgress(data, formResponses, removedQuestions, duplicates);

//   return (
//     <div>
//       <button onClick={toggleSidebar} style={styles.toggleButton}>
//         {isVisible ? 'Hide Sidebar' : 'Show Sidebar'}
//       </button>

//       {isVisible && (
//         <div className="sidebar" style={styles.sidebar}>
//           <h3 className="sidebar-h3">Complétion</h3>
//           <ul className="list-group">
//             {Object.entries(progressData).map(([sousChapitre, progress]) => (
//               <li key={sousChapitre} className="list-group-item">
//                 <Link
//                   to={sousChapitre}
//                   smooth={true}
//                   offset={-70} // Offset for sticky positioning
//                   duration={500}
//                   className="text-decoration-none"
//                 >
//                   <h5 className="sidebar-h5">{sousChapitre}</h5>
//                 </Link>

//                 <div className="progress mb-2">
//                   <div
//                     className="progress-bar"
//                     role="progressbar"
//                     style={{ width: `${progress.percentage}%` }}
//                     aria-valuenow={progress.percentage}
//                     aria-valuemin="0"
//                     aria-valuemax="100"
//                   >
//                     {progress.percentage}%
//                   </div>
//                 </div>

//                 {progress.paragraphes && (
//                   <ul className="list-group">
//                     {Object.entries(progress.paragraphes).map(([paragraphe, parData]) => (
//                       <li key={`${sousChapitre}-${paragraphe}`} className="list-group-item">
//                         <Link
//                           to={`${sousChapitre}-${paragraphe}`}
//                           smooth={true}
//                           offset={-70}
//                           duration={500}
//                           className="text-decoration-none"
//                         >
//                           <h6>{paragraphe}</h6>
//                         </Link>

//                         <div className="progress">
//                           <div
//                             className="progress-bar bg-secondary"
//                             role="progressbar"
//                             style={{ width: `${parData.percentage}%` }}
//                             aria-valuenow={parData.percentage}
//                             aria-valuemin="0"
//                             aria-valuemax="100"
//                           >
//                             {parData.percentage}%
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   sidebar: {
//     position: 'sticky',
//     top: '20px',
//     height: '100vh',
//     overflowY: 'auto',
//     padding: '10px',
//     backgroundColor: '#f8f9fa',
//     borderRight: '1px solid #ddd',
//   },
//   toggleButton: {
//     position: 'fixed',
//     top: '20px',
//     left: '10px',
//     zIndex: 1000,
//     padding: '5px 10px',
//     backgroundColor: '#007bff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
// };

// export default Sidebar;


import React, { useState } from 'react';
import { Link } from 'react-scroll';
import calculateProgress from './functions/calculateProgress';

function Sidebar({ data, formResponses, removedQuestions, duplicates }) {
  const [isVisible, setIsVisible] = useState(true); // State to control sidebar visibility

  // Function to toggle sidebar visibility
  const toggleSidebar = () => setIsVisible(!isVisible);

  // Calculate progress data
  const progressData = calculateProgress(data, formResponses, removedQuestions, duplicates);

  return (
    <div style={styles.container}>
      <button
        type="button"
        onClick={toggleSidebar} style={styles.toggleButton}>
        {isVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>

      {isVisible && (
        <div className="sidebar" style={styles.sidebar}>
          <h3 className="sidebar-h3">Complétion</h3>
          <ul className="list-group">
            {Object.entries(progressData).map(([sousChapitre, progress]) => (
              <li key={sousChapitre} className="list-group-item">
                <Link
                  to={sousChapitre}
                  smooth={true}
                  offset={-70} // Offset for sticky positioning
                  duration={500}
                  className="text-decoration-none"
                >
                  <h5 className="sidebar-h5">{sousChapitre}</h5>
                </Link>

                <div className="progress mb-2">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress.percentage}%` }}
                    aria-valuenow={progress.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progress.percentage}%
                  </div>
                </div>

                {progress.paragraphes && (
                  <ul className="list-group">
                    {Object.entries(progress.paragraphes).map(([paragraphe, parData]) => (
                      <li key={`${sousChapitre}-${paragraphe}`} className="list-group-item">
                        <Link
                          to={`${sousChapitre}-${paragraphe}`}
                          smooth={true}
                          offset={-70}
                          duration={500}
                          className="text-decoration-none"
                        >
                          <h6>{paragraphe}</h6>
                        </Link>

                        <div className="progress">
                          <div
                            className="progress-bar bg-secondary"
                            role="progressbar"
                            style={{ width: `${parData.percentage}%` }}
                            aria-valuenow={parData.percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {parData.percentage}%
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
    position: 'sticky',
    top: '0', // Ensures the sidebar starts at the top of the screen when scrolling
    height: '100vh',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #ddd',
    zIndex: 100, // Ensures the sidebar stays above other elements
  },
  toggleButton: {
    position: 'fixed',
    top: '20px',
    left: '10px',
    zIndex: 1000,
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Sidebar;
