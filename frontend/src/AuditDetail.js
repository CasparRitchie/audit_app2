import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import QuestionComponent from './QuestionComponent';
import DuplicateQuestionComponent from './DuplicateQuestionComponent';

function AuditDetail({ updateProgress }) {
  const [data, setData] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [comments, setComments] = useState({});
  const [images, setImages] = useState({});
  const [duplicates, setDuplicates] = useState({});
  const [removedQuestions, setRemovedQuestions] = useState({});
  const [expandedSousChapitres, setExpandedSousChapitres] = useState({});
  const [auditId, setAuditId] = useState(null);

  const calculateProgress = useCallback((auditData = {}, responses = {}, removedQuestions = {}) => {
    let progressData = {};
    Object.entries(auditData || {}).forEach(([chapitre, sousChapitres = {}]) => {
      Object.entries(sousChapitres || {}).forEach(([sousChapitre, paragraphes = {}]) => {
        let sousChapitreTotalQuestions = 0;
        let sousChapitreAnsweredQuestions = 0;
        let paragrapheProgressData = {};

        Object.entries(paragraphes || {}).forEach(([paragraphe, sousParagraphes = {}]) => {
          let paragrapheTotalQuestions = 0;
          let paragrapheAnsweredQuestions = 0;

          Object.entries(sousParagraphes || {}).forEach(([_, questions = []]) => {
            // Filter out the removed questions
            const activeQuestions = questions.filter(
              (question) => !(removedQuestions[sousChapitre] || []).includes(question.id)
            );

            paragrapheTotalQuestions += activeQuestions.length;

            activeQuestions.forEach((question) => {
              if (responses[question.id]?.response) {
                paragrapheAnsweredQuestions += 1;
              }

              const duplicateQuestions = duplicates[question.id] || [];
              const activeDuplicates = duplicateQuestions.filter(
                (duplicate) => !(removedQuestions[sousChapitre] || []).includes(duplicate.duplicateId)
              );

              paragrapheTotalQuestions += activeDuplicates.length;

              activeDuplicates.forEach((duplicate) => {
                if (responses[duplicate.duplicateId]?.response) {
                  paragrapheAnsweredQuestions += 1;
                }
              });
            });
          });

          const paragraphePercentageComplete = paragrapheTotalQuestions > 0
            ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
            : 0;

          sousChapitreTotalQuestions += paragrapheTotalQuestions;
          sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;

          paragrapheProgressData[paragraphe] = {
            percentage: paragraphePercentageComplete,
            totalQuestions: paragrapheTotalQuestions,
            answeredQuestions: paragrapheAnsweredQuestions,
          };
        });

        const sousChapitrePercentageComplete = sousChapitreTotalQuestions > 0
          ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
          : 0;

        progressData[sousChapitre] = {
          percentage: sousChapitrePercentageComplete,
          totalQuestions: sousChapitreTotalQuestions,
          answeredQuestions: sousChapitreAnsweredQuestions,
          paragraphes: paragrapheProgressData,
        };
      });
    });

    return progressData;
  }, [duplicates]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/audit_detail');
        setData(response.data);
        const storedResponses = JSON.parse(localStorage.getItem("auditResponses"));
        const storedAuditId = localStorage.getItem("auditId");

        if (storedResponses) {
          setFormResponses(storedResponses);
        }

        if (storedAuditId) {
          setAuditId(storedAuditId);
        } else {
          const newAuditId = Date.now().toString();
          setAuditId(newAuditId);
          localStorage.setItem("auditId", newAuditId);
        }

        updateProgress(calculateProgress(response.data, storedResponses, removedQuestions));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [calculateProgress, updateProgress, removedQuestions]);

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    const updatedResponses = {
      ...formResponses,
      [questionId]: { ...formResponses[questionId], response: value },
    };
    setFormResponses(updatedResponses);
    localStorage.setItem("auditResponses", JSON.stringify(updatedResponses));
    updateProgress(calculateProgress(data, updatedResponses, removedQuestions));
  };

  const handleCommentChange = (event, questionId) => {
    const { value } = event.target;
    setComments(prev => ({
      ...prev,
      [questionId]: value,
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [questionId]: { ...formResponses[questionId], comment: value },
    }));
  };

  const handleImageChange = (event, questionId) => {
    const file = event.target.files[0];
    setImages(prev => ({
      ...prev,
      [questionId]: file,
    }));
    localStorage.setItem("auditResponses", JSON.stringify({
      ...formResponses,
      [`image_${questionId}`]: { imageName: file.name }
    }));
  };

  const handleDuplicate = (questionObj) => {
    const { id } = questionObj;
    const duplicateId = `${id}-duplicate-${Date.now()}`;  // Ensuring a unique ID with timestamp
    setDuplicates(prev => {
      const newDuplicates = {
        ...prev,
        [id]: [...(prev[id] || []), { ...questionObj, duplicateId }],
      };

      const updatedProgress = calculateProgress(data, formResponses, removedQuestions);
      updateProgress(updatedProgress);
      return newDuplicates;
    });
  };

  // const handleRemoveQuestion = (sousChapitre, questionId) => {
  //   setRemovedQuestions((prev) => ({
  //     ...prev,
  //     [sousChapitre]: [...(prev[sousChapitre] || []), questionId],
  //   }));
  //   updateProgress(calculateProgress(data, formResponses, removedQuestions));
  // };

  // const handleRemoveDuplicate = (duplicateId) => {
  //   setDuplicates((prev) => {
  //     const updatedDuplicates = {};

  //     // Iterate over the current duplicates to remove the specific duplicate by its ID
  //     Object.keys(prev).forEach((questionId) => {
  //       updatedDuplicates[questionId] = prev[questionId].filter((duplicate) => duplicate.duplicateId !== duplicateId);

  //       // If no duplicates remain for this question, we can remove the key entirely
  //       if (updatedDuplicates[questionId].length === 0) {
  //         delete updatedDuplicates[questionId];
  //       }
  //     });

  //     // Recalculate progress after removing the duplicate
  //     updateProgress(calculateProgress(data, formResponses, removedQuestions));

  //     return updatedDuplicates;
  //   });
  // };
  const handleRemoveQuestion = (sousChapitre, questionId) => {
    setRemovedQuestions((prev) => ({
      ...prev,
      [sousChapitre]: [...(prev[sousChapitre] || []), questionId],
    }));
    updateProgress(calculateProgress(data, formResponses, removedQuestions));
  };

  const handleRemoveDuplicate = (duplicateId) => {
    setDuplicates((prev) => {
      const updatedDuplicates = {};

      Object.keys(prev).forEach((questionId) => {
        updatedDuplicates[questionId] = prev[questionId].filter((duplicate) => duplicate.duplicateId !== duplicateId);
        if (updatedDuplicates[questionId].length === 0) {
          delete updatedDuplicates[questionId];
        }
      });

      updateProgress(calculateProgress(data, formResponses, removedQuestions));
      return updatedDuplicates;
    });
  };

  const handleReAddQuestion = (sousChapitre, questionObj) => {
    setRemovedQuestions((prev) => ({
      ...prev,
      [sousChapitre]: prev[sousChapitre]?.filter(id => id !== questionObj.id),
    }));
    updateProgress(calculateProgress(data, formResponses, removedQuestions));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('auditId', auditId);

    Object.entries(formResponses).forEach(([questionId, response]) => {
      const finalResponse = typeof response === 'object' ? JSON.stringify(response) : response;
      formData.append(`responses[${questionId}]`, finalResponse);
    });

    Object.entries(images).forEach(([questionId, image]) => {
      if (image) {
        formData.append(`images[${questionId}]`, image);
      }
    });

    axios.post('/api/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {
      alert('Audit detail submitted successfully!');
      localStorage.removeItem("auditResponses");
      localStorage.removeItem("auditId");
    })
    .catch(error => console.error('Error submitting audit detail:', error));
  };

  const toggleSousChapitre = (sousChapitre) => {
    setExpandedSousChapitres(prevState => ({
      ...prevState,
      [sousChapitre]: !prevState[sousChapitre],
    }));
  };

  if (!data) {
    return <div>Loading audit details...</div>;
  }

  const getBackgroundColor = (index) => index % 2 === 0 ? '#e1e1e1' : '#ffffff';

  return (
    <div>
      <h2>Grilles de l'audit</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(data).map(([chapitre, sousChapitres]) => (
          <div key={chapitre}>
            <h3>{chapitre}</h3>
            {Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
              <div key={sousChapitre} className="mb-3" id={sousChapitre}>
                <h4>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => toggleSousChapitre(sousChapitre)}
                  >
                    {expandedSousChapitres[sousChapitre] ? '▼' : '▶'} {sousChapitre}
                  </button>
                </h4>
                {expandedSousChapitres[sousChapitre] && (
                  <div>
                    {Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => {
  // Combine original questions and duplicates into one flat array
  const allQuestionsFlattened = [];

  Object.entries(sousParagraphes).forEach(([_, questions]) => {
    questions.forEach((questionObj) => {
      // Push original question
      allQuestionsFlattened.push({ ...questionObj, isDuplicate: false });
      // Push duplicates if any
      (duplicates[questionObj.id] || []).forEach((duplicate) => {
        allQuestionsFlattened.push({ ...duplicate, isDuplicate: true });
      });
    });
  });

  // Now that we have a flat list, we can render each question/duplicate with the correct alternating background
  return (
    <div key={paragraphe} id={paragraphe} className="mb-2">
      <h5>{paragraphe}</h5>

      {allQuestionsFlattened.map((item, index) => {
        const isRemoved = (removedQuestions[sousChapitre] || []).includes(item.id || item.duplicateId);

        if (!isRemoved) {
          return (
            <div
              key={item.duplicateId || item.id} // Unique key for original or duplicate question
              style={{
                backgroundColor: getBackgroundColor(index), // Unified shading for originals and duplicates
                marginLeft: 0, // Ensure alignment
              }}
            >
              {item.isDuplicate ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <DuplicateQuestionComponent
                    duplicate={item}
                    index={index}
                    formResponses={formResponses}
                    handleInputChange={handleInputChange}
                    handleCommentChange={handleCommentChange}
                    handleImageChange={handleImageChange}
                    comments={comments}
                    images={images}
                  />
                  {/* Remove button for duplicate */}
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveDuplicate(item.duplicateId)} // Removes the duplicate
                  >
                    X
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <QuestionComponent
                    questionObj={item}
                    formResponses={formResponses}
                    handleInputChange={handleInputChange}
                    handleCommentChange={handleCommentChange}
                    handleImageChange={handleImageChange}
                    handleDuplicate={handleDuplicate}
                    comments={comments}
                    images={images}
                  />
                  {/* Duplicate and Remove buttons for original question */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleDuplicate(item)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveQuestion(sousChapitre, item.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
})}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  );
}

export default AuditDetail;
