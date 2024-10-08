import React from 'react';
import { findResponseForQuestion, getResponseStyle } from '../functions/responseHelpers';
import ResponsesTable from './ResponsesTable';

const RenderAuditDetailsWithResponses = ({ auditDetail, filteredAudits }) => {
  return Object.keys(auditDetail).map((chapitre, chapitreIndex) => (
    <div key={chapitreIndex}>
      <h3>{chapitre}</h3>
      {Object.keys(auditDetail[chapitre]).map((sousChapitre, sousChapitreIndex) => (
        <div key={sousChapitreIndex}>
          <h4>{sousChapitre}</h4>
          {Object.keys(auditDetail[chapitre][sousChapitre]).map((paragraphe, paragrapheIndex) => (
            <div key={paragrapheIndex}>
              <h5>{paragraphe}</h5>
              {Object.keys(auditDetail[chapitre][sousChapitre][paragraphe]).map(
                (sousParagraphe, sousParagrapheIndex) => {
                  const sectionQuestions = auditDetail[chapitre][sousChapitre][paragraphe][sousParagraphe];
                  const responseCounts = { C: 0, PC: 0, NC: 0, OK: 0, KO: 0, over63: 0, under63: 0 };

                  if (Array.isArray(sectionQuestions)) {
                    sectionQuestions.forEach((questionObj) => {
                      const response = findResponseForQuestion(filteredAudits, questionObj.id);
                      if (response === 'C') responseCounts.C++;
                      if (response === 'PC') responseCounts.PC++;
                      if (response === 'NC') responseCounts.NC++;
                      if (response === 'OK') responseCounts.OK++;
                      if (response === 'KO') responseCounts.KO++;
                      const temperature = parseFloat(response);
                      if (!isNaN(temperature)) {
                        if (temperature >= 63) {
                          responseCounts.over63++;
                        } else {
                          responseCounts.under63++;
                        }
                      }
                    });
                  }

                  return (
                    <div key={sousParagrapheIndex}>
                      <h6>{sousParagraphe}</h6>
                      {Array.isArray(sectionQuestions) ? (
                        sectionQuestions.map((questionObj) => {
                          const response = findResponseForQuestion(filteredAudits, questionObj.id);
                          const responseClass = getResponseStyle(response, questionObj.response_type);

                          return (
                            <div key={questionObj.id}>
                              <strong>Question:</strong> {questionObj.question}
                              <br />
                              <strong>Response:</strong> <span className={`response-btn ${responseClass}`}>{response}</span>
                              <hr />
                            </div>
                          );
                        })
                      ) : (
                        <p>No questions available</p>
                      )}
                      <ResponsesTable sousParagraphe={sousParagraphe} responseCounts={responseCounts} />
                    </div>
                  );
                }
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  ));
};

export default RenderAuditDetailsWithResponses;
