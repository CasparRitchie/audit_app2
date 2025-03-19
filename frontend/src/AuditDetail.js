import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import QuestionComponent from './QuestionComponent';
import calculateProgress from './functions/calculateProgress';

function AuditDetail({ updateProgress }) {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [comments, setComments] = useState({});
  const [images, setImages] = useState({});
  const [duplicates, setDuplicates] = useState({});
  const [removedQuestions, setRemovedQuestions] = useState({});
  const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
  const [auditHeaders, setAuditHeaders] = useState([]);
  const [selectedAuditHeaderId, setSelectedAuditHeaderId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/audit_detail');
        setData(response.data);
        const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
        const storedRemovedQuestions = JSON.parse(localStorage.getItem("removedQuestions")) || {};

        if (storedResponses) setFormResponses(storedResponses);
        setRemovedQuestions(storedRemovedQuestions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAuditHeaders = async () => {
      try {
        const response = await axios.get('/api/get_audit_headers'); // Use the new endpoint
        console.log("Audit headers fetched:", response.data); // Confirm data in console
        setAuditHeaders(response.data);
      } catch (error) {
        console.error('Error fetching audit headers:', error);
      }
    };
    fetchAuditHeaders();
  }, []);

  const getRowColor = (index) => (index % 2 === 0 ? '#f8f9fa' : '#ffffff');

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    const duplicateId = `${id}-duplicate-${Date.now()}`;

    setDuplicates((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
    }));
  };

  useEffect(() => {
    if (data) {
      const progress = calculateProgress(data, formResponses, removedQuestions, duplicates);
      updateProgress(progress);
    }
  }, [data, formResponses, removedQuestions, duplicates, updateProgress]);

  const handleRemoveDuplicate = (duplicateId) => {
    setDuplicates((prev) => {
      const updatedDuplicates = {};
      Object.keys(prev).forEach((questionId) => {
        updatedDuplicates[questionId] = prev[questionId].filter(
          (duplicate) => duplicate.duplicateId !== duplicateId
        );
        if (updatedDuplicates[questionId].length === 0) delete updatedDuplicates[questionId];
      });
      return updatedDuplicates;
    });
  };

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...formResponses,
      [questionId]: { ...formResponses[questionId], response: value },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
  };

  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments((prev) => ({ ...prev, [questionId]: value }));
    const updatedResponses = {
      ...formResponses,
      [questionId]: {
        ...formResponses[questionId],
        comment: value,
        response: formResponses[questionId]?.response || '',
      },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
  };

  const handleImageChange = (event, questionId) => {
    const files = Array.from(event.target.files);
    setImages((prev) => ({ ...prev, [questionId]: [...(prev[questionId] || []), ...files] }));
    localStorage.setItem(
      "auditResponses",
      JSON.stringify({
        ...formResponses,
        [questionId]: {
          ...formResponses[questionId],
          images: [...(formResponses[questionId]?.images || []), ...files.map((file) => file.name)],
        },
      })
    );
  };

  const handleRemoveQuestion = (sousChapitre, questionObj) => {
    const questionId = questionObj.id || questionObj.duplicateId;

    if (questionObj.duplicateId) {
      setDuplicates((prev) => {
        const updatedDuplicates = { ...prev };
        updatedDuplicates[questionObj.id] = updatedDuplicates[questionObj.id].filter(
          (duplicate) => duplicate.duplicateId !== questionObj.duplicateId
        );
        if (updatedDuplicates[questionObj.id].length === 0) delete updatedDuplicates[questionObj.id];
        return updatedDuplicates;
      });
    } else {
      setRemovedQuestions((prev) => ({
        ...prev,
        [sousChapitre]: [
          ...(prev[sousChapitre] || []),
          { id: questionId, title: questionObj.question },
        ],
      }));
    }
    updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
    localStorage.setItem("removedQuestions", JSON.stringify(removedQuestions));
  };

  const handleReAddQuestion = (sousChapitre, questionId) => {
    setRemovedQuestions((prev) => {
      const updated = { ...prev };
      updated[sousChapitre] = updated[sousChapitre].filter((q) => q.id !== questionId);
      if (updated[sousChapitre].length === 0) delete updated[sousChapitre];
      return updated;
    });
    updateProgress(calculateProgress(data, formResponses, removedQuestions, duplicates));
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    // Generate a new audit detail ID
    const auditDetailId = 'auditDetail_' + Date.now();

    const formData = new FormData();
    formData.append("auditId", selectedAuditHeaderId);
    formData.append("auditDetailId", auditDetailId);

    // Append responses and comments as JSON strings
    const responsesOnly = {};
    for (const questionId in formResponses) {
      responsesOnly[questionId] = formResponses[questionId]?.response || '';
    }
    formData.append("responses", JSON.stringify(responsesOnly));
    formData.append("comments", JSON.stringify(comments));

    // Append each image file for each question separately
    for (const questionId in images) {
      images[questionId].forEach((file) => {
        console.log(`Appending image for ${questionId}:`, file.name);
        formData.append(`images[${questionId}][]`, file);
      });
    }

    axios.post('/api/submit_audit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
      alert(`Audit successfully submitted! New ID: ${auditDetailId}`);

      // Reset state after successful submission
      setFormResponses({});
      setComments({});
      setImages({});
      setDuplicates({});
      setRemovedQuestions({});
      localStorage.removeItem("auditResponses");
      localStorage.removeItem("removedQuestions");

      // Optionally reset the selected header if needed
      setSelectedAuditHeaderId(null);
    })
    .catch((error) => {
      console.error('Error submitting the audit:', error);
      alert('An error occurred while submitting the audit. Please try again.');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-3"
            style={{
              position: 'sticky',
              top: '0',
              height: '100vh',
              overflowY: 'auto',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRight: '1px solid #ddd',
            }}
          >
            {data && (
              <Sidebar
                data={data}
                formResponses={formResponses}
                removedQuestions={removedQuestions}
                duplicates={duplicates}
              />
            )}
          </div>
          <div className="col-md-9">
            <h2>Grilles de l'audit</h2>

          {/* Dropdown for selecting an audit header */}
          <div className="form-group">
            <label htmlFor="auditHeaderSelect">Select Audit Header:</label>
            <select
              id="auditHeaderSelect"
              className="form-control"
              value={selectedAuditHeaderId || ""}
              onChange={(e) => setSelectedAuditHeaderId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an audit header
              </option>
              {[...new Set(auditHeaders.map((header) => header.auditId))].map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>



            {data &&
  Object.entries(data)
    .sort(([, a], [, b]) => {
      // Sort chapters based on the order in the CSV (using the lowest question ID)
      const aMinId = Math.min(...Object.values(a).flatMap((sousChapitre) =>
        Object.values(sousChapitre).flatMap((paragraphe) =>
          Object.values(paragraphe).flatMap((sousParagraphe) =>
            sousParagraphe.map((question) => question.id)
          )
        )
      ));
      const bMinId = Math.min(...Object.values(b).flatMap((sousChapitre) =>
        Object.values(sousChapitre).flatMap((paragraphe) =>
          Object.values(paragraphe).flatMap((sousParagraphe) =>
            sousParagraphe.map((question) => question.id)
          )
        )
      ));
      return aMinId - bMinId;
    })
    .map(([chapitre, sousChapitres]) => (
      <div key={chapitre}>
        <h3>{chapitre}</h3>
        {Object.entries(sousChapitres)
          .sort(([, a], [, b]) => {
            // Sort sub-chapters based on the CSV order
            const aMinId = Math.min(...Object.values(a).flatMap((paragraphe) =>
              Object.values(paragraphe).flatMap((sousParagraphe) =>
                sousParagraphe.map((question) => question.id)
              )
            ));
            const bMinId = Math.min(...Object.values(b).flatMap((paragraphe) =>
              Object.values(paragraphe).flatMap((sousParagraphe) =>
                sousParagraphe.map((question) => question.id)
              )
            ));
            return aMinId - bMinId;
          })
          .map(([sousChapitre, paragraphes]) => (
            <div key={sousChapitre} id={sousChapitre} className="mb-3">
              <h4 className="paragraphe-header">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() =>
                    setExpandedSousChapitres((prev) => ({
                      ...prev,
                      [sousChapitre]: !prev[sousChapitre],
                    }))
                  }
                >
                  {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
                </button>
              </h4>

              {expandedSousChapitres[sousChapitre] &&
                Object.entries(paragraphes)
                  .sort(([, a], [, b]) => {
                    // Sort paragraphs based on the CSV order
                    const aMinId = Math.min(...Object.values(a).flatMap((sousParagraphe) =>
                      sousParagraphe.map((question) => question.id)
                    ));
                    const bMinId = Math.min(...Object.values(b).flatMap((sousParagraphe) =>
                      sousParagraphe.map((question) => question.id)
                    ));
                    return aMinId - bMinId;
                  })
                  .map(([paragraphe, sousParagraphes]) => (
                    <div
                      key={`${sousChapitre}-${paragraphe}`}
                      className="mb-2"
                      id={`${sousChapitre}-${paragraphe}`}
                      style={{ paddingTop: '60px' }}
                    >
                      <h5 className="sticky-title">{paragraphe}</h5>
                      {Object.entries(sousParagraphes)
                        .flatMap(([_, questions]) => questions)
                        .filter((q) => !(removedQuestions[sousChapitre] || []).find((r) => r.id === q.id))
                        .reduce((acc, questionObj) => {
                          acc.push(questionObj);
                          const questionDuplicates = duplicates[questionObj.id] || [];
                          return acc.concat(questionDuplicates);
                        }, [])
                        .sort((a, b) => a.id - b.id) // Sort questions by ID
                        .map((questionObj, index) => (
                          <div
                            key={questionObj.duplicateId || questionObj.id}
                            style={{ backgroundColor: getRowColor(index) }}
                          >
                            <QuestionComponent
                              questionObj={questionObj}
                              formResponses={formResponses}
                              handleInputChange={handleInputChange}
                              handleCommentChange={handleCommentChange}
                              handleImageChange={handleImageChange}
                              handleDuplicate={handleDuplicate}
                              handleRemove={(q) => handleRemoveQuestion(sousChapitre, q)}
                              handleReAddQuestion={handleReAddQuestion} // Ensure this is passed
                              handleRemoveDuplicate={handleRemoveDuplicate} // Ensure this is passed
                              comments={comments}
                              images={images}
                              setImages={setImages}
                            />
                          </div>
                        ))}
                    </div>
                  ))}
            </div>
          ))}
      </div>
    ))}
            <button type="submit" className="btn btn-primary">Envoyer</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AuditDetail;
