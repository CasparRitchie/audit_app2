import React from 'react';

function ResponsesTable({ sousParagraphe, responseCounts }) {
  // console.log('Response counts for:', sousParagraphe, responseCounts);
  return (
    <div>
      <h6>Response Summary for {sousParagraphe}</h6>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '5px' }}>Type</th>
            <th style={{ border: '1px solid black', padding: '5px' }}>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>C</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.C}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>PC</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.PC}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>NC</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.NC}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>OK</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.OK}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>KO</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.KO}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>&ge; 63°C</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.over63}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>&lt; 63°C</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.under63}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>&ge; 10°C</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.over10}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid black', padding: '5px' }}>&lt; 10°C</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{responseCounts.under10}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResponsesTable;
