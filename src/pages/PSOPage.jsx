// src/pages/PSOPage.jsx
import React from 'react';
import './PSOPage.css';

const programmeSpecificOutcomes = [
  { no: 'PSO1', statement: "Conceptualize, design, model, simulate and analyze mechanical components, systems and processes by applying the principles of thermal engineering, machine design, manufacturing and automation." },
  { no: 'PSO2', statement: "Derive solutions to real life mechanical engineering problems in automobile industries and research organizations." },
  { no: 'PSO3', statement: "Apply industrial engineering and management principles and consider public health safety and environmental factors, cultural, societal, and to work professionally in the industry or as an entrepreneur." },
];

function PSOPage() {
  return (
    <div className="pso-page">
      <h1>Programme Specific Outcomes (PSO)</h1>
      <table className="pso-table">
        <thead>
          <tr>
            <th>PSO No.</th>
            <th>PSO Statement</th>
          </tr>
        </thead>
        <tbody>
          {programmeSpecificOutcomes.map((pso) => (
            <tr key={pso.no}>
              <td>{pso.no}</td>
              <td>{pso.statement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PSOPage;
