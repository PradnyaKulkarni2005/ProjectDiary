// src/pages/POPage.jsx
import React from 'react';
import './POPage.css';  // We'll create this for styling

const programmeOutcomes = [
  { no: 1, statement: "Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems." },
  { no: 2, statement: "Problem analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences." },
  { no: 3, statement: "Design/development of solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations." },
  { no: 4, statement: "Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions." },
  { no: 5, statement: "Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations." },
  { no: 6, statement: "The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice." },
  { no: 7, statement: "Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development." },
  { no: 8, statement: "Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice." },
  { no: 9, statement: "Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings." },
  { no: 10, statement: "Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions." },
  { no: 11, statement: "Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one’s own work, as a member and leader in a team, to manage projects and in multidisciplinary environments." },
  { no: 12, statement: "Life-long learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change." },
];

function POPage() {
  return (
    <div className="po-page">
      <h1>Programme Outcomes (PO's)</h1>
      <table className="po-table">
        <thead>
          <tr>
            <th>PO No.</th>
            <th>PO Statement</th>
          </tr>
        </thead>
        <tbody>
          {programmeOutcomes.map((po) => (
            <tr key={po.no}>
              <td>{po.no}</td>
              <td>{po.statement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default POPage;
