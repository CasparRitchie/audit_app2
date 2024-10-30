// // // calculateProgress.js

// // export default function calculateProgress(auditData, responses, removedQuestions, duplicates = {}) {
// //   let progressData = {};
// //   Object.entries(auditData).forEach(([chapitre, sousChapitres]) => {
// //     Object.entries(sousChapitres).forEach(([sousChapitre, paragraphes]) => {
// //       let sousChapitreTotalQuestions = 0;
// //       let sousChapitreAnsweredQuestions = 0;
// //       let paragrapheProgressData = {};

// //       Object.entries(paragraphes).forEach(([paragraphe, sousParagraphes]) => {
// //         let paragrapheTotalQuestions = 0;
// //         let paragrapheAnsweredQuestions = 0;

// //         Object.entries(sousParagraphes).forEach(([_, questions]) => {
// //           const activeQuestions = questions
// //             .concat(duplicates[questions.id] || []) // Include duplicates
// //             .filter((question) => !(removedQuestions[sousChapitre] || []).find((q) => q.id === question.id));

// //           paragrapheTotalQuestions += activeQuestions.length;
// //           activeQuestions.forEach((question) => {
// //             if (responses[question.id]?.response) paragrapheAnsweredQuestions += 1;
// //           });
// //         });

// //         const paragraphePercentage = paragrapheTotalQuestions
// //           ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
// //           : 0;

// //         sousChapitreTotalQuestions += paragrapheTotalQuestions;
// //         sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;
// //         paragrapheProgressData[paragraphe] = { percentage: paragraphePercentage };
// //       });

// //       const sousChapitrePercentage = sousChapitreTotalQuestions
// //         ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
// //         : 0;

// //       progressData[sousChapitre] = {
// //         percentage: sousChapitrePercentage,
// //         paragraphes: paragrapheProgressData,
// //       };
// //     });
// //   });

// //   return progressData;
// // }

// export default function calculateProgress(data, formResponses, removedQuestions, duplicates) {
//   let progressData = {};

//   Object.entries(data).forEach(([chapitre, sousChapitres]) => {
//     Object.entries(sousChapitres).forEach(([sousChapitre, paragraphes]) => {
//       let sousChapitreTotalQuestions = 0;
//       let sousChapitreAnsweredQuestions = 0;
//       let paragrapheProgressData = {};

//       Object.entries(paragraphes).forEach(([paragraphe, sousParagraphes]) => {
//         let paragrapheTotalQuestions = 0;
//         let paragrapheAnsweredQuestions = 0;

//         Object.entries(sousParagraphes).forEach(([_, questions]) => {
//           // Filter out removed questions
//           const activeQuestions = questions.filter(
//             (question) => !(removedQuestions[sousChapitre] || []).find((q) => q.id === question.id)
//           );

//           // Count original and duplicated questions
//           const totalQuestions = [
//             ...activeQuestions,
//             ...(duplicates[activeQuestions.id] || []),
//           ];

//           paragrapheTotalQuestions += totalQuestions.length;

//           totalQuestions.forEach((question) => {
//             if (formResponses[question.id]?.response) {
//               paragrapheAnsweredQuestions += 1;
//             }
//           });
//         });

//         const paragraphePercentage = paragrapheTotalQuestions
//           ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
//           : 0;

//         sousChapitreTotalQuestions += paragrapheTotalQuestions;
//         sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;
//         paragrapheProgressData[paragraphe] = { percentage: paragraphePercentage };
//       });

//       const sousChapitrePercentage = sousChapitreTotalQuestions
//         ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
//         : 0;

//       progressData[sousChapitre] = {
//         percentage: sousChapitrePercentage,
//         paragraphes: paragrapheProgressData,
//       };
//     });
//   });

//   return progressData;
// }


export default function calculateProgress(data, formResponses, removedQuestions, duplicates) {
  let progressData = {};

  Object.entries(data).forEach(([chapitre, sousChapitres]) => {
    Object.entries(sousChapitres).forEach(([sousChapitre, paragraphes]) => {
      let sousChapitreTotalQuestions = 0;
      let sousChapitreAnsweredQuestions = 0;
      let paragrapheProgressData = {};

      Object.entries(paragraphes).forEach(([paragraphe, sousParagraphes]) => {
        let paragrapheTotalQuestions = 0;
        let paragrapheAnsweredQuestions = 0;

        Object.entries(sousParagraphes).forEach(([_, questions]) => {
          // Filter out removed questions
          const activeQuestions = questions.filter(
            (question) => !(removedQuestions[sousChapitre] || []).find((q) => q.id === question.id)
          );

          // Count both original and duplicate questions for each active question
          activeQuestions.forEach((question) => {
            // Original question
            paragrapheTotalQuestions += 1;
            if (formResponses[question.id]?.response) {
              paragrapheAnsweredQuestions += 1;
            }

            // Duplicated questions
            const questionDuplicates = duplicates[question.id] || [];
            paragrapheTotalQuestions += questionDuplicates.length;
            questionDuplicates.forEach((duplicate) => {
              if (formResponses[duplicate.duplicateId]?.response) {
                paragrapheAnsweredQuestions += 1;
              }
            });
          });
        });

        const paragraphePercentage = paragrapheTotalQuestions
          ? Math.round((paragrapheAnsweredQuestions / paragrapheTotalQuestions) * 100)
          : 0;

        sousChapitreTotalQuestions += paragrapheTotalQuestions;
        sousChapitreAnsweredQuestions += paragrapheAnsweredQuestions;
        paragrapheProgressData[paragraphe] = { percentage: paragraphePercentage };
      });

      const sousChapitrePercentage = sousChapitreTotalQuestions
        ? Math.round((sousChapitreAnsweredQuestions / sousChapitreTotalQuestions) * 100)
        : 0;

      progressData[sousChapitre] = {
        percentage: sousChapitrePercentage,
        paragraphes: paragrapheProgressData,
      };
    });
  });

  return progressData;
}
