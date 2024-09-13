import React from 'react';
import { Link } from 'react-scroll'; // Smooth scrolling between sections

function Sidebar({ data, progress }) {
  return (
    <div className="sidebar">
      <h3>Completion Progress</h3>
      <ul>
        {Object.entries(data).map(([chapitre, sousChapitres]) => (
          <li key={chapitre}>
            <h4>{chapitre}</h4>
            <ul>
              {Object.entries(sousChapitres).map(([sousChapitre]) => (
                <li key={sousChapitre}>
                  <Link to={`${chapitre}-${sousChapitre}`} smooth={true} offset={-70}>
                    {sousChapitre} ({Math.round(progress[chapitre]?.[sousChapitre]?.percentage || 0)}% completed)
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
