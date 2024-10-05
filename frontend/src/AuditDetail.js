import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import QuestionBaseComponent from './QuestionBaseComponent';

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

  // Sticky Header Effect for h4 elements
  useEffect(() => {
    const handleScroll = () => {
      const headers = document.querySelectorAll('h4');
      headers.forEach((header, index) => {
        const nextHeader = headers[index + 1]; // Get the next h4 element
        const headerRect = header.getBoundingClientRect();
        const nextHeaderRect = nextHeader?.getBoundingClientRect();

        // When the next header is about to overlap the current sticky header
        if (nextHeaderRect && nextHeaderRect.top <= headerRect.height) {
          header.style.transform = `translateY(${nextHeaderRect.top - headerRect.height}px)`;
        } else {
          header.style.transform = 'translateY(0)'; // Reset transformation
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup event listener
    };
  }, []);

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
    const duplicateNumber = (duplicates[id]?.length || 0) + 1;
    const duplicateId = `${id}-duplicate-${Date.now()}`;  // Unique ID with timestamp

    setDuplicates(prev => {
      const newDuplicates = {
        ...prev,
        [id]: [...(prev[id] || []), { ...questionObj, duplicateId, index: duplicateNumber }]
      };

      if (data) {
        // Ensure this state update doesn't happen during render
        setTimeout(() => {
          const updatedProgress = calculateProgress(data, formResponses, removedQuestions);
          updateProgress(updatedProgress);
        }, 0);

      }
      return newDuplicates;
    });
  };

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

      // Iterate over each original question's duplicates
      Object.keys(prev).forEach((questionId) => {
        // Filter out the duplicate with the given duplicateId
        updatedDuplicates[questionId] = prev[questionId].filter((duplicate) => duplicate.duplicateId !== duplicateId);

        // If no duplicates are left for this question, remove the entry
        if (updatedDuplicates[questionId].length === 0) {
          delete updatedDuplicates[questionId];
        }
      });

      // Update the progress after removing the duplicate
      if (data) {
        setTimeout(() => {
          const updatedProgress = calculateProgress(data, formResponses, removedQuestions);
          updateProgress(updatedProgress);
        }, 0);
      }

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

  const getBackgroundColor = (index) => index % 2 === 0 ? '#e1e1e1' : '#ffffff';

  // const renderQuestionComponent = (item, itemIndex, sousChapitre) => (
  //   <div
  //     key={item.duplicateId || item.id} // Unique key for original or duplicate question
  //     style={{ backgroundColor: getBackgroundColor(itemIndex), marginLeft: 0 }} // Reset margin for alignment
  //   >
  //     <QuestionBaseComponent
  //       questionObj={item}
  //       formResponses={formResponses}
  //       handleInputChange={handleInputChange}
  //       handleCommentChange={handleCommentChange}
  //       handleImageChange={handleImageChange}
  //       handleDuplicate={item.duplicateId ? null : handleDuplicate} // Only allow duplicate creation for original questions
  //       handleRemove={item.duplicateId ? () => handleRemoveDuplicate(item.duplicateId) : () => handleRemoveQuestion(sousChapitre, item.id)} // Remove based on original/duplicate
  //       comments={comments}
  //       images={images}
  //       isDuplicate={!!item.duplicateId} // Mark whether the item is a duplicate
  //     />
  //   </div>
  // );

  return (
    <div>
      <h2>Grilles de l'audit</h2>
      <form onSubmit={handleSubmit}>
        {data && Object.entries(data).map(([chapitre, sousChapitres]) => (
          <div key={chapitre}>
            <h3>{chapitre}</h3>
            {sousChapitres && Object.entries(sousChapitres).map(([sousChapitre, paragraphes]) => (
              <div key={sousChapitre} className="mb-3" id={sousChapitre}>
              <h4 className="paragraphe-header">
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
                    {paragraphes && Object.entries(paragraphes).map(([paragraphe, sousParagraphes]) => {
                      const allQuestionsFlattened = [];

                      sousParagraphes && Object.entries(sousParagraphes).forEach(([_, questions]) => {
                        questions.forEach((questionObj) => {
                          allQuestionsFlattened.push({ ...questionObj, isDuplicate: false });
                          (duplicates[questionObj.id] || []).forEach((duplicate) => {
                            allQuestionsFlattened.push({ ...duplicate, isDuplicate: true });
                          });
                        });
                      });

                      return (
                        <div key={paragraphe} id={paragraphe} className="mb-2">
                          <h5>{paragraphe}</h5>

                          {(removedQuestions[sousChapitre] || []).length > 0 && (
                            <div className="mb-2">
                              <h6>Questions Removed:</h6>
                              <ul>
                                {allQuestionsFlattened
                                  .filter(question => removedQuestions[sousChapitre].includes(question.id))
                                  .map(question => (
                                    <li key={question.id}>
                                      {question.question}
                                      <button
                                        type="button"
                                        className="btn btn-success btn-sm ml-2"
                                        onClick={() => handleReAddQuestion(sousChapitre, question)}
                                      >
                                        Re-add
                                      </button>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {allQuestionsFlattened.map((item, index) => {
                            const isRemoved = (removedQuestions[sousChapitre] || []).includes(item.id || item.duplicateId);
                            if (!isRemoved) {
                              return (
                                <div
                                  key={item.duplicateId || item.id}
                                  style={{ backgroundColor: getBackgroundColor(index), marginLeft: 0 }}
                                >
                                  <QuestionBaseComponent
                                    questionObj={item}
                                    formResponses={formResponses}
                                    handleInputChange={handleInputChange}
                                    handleCommentChange={handleCommentChange}
                                    handleImageChange={handleImageChange}
                                    isDuplicate={item.isDuplicate}
                                    handleDuplicate={item.isDuplicate ? null : handleDuplicate}
                                    handleRemove={item.isDuplicate ? () => handleRemoveDuplicate(item.duplicateId) : () => handleRemoveQuestion(sousChapitre, item.id)}
                                    comments={comments}
                                    images={images}
                                  />
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
