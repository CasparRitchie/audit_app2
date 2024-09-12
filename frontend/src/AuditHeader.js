// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function AuditHeader() {
//   const [headerData, setHeaderData] = useState([]);
//   const [headerResponses, setHeaderResponses] = useState({});
//   const [calculatedFields, setCalculatedFields] = useState({});

//   // Helper function to save header responses to localStorage
//   const saveToLocalStorage = (key, value) => {
//     const existingData = JSON.parse(localStorage.getItem("auditHeader")) || {};
//     existingData[key] = value;
//     localStorage.setItem("auditHeader", JSON.stringify(existingData));
//   };

//   // Fetch audit header data and previously saved responses from localStorage
//   useEffect(() => {
//     axios.get('/api/audit_header')
//       .then(response => {
//         console.log('Header data fetched:', response.data);
//         if (Array.isArray(response.data)) {
//           setHeaderData(response.data);
//         } else {
//           console.error('Invalid header data format:', response.data);
//         }

//         // Load stored header responses from localStorage
//         const storedHeaderResponses = JSON.parse(localStorage.getItem("auditHeader"));
//         if (storedHeaderResponses) {
//           setHeaderResponses(storedHeaderResponses);
//         }
//       })
//       .catch(error => console.error('Error fetching header data:', error));
//   }, []);

//   // Function to calculate rates only when all required fields are filled
//   const calculateRates = (repasJour, placesAssises, repasJourServis) => {
//     let globalRate = null;
//     let jourRate = null;

//     // Calculate Taux de rotation global
//     if (repasJour && placesAssises) {
//       globalRate = ((repasJour / (placesAssises * 0.8)).toFixed(2));
//       setCalculatedFields((prevFields) => ({
//         ...prevFields,
//         9: globalRate,  // Assuming 9 is the ID for Taux de rotation global
//       }));
//     }

//     // Calculate Taux de rotation du jour
//     if (repasJourServis && placesAssises) {
//       jourRate = ((repasJourServis / (placesAssises * 0.8)).toFixed(2));
//       setCalculatedFields((prevFields) => ({
//         ...prevFields,
//         11: jourRate,  // Assuming 11 is the ID for Taux de rotation du jour
//       }));
//     }
//   };

//   // Handle input changes and store in localStorage
//   const handleInputChange = (event, questionId) => {
//     const { value } = event.target;
//     const updatedResponses = {
//       ...headerResponses,
//       [questionId]: value,
//     };
//     setHeaderResponses(updatedResponses);
//     saveToLocalStorage(questionId, value);

//     // Parse relevant values and ensure calculations happen only when both fields are filled
//     const repasJour = parseFloat(updatedResponses[7] || 0);  // Nombre de repas jour (Field 7)
//     const placesAssises = parseFloat(updatedResponses[8] || 0);  // Nombre de places assises (Field 8)
//     const repasJourServis = parseFloat(updatedResponses[10] || 0);  // Nombre de repas servis ce jour (Field 10)

//     // Call calculation only when necessary fields are present
//     if (repasJour && placesAssises) {
//       calculateRates(repasJour, placesAssises, repasJourServis);
//     }
//   };

//   // Handle form submission to send data to the backend
//   // Helper function to generate a unique audit ID
// const generateAuditId = () => {
//   return 'audit_' + Date.now(); // Simple unique ID based on timestamp
// };

// // Handle form submission to send data to the backend
// const handleSubmit = (event) => {
//   event.preventDefault();
//   const formData = new FormData();

//   // Check if audit ID exists in localStorage, otherwise generate one
//   let auditId = localStorage.getItem("auditId");
//   if (!auditId) {
//     auditId = generateAuditId();
//     localStorage.setItem("auditId", auditId); // Save auditId to localStorage
//   }

//   // Append audit ID to formData
//   formData.append('auditId', auditId);

//   // Append header responses to formData
//   Object.entries(headerResponses).forEach(([questionId, response]) => {
//     formData.append(`header[${questionId}]`, response);
//   });

//   // Submit the form data to the backend
//   axios.post('/api/submit', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   })
//     .then(response => {
//       alert('Audit header responses submitted successfully!');
//     })
//     .catch(error => {
//       console.error('Error submitting audit header responses:', error);
//     });
// };

//   if (!headerData || headerData.length === 0) {
//     return <div>Loading audit header data...</div>;
//   }

//   return (
//     <div>
//       <h2>Audit Header</h2>
//       <form onSubmit={handleSubmit}>
//         {headerData.map((question) => (
//           <div key={question.id}>
//             <label>{question.question}</label>

//             {question.type === 'Text' && (
//               <input
//                 type="text"
//                 name={question.id}
//                 value={headerResponses[question.id] || ''}
//                 onChange={(event) => handleInputChange(event, question.id)}
//               />
//             )}

//             {question.type === 'Integer' && (
//               <input
//                 type="number"
//                 name={question.id}
//                 value={headerResponses[question.id] || ''}
//                 onChange={(event) => handleInputChange(event, question.id)}
//               />
//             )}

//             {question.type === 'Date' && (
//               <input
//                 type="date"
//                 name={question.id}
//                 value={headerResponses[question.id] || ''}
//                 onChange={(event) => handleInputChange(event, question.id)}
//               />
//             )}

//             {question.type === 'Time' && (
//               <input
//                 type="time"
//                 name={question.id}
//                 value={headerResponses[question.id] || question.default_value || ''}
//                 onChange={(event) => handleInputChange(event, question.id)}
//               />
//             )}

//             {question.type === 'Calculated' && (
//               <input
//                 type="text"
//                 name={question.id}
//                 value={calculatedFields[question.id] || ''}
//                 readOnly
//               />
//             )}
//           </div>
//         ))}

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

// export default AuditHeader;



import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditHeader() {
  const [headerData, setHeaderData] = useState([]);
  const [headerResponses, setHeaderResponses] = useState({});
  const [calculatedFields, setCalculatedFields] = useState({});

  const saveToLocalStorage = (key, value) => {
    const existingData = JSON.parse(localStorage.getItem("auditHeader")) || {};
    existingData[key] = value;
    localStorage.setItem("auditHeader", JSON.stringify(existingData));
  };

  useEffect(() => {
    axios.get('/api/audit_header')
      .then(response => {
        setHeaderData(response.data);
        const storedHeaderResponses = JSON.parse(localStorage.getItem("auditHeader"));
        if (storedHeaderResponses) {
          setHeaderResponses(storedHeaderResponses);
        }
      })
      .catch(error => console.error('Error fetching header data:', error));
  }, []);

  const calculateRates = (repasJour, placesAssises, repasJourServis) => {
    if (repasJour && placesAssises) {
      setCalculatedFields(prevFields => ({
        ...prevFields,
        9: ((repasJour / (placesAssises * 0.8)).toFixed(2))
      }));
    }
    if (repasJourServis && placesAssises) {
      setCalculatedFields(prevFields => ({
        ...prevFields,
        11: ((repasJourServis / (placesAssises * 0.8)).toFixed(2))
      }));
    }
  };

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...headerResponses,
      [questionId]: value,
    };
    setHeaderResponses(updatedResponses);
    saveToLocalStorage(questionId, value);

    const repasJour = parseFloat(updatedResponses[7] || 0);
    const placesAssises = parseFloat(updatedResponses[8] || 0);
    const repasJourServis = parseFloat(updatedResponses[10] || 0);
    if (repasJour && placesAssises) {
      calculateRates(repasJour, placesAssises, repasJourServis);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    let auditId = localStorage.getItem("auditId");
    if (!auditId) {
      auditId = 'audit_' + Date.now();
      localStorage.setItem("auditId", auditId);
    }
    formData.append('auditId', auditId);
    Object.entries(headerResponses).forEach(([questionId, response]) => {
      formData.append(`header[${questionId}]`, response);
    });

    axios.post('/api/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => alert('Audit header submitted successfully!'))
    .catch(error => console.error('Error submitting audit header:', error));
  };

  if (!headerData.length) {
    return <div>Loading audit header data...</div>;
  }

  return (
    <div>
      <h2>Audit Header</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        {headerData.map(question => (
          <div key={question.id} className="form-group">
            <label>{question.question}</label>
            {question.type === 'Text' && (
              <input type="text" className="form-control" value={headerResponses[question.id] || ''} onChange={e => handleInputChange(e, question.id)} />
            )}
            {question.type === 'Integer' && (
              <input type="number" className="form-control" value={headerResponses[question.id] || ''} onChange={e => handleInputChange(e, question.id)} />
            )}
            {question.type === 'Date' && (
              <input type="date" className="form-control" value={headerResponses[question.id] || ''} onChange={e => handleInputChange(e, question.id)} />
            )}
            {question.type === 'Time' && (
              <input type="time" className="form-control" value={headerResponses[question.id] || question.default_value || ''} onChange={e => handleInputChange(e, question.id)} />
            )}
            {question.type === 'Calculated' && (
              <input type="text" className="form-control" value={calculatedFields[question.id] || ''} readOnly />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default AuditHeader;
